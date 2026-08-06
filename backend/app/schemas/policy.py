from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.policy import PolicyStatus


class PolicyBase(BaseModel):
    title: str = Field(..., max_length=255)
    category: Optional[str] = Field(default=None, max_length=100)
    department: Optional[str] = Field(default=None, max_length=150)
    ministry: Optional[str] = Field(default=None, max_length=150)
    state: Optional[str] = Field(default=None, max_length=100)
    file_url: Optional[str] = Field(default=None, max_length=500)
    published_date: Optional[date] = None


class PolicyCreate(PolicyBase):
    pass


class PolicyUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=255)
    category: Optional[str] = Field(default=None, max_length=100)
    department: Optional[str] = Field(default=None, max_length=150)
    ministry: Optional[str] = Field(default=None, max_length=150)
    state: Optional[str] = Field(default=None, max_length=100)
    file_url: Optional[str] = Field(default=None, max_length=500)
    published_date: Optional[date] = None


class PolicyApprovalUpdate(BaseModel):
    status: PolicyStatus
    approved_by: Optional[UUID] = None


class PolicyResponse(PolicyBase):
    model_config = ConfigDict(from_attributes=True)

    policy_id: UUID
    status: PolicyStatus
    uploaded_by: UUID
    approved_by: Optional[UUID] = None
    created_at: datetime


class PolicySearchFilters(BaseModel):
    keyword: Optional[str] = None
    department: Optional[str] = None
    state: Optional[str] = None
    category: Optional[str] = None
    status: Optional[PolicyStatus] = None
    published_from: Optional[date] = None
    published_to: Optional[date] = None


class PolicyList(BaseModel):
    items: list[PolicyResponse]
    total: int
    skip: int
    limit: int
