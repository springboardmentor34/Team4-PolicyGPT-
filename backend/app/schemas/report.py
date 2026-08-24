from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.report import ReportFormat, ReportType


class ReportCreate(BaseModel):
    report_type: ReportType
    format: ReportFormat
    policy_id: Optional[UUID] = None
    scheme_id: Optional[UUID] = None
    department: Optional[str] = None
    filters: Optional[dict[str, Any]] = None


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    report_id: UUID
    generated_by: UUID
    policy_id: Optional[UUID] = None
    scheme_id: Optional[UUID] = None
    report_type: ReportType
    format: ReportFormat
    department: Optional[str] = None
    filters: Optional[dict[str, Any]] = None
    file_path: Optional[str] = None
    created_at: datetime
    data: list[dict[str, Any]] = []
