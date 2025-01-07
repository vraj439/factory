from server.extensions import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.dialects.postgresql import ENUM

class ConsumerUser(db.Model):
    __tablename__ = 'consumer_user'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    country_code = db.Column(db.String(10), nullable=False)
    is_validated = db.Column(db.Boolean, default=False)
    marketing_consent = db.Column(db.Boolean, default=False)
    industry = db.Column(
        ENUM(
            "Aerospace",
            "Agriculture",
            "Automotive",
            "Aviation & Aerospace",
            "Construction",
            "Consulting",
            "Consumer Electronics",
            "Consumer Products",
            "Defense",
            "Design",
            "Electrical/Electronic Manufacturing",
            "Energy",
            "EV",
            "FMCG",
            "General Engineering",
            "Health Care",
            "HVAC",
            "Import and Export",
            "Industrial Automation",
            "Logistics and Supply Chain",
            "Machinery",
            "Mechanical or Industrial Engineering",
            "Medical Devices",
            "Nuclear",
            "Oil & Energy",
            "Outsourcing/Offshoring",
            "Packaging and Containers",
            "Pharmaceuticals",
            "Power",
            "Railways",
            "Research",
            "Solar",
            name='industry_enum',
            create_type=False,
        ),
        nullable=False,
    )


    # Relationships
    quote_requests = db.relationship('QuoteRequest', back_populates='user', lazy=True)
    items = db.relationship('Item', back_populates='user', lazy=True)
    addresses = db.relationship('UserAddress', back_populates='user', lazy=True)
    files = db.relationship('UserCADFile', back_populates='user', lazy=True)