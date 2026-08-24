from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.feedback import Feedback
from app.models.user import User, UserRole
from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackStatusUpdate, PublicFeedbackResponse


router = APIRouter(prefix="/feedback", tags=["Feedback"])


def require_citizen(current_user: User = Depends(get_current_user)) -> User:
    current_role = getattr(current_user.role, "value", current_user.role)
    if not isinstance(current_role, str) or current_role != UserRole.citizen.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only citizen accounts can access feedback.",
        )
    return current_user


def require_feedback_staff(current_user: User = Depends(get_current_user)) -> User:
    current_role = getattr(current_user.role, "value", current_user.role)
    if current_role not in (
        UserRole.administrator.value,
        UserRole.government_official.value,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and government officials can manage feedback.",
        )
    return current_user


def require_researcher(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role.value != UserRole.researcher.value:
        raise HTTPException(status_code=403, detail="Researcher access required.")
    return current_user


@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_citizen),
) -> Feedback:
    feedback = Feedback(
        user_id=current_user.user_id,
        subject=feedback_data.subject,
        category=feedback_data.category,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


@router.get("/my-feedback", response_model=list[FeedbackResponse])
def get_my_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_citizen),
) -> list[Feedback]:
    return (
        db.query(Feedback)
        .filter(Feedback.user_id == current_user.user_id)
        .order_by(Feedback.created_at.desc())
        .all()
    )


@router.get("/manage", response_model=list[FeedbackResponse])
def get_feedback_for_staff(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_feedback_staff),
) -> list[Feedback]:
    query = db.query(Feedback).order_by(Feedback.created_at.desc())
    if current_user.role.value == UserRole.government_official.value:
        if current_user.department is None:
            return []
        query = query.join(User, Feedback.user_id == User.user_id).filter(
            User.department_id == current_user.department_id
        )
    return query.all()


@router.get("/public", response_model=list[PublicFeedbackResponse])
def get_public_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_researcher),
) -> list[Feedback]:
    return db.query(Feedback).filter(
        Feedback.status.in_(("resolved", "closed"))
    ).order_by(Feedback.created_at.desc()).all()


@router.patch("/{feedback_id}/status", response_model=FeedbackResponse)
def update_feedback_status(
    feedback_id: UUID,
    status_data: FeedbackStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_feedback_staff),
) -> Feedback:
    feedback = db.query(Feedback).filter(Feedback.feedback_id == feedback_id).first()
    if feedback is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found.",
        )

    setattr(feedback, "status", status_data.status)
    setattr(feedback, "resolved_by", (
        current_user.user_id
        if status_data.status.value in ("resolved", "closed")
        else None
    ))
    setattr(feedback, "resolved_at", (
        datetime.utcnow()
        if status_data.status.value in ("resolved", "closed")
        else None
    ))
    db.commit()
    db.refresh(feedback)
    return feedback


@router.get("/{feedback_id}", response_model=FeedbackResponse)
def get_my_feedback_by_id(
    feedback_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_citizen),
) -> Feedback:
    feedback = (
        db.query(Feedback)
        .filter(
            Feedback.feedback_id == feedback_id,
            Feedback.user_id == current_user.user_id,
        )
        .first()
    )
    if feedback is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found.",
        )
    return feedback