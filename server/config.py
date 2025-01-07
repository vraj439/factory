import os
from datetime import timedelta
from dotenv import load_dotenv
import boto3
import json
from utils import get_ssm_parameter

# Load .env file for local development
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')  # Replace 'default-secret-key' in production
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///app.db'  # Fallback to SQLite if DATABASE_URL is not set
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv('FLASK_ENV', 'development') == 'development'
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    TESTING = False
    STRICT_SLASHES= False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
    """Production configuration."""
    TESTING = False
    SECRET_KEY = get_ssm_parameter('/myapp/SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = get_ssm_parameter('/myapp/DATABASE_URI')

# Optionally, you can map configurations for easier use
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
}
