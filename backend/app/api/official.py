from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.core.dependencies import require_roles
from app.db.database import get_db
from app.models.application import Application
from app.models.department import Department
from app.models.notification import Notification
from app.models.policy import Policy, PolicyStatus
from app.models.scheme import Scheme
from app.models.user import User

router = APIRouter(prefix="/official", tags=["Government Official"])


def _department_clause(column, department_name: str):
    if department_name.casefold() == "healthcare":
        return func.lower(column).in_(
            ("healthcare", "health department")
        )

    return func.lower(column) == func.lower(department_name)


def _department_filter(query, column, department_name: str):
    return query.filter(_department_clause(column, department_name))


def _assigned_department(current_user: User):
    if current_user.department_id is None or current_user.department is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Your account is not assigned to a department.",
        )
    return current_user.department


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("government_official")),
):
    department = _assigned_department(current_user)
    department_name = department.name
    policy_query = _department_filter(
        db.query(Policy), Policy.department, department_name
    )
    scheme_query = _department_filter(
        db.query(Scheme), Scheme.department, department_name
    )

    scheme_usage_query = (
        db.query(
            Scheme.name.label("scheme"),
            func.count(Application.application_id).label("users"),
        )
        .outerjoin(Application, Application.scheme_id == Scheme.scheme_id)
    )
    scheme_usage = _department_filter(
        scheme_usage_query, Scheme.department, department_name
    ).group_by(
        Scheme.scheme_id, Scheme.name
    ).order_by(
        func.count(Application.application_id).desc(), Scheme.name
    ).all()

    notifications = db.query(Notification).filter(
        or_(
            Notification.user_id == current_user.user_id,
            _department_clause(Notification.department, department_name),
        )
    ).count()

    return {
        "totalPolicies": policy_query.count(),
        "activeSchemes": scheme_query.filter(Scheme.status == "active").count(),
        "totalDepartments": 1,
        "notifications": notifications,
        "approvedPolicies": policy_query.filter(Policy.status == PolicyStatus.approved).count(),
        "pendingPolicies": policy_query.filter(Policy.status == PolicyStatus.pending).count(),
        "rejectedPolicies": 0,
        "schemeUsage": [
            {"scheme": row.scheme, "users": int(row.users or 0)}
            for row in scheme_usage
        ],
        "recentActivity": [],
    }


@router.get("/departments")
def get_department_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("government_official", "administrator")),
):
    if current_user.role.value == "government_official":
        departments = [_assigned_department(current_user)]
    else:
        departments = db.query(Department).order_by(Department.name).all()

    reports = []
    for department in departments:
        department_name = department.name
        reports.append({
            "departmentId": str(department.department_id),
            "department": department_name,
            "policies": _department_filter(
                db.query(Policy), Policy.department, department_name
            ).count(),
            "schemes": _department_filter(
                db.query(Scheme), Scheme.department, department_name
            ).count(),
        })

    return reports