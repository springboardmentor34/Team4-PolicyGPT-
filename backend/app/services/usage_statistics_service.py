from datetime import date, datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.engagement_event import EngagementEvent
from app.models.policy_view import PolicyView
from app.models.search_history import SearchHistory
from app.models.saved_policy import SavedPolicy
from app.models.user import User


def get_usage(db: Session, current_user: User, start_date: date | None = None, end_date: date | None = None, period: str = "6m", user_type: str = "all") -> dict:
    if not start_date:
        today = datetime.utcnow().date()
        period_days = {"7d": 7, "30d": 30, "3m": 90, "6m": 180, "1y": 365}.get(period)
        if period_days:
            start_date = today - timedelta(days=period_days)
            end_date = end_date or today
    user_filter = current_user.user_id
    role = current_user.role.value
    scoped_user_ids = None
    if role == "administrator":
        user_filter = None
    elif role == "government_official" and current_user.department_id:
        scoped_user_ids = [user_id for (user_id,) in db.query(User.user_id).filter(User.department_id == current_user.department_id).all()]
    elif role == "organization" and current_user.organization_id:
        scoped_user_ids = [user_id for (user_id,) in db.query(User.user_id).filter(User.organization_id == current_user.organization_id).all()]
    if user_type != "all" and (role == "administrator" or scoped_user_ids is not None):
        role_value = user_type.lower().replace(" ", "_")
        role_query = db.query(User.user_id).filter(User.role == role_value)
        if scoped_user_ids is not None:
            role_query = role_query.filter(User.user_id.in_(scoped_user_ids))
        scoped_user_ids = [user_id for (user_id,) in role_query.all()]
        user_filter = None
    from datetime import time
    start_dt = datetime.combine(start_date, time.min) if start_date else None
    end_dt = datetime.combine(end_date, time.max) if end_date else None

    def count(model, timestamp_column):
        if model is SearchHistory:
            query = db.query(func.count(SearchHistory.search_id))
            timestamp_column = SearchHistory.searched_at
        elif model is PolicyView:
            query = db.query(func.count(PolicyView.view_id))
        elif model is Application:
            query = db.query(func.count(Application.application_id))
        elif model is SavedPolicy:
            query = db.query(func.count(SavedPolicy.saved_id))
        else:
            query = db.query(func.count(EngagementEvent.event_id))
        query = query.select_from(model)
        if user_filter:
            query = query.filter(model.user_id == user_filter)
        elif scoped_user_ids is not None:
            query = query.filter(model.user_id.in_(scoped_user_ids))
        if start_dt:
            query = query.filter(timestamp_column >= start_dt)
        if end_dt:
            query = query.filter(timestamp_column <= end_dt)
        return int(query.scalar() or 0)
    searches = count(SearchHistory, SearchHistory.searched_at)
    views = count(PolicyView, PolicyView.viewed_at)
    applications = count(Application, Application.submitted_at)
    saves = count(SavedPolicy, SavedPolicy.saved_at)
    engagement = count(EngagementEvent, EngagementEvent.created_at)

    recent_searches_query = db.query(SearchHistory)
    if user_filter:
        recent_searches_query = recent_searches_query.filter(SearchHistory.user_id == user_filter)
    elif scoped_user_ids is not None:
        recent_searches_query = recent_searches_query.filter(SearchHistory.user_id.in_(scoped_user_ids))
    recent_searches_query = recent_searches_query.order_by(SearchHistory.searched_at.desc()).limit(5)
    recent_searches = [
        {"query": s.query_text or "Policy Search", "searchedAt": s.searched_at.strftime("%b %d, %H:%M") if s.searched_at else "Recent"}
        for s in recent_searches_query.all()
    ]

    user_activity = []
    if role in ["administrator", "government_official"]:
        roles_to_check = ["citizen", "government_official", "researcher", "organization", "administrator"]
        for r in roles_to_check:
            u_ids = [uid for (uid,) in db.query(User.user_id).filter(User.role == r).all()]
            total_act = 0
            if u_ids:
                s_c = db.query(func.count(SearchHistory.search_id)).filter(SearchHistory.user_id.in_(u_ids)).scalar() or 0
                v_c = db.query(func.count(PolicyView.view_id)).filter(PolicyView.user_id.in_(u_ids)).scalar() or 0
                sv_c = db.query(func.count(SavedPolicy.saved_id)).filter(SavedPolicy.user_id.in_(u_ids)).scalar() or 0
                total_act = s_c + v_c + sv_c
            role_label = r.replace('_', ' ').title()
            user_activity.append({"role": role_label, "total": total_act})

    return {
        "searches": searches,
        "policy_views": views,
        "saved_policies": saves,
        "applications": applications,
        "engagement": views + searches + saves + engagement,
        "trend": [],
        "user_activity": user_activity,
        "recent_searches": recent_searches,
    }
