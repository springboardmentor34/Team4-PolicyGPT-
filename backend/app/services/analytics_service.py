from datetime import date, timedelta
from typing import Iterable

from sqlalchemy import Date, cast, func
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.eligibility_rule import EligibilityRule
from app.models.feedback import Feedback
from app.models.policy import Policy
from app.models.policy_view import PolicyView
from app.models.saved_policy import SavedPolicy
from app.models.scheme import Scheme
from app.models.search_history import SearchHistory
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


def _role_value(current_user: User) -> str:
    return getattr(current_user.role, "value", current_user.role)


def _period_dates(period: str | None) -> tuple[date | None, date | None]:
    if not period:
        return None, None

    today = date.today()
    days_by_period = {
        "7d": 7,
        "last_7_days": 7,
        "30d": 30,
        "last_30_days": 30,
        "3m": 90,
        "last_3_months": 90,
        "6m": 180,
        "last_6_months": 180,
        "1y": 365,
        "last_year": 365,
    }
    days = days_by_period.get(period)
    if days is None:
        return None, None
    return today - timedelta(days=days - 1), today


def _normalize_filters(filters=None) -> dict:
    if filters is None:
        return {
            "start_date": None,
            "end_date": None,
            "period": None,
            "department": None,
            "category": None,
        }

    if isinstance(filters, dict):
        values = filters
    else:
        values = filters.model_dump()

    start_date = values.get("start_date")
    end_date = values.get("end_date")
    period = values.get("period")
    period_start, period_end = _period_dates(period)

    return {
        "start_date": start_date or period_start,
        "end_date": end_date or period_end,
        "period": period,
        "department": values.get("department"),
        "category": values.get("category"),
    }


def _official_department(current_user: User) -> str | None:
    if current_user.department is None:
        return None
    return current_user.department.name


def _apply_policy_scope(query, db: Session, current_user: User, filters: dict):
    role = _role_value(current_user)
    department = filters.get("department")
    category = filters.get("category")

    if filters.get("start_date"):
        query = query.filter(Policy.created_at >= filters["start_date"])
    if filters.get("end_date"):
        query = query.filter(Policy.created_at <= filters["end_date"])
    if category:
        query = query.filter(Policy.category == category)

    if role == "government_official":
        official_department = _official_department(current_user)
        if official_department is None:
            return query.filter(False)
        return query.filter(Policy.department == official_department)

    if role == "organization":
        ids = scoped_user_ids(db, current_user)
        if not ids:
            return query.filter(False)
        query = query.filter(Policy.uploaded_by.in_(ids))
    elif department:
        query = query.filter(Policy.department == department)

    if role == "citizen" or role == "guest_user":
        return query.filter(False)

    return query


def _apply_scheme_scope(query, db: Session, current_user: User, filters: dict):
    role = _role_value(current_user)
    department = filters.get("department")
    category = filters.get("category")

    if filters.get("start_date"):
        query = query.filter(Scheme.created_at >= filters["start_date"])
    if filters.get("end_date"):
        query = query.filter(Scheme.created_at <= filters["end_date"])
    if category:
        query = query.filter(Scheme.category == category)

    if role == "government_official":
        official_department = _official_department(current_user)
        if official_department is None:
            return query.filter(False)
        return query.filter(Scheme.department == official_department)

    if role == "organization":
        ids = scoped_user_ids(db, current_user)
        if not ids:
            return query.filter(False)
        query = query.filter(Scheme.created_by.in_(ids))
    elif department:
        query = query.filter(Scheme.department == department)

    if role == "citizen" or role == "guest_user":
        return query.filter(False)

    return query


def _apply_user_scope(query, model, db: Session, current_user: User, timestamp_field, filters: dict):
    if filters.get("start_date"):
        query = query.filter(timestamp_field >= filters["start_date"])
    if filters.get("end_date"):
        query = query.filter(timestamp_field <= filters["end_date"])

    ids = scoped_user_ids(db, current_user)
    if ids is not None:
        if not ids:
            return query.filter(False)
        query = query.filter(model.user_id.in_(ids))

    return query


def _items(rows: Iterable) -> list[dict]:
    return [
        {
            "label": str(getattr(row.label, "value", row.label) or "Unspecified"),
            "count": int(row.count or 0),
        }
        for row in rows
    ]


def _count(query) -> int:
    return int(query.scalar() or 0)


