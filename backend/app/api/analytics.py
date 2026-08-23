from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_roles
from app.db.database import get_db
from app.models.user import User
from app.services.analytics_service import summary
from app.services.report_service import report_data

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_summary(start_date: date | None = Query(None), end_date: date | None = Query(None), department: str | None = Query(None), category: str | None = Query(None), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return summary(db, current_user, start_date, end_date, department, category)


@router.get("/engagement")
def get_engagement(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    data = summary(db, current_user)
    return {"engagement": data["feedback"] + data["applications"]}


@router.get("/search-trends")
def get_search_trends(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.models.search_history import SearchHistory
    from sqlalchemy import func
    from app.models.user import UserRole
    query = db.query(SearchHistory.query_text, func.count(SearchHistory.search_id).label("count"))
    if current_user.role == UserRole.government_official:
        if current_user.department_id is None:
            return {"items": []}
        query = query.join(User, SearchHistory.user_id == User.user_id).filter(User.department_id == current_user.department_id)
    elif current_user.role == UserRole.organization:
        if current_user.organization_id is None:
            return {"items": []}
        query = query.join(User, SearchHistory.user_id == User.user_id).filter(User.organization_id == current_user.organization_id)
    elif current_user.role == UserRole.citizen:
        query = query.filter(SearchHistory.user_id == current_user.user_id)
    query = query.filter(SearchHistory.query_text.isnot(None)).group_by(SearchHistory.query_text).order_by(func.count(SearchHistory.search_id).desc()).limit(100)
    return {"items": [{"query": row.query_text, "count": row.count} for row in query.all()]}


@router.get("/departments")
def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("administrator", "government_official", "researcher")
    ),
):
    return {"items": report_data(db, "department_summary", current_user)}
