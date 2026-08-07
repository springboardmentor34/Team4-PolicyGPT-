from typing import List, Optional
from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.scheme import Scheme, SchemeStatus
from app.schemas.scheme import (
    SchemeCreate,
    SchemeSearchFilters,
    SchemeUpdate,
)


def get_scheme(db: Session, scheme_id: UUID) -> Optional[Scheme]:
    """Fetch a single scheme by its UUID."""
    return db.query(Scheme).filter(Scheme.scheme_id == scheme_id).first()


def get_scheme_by_name(db: Session, name: str) -> Optional[Scheme]:
    """Fetch a scheme by its exact name (useful for duplicate checks)."""
    return db.query(Scheme).filter(Scheme.name == name).first()


def get_schemes(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[SchemeStatus] = None,
) -> List[Scheme]:
    """Get a paginated list of schemes, optionally filtered by status."""
    query = db.query(Scheme)

    if status:
        query = query.filter(Scheme.status == status)

    return query.order_by(Scheme.created_at.desc()).offset(skip).limit(limit).all()


def count_schemes(db: Session) -> int:
    """Count total schemes."""
    return db.query(Scheme).count()


def create_scheme(
    db: Session,
    scheme_data: SchemeCreate,
    created_by: UUID,
) -> Scheme:
    """Create a new scheme record with draft status."""
    scheme = Scheme(
        name=scheme_data.name,
        category=scheme_data.category,
        department=scheme_data.department,
        state=scheme_data.state,
        benefits=scheme_data.benefits,
        application_start_date=scheme_data.application_start_date,
        application_end_date=scheme_data.application_end_date,
        status=SchemeStatus.draft,
        created_by=created_by,
    )

    db.add(scheme)
    db.commit()
    db.refresh(scheme)
    return scheme


def update_scheme(
    db: Session,
    scheme: Scheme,
    scheme_data: SchemeUpdate,
) -> Scheme:
    """Update editable fields of an existing scheme."""
    update_data = scheme_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(scheme, field, value)

    db.commit()
    db.refresh(scheme)
    return scheme


def update_scheme_status(
    db: Session,
    scheme: Scheme,
    new_status: SchemeStatus,
) -> Scheme:
    """Update the lifecycle status of a scheme."""
    scheme.status = new_status
    db.commit()
    db.refresh(scheme)
    return scheme


def delete_scheme(db: Session, scheme: Scheme) -> None:
    """Hard-delete a scheme record (cascades to eligibility rules)."""
    db.delete(scheme)
    db.commit()


def search_schemes(
    db: Session,
    filters: SchemeSearchFilters,
    skip: int = 0,
    limit: int = 100,
) -> List[Scheme]:
    """Advanced search for schemes with keyword and attribute filters."""
    query = db.query(Scheme)

    if filters.keyword:
        like_pattern = f"%{filters.keyword}%"
        query = query.filter(
            or_(
                Scheme.name.ilike(like_pattern),
                Scheme.category.ilike(like_pattern),
                Scheme.department.ilike(like_pattern),
                Scheme.benefits.ilike(like_pattern),
            )
        )

    if filters.department:
        query = query.filter(Scheme.department == filters.department)

    if filters.state:
        query = query.filter(Scheme.state == filters.state)

    if filters.category:
        query = query.filter(Scheme.category == filters.category)

    if filters.status:
        query = query.filter(Scheme.status == filters.status)

    return query.order_by(Scheme.created_at.desc()).offset(skip).limit(limit).all()
