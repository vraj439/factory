from server.extensions import db
import uuid
from datetime import datetime

class QuoteRequest(db.Model):
    __tablename__ = 'quote_requests'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('consumer_user.id'), nullable=False)
    shipping_address_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user_addresses.id'))
    billing_address_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user_addresses.id'))
    special_instructions = db.Column(db.Text)
    expected_lead_time = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    is_draft = db.Column(db.Boolean, default=True, nullable=False)
    admin_status = db.Column(db.String(50), default='pending', nullable=False)
    admin_notes = db.Column(db.Text)
    feedback = db.Column(db.Text)

    # Relationships
    user = db.relationship('ConsumerUser', back_populates='quote_requests')
    shipping_address = db.relationship('UserAddress', foreign_keys=[shipping_address_id])
    billing_address = db.relationship('UserAddress', foreign_keys=[billing_address_id])
    quote_item_configs = db.relationship('QuoteItemConfig', back_populates='quote_request', lazy=True)

    def to_dict(self):
        """
        Converts the QuoteRequest object into a dictionary for serialization.
        """
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "shipping_address_id": self.shipping_address_id,
            "billing_address_id": self.billing_address_id,
            "special_instructions": self.special_instructions,
            "expected_lead_time": self.expected_lead_time,
            "is_draft": self.is_draft,
            "admin_status": self.admin_status,
        }
    
    
    @staticmethod
    def validate_quote(quote_request):
        """
        Validate that required fields are populated when the quote is not a draft.
        """
        if not quote_request.is_draft:
            if not quote_request.shipping_address_id or not quote_request.billing_address_id:
                raise ValueError(
                    "Both shipping_address_id and billing_address_id must be populated when is_draft=False."
                )

    def save(self):
        """
        Validate and save the quote request to the database.
        """
        self.validate_quote(self)
        db.session.add(self)
        db.session.commit()