def _group_by_day(query, timestamp_field, count_field):
    day = cast(timestamp_field, Date).label("label")
    return (
        query.with_entities(day, func.count(count_field).label("count"))
        .group_by(day)
        .order_by(day)
        .all()
    )


def _merge_timeline(series: dict[str, list[dict]]) -> list[dict]:
    labels = sorted({item["label"] for values in series.values() for item in values})
    timeline = []
    for label in labels:
        point = {
            "label": label,
            "searches": 0,
            "views": 0,
            "saves": 0,
            "applications": 0,
            "feedback": 0,
        }
        for key, values in series.items():
            match = next((item for item in values if item["label"] == label), None)
            if match:
                point[key] = match["count"]
        timeline.append(point)
    return timeline


def get_analytics_summary(db: Session, current_user: User, filters=None) -> dict:
    normalized = _normalize_filters(filters)
    data = summary(
        db,
        current_user,
        normalized["start_date"],
        normalized["end_date"],
        normalized["department"],
        normalized["category"],
    )
    views = _count(_apply_user_scope(db.query(func.count(PolicyView.view_id)), PolicyView, db, current_user, PolicyView.viewed_at, normalized))
    saves = _count(_apply_user_scope(db.query(func.count(SavedPolicy.saved_id)), SavedPolicy, db, current_user, SavedPolicy.saved_at, normalized))
    searches = _count(_apply_user_scope(db.query(func.count(SearchHistory.search_id)), SearchHistory, db, current_user, SearchHistory.searched_at, normalized))
    total_engagement = views + saves + searches + int(data["feedback"] or 0) + int(data["applications"] or 0)

    return {
        "total_policies": int(data["total_policies"] or 0),
        "active_schemes": int(data["active_schemes"] or 0),
        "users": data["users"],
        "total_engagement": total_engagement,
        "feedback": int(data["feedback"] or 0),
        "applications": int(data["applications"] or 0),
    }


def get_policy_statistics(db: Session, current_user: User, filters=None) -> dict:
    normalized = _normalize_filters(filters)
    scoped = _apply_policy_scope(db.query(Policy), db, current_user, normalized).subquery()

    by_category = _items(
        db.query(scoped.c.category.label("label"), func.count(scoped.c.policy_id).label("count"))
        .group_by(scoped.c.category)
        .order_by(func.count(scoped.c.policy_id).desc())
        .all()
    )
    by_status = _items(
        db.query(scoped.c.status.label("label"), func.count(scoped.c.policy_id).label("count"))
        .group_by(scoped.c.status)
        .order_by(func.count(scoped.c.policy_id).desc())
        .all()
    )
    by_department = _items(
        db.query(scoped.c.department.label("label"), func.count(scoped.c.policy_id).label("count"))
        .group_by(scoped.c.department)
        .order_by(func.count(scoped.c.policy_id).desc())
        .all()
    )
    trends = _items(
        db.query(cast(scoped.c.created_at, Date).label("label"), func.count(scoped.c.policy_id).label("count"))
        .group_by(cast(scoped.c.created_at, Date))
        .order_by(cast(scoped.c.created_at, Date))
        .all()
    )

    return {
        "by_category": by_category,
        "by_status": by_status,
        "by_department": by_department,
        "trends": trends,
    }


