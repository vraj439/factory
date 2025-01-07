from server.extensions import db
import uuid

class UserAddress(db.Model):
    __tablename__ = 'user_addresses'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('consumer_user.id'), nullable=False)
    address_line1 = db.Column(db.String(255), nullable=False)
    address_line2 = db.Column(db.String(255))
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    country_code = db.Column(db.String(10), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)

    # Relationships
    user = db.relationship('ConsumerUser', back_populates='addresses')

    def to_dict(self):
        """
        Converts the UserAddress object into a dictionary for serialization.
        """
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "address_line1": self.address_line1,
            "address_line2": self.address_line2,
            "city": self.city,
            "state": self.state,
            "country": self.country,
            "postal_code": self.postal_code,
            "title": self.title,
            "country_code": self.country_code,
            "phone_number": self.phone_number
        }
