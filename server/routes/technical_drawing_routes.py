from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from models import TechnicalDrawing, UserCADFile
from extensions import db

technical_drawings_ns = Namespace("technical-drawings", description="Technical Drawing-related operations", security="Bearer")

drawing_model = technical_drawings_ns.model("TechnicalDrawing", {
    "id": fields.Integer(readOnly=True, description="Unique identifier for the technical drawing"),
    "file_id": fields.Integer(required=True, description="ID of the associated CAD file"),
    "drawing_name": fields.String(required=True, description="Name of the technical drawing"),
})

pagination_model = technical_drawings_ns.model("Pagination", {
    "items": fields.List(fields.Nested(drawing_model)),
    "total": fields.Integer(description="Total number of technical drawings"),
    "pages": fields.Integer(description="Total number of pages"),
    "current_page": fields.Integer(description="Current page number")
})

@technical_drawings_ns.route("")
class DrawingList(Resource):
    @technical_drawings_ns.marshal_with(pagination_model)
    @technical_drawings_ns.doc(
        "drawings_list",
        params={
            "page": {"description": "Page number (default: 1)", "type": "integer", "default": 1},
            "size": {"description": "Number of items per page (default: 10)", "type": "integer", "default": 10}
        },
        security='Bearer'
    )
    @jwt_required()
    def get(self):
        """
        Get all technical drawings for the authenticated user's files with pagination
        """
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        size = request.args.get('size', 10, type=int)

        query = TechnicalDrawing.query.filter(
            TechnicalDrawing.file_id.in_(
                db.session.query(UserCADFile.id).filter_by(user_id=user_id)
            )
        )

        pagination = query.paginate(page=page, per_page=size, error_out=False)
        drawings = pagination.items

        return {
            "items": drawings,
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page
        }, 200

    @technical_drawings_ns.expect(drawing_model)
    @technical_drawings_ns.marshal_with(drawing_model, code=201)
    @technical_drawings_ns.doc(security='Bearer')
    @jwt_required()
    def post(self):
        """
        Create a new technical drawing for a file owned by the authenticated user
        """
        user_id = get_jwt_identity()
        data = technical_drawings_ns.payload

        # Validate that the file_id belongs to the user
        file_id = data['file_id']
        if not db.session.query(UserCADFile.id).filter_by(id=file_id, user_id=user_id).first():
            return {"message": "Invalid file ID or you don't own this file"}, 403

        new_drawing = TechnicalDrawing(**data)
        db.session.add(new_drawing)
        db.session.commit()
        return new_drawing, 201

@technical_drawings_ns.route("/<int:id>")
@technical_drawings_ns.response(404, "Technical Drawing not found")
class DrawingDetail(Resource):
    @technical_drawings_ns.marshal_with(drawing_model)
    @technical_drawings_ns.doc(security='Bearer')
    @jwt_required()
    def get(self, id):
        """
        Get a technical drawing by ID for the authenticated user's file
        """
        user_id = get_jwt_identity()
        drawing = (
            TechnicalDrawing.query.join(UserCADFile, TechnicalDrawing.file_id == UserCADFile.id)
            .filter(UserCADFile.user_id == user_id, TechnicalDrawing.id == id)
            .first_or_404()
        )
        return drawing

    @technical_drawings_ns.doc(security='Bearer')
    @jwt_required()
    def delete(self, id):
        """
        Delete a technical drawing by ID for the authenticated user's file
        """
        user_id = get_jwt_identity()
        drawing = (
            TechnicalDrawing.query.join(UserCADFile, TechnicalDrawing.file_id == UserCADFile.id)
            .filter(UserCADFile.user_id == user_id, TechnicalDrawing.id == id)
            .first_or_404()
        )
        db.session.delete(drawing)
        db.session.commit()
        return '', 204

    @technical_drawings_ns.expect(drawing_model)
    @technical_drawings_ns.marshal_with(drawing_model)
    @technical_drawings_ns.doc(security='Bearer')
    @jwt_required()
    def put(self, id):
        """
        Update a technical drawing by ID for the authenticated user's file
        """
        user_id = get_jwt_identity()
        drawing = (
            TechnicalDrawing.query.join(UserCADFile, TechnicalDrawing.file_id == UserCADFile.id)
            .filter(UserCADFile.user_id == user_id, TechnicalDrawing.id == id)
            .first_or_404()
        )
        data = technical_drawings_ns.payload

        # Ensure updated file_id also belongs to the user
        if 'file_id' in data:
            file_id = data['file_id']
            if not db.session.query(UserCADFile.id).filter_by(id=file_id, user_id=user_id).first():
                return {"message": "Invalid file ID or you don't own this file"}, 403

        for key, value in data.items():
            setattr(drawing, key, value)

        db.session.commit()
        return drawing
