from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from models import QuoteRequest
from extensions import db
import uuid

quote_ns = Namespace("quotes", description="Quote Request-related operations", security="Bearer")

quote_model = quote_ns.model("QuoteRequest", {
  "id": fields.String(readOnly=True, description="Unique identifier for the quote request"),
  "shipping_address_id": fields.String(required=True, description="ID of the shipping address"),
  "billing_address_id": fields.String(required=True, description="ID of the billing address"),
  "special_instructions": fields.String(description="Special instructions for the quote request"),
  "expected_lead_time": fields.String(description="Expected lead time for the quote"),
})

pagination_model = quote_ns.model("Pagination", {
  "items": fields.List(fields.Nested(quote_model)),
  "total": fields.Integer(description="Total number of quote requests"),
  "pages": fields.Integer(description="Total number of pages"),
  "current_page": fields.Integer(description="Current page number")
})


@quote_ns.route("")
class QuoteList(Resource):
  @quote_ns.marshal_with(pagination_model)
  @quote_ns.doc(
    "quotes_list",
    params={
      "page": {"description": "Page number (default: 1)", "type": "integer", "default": 1},
      "size": {"description": "Number of items per page (default: 10)", "type": "integer", "default": 10}
    },
    security='Bearer'
  )
  @jwt_required()
  def get(self):
    """
    Get all quote requests for the authenticated user with pagination
    """
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 10, type=int)

    pagination = QuoteRequest.query.filter_by(user_id=user_id).paginate(page=page, per_page=size, error_out=False)
    return {
      "items": [{"id": str(quote.id), **quote.to_dict()} for quote in pagination.items],
      "total": pagination.total,
      "pages": pagination.pages,
      "current_page": pagination.page
    }, 200

  @quote_ns.expect(quote_model)
  @quote_ns.marshal_with(quote_model, code=201)
  @jwt_required()
  def post(self):
    """
    Create a new quote request for the authenticated user
    """
    user_id = get_jwt_identity()
    data = request.json

    is_draft = data.get('is_draft', True)

    if not is_draft and (not data.get('shipping_address_id') or not data.get('billing_address_id')):
      quote_ns.abort(400, "Shipping and billing addresses are required when isDraft is set to false.")

    new_quote = QuoteRequest(
      user_id=user_id,
      shipping_address_id=data.get('shipping_address_id'),
      billing_address_id=data.get('billing_address_id'),
      special_instructions=data.get('special_instructions'),
      expected_lead_time=data.get('expected_lead_time'),
      is_draft=is_draft,
    )

    db.session.add(new_quote)
    db.session.commit()

    return {"id": str(new_quote.id), **new_quote.to_dict()}, 201


@quote_ns.route("/<string:id>")
@quote_ns.response(404, "Quote Request not found")
class QuoteDetail(Resource):
  @quote_ns.marshal_with(quote_model)
  @jwt_required()
  def get(self, id):
    """
    Get a quote request by ID for the authenticated user
    """
    user_id = get_jwt_identity()
    try:
      quote_uuid = uuid.UUID(id)
    except ValueError:
      return {"message": "Invalid quote ID format"}, 400

    quote = QuoteRequest.query.filter_by(id=quote_uuid, user_id=user_id).first_or_404()
    return {"id": str(quote.id), **quote.to_dict()}

  @jwt_required()
  def delete(self, id):
    """
    Delete a quote request by ID for the authenticated user
    """
    user_id = get_jwt_identity()
    try:
      quote_uuid = uuid.UUID(id)
    except ValueError:
      return {"message": "Invalid quote ID format"}, 400

    quote = QuoteRequest.query.filter_by(id=quote_uuid, user_id=user_id).first_or_404()
    db.session.delete(quote)
    db.session.commit()
    return '', 204

  @quote_ns.expect(quote_model)
  @quote_ns.marshal_with(quote_model)
  @jwt_required()
  def put(self, id):
    """
    Update a quote request by ID for the authenticated user
    """
    user_id = get_jwt_identity()
    try:
      quote_uuid = uuid.UUID(id)
    except ValueError:
      return {"message": "Invalid quote ID format"}, 400

    quote_request = QuoteRequest.query.filter_by(id=quote_uuid, user_id=user_id).first_or_404()
    data = request.json

    # Update attributes
    quote_request.shipping_address_id = data.get('shipping_address_id', quote_request.shipping_address_id)
    quote_request.billing_address_id = data.get('billing_address_id', quote_request.billing_address_id)
    quote_request.special_instructions = data.get('special_instructions', quote_request.special_instructions)
    quote_request.expected_lead_time = data.get('expected_lead_time', quote_request.expected_lead_time)
    quote_request.is_draft = data.get('is_draft', quote_request.is_draft)
    quote_request.admin_status = data.get('admin_status', quote_request.admin_status)

    db.session.commit()

    return {"id": str(quote_request.id), **quote_request.to_dict()}, 200
