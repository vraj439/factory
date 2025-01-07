from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from server.models import UserAddress
from server.extensions import db

user_address_ns = Namespace("addresses", description="User Address-related operations", security="Bearer")

address_model = user_address_ns.model("UserAddress", {
  "id": fields.String(readOnly=True, description="Unique identifier for the address"),
  "address_line1": fields.String(required=True, description="First line of the address"),
  "address_line2": fields.String(description="Second line of the address"),
  "city": fields.String(required=True, description="City of the address"),
  "state": fields.String(required=True, description="State of the address"),
  "country": fields.String(required=True, description="Country of the address"),
  "postal_code": fields.String(required=True, description="Postal code of the address"),
  "title": fields.String(required=True, description="Title for the address"),
  "country_code": fields.String(required=True, description="Country code for the address phone number"),
  "phone_number": fields.String(required=True, description="Phone number for the address"),
})

pagination_model = user_address_ns.model("Pagination", {
  "items": fields.List(fields.Nested(address_model)),
  "total": fields.Integer(description="Total number of addresses"),
  "pages": fields.Integer(description="Total number of pages"),
  "current_page": fields.Integer(description="Current page number"),
})


@user_address_ns.route("")
class AddressList(Resource):
  @user_address_ns.marshal_with(pagination_model)
  @user_address_ns.doc(
    "addresses_list",
    params={
      "page": {"description": "Page number (default: 1)", "type": "integer", "default": 1},
      "size": {"description": "Number of items per page (default: 10)", "type": "integer", "default": 10},
    },
    security="Bearer",
  )
  @jwt_required()
  def get(self):
    """
    Get all addresses for the authenticated user with pagination
    """
    user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    size = request.args.get("size", 10, type=int)

    pagination = UserAddress.query.filter_by(user_id=user_id).paginate(page=page, per_page=size, error_out=False)
    return {
      "items": [{"id": str(address.id), **address.to_dict()} for address in pagination.items],
      "total": pagination.total,
      "pages": pagination.pages,
      "current_page": pagination.page,
    }, 200

  @user_address_ns.expect(address_model)
  @user_address_ns.marshal_with(address_model, code=201)
  @jwt_required()
  def post(self):
    """
    Create a new address for the authenticated user
    """
    user_id = get_jwt_identity()
    data = request.json
    data["user_id"] = user_id  # Ensure the user_id is set to the authenticated user

    new_address = UserAddress(**data)
    db.session.add(new_address)
    db.session.commit()
    return {**new_address.to_dict()}, 201


@user_address_ns.route("/<string:id>")
@user_address_ns.response(404, "Address not found")
class AddressDetail(Resource):
  @user_address_ns.marshal_with(address_model)
  @jwt_required()
  def get(self, id):
    """
    Get a specific address by ID for the authenticated user
    """
    user_id = get_jwt_identity()
    try:
      address_id = int(id)
    except ValueError:
      return {"message": "Invalid address ID format"}, 400

    address = UserAddress.query.filter_by(id=address_id, user_id=user_id).first_or_404()
    return {"id": str(address.id), **address.to_dict()}

  @jwt_required()
  def delete(self, id):
    """
    Delete a specific address by ID for the authenticated user
    """
    user_id = get_jwt_identity()
    try:
      address_id = int(id)
    except ValueError:
      return {"message": "Invalid address ID format"}, 400

    address = UserAddress.query.filter_by(id=address_id, user_id=user_id).first_or_404()
    db.session.delete(address)
    db.session.commit()
    return "", 204

  @user_address_ns.expect(address_model)
  @user_address_ns.marshal_with(address_model)
  @jwt_required()
  def put(self, id):
    """
    Update a specific address by ID for the authenticated user
    """
    user_id = get_jwt_identity()
    try:
      address_id = int(id)
    except ValueError:
      return {"message": "Invalid address ID format"}, 400

    address = UserAddress.query.filter_by(id=address_id, user_id=user_id).first_or_404()
    data = request.json

    for key, value in data.items():
      setattr(address, key, value)

    db.session.commit()
    return {"id": str(address.id), **address.to_dict()}, 200
