from server.extensions import db
from datetime import datetime, timezone
import uuid

class QuoteItemConfig(db.Model):
    __tablename__ = 'quote_item_configs'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    quote_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey('quote_requests.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )
    item_id = db.Column(
        db.UUID(as_uuid=True),
        db.ForeignKey('items.id', ondelete='RESTRICT'),
        nullable=False,
        index=True
    )
    process = db.Column(db.String(100), nullable=True)
    sub_process = db.Column(db.String(100), nullable=True)
    material = db.Column(db.String(100), nullable=True)
    material_grade = db.Column(db.String(100), nullable=True)
    surface_finish = db.Column(db.String(100), nullable=True)
    color = db.Column(db.String(50), nullable=True)
    tolerance = db.Column(db.String(50), nullable=True)
    target_cost = db.Column(db.Float, nullable=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    additional_details = db.Column(db.JSON, nullable=False, default={})
    last_updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Relationships
    quote_request = db.relationship(
        'QuoteRequest',
        back_populates='quote_item_configs',
        cascade="all, delete"
    )
    item = db.relationship(
        'Item',
        back_populates='quote_item_configs'
    )

    __table_args__ = (
        db.CheckConstraint(
            "(process IS NOT NULL AND sub_process IS NOT NULL AND material IS NOT NULL "
            "AND material_grade IS NOT NULL AND tolerance IS NOT NULL) OR "
            "(process IS NULL AND sub_process IS NULL AND material IS NULL AND "
            "material_grade IS NULL AND tolerance IS NULL)",
            name="ck_quote_item_config_consistency"
        ),
    )


    def to_dict(self):
        """
        Converts the QuoteItemConfig object into a dictionary for serialization.
        """
        return {
            "id": str(self.id),
            "quote_id": str(self.quote_id),
            "item_id": str(self.item_id),
            "process": self.process,
            "sub_process": self.sub_process,
            "material": self.material,
            "material_grade": self.material_grade,
            "surface_finish": self.surface_finish,
            "color": self.color,
            "tolerance": self.tolerance,
            "target_cost": self.target_cost,
            "quantity": self.quantity,
            "additional_details": self.additional_details,
            "last_updated_at": self.last_updated_at.astimezone(timezone.utc).isoformat(),
        }

    @staticmethod
    def validate_against_quote_draft_state(quote_request):
        """
        Validate the item configurations based on the `is_draft` state of the parent quote request.
        """
        if not quote_request.is_draft:
            for config in quote_request.quote_item_configs:
                if not all([config.process, config.sub_process, config.material, config.material_grade, config.tolerance]):
                    raise ValueError(
                        "When a quote request is finalized (is_draft=False), all "
                        "QuoteItemConfig fields must be fully defined."
                    )

    def save(self):
        """
        Validate and save the quote item configuration to the database.
        """
        self.validate_against_quote_draft_state(self.quote_request)
        db.session.add(self)
        db.session.commit()