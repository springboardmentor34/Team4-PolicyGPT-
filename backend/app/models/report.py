import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, DateTime, Enum, ForeignKey, JSON, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class ReportType(str, enum.Enum):
    usage = "usage"
    scheme_summary = "scheme_summary"
    audit = "audit"
    custom = "custom"
    policy_summary = "policy_summary"
    department_summary = "department_summary"
    user_summary = "user_summary"


class ReportFormat(str, enum.Enum):
    pdf = "pdf"
    csv = "csv"
    xlsx = "xlsx"


class Report(Base):
    __tablename__ = "reports"

    report_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    generated_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.policy_id", ondelete="SET NULL"), index=True)
    scheme_id = Column(UUID(as_uuid=True), ForeignKey("schemes.scheme_id", ondelete="SET NULL"), index=True)
    report_type = Column(Enum(ReportType, name="report_type"), nullable=False, index=True)
    format = Column(Enum(ReportFormat, name="report_format"), nullable=False)
    department = Column(String(150), index=True)
    filters = Column(JSON)
    file_path = Column(String(500))
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
