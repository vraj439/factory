from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from models import Item, UserCADFile, QuoteItemConfig
from extensions import db
import uuid

item_ns = Namespace("items", description="Item-related operations", security="Bearer")

item_model = item_ns.model("Item", {
  "id": fields.String(readOnly=True, description="Unique identifier for the item"),
  "cad_file_id": fields.String(required=True, description="ID of the associated CAD file")
})

pagination_model = item_ns.model("Pagination", {
  "items": fields.List(fields.Nested(item_model)),
  "total": fields.Integer(description="Total number of items"),
  "pages": fields.Integer(description="Total number of pages"),
  "current_page": fields.Integer(description="Current page number"),
})


@item_ns.route("")
class ItemList(Resource):
  @item_ns.marshal_with(pagination_model)
  @item_ns.doc(
    "list_items",
    params={
      "page": {"description": "Page number (default: 1)", "type": "integer", "default": 1},
      "size": {"description": "Number of items per page (default: 10)", "type": "integer", "default": 10}
    },
    security="Bearer"
  )
  @jwt_required()
  def get(self):
    """
    Get all items for the authenticated user with pagination
    """
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 10, type=int)

    pagination = Item.query.filter_by(user_id=user_id).paginate(page=page, per_page=size, error_out=False)
    return {
      "items": [{"id": str(item.id), **item.to_dict()} for item in pagination.items],
      "total": pagination.total,
      "pages": pagination.pages,
      "current_page": pagination.page,
    }, 200

  @item_ns.doc(security="Bearer")
  @item_ns.expect(item_model)
  @item_ns.marshal_with(item_model, code=201)
  @jwt_required()
  def post(self):
    """
    Create a new item for the authenticated user using `cad_file_id` from request parameters
    """
    user_id = get_jwt_identity()
    data = request.json
    cad_file_id = data.get('cad_file_id')

    if not cad_file_id:
      return {"message": "CAD file ID is required in the request parameters"}, 400

    try:
      cad_file_uuid = uuid.UUID(cad_file_id)
    except ValueError:
      return {"message": "Invalid CAD file ID format"}, 400

    # Validate CAD file ownership
    cad_file = UserCADFile.query.filter_by(id=cad_file_uuid, user_id=user_id).first()
    if not cad_file:
      return {"message": "Invalid CAD file ID or it doesn't belong to you"}, 403

    new_item = Item(
      user_id=user_id,
      **data,
    )
    db.session.add(new_item)
    db.session.commit()
    return {"id": str(new_item.id), **new_item.to_dict()}, 201


@item_ns.route("/<string:id>")
@item_ns.response(404, "Item not found")
class ItemDetail(Resource):
  @item_ns.marshal_with(item_model)
  @item_ns.doc(security="Bearer")
  @jwt_required()
  def get(self, id):
    """
    Get a specific item by ID for the authenticated user
    """
    user_id = get_jwt_identity()
    try:
      item_uuid = uuid.UUID(id)
    except ValueError:
      return {"message": "Invalid item ID format"}, 400

    item = Item.query.filter_by(id=item_uuid, user_id=user_id).first_or_404()
    return {"id": str(item.id), **item.to_dict()}

  @item_ns.doc(security="Bearer")
  @jwt_required()
  def delete(self, id):
    """
    Delete a specific item by ID for the authenticated user
    """
    user_id = get_jwt_identity()
    try:
      item_uuid = uuid.UUID(id)
    except ValueError:
      return {"message": "Invalid item ID format"}, 400

    item = Item.query.filter_by(id=item_uuid, user_id=user_id).first_or_404()

    # Check if the item is being used in quote_item
    if QuoteItemConfig.query.filter_by(item_id=item_uuid).first():
      return {"message": "Item cannot be deleted because it is referenced in a quote item"}, 400

    db.session.delete(item)
    db.session.commit()
    return '', 204

  @item_ns.expect(item_model)
  @item_ns.marshal_with(item_model)
  @item_ns.doc(security="Bearer")
  @jwt_required()
  def put(self, id):
    """
    Update a specific item by ID for the authenticated user
    """
    user_id = get_jwt_identity()
    try:
      item_uuid = uuid.UUID(id)
    except ValueError:
      return {"message": "Invalid item ID format"}, 400

    item = Item.query.filter_by(id=item_uuid, user_id=user_id).first_or_404()
    data = request.json

    # Validate CAD file ownership
    if 'cad_file_id' in data:
      try:
        cad_file_uuid = uuid.UUID(data['cad_file_id'])
      except ValueError:
        return {"message": "Invalid CAD file ID format"}, 400

      cad_file = UserCADFile.query.filter_by(id=cad_file_uuid, user_id=user_id).first()
      if not cad_file:
        return {"message": "Invalid CAD file ID or it doesn't belong to you"}, 403

    for key, value in data.items():
      if key == "cad_file_id":
        value = cad_file_uuid
      setattr(item, key, value)

    db.session.commit()
    return {"id": str(item.id), **item.to_dict()}
