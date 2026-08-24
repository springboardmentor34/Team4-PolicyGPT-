from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.policy import Policy
from app.models.report import Report
from app.models.scheme import Scheme
from app.models.user import User


def _scope_user_ids(db: Session, current_user: User):
    if current_user.role.value == "administrator":
        return None
    if current_user.role.value == "government_official" and current_user.department_id:
        return [user_id for (user_id,) in db.query(User.user_id).filter(User.department_id == current_user.department_id).all()]
    if current_user.role.value == "organization":
        if current_user.organization_id is None:
            return []
        return [user_id for (user_id,) in db.query(User.user_id).filter(User.organization_id == current_user.organization_id).all()]
    return [current_user.user_id]


def report_data(db: Session, report_type: str, current_user: User, department: str | None = None) -> list[dict]:
    if report_type == "policy_summary":
        if current_user.role.value == "organization":
            return []
        if current_user.role.value == "government_official" and current_user.department is None:
            return []
        query = db.query(Policy)
        if department:
            query = query.filter(Policy.department == department)
        if current_user.role.value == "government_official" and current_user.department:
            query = query.filter(Policy.department == current_user.department.name)
        return [{"policy_id": str(row.policy_id), "title": row.title, "department": row.department, "category": row.category, "status": row.status.value} for row in query.all()]
    if report_type == "department_summary":
        rows = db.query(Policy.department, Policy.status, Policy.policy_id).all()
        scheme_rows = db.query(Scheme.department, Scheme.status, Scheme.scheme_id).all()
        grouped: dict[str, dict] = {}
        for row in rows:
            name = row.department or "Unassigned"
            if department and name != department:
                continue
            if current_user.role.value == "government_official":
                if current_user.department is None or name != current_user.department.name:
                    continue
            grouped.setdefault(name, {"department": name, "policies": 0, "active_policies": 0, "schemes": 0, "active_schemes": 0})
            grouped[name]["policies"] += 1
            if row.status.value in ("approved", "published"):
                grouped[name]["active_policies"] += 1
        for row in scheme_rows:
            name = row.department or "Unassigned"
            if department and name != department:
                continue
            if current_user.role.value == "government_official":
                if current_user.department is None or name != current_user.department.name:
                    continue
            grouped.setdefault(name, {"department": name, "policies": 0, "active_policies": 0, "schemes": 0, "active_schemes": 0})
            grouped[name]["schemes"] += 1
            if row.status.value == "active":
                grouped[name]["active_schemes"] += 1
        return list(grouped.values())
    if report_type == "user_summary":
        query = db.query(User)
        ids = _scope_user_ids(db, current_user)
        if ids is not None:
            query = query.filter(User.user_id.in_(ids))
        rows = query.with_entities(User.role).group_by(User.role).all()
        return [
            {
                "role": row.role.value,
                "user_count": query.filter(User.role == row.role).count(),
            }
            for row in rows
        ]
    if report_type == "usage":
        query = db.query(Application)
        ids = _scope_user_ids(db, current_user)
        if ids is not None:
            query = query.filter(Application.user_id.in_(ids))
        return [{"application_id": str(row.application_id), "user_id": str(row.user_id), "scheme_id": str(row.scheme_id), "status": row.status.value, "submitted_at": row.submitted_at.isoformat()} for row in query.all()]
    if current_user.role.value == "organization":
        return []
    scheme_query = db.query(Scheme)
    if current_user.role.value == "government_official":
        if current_user.department is None:
            return []
        scheme_query = scheme_query.filter(Scheme.department == current_user.department.name)
    return [{"scheme_id": str(row.scheme_id), "name": row.name, "department": row.department, "status": row.status.value} for row in scheme_query.all()]


def serialize_report(report: Report, data: list[dict]) -> dict:
    result = {column.name: getattr(report, column.name) for column in report.__table__.columns}
    result["report_type"] = report.report_type.value
    result["format"] = report.format.value
    result["data"] = data
    return result
