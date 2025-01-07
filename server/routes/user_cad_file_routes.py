from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils import (
    get_access_token,
    check_bucket_exists,
    create_bucket,
    get_signed_s3_upload_url,
    complete_multipart_upload,
    translate_file,
    get_cad_metadata
)
from models import UserCADFile
from extensions import db
import os
import requests
import time

user_cad_file_ns = Namespace("files", description="User File-related operations", security="Bearer")

file_model = user_cad_file_ns.model("UserFile", {
    "id": fields.String(readOnly=True, description="Unique identifier for the file"),
    "file_name": fields.String(required=True, description="Name of the file"),
    "file_path": fields.String(required=True, description="Path to the file"),
})

upload_response_model = user_cad_file_ns.model("UploadResponse", {
    "message": fields.String(description="Upload status message"),
    "data": fields.Raw(description="Details of the uploaded file"),
    "file_id": fields.String(description="ID of the uploaded file")
})

pagination_model = user_cad_file_ns.model("Pagination", {
    "items": fields.List(fields.Nested(file_model)),
    "total": fields.Integer(description="Total number of files"),
    "pages": fields.Integer(description="Total number of pages"),
    "current_page": fields.Integer(description="Current page number"),
})


@user_cad_file_ns.route("/<string:id>")
@user_cad_file_ns.response(404, "File not found")
class FileDetail(Resource):
    @user_cad_file_ns.marshal_with(file_model)
    @user_cad_file_ns.doc(security='Bearer')
    @jwt_required()
    def get(self, id):
        """
        Get a file by ID for the authenticated user
        """
        user_id = get_jwt_identity()
        try:
            file_id = int(id)
        except ValueError:
            return {"message": "Invalid file ID format"}, 400

        file = UserCADFile.query.filter_by(id=file_id, user_id=user_id).first_or_404()
        return {"id": str(file.id), **file.to_dict()}

    @user_cad_file_ns.doc(security='Bearer')
    @jwt_required()
    def delete(self, id):
        """
        Delete a file by ID for the authenticated user
        """
        user_id = get_jwt_identity()
        try:
            file_id = int(id)
        except ValueError:
            return {"message": "Invalid file ID format"}, 400

        file = UserCADFile.query.filter_by(id=file_id, user_id=user_id).first_or_404()
        db.session.delete(file)
        db.session.commit()
        return '', 204

    @user_cad_file_ns.expect(file_model)
    @user_cad_file_ns.marshal_with(file_model)
    @user_cad_file_ns.doc(security='Bearer')
    @jwt_required()
    def put(self, id):
        """
        Update file details for the authenticated user
        """
        user_id = get_jwt_identity()
        try:
            file_id = int(id)
        except ValueError:
            return {"message": "Invalid file ID format"}, 400

        file = UserCADFile.query.filter_by(id=file_id, user_id=user_id).first_or_404()
        data = request.json

        for key, value in data.items():
            setattr(file, key, value)

        db.session.commit()
        return {"id": str(file.id), **file.to_dict()}


@user_cad_file_ns.route("")
class FileList(Resource):
    @user_cad_file_ns.marshal_with(pagination_model)
    @user_cad_file_ns.doc(
        "files_list",
        params={
            "page": {"description": "Page number (default: 1)", "type": "integer", "default": 1},
            "size": {"description": "Number of items per page (default: 10)", "type": "integer", "default": 10},
        },
        security='Bearer',
    )
    @jwt_required()
    def get(self):
        """
        Get all files for the authenticated user with pagination
        """
        user_id = get_jwt_identity()
        page = request.args.get("page", 1, type=int)
        size = request.args.get("size", 10, type=int)

        pagination = UserCADFile.query.filter_by(user_id=user_id).paginate(page=page, per_page=size, error_out=False)
        return {
            "items": [{"id": str(file.id), **file.to_dict()} for file in pagination.items],
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page,
        }, 200

    @user_cad_file_ns.expect(
        user_cad_file_ns.parser()
        .add_argument('file', location='files', type='file', required=True, help="STP file to upload")
    )
    @user_cad_file_ns.marshal_with(upload_response_model, code=201)
    @user_cad_file_ns.doc(security='Bearer')
    @jwt_required()
    def post(self):
        """
        Upload a STP file
        """
        user_id = get_jwt_identity()

        file = request.files.get('file')
        if not file:
            return {'message': 'No file provided'}, 400

        file_format = file.filename.split('.')[-1]
        access_token = get_access_token()
        bucket_key = 'uniqueossbucketkeyflaskapp'
        bucket_name = 'OSS Bucket Flask App'

        # Create or check bucket
        if not check_bucket_exists(access_token, bucket_key):
            create_bucket(access_token, bucket_key, bucket_name)

        file_length = file.seek(0, os.SEEK_END)
        file.seek(0)

        signed_url_response = get_signed_s3_upload_url(access_token, bucket_key, file.filename)
        signed_urls = signed_url_response['urls']

        part_size = file_length // len(signed_urls)

        for i, signed_url in enumerate(signed_urls):
            part_data = file.read(part_size) if i < len(signed_urls) - 1 else file.read()
            response = requests.put(signed_url, data=part_data)
            response.raise_for_status()

        oss_response = complete_multipart_upload(access_token, bucket_key, file.filename, file_length,
                                                 signed_url_response['uploadKey'])
        translated_file = translate_file(access_token, oss_response['objectId'])
        cad_metadata = get_cad_metadata(access_token, translated_file['urn'])

        cad_file = UserCADFile(
            user_id=user_id,
            file_name=file.filename,
            file_url=translated_file['urn'],
            thumbnail_url="",  # Thumbnail generation can be added later
            upload_date=time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()),
            file_metadata=cad_metadata.get('data', {}).get('metadata', {}),
            file_format=file_format,
            object_id=oss_response['objectId']
        )
        db.session.add(cad_file)
        db.session.commit()

        return {
            'message': 'File uploaded successfully',
            'data': oss_response,
            'file_id': str(cad_file.id)
        }, 201
