from typing import Optional
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.user import User, UserRole
from app.schemas.notification import NotificationCreate, NotificationUpdate


def get_notifications(
    db: Session,
    user_id: UUID,
    skip: int = 0,
    limit: int = 100,
    unread_only: bool = False,
) -> list[Notification]:
    query = db.query(Notification).filter(Notification.user_id == user_id)
    if unread_only:
        query = query.filter(Notification.is_read.is_(False))
    return query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()


def count_notifications(db: Session, user_id: UUID, unread_only: bool = False) -> int:
    query = db.query(func.count(Notification.notification_id)).filter(
        Notification.user_id == user_id
    )
    if unread_only:
        query = query.filter(Notification.is_read.is_(False))
    return int(query.scalar() or 0)


def get_notification(db: Session, notification_id: UUID, user_id: UUID) -> Optional[Notification]:
    return db.query(Notification).filter(
        Notification.notification_id == notification_id,
        Notification.user_id == user_id,
    ).first()


def create_notifications(
    db: Session,
    notification_data: NotificationCreate,
    requesting_user_id: UUID,
) -> list[Notification]:
    recipient_ids: list[UUID]
    if notification_data.role is not None:
        recipient_ids = [
            user_id
            for (user_id,) in db.query(User.user_id).filter(
                User.role == notification_data.role
            ).all()
        ]
    elif notification_data.user_id is not None:
        recipient_ids = [notification_data.user_id]
    else:
        recipient_ids = [requesting_user_id]

    notifications = [
        Notification(
            user_id=user_id,
            title=notification_data.title,
            type=notification_data.type,
            channel=notification_data.channel,
        )
        for user_id in recipient_ids
    ]
    db.add_all(notifications)
    db.commit()
    for notification in notifications:
        db.refresh(notification)
    return notifications


def update_notification(
    db: Session,
    notification: Notification,
    notification_data: NotificationUpdate,
) -> Notification:
    for field, value in notification_data.model_dump(exclude_unset=True).items():
        setattr(notification, field, value)
    db.commit()
    db.refresh(notification)
    return notification


def mark_notification_read(db: Session, notification: Notification) -> Notification:
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


def delete_notification(db: Session, notification: Notification) -> None:
    db.delete(notification)
    db.commit()