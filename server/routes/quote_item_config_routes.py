from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from models import QuoteItemConfig, QuoteRequest, Item
from extensions import db
import uuid

quote_item_config_ns = Namespace(
    "quote_item_configs",
    description="Operations related to Quote Item Configurations",
    security="Bearer"
)

quote_item_model = quote_item_config_ns.model("QuoteItemConfig", {
    "id": fields.String(readOnly=True, description="Unique identifier for the quote item configuration"),
    "quote_id": fields.String(required=True, description="ID of the parent quote request"),
    "item_id": fields.String(required=True, description="ID of the associated item"),
    "process": fields.String(description="Process applied to the item"),
    "sub_process": fields.String(description="Sub-process applied to the item"),
    "material": fields.String(description="Material used for the item"),
    "material_grade": fields.String(description="Material grade of the item"),
    "surface_finish": fields.String(description="Surface finish applied"),
    "color": fields.String(description="Color of the item"),
    "tolerance": fields.String(description="Tolerance level for the item"),
    "target_cost": fields.Float(description="Target cost for the item"),
    "quantity": fields.Integer(required=True, description="Quantity of the item"),
    "additional_details": fields.Raw(description="Additional details in JSON format"),
    "last_updated_at": fields.DateTime(description="Last updated timestamp"),
})

pagination_model = quote_item_config_ns.model("Pagination", {
    "items": fields.List(fields.Nested(quote_item_model)),
    "total": fields.Integer(description="Total number of configurations"),
    "pages": fields.Integer(description="Total number of pages"),
    "current_page": fields.Integer(description="Current page number"),
})


@quote_item_config_ns.route("")
class QuoteItemConfigList(Resource):
    @quote_item_config_ns.marshal_with(pagination_model)
    @quote_item_config_ns.doc(
        "list_quote_item_configs",
        params={
            "page": {"description": "Page number (default: 1)", "type": "integer", "default": 1},
            "size": {"description": "Number of items per page (default: 10)", "type": "integer", "default": 10},
            "quote_id": {"description": "Filter by quote ID", "type": "string"}
        },
        security="Bearer"
    )
    @jwt_required()
    def get(self):
        """
        Get all quote item configurations with optional pagination and filtering by quote ID.
        """
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        size = request.args.get('size', 10, type=int)
        quote_id = request.args.get('quote_id')

        query = QuoteItemConfig.query.join(QuoteRequest).filter(QuoteRequest.user_id == user_id)
        if quote_id:
            try:
                quote_uuid = uuid.UUID(quote_id)
                query = query.filter(QuoteItemConfig.quote_id == quote_uuid)
            except ValueError:
                return {"message": "Invalid quote ID format"}, 400

        pagination = query.paginate(page=page, per_page=size, error_out=False)
        return {
            "items": [{"id": str(config.id), **config.to_dict()} for config in pagination.items],
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page,
        }, 200

    @quote_item_config_ns.expect(quote_item_model)
    @quote_item_config_ns.marshal_with(quote_item_model, code=201)
    @jwt_required()
    def post(self):
        """
        Create a new quote item configuration for the authenticated user.
        """
        user_id = get_jwt_identity()
        data = request.json

        try:
            quote_uuid = uuid.UUID(data['quote_id'])
            item_uuid = uuid.UUID(data['item_id'])
        except ValueError:
            return {"message": "Invalid UUID format for quote_id or item_id"}, 400

        # Validate parent quote ownership
        quote = QuoteRequest.query.filter_by(id=quote_uuid, user_id=user_id).first_or_404()
        Item.query.filter_by(id=item_uuid, user_id=user_id).first_or_404()

        # Prevent creation if quote is not a draft
        if not quote.is_draft:
            quote_item_config_ns.abort(400, "Cannot add configurations to a finalized quote request.")

        new_config = QuoteItemConfig(**data)
        db.session.add(new_config)
        db.session.commit()
        return {"id": str(new_config.id), **new_config.to_dict()}, 201


@quote_item_config_ns.route("/<string:id>")
@quote_item_config_ns.response(404, "Quote Item Configuration not found")
class QuoteItemConfigDetail(Resource):
    @quote_item_config_ns.marshal_with(quote_item_model)
    @jwt_required()
    def get(self, id):
        """
        Get a specific quote item configuration by ID for the authenticated user.
        """
        user_id = get_jwt_identity()
        try:
            config_uuid = uuid.UUID(id)
        except ValueError:
            return {"message": "Invalid configuration ID format"}, 400

        config = QuoteItemConfig.query.join(QuoteRequest).filter(
            QuoteItemConfig.id == config_uuid,
            QuoteRequest.user_id == user_id
        ).first_or_404()
        return {"id": str(config.id), **config.to_dict()}

    @jwt_required()
    def delete(self, id):
        """
        Delete a specific quote item configuration by ID for the authenticated user.
        """
        user_id = get_jwt_identity()
        try:
            config_uuid = uuid.UUID(id)
        except ValueError:
            return {"message": "Invalid configuration ID format"}, 400

        config = QuoteItemConfig.query.join(QuoteRequest).filter(
            QuoteItemConfig.id == config_uuid,
            QuoteRequest.user_id == user_id
        ).first_or_404()

        # Prevent deletion if the parent quote is not a draft
        if not config.quote_request.is_draft:
            quote_item_config_ns.abort(400, "Cannot delete configurations from a finalized quote request.")

        db.session.delete(config)
        db.session.commit()
        return '', 204

    @quote_item_config_ns.expect(quote_item_model)
    @quote_item_config_ns.marshal_with(quote_item_model)
    @jwt_required()
    def put(self, id):
        """
        Update a specific quote item configuration by ID for the authenticated user.
        """
        user_id = get_jwt_identity()
        try:
            config_uuid = uuid.UUID(id)
        except ValueError:
            return {"message": "Invalid configuration ID format"}, 400

        config = QuoteItemConfig.query.join(QuoteRequest).filter(
            QuoteItemConfig.id == config_uuid,
            QuoteRequest.user_id == user_id
        ).first_or_404()

        # Prevent updates if the parent quote is not a draft
        if not config.quote_request.is_draft:
            quote_item_config_ns.abort(400, "Cannot modify configurations for a finalized quote request.")

        data = request.json
        for key, value in data.items():
            setattr(config, key, value)

        db.session.commit()
        return {"id": str(config.id), **config.to_dict()}, 200
