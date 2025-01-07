import bcrypt
from flask import request, make_response
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token
from server.models import SupplierUser
from server.extensions import db

supplier_ns = Namespace('supplier', description='Supplier operations', security="Bearer")

# Swagger Models
supplier_signup_model = supplier_ns.model('SupplierSignup', {
    'name': fields.String(required=True),
    'company': fields.String(required=True),
    'email': fields.String(required=True),
    'password': fields.String(required=True),
    'phone_number': fields.String(required=True),
    'country_code': fields.String(required=True),
    'company_type': fields.String(required=True),
    'marketing_consent': fields.Boolean(required=False)
})

supplier_login_model = supplier_ns.model('SupplierLogin', {
    'email': fields.String(required=True),
    'password': fields.String(required=True)
})


@supplier_ns.route('/signup')
class SupplierSignup(Resource):
    @supplier_ns.expect(supplier_signup_model, validate=True)
    def post(self):
        """Supplier Signup"""
        data = request.get_json()
        # Hash the password using bcrypt
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        supplier = SupplierUser.query.filter_by(email=data['email']).first()
        if supplier:
            return {"message": "Email already registered"}, 400
        
        # Create a new SupplierUser
        new_supplier = SupplierUser(
            name=data['name'],
            company=data['company'],
            email=data['email'],
            password=hashed_password.decode('utf-8'),  # Decode before saving to DB
            phone_number=data['phone_number'],
            country_code=data['country_code'],
            company_type=data['company_type'],
            marketing_consent=data.get('marketing_consent', False)
        )
        db.session.add(new_supplier)
        db.session.commit()
        return {"message": "Supplier signed up successfully"}, 201


@supplier_ns.route('/login')
class SupplierLogin(Resource):
    @supplier_ns.expect(supplier_login_model, validate=True)
    def post(self):
        """Supplier Login"""
        data = request.get_json()
        # Retrieve the user by email
        supplier = SupplierUser.query.filter_by(email=data['email']).first()
        if supplier and bcrypt.checkpw(data['password'].encode('utf-8'), supplier.password.encode('utf-8')):
            # Generate a JWT token
            token = create_access_token(
                identity=supplier.id,
                additional_claims={"role": "supplier"}
            )
            print({"token": token})
            return {"token": token}, 200
        return {"message": "Invalid email or password"}, 401


@supplier_ns.route('/logout')
class SupplierLogout(Resource):
  def post(self):
    """Log out the user by clearing the authentication cookie"""
    response = make_response({"message": "Logout successful"}, 200)
    # Clear the cookie by setting it to an empty value and an expired date
    response.set_cookie(
      "access_token_cookie",
      "",
      httponly=True,
      secure=False,  # todo: set this to true in production
      expires=0  # Expire the cookie immediately
    )
    return response
