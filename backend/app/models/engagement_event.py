import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, JSON, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class EngagementEvent(Base):
    __tablename__ = "engagement_events"

    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.policy_id", ondelete="SET NULL"), index=True)
    scheme_id = Column(UUID(as_uuid=True), ForeignKey("schemes.scheme_id", ondelete="SET NULL"), index=True)
    event_metadata = Column("metadata", JSON)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
