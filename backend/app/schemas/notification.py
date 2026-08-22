from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.notification import NotificationChannel, NotificationType
from app.models.user import UserRole


class NotificationCreate(BaseModel):
    title: str
    type: NotificationType
    channel: NotificationChannel = NotificationChannel.in_app
    user_id: Optional[UUID] = None
    role: Optional[UserRole] = None


class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[NotificationType] = None
    channel: Optional[NotificationChannel] = None
    is_read: Optional[bool] = None


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    notification_id: UUID
    user_id: UUID
    title: str
    type: NotificationType
    channel: NotificationChannel
    is_read: bool
    created_at: datetime


class NotificationList(BaseModel):
    items: list[NotificationResponse]
    total: int
    unread_count: int


class UnreadCount(BaseModel):
    unread_count: int