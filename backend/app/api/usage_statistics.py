from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.engagement_event import EngagementEvent
from app.models.user import User
from app.schemas.usage_statistics import UsageEventCreate
from app.services.usage_statistics_service import get_usage

router = APIRouter(prefix="/usage-statistics", tags=["Usage Statistics"])


@router.get("")
def usage_statistics(start_date: date | None = Query(None), end_date: date | None = Query(None), period: str = Query("6m"), user_type: str = Query("all"), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_usage(db, current_user, start_date, end_date, period, user_type)


@router.post("/events", status_code=201)
def record_event(request: UsageEventCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    event = EngagementEvent(user_id=current_user.user_id, event_type=request.event_type, policy_id=request.policy_id, scheme_id=request.scheme_id, event_metadata=request.metadata)
    db.add(event)
    db.commit()
    db.refresh(event)
    return {"event_id": event.event_id, "event_type": event.event_type}
