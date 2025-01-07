from server.extensions import db
import uuid

class TechnicalDrawing(db.Model):
    __tablename__ = 'technical_drawings'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    file_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('user_files.id'), nullable=False)
    drawing_name = db.Column(db.String(255), nullable=False)

    # Relationships
    user_file = db.relationship('UserCADFile', back_populates='technical_drawings')


    def to_dict(self):
        """
        Converts the TechnicalDrawing object into a dictionary for serialization.
        """
        return {
            "id": str(self.id),
            "file_id": str(self.file_id),
            "drawing_name": self.drawing_name,
        }