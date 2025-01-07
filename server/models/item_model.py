from server.extensions import db
import uuid

class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('consumer_user.id'), nullable=False)
    cad_file_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user_files.id'), nullable=False)
    
    # Relationships
    user = db.relationship('ConsumerUser', back_populates='items')
    cad_file = db.relationship('UserCADFile', back_populates='used_in_items')
    quote_item_configs = db.relationship('QuoteItemConfig', back_populates='item', lazy=True)


    def to_dict(self):
        """
        Converts the Item object into a dictionary for serialization.
        """
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "cad_file_id": str(self.cad_file_id),
        }
