import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class NotificationType(str, enum.Enum):
    info = "info"
    alert = "alert"
    reminder = "reminder"
    approval = "approval"


class NotificationChannel(str, enum.Enum):
    in_app = "in_app"
    email = "email"
    sms = "sms"


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    type = Column(Enum(NotificationType, name="notification_type"), nullable=False)
    channel = Column(
        Enum(NotificationChannel, name="notification_channel"),
        nullable=False,
    )
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)