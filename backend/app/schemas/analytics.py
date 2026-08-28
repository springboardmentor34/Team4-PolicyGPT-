from datetime import date
from typing import Optional

from pydantic import BaseModel


class AnalyticsFilters(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    period: Optional[str] = None
    department: Optional[str] = None
    category: Optional[str] = None


class AnalyticsBreakdownItem(BaseModel):
    label: str
    count: int


class AnalyticsTimelinePoint(BaseModel):
    label: str
    searches: int = 0
    views: int = 0
    saves: int = 0
    applications: int = 0
    feedback: int = 0


class AnalyticsSummaryResponse(BaseModel):
    total_policies: int
    active_schemes: int
    users: int | None = None
    total_engagement: int
    feedback: int
    applications: int


class PolicyStatsResponse(BaseModel):
    by_category: list[AnalyticsBreakdownItem]
    by_status: list[AnalyticsBreakdownItem]
    by_department: list[AnalyticsBreakdownItem]
    trends: list[AnalyticsBreakdownItem]


class EngagementSummaryResponse(BaseModel):
    views: int
    saves: int
    searches: int
    applications: int
    feedback: int
    total_engagement: int
    timeline: list[AnalyticsTimelinePoint]


class EligibilityStatsResponse(BaseModel):
    age_groups: list[AnalyticsBreakdownItem]
    gender_distribution: list[AnalyticsBreakdownItem]
    social_categories: list[AnalyticsBreakdownItem]
    disability: list[AnalyticsBreakdownItem]
