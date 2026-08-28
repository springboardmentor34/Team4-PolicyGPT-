from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.analytics import (
    AnalyticsSummaryResponse,
    EligibilityStatsResponse,
    EngagementSummaryResponse,
    PolicyStatsResponse,
)
from app.services.analytics_service import (
    get_analytics_summary,
    get_eligibility_statistics,
    get_engagement_summary,
    get_policy_statistics,
    get_search_trends,
)
from app.services.report_service import report_data

router = APIRouter(prefix="/analytics", tags=["Analytics"])

ANALYTICS_ROLES = (
    "administrator",
    "government_official",
    "researcher",
    "organization",
)


def analytics_filters(
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    period: str | None = Query(None),
    department: str | None = Query(None),
    category: str | None = Query(None),
) -> dict:
    return {
        "start_date": start_date,
        "end_date": end_date,
        "period": period,
        "department": department,
        "category": category,
    }


@router.get("/summary", response_model=AnalyticsSummaryResponse)
def get_summary(
    filters: dict = Depends(analytics_filters),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*ANALYTICS_ROLES)),
):
    return get_analytics_summary(db, current_user, filters)


@router.get("/engagement")
def get_engagement(
    filters: dict = Depends(analytics_filters),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*ANALYTICS_ROLES)),
):
    data = get_engagement_summary(db, current_user, filters)
    return {"engagement": data["total_engagement"]}


@router.get("/policy-stats", response_model=PolicyStatsResponse)
def policy_stats(
    filters: dict = Depends(analytics_filters),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*ANALYTICS_ROLES)),
):
    return get_policy_statistics(db, current_user, filters)


@router.get("/engagement-summary", response_model=EngagementSummaryResponse)
def engagement_summary(
    filters: dict = Depends(analytics_filters),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*ANALYTICS_ROLES)),
):
    return get_engagement_summary(db, current_user, filters)


@router.get("/eligibility-stats", response_model=EligibilityStatsResponse)
def eligibility_stats(
    filters: dict = Depends(analytics_filters),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*ANALYTICS_ROLES)),
):
    return get_eligibility_statistics(db, current_user, filters)


@router.get("/search-trends")
def search_trends(
    filters: dict = Depends(analytics_filters),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(*ANALYTICS_ROLES)),
):
    return get_search_trends(db, current_user, filters)


@router.get("/departments")
def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("administrator", "government_official", "researcher")
    ),
):
    return {"items": report_data(db, "department_summary", current_user)}
