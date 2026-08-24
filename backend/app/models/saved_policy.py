import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class SavedPolicy(Base):
    __tablename__ = "saved_policies"

    saved_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.policy_id", ondelete="CASCADE"), nullable=False, index=True)
    saved_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
