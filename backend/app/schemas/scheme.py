from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.scheme import SchemeStatus


class SchemeBase(BaseModel):
    name: str = Field(..., max_length=255)
    category: Optional[str] = Field(default=None, max_length=100)
    department: Optional[str] = Field(default=None, max_length=150)
    state: Optional[str] = Field(default=None, max_length=100)
    benefits: Optional[str] = None
    application_start_date: Optional[date] = None
    application_end_date: Optional[date] = None


class SchemeCreate(SchemeBase):
    pass


class SchemeUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=255)
    category: Optional[str] = Field(default=None, max_length=100)
    department: Optional[str] = Field(default=None, max_length=150)
    state: Optional[str] = Field(default=None, max_length=100)
    benefits: Optional[str] = None
    application_start_date: Optional[date] = None
    application_end_date: Optional[date] = None


class SchemeStatusUpdate(BaseModel):
    status: SchemeStatus


class SchemeResponse(SchemeBase):
    model_config = ConfigDict(from_attributes=True)

    scheme_id: UUID
    status: SchemeStatus
    created_by: Optional[UUID] = None
    created_at: datetime


class SchemeSearchFilters(BaseModel):
    keyword: Optional[str] = None
    department: Optional[str] = None
    state: Optional[str] = None
    category: Optional[str] = None
    status: Optional[SchemeStatus] = None


class SchemeList(BaseModel):
    items: list[SchemeResponse]
    total: int
    skip: int
    limit: int
