from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.report import Report, ReportType
from app.models.user import User
from app.schemas.report import ReportCreate
from app.services.report_service import report_data, serialize_report

router = APIRouter(prefix="/reports", tags=["Reports"])


def can_generate(user: User) -> bool:
    return user.role.value in ("administrator", "government_official", "organization", "citizen")


@router.post("", status_code=status.HTTP_201_CREATED)
def create_report(request: ReportCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not can_generate(current_user):
        raise HTTPException(status_code=403, detail="This role can only view public reports.")
    if current_user.role.value == "citizen" and request.report_type.value not in ("policy_summary", "scheme_summary", "usage"):
        raise HTTPException(status_code=403, detail="Citizens can only generate personal or policy reports.")
    effective_department = request.department if current_user.role.value == "administrator" else None
    if current_user.role.value == "government_official":
        effective_department = current_user.department.name if current_user.department else None
    data = report_data(db, request.report_type.value, current_user, effective_department)
    report = Report(generated_by=current_user.user_id, policy_id=request.policy_id, scheme_id=request.scheme_id, report_type=request.report_type, format=request.format, department=effective_department, filters=request.filters)
    db.add(report)
    db.commit()
    db.refresh(report)
    return serialize_report(report, data)


@router.get("")
def list_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), limit: int = Query(100, ge=1, le=1000)):
    query = db.query(Report).filter(Report.generated_by == current_user.user_id)
    if current_user.role.value == "administrator":
        query = db.query(Report)
    return [serialize_report(report, []) for report in query.order_by(Report.created_at.desc()).limit(limit).all()]


@router.get("/preview")
def preview_report(
    report_type: ReportType,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role.value == "citizen" and report_type.value not in ("policy_summary", "scheme_summary", "usage"):
        raise HTTPException(status_code=403, detail="Citizens can only preview personal or policy reports.")
    if current_user.role.value == "researcher" and report_type.value not in ("policy_summary", "scheme_summary", "department_summary", "user_summary"):
        raise HTTPException(status_code=403, detail="Researchers can only preview public reports.")
    department = current_user.department.name if current_user.role.value == "government_official" and current_user.department else None
    return {"report_type": report_type.value, "data": report_data(db, report_type.value, current_user, department)}


@router.get("/{report_id}")
def get_report(report_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = db.query(Report).filter(Report.report_id == report_id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if current_user.role.value != "administrator" and report.generated_by != current_user.user_id:
        raise HTTPException(status_code=403, detail="You do not have access to this report.")
    return serialize_report(report, report_data(db, report.report_type.value, current_user, report.department))
