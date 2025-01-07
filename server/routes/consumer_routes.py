import bcrypt
from flask import request, make_response
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import ConsumerUser
from extensions import db
from constants import industry_enum

consumer_ns = Namespace('consumer', description='Consumer operations', security="Bearer")

# Swagger Models
consumer_signup_model = consumer_ns.model('ConsumerSignup', {
  'name': fields.String(required=True),
  'company': fields.String(required=True),
  'email': fields.String(required=True),
  'password': fields.String(required=True),
  'phone_number': fields.String(required=True),
  'country_code': fields.String(required=True),
  'industry': fields.String(required=True),
  'marketing_consent': fields.Boolean(required=False)
})

consumer_login_model = consumer_ns.model('ConsumerLogin', {
  'email': fields.String(required=True),
  'password': fields.String(required=True)
})


@consumer_ns.route('/signup')
class ConsumerSignup(Resource):
  @consumer_ns.expect(consumer_signup_model, validate=True)
  def post(self):
    """Consumer Signup"""
    data = request.get_json()

    # Check if email is already registered
    if ConsumerUser.query.filter_by(email=data['email']).first():
      return {"message": "Email already registered"}, 400

    # Validate the industry field manually (optional)
    if data['industry'] not in industry_enum:
        return {"message": f"Invalid industry: {data['industry']}. Must be one of {industry_enum}"}, 400


    # Hash the password using bcrypt
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    # Create a new ConsumerUser
    new_consumer = ConsumerUser(
      name=data['name'],
      company=data['company'],
      email=data['email'],
      password=hashed_password.decode('utf-8'),  # Decode before saving to DB
      phone_number=data['phone_number'],
      country_code=data['country_code'],
      industry=data['industry'],
      marketing_consent=data.get('marketing_consent', False)
    )
    db.session.add(new_consumer)
    db.session.commit()

    # Generate a JWT token
    token = create_access_token(
      identity=new_consumer.id,
      additional_claims={"role": "consumer"}
    )

    # Set the token in an HTTP-only cookie
    response = make_response({"message": "Consumer signed up successfully", "token": token}, 201)

    return response


@consumer_ns.route('/login')
class ConsumerLogin(Resource):
  @consumer_ns.expect(consumer_login_model, validate=True)
  def post(self):
    """Consumer Login"""
    data = request.get_json()

    # Retrieve the user by email
    consumer = ConsumerUser.query.filter_by(email=data['email']).first()
    if consumer and bcrypt.checkpw(data['password'].encode('utf-8'), consumer.password.encode('utf-8')):
      # Generate a JWT token
      token = create_access_token(
        identity=consumer.id,
        additional_claims={"role": "consumer"}
      )

      # Set the token in an HTTP-only cookie
      response = make_response({"message": "Login successful", "token": token}, 200)

      return response

    return {"message": "Invalid email or password"}, 401


@consumer_ns.route('/check-status')
class ConsumerStatus(Resource):
  @consumer_ns.doc(security='Bearer')
  @jwt_required()  # Ensures the JWT token is validated
  def get(self):
    """Check if the user is signed in and exists in the database"""
    # Get the user ID from the token
    user_id = get_jwt_identity()

    # Query the database to check if the user exists
    user = ConsumerUser.query.get(user_id)
    if not user:
      return {"message": "User not found or no longer exists"}, 401

    # Return a success response if the user exists
    return {
      "message": "User is signed in",
      "id": str(user.id),
      "name": user.name,
      "email": user.email
    }, 200


@consumer_ns.route('/logout')
class ConsumerLogout(Resource):
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
