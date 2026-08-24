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


from app.models.search_history import SearchHistory
from app.models.policy_view import PolicyView
from app.models.saved_policy import SavedPolicy
from app.schemas.usage_statistics import SearchTrackRequest, PolicyTrackRequest


@router.post("/track/search", status_code=201)
def track_search(request: SearchTrackRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    search_hist = SearchHistory(user_id=current_user.user_id, query_text=request.query_text, filters_json=request.filters_json)
    db.add(search_hist)
    db.commit()
    db.refresh(search_hist)
    return {"status": "success", "search_id": search_hist.search_id}


@router.post("/track/view", status_code=201)
def track_policy_view(request: PolicyTrackRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    view = PolicyView(user_id=current_user.user_id, policy_id=request.policy_id)
    db.add(view)
    db.commit()
    db.refresh(view)
    return {"status": "success", "view_id": view.view_id}


@router.post("/track/save", status_code=201)
def track_policy_save(request: PolicyTrackRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if already saved
    existing = db.query(SavedPolicy).filter(SavedPolicy.user_id == current_user.user_id, SavedPolicy.policy_id == request.policy_id).first()
    if existing:
        return {"status": "already_saved", "saved_id": existing.saved_id}
        
    save = SavedPolicy(user_id=current_user.user_id, policy_id=request.policy_id)
    db.add(save)
    db.commit()
    db.refresh(save)
    return {"status": "success", "saved_id": save.saved_id}
