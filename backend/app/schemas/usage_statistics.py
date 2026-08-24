from datetime import date
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel


class UsageEventCreate(BaseModel):
    event_type: str
    policy_id: Optional[UUID] = None
    scheme_id: Optional[UUID] = None
    metadata: Optional[dict[str, Any]] = None


class SearchTrackRequest(BaseModel):
    query_text: Optional[str] = None
    filters_json: Optional[dict[str, Any]] = None


class PolicyTrackRequest(BaseModel):
    policy_id: UUID


class UsageStatisticsResponse(BaseModel):
    searches: int
    policy_views: int
    saved_policies: int
    applications: int
    engagement: int
    trend: list[dict[str, Any]]


class UsageFilters(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    user_type: Optional[str] = None
