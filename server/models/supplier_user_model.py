from server.extensions import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.dialects.postgresql import ENUM

class SupplierUser(db.Model):
    __tablename__ = 'supplier_user'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    country_code = db.Column(db.String(10), nullable=False)
    is_validated = db.Column(db.Boolean, default=False)
    marketing_consent = db.Column(db.Boolean, default=False)
    company_type = db.Column(
        ENUM(
            'Manufacturing',
            'OEM',
            'Raw Material',
            'Finishing services',
            name='company_type_enum',
            create_type=False,
        ),
        nullable=False,
    )