import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class PolicyView(Base):
    __tablename__ = "policy_views"

    view_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.policy_id", ondelete="CASCADE"), nullable=False, index=True)
    viewed_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