def get_engagement_summary(db: Session, current_user: User, filters=None) -> dict:
    normalized = _normalize_filters(filters)

    view_query = _apply_user_scope(db.query(PolicyView), PolicyView, db, current_user, PolicyView.viewed_at, normalized)
    save_query = _apply_user_scope(db.query(SavedPolicy), SavedPolicy, db, current_user, SavedPolicy.saved_at, normalized)
    search_query = _apply_user_scope(db.query(SearchHistory), SearchHistory, db, current_user, SearchHistory.searched_at, normalized)
    application_query = _apply_user_scope(db.query(Application), Application, db, current_user, Application.submitted_at, normalized)
    feedback_query = _apply_user_scope(db.query(Feedback), Feedback, db, current_user, Feedback.created_at, normalized)

    if normalized.get("department") or normalized.get("category") or _role_value(current_user) == "government_official":
        view_query = view_query.join(Policy, PolicyView.policy_id == Policy.policy_id)
        save_query = save_query.join(Policy, SavedPolicy.policy_id == Policy.policy_id)
        feedback_query = feedback_query.outerjoin(Policy, Feedback.policy_id == Policy.policy_id).outerjoin(Scheme, Feedback.scheme_id == Scheme.scheme_id)
        application_query = application_query.join(Scheme, Application.scheme_id == Scheme.scheme_id)

        if _role_value(current_user) == "government_official":
            department = _official_department(current_user)
        else:
            department = normalized.get("department")

        if department:
            view_query = view_query.filter(Policy.department == department)
            save_query = save_query.filter(Policy.department == department)
            application_query = application_query.filter(Scheme.department == department)
            feedback_query = feedback_query.filter((Policy.department == department) | (Scheme.department == department))

        if normalized.get("category"):
            category = normalized["category"]
            view_query = view_query.filter(Policy.category == category)
            save_query = save_query.filter(Policy.category == category)
            application_query = application_query.filter(Scheme.category == category)
            feedback_query = feedback_query.filter((Policy.category == category) | (Scheme.category == category))

    views = int(view_query.count())
    saves = int(save_query.count())
    searches = int(search_query.count())
    applications = int(application_query.count())
    feedback = int(feedback_query.count())

    timeline = _merge_timeline({
        "views": _items(_group_by_day(view_query, PolicyView.viewed_at, PolicyView.view_id)),
        "saves": _items(_group_by_day(save_query, SavedPolicy.saved_at, SavedPolicy.saved_id)),
        "searches": _items(_group_by_day(search_query, SearchHistory.searched_at, SearchHistory.search_id)),
        "applications": _items(_group_by_day(application_query, Application.submitted_at, Application.application_id)),
        "feedback": _items(_group_by_day(feedback_query, Feedback.created_at, Feedback.feedback_id)),
    })

    return {
        "views": views,
        "saves": saves,
        "searches": searches,
        "applications": applications,
        "feedback": feedback,
        "total_engagement": views + saves + searches + applications + feedback,
        "timeline": timeline,
    }


def get_eligibility_statistics(db: Session, current_user: User, filters=None) -> dict:
    normalized = _normalize_filters(filters)
    query = db.query(EligibilityRule).join(Scheme, EligibilityRule.scheme_id == Scheme.scheme_id)
    query = _apply_scheme_scope(query, db, current_user, normalized)
    rules = query.all()

    age_groups = {
        "<18": 0,
        "18-35": 0,
        "36-60": 0,
        "60+": 0,
    }
    gender_distribution: dict[str, int] = {}
    social_categories: dict[str, int] = {}
    disability = {
        "Disability criteria": 0,
        "No disability criteria": 0,
    }

    for rule in rules:
        min_age = rule.min_age if rule.min_age is not None else 0
        max_age = rule.max_age if rule.max_age is not None else 120
        if min_age <= 17 and max_age >= 0:
            age_groups["<18"] += 1
        if min_age <= 35 and max_age >= 18:
            age_groups["18-35"] += 1
        if min_age <= 60 and max_age >= 36:
            age_groups["36-60"] += 1
        if max_age >= 61:
            age_groups["60+"] += 1

        gender = rule.gender or "Any"
        gender_distribution[gender] = gender_distribution.get(gender, 0) + 1

        social_category = rule.social_category or "Unspecified"
        social_categories[social_category] = social_categories.get(social_category, 0) + 1

        disability_key = "Disability criteria" if rule.disability_status else "No disability criteria"
        disability[disability_key] += 1

    return {
        "age_groups": [{"label": label, "count": count} for label, count in age_groups.items()],
        "gender_distribution": [{"label": label, "count": count} for label, count in gender_distribution.items()],
        "social_categories": [{"label": label, "count": count} for label, count in social_categories.items()],
        "disability": [{"label": label, "count": count} for label, count in disability.items()],
    }


def get_search_trends(db: Session, current_user: User, filters=None) -> dict:
    normalized = _normalize_filters(filters)
    query = _apply_user_scope(db.query(SearchHistory), SearchHistory, db, current_user, SearchHistory.searched_at, normalized)
    query = (
        query.filter(SearchHistory.query_text.isnot(None))
        .with_entities(SearchHistory.query_text, func.count(SearchHistory.search_id).label("count"))
        .group_by(SearchHistory.query_text)
        .order_by(func.count(SearchHistory.search_id).desc())
        .limit(100)
    )
    return {"items": [{"query": row.query_text, "count": row.count} for row in query.all()]}
