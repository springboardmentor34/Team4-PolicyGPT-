from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.crud.notification import (
    count_notifications,
    create_notifications,
    delete_notification,
    get_notification,
    get_notifications,
    mark_notification_read,
    update_notification,
)
from app.db.database import get_db
from app.models.user import User, UserRole
from app.schemas.notification import (
    NotificationCreate,
    NotificationList,
    NotificationResponse,
    NotificationUpdate,
    UnreadCount,
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def ensure_delivery_permission(current_user: User, notification_data: NotificationCreate) -> None:
    is_privileged = current_user.role in {
        UserRole.administrator,
        UserRole.government_official,
    }
    targets_another_user = (
        notification_data.user_id is not None
        and notification_data.user_id != current_user.user_id
    )
    if (notification_data.role is not None or targets_another_user) and not is_privileged:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and government officials can deliver notifications to other users or roles.",
        )


@router.post(
    "/",
    response_model=list[NotificationResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_notification(
    notification_data: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[NotificationResponse]:
    ensure_delivery_permission(current_user, notification_data)
    return create_notifications(
        db=db,
        notification_data=notification_data,
        requesting_user_id=current_user.user_id,
    )


@router.get("/", response_model=NotificationList)
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    unread_only: bool = Query(default=False),
) -> NotificationList:
    return NotificationList(
        items=get_notifications(
            db=db,
            user_id=current_user.user_id,
            skip=skip,
            limit=limit,
            unread_only=unread_only,
        ),
        total=count_notifications(db=db, user_id=current_user.user_id),
        unread_count=count_notifications(
            db=db,
            user_id=current_user.user_id,
            unread_only=True,
        ),
    )


@router.get("/unread-count", response_model=UnreadCount)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UnreadCount:
    return UnreadCount(
        unread_count=count_notifications(
            db=db,
            user_id=current_user.user_id,
            unread_only=True,
        )
    )


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationResponse:
    notification = get_notification(db, notification_id, current_user.user_id)
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return mark_notification_read(db, notification)


@router.get("/{notification_id}", response_model=NotificationResponse)
def get_notification_by_id(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationResponse:
    notification = get_notification(db, notification_id, current_user.user_id)
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return notification


@router.put("/{notification_id}", response_model=NotificationResponse)
def update_existing_notification(
    notification_id: UUID,
    notification_data: NotificationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationResponse:
    notification = get_notification(db, notification_id, current_user.user_id)
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return update_notification(db, notification, notification_data)


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_notification(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    notification = get_notification(db, notification_id, current_user.user_id)
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    delete_notification(db, notification)