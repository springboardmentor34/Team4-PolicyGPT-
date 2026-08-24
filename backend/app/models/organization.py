import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class Organization(Base):
    __tablename__ = "organizations"

    organization_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    users = relationship("User", back_populates="organization")
