import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class FeedbackCategory(str, enum.Enum):
    bug = "bug"
    suggestion = "suggestion"
    complaint = "complaint"
    query = "query"


class FeedbackStatus(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class Feedback(Base):
    __tablename__ = "feedback"

    feedback_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.policy_id", ondelete="SET NULL"), index=True)
    scheme_id = Column(UUID(as_uuid=True), ForeignKey("schemes.scheme_id", ondelete="SET NULL"), index=True)
    subject = Column(String(255))
    category = Column(Enum(FeedbackCategory, name="feedback_category"), nullable=False)
    status = Column(
        Enum(FeedbackStatus, name="feedback_status"),
        nullable=False,
        default=FeedbackStatus.open,
    )
    feedback_text = Column(Text)
    response_text = Column(Text)
    resolved_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
    )
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)