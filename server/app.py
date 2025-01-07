import os
import logging
from config import config_by_name
from extensions import db, migrate, jwt
from flask import Flask
from flask_restx import Api
from sqlalchemy import text
from routes import (
  consumer_routes,
  supplier_routes,
  quote_routes,
  item_routes,
  quote_item_config_routes,
  user_cad_file_routes,
  user_address_routes,
  technical_drawing_routes
)
from flask_cors import CORS

# Set up logging
logging.basicConfig(level=logging.INFO)


def create_app(config_name=None):
  app = Flask(__name__)

  # Choose configuration based on environment
  config_name = config_name or os.getenv("FLASK_ENV", "development")
  app.config.from_object(config_by_name[config_name])
  CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://localhost:1234"])

  # Initialize extensions
  db.init_app(app)
  migrate.init_app(app, db)
  jwt.init_app(app)

  # Define the API with a JWT Bearer Token Security Scheme
  authorizations = {
      'Bearer': {
          'type': 'apiKey',
          'in': 'header',
          'name': 'Authorization',  # The header key expected in requests
          'description': 'Enter your JWT token as: Bearer <token>'
      }
  }

  # Initialize Flask-Restx API
  api = Api(
    app,
    version='1.0',
    title='Factory.io API',
    description='API for consumer and supplier management',
    doc='/swagger',
    authorizations=authorizations,  # Include the security definitions
    security='Bearer'
  )

  # Add namespaces
  api.add_namespace(consumer_routes.consumer_ns, path='/api/consumer')
  api.add_namespace(supplier_routes.supplier_ns, path='/api/supplier')
  api.add_namespace(item_routes.item_ns, path='/api/item')
  api.add_namespace(quote_routes.quote_ns, path='/api/quote')
  api.add_namespace(quote_item_config_routes.quote_item_config_ns, path='/api/quote-item-config')
  api.add_namespace(user_cad_file_routes.user_cad_file_ns, path='/api/user-cad-file')
  api.add_namespace(user_address_routes.user_address_ns, path='/api/user-address')
  api.add_namespace(technical_drawing_routes.technical_drawings_ns, path='/api/technical-drawing')

  @app.route('/api/test-db')
  def test_db():
    try:
      db.session.execute(text('SELECT 1'))  # Simple DB connection test
      logging.info('Database connection successful!')
      return 'Database connection successful!'
    except Exception as e:
      logging.error(f"Database connection failed: {str(e)}")
      return 'Database connection failed.', 500

  @app.route('/api/random')
  def random():
    try:
      return {'message': 'Hello, world'}, 200
    except Exception as e:
      logging.error(f"Database connection failed: {str(e)}")
      return 'Database connection failed.', 500

  return app


if __name__ == '__main__':
  app = create_app()
  # Explicitly bind to all interfaces for Docker
  app.run(host='0.0.0.0', port=int(os.getenv('PORT', 8000)))
