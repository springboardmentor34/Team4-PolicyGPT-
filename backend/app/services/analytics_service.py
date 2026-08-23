from datetime import date
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.feedback import Feedback
from app.models.policy import Policy
from app.models.scheme import Scheme
from app.models.user import User


def scoped_user_ids(db: Session, current_user: User):
    if current_user.role.value == "administrator" or current_user.role.value == "researcher":
        return None
    if current_user.role.value == "government_official":
        return [user_id for (user_id,) in db.query(User.user_id).filter(User.department_id == current_user.department_id).all()]
    if current_user.role.value == "organization":
        return [user_id for (user_id,) in db.query(User.user_id).filter(User.organization_id == current_user.organization_id).all()]
    return [current_user.user_id]


def summary(db: Session, current_user: User, start_date: date | None = None, end_date: date | None = None, department: str | None = None, category: str | None = None) -> dict:
    policy_query = db.query(Policy)
    scheme_query = db.query(Scheme)
    if start_date:
        policy_query = policy_query.filter(Policy.created_at >= start_date)
        scheme_query = scheme_query.filter(Scheme.created_at >= start_date)
    if end_date:
        policy_query = policy_query.filter(Policy.created_at <= end_date)
        scheme_query = scheme_query.filter(Scheme.created_at <= end_date)
    if department:
        policy_query = policy_query.filter(Policy.department == department)
        scheme_query = scheme_query.filter(Scheme.department == department)
    if category:
        policy_query = policy_query.filter(Policy.category == category)
        scheme_query = scheme_query.filter(Scheme.category == category)
    if current_user.role.value == "government_official":
        if current_user.department is None:
            policy_query = policy_query.filter(False)
            scheme_query = scheme_query.filter(False)
        else:
            policy_query = policy_query.filter(Policy.department == current_user.department.name)
            scheme_query = scheme_query.filter(Scheme.department == current_user.department.name)
    elif current_user.role.value in ("citizen", "organization"):
        policy_query = policy_query.filter(False)
        scheme_query = scheme_query.filter(False)
    ids = scoped_user_ids(db, current_user)
    feedback_query = db.query(func.count(Feedback.feedback_id))
    application_query = db.query(func.count(Application.application_id))
    if ids is not None:
        feedback_query = feedback_query.filter(Feedback.user_id.in_(ids))
        application_query = application_query.filter(Application.user_id.in_(ids))
    return {
        "total_policies": policy_query.count(),
        "active_schemes": scheme_query.filter(Scheme.status == "active").count(),
        "users": db.query(func.count(User.user_id)).scalar() if current_user.role.value == "administrator" else None,
        "feedback": feedback_query.scalar(),
        "applications": application_query.scalar(),
    }
