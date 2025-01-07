from server.extensions import db
import uuid

class UserCADFile(db.Model):
    __tablename__ = 'user_files'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('consumer_user.id'), nullable=False)
    file_name = db.Column(db.String(255), nullable=False)
    file_url = db.Column(db.String(100), nullable=False)
    thumbnail_url = db.Column(db.String, nullable=True)
    upload_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    file_metadata = db.Column(db.JSON)  # Store CAD metadata as JSON
    file_format = db.Column(db.String(10))  # For storing formats like .stp, .dwg
    object_id = db.Column(db.String(255), index=True)  # Forge object ID with index
    
    # Relationships
    user = db.relationship('ConsumerUser', back_populates='files')
    used_in_items = db.relationship('Item', back_populates='cad_file', lazy=True)
    technical_drawings = db.relationship('TechnicalDrawing', back_populates='user_file', lazy=True)

    def to_dict(self):
        """
        Converts the UserCADFile object into a dictionary for serialization.
        """
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "file_name": self.file_name,
            "file_url": self.file_url,
            "thumbnail_url": self.thumbnail_url,
            "upload_date": self.upload_date,
            "file_metadata": self.file_metadata,
            "file_format": self.file_format,
            "object_id": self.object_id,
        }