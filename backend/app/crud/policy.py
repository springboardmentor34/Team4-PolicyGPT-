from typing import List, Optional
from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.policy import Policy, PolicyStatus
from app.schemas.policy import (
    PolicyCreate,
    PolicySearchFilters,
    PolicyUpdate,
)


def get_policy(db: Session, policy_id: UUID) -> Optional[Policy]:
    """Fetch a single policy by its UUID."""
    return db.query(Policy).filter(Policy.policy_id == policy_id).first()


def get_policies(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[PolicyStatus] = None,
) -> List[Policy]:
    """Get a paginated list of policies, optionally filtered by status."""
    query = db.query(Policy)

    if status:
        query = query.filter(Policy.status == status)

    return query.order_by(Policy.created_at.desc()).offset(skip).limit(limit).all()


def count_policies(db: Session) -> int:
    """Count total policies (useful for pagination and dashboards)."""
    return db.query(Policy).count()


def create_policy(
    db: Session,
    policy_data: PolicyCreate,
    uploaded_by: UUID,
) -> Policy:
    """Create a new policy record with pending status."""
    policy = Policy(
        title=policy_data.title,
        category=policy_data.category,
        department=policy_data.department,
        ministry=policy_data.ministry,
        state=policy_data.state,
        file_url=policy_data.file_url,
        status=PolicyStatus.pending,
        uploaded_by=uploaded_by,
        published_date=policy_data.published_date,
    )

    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy


def update_policy(
    db: Session,
    policy: Policy,
    policy_data: PolicyUpdate,
) -> Policy:
    """Update editable fields of an existing policy."""
    update_data = policy_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(policy, field, value)

    db.commit()
    db.refresh(policy)
    return policy


def update_policy_status(
    db: Session,
    policy: Policy,
    new_status: PolicyStatus,
    approved_by: Optional[UUID] = None,
) -> Policy:
    """Update the approval/publishing status of a policy."""
    policy.status = new_status

    if approved_by:
        policy.approved_by = approved_by

    db.commit()
    db.refresh(policy)
    return policy


def archive_policy(db: Session, policy: Policy) -> Policy:
    """Archive a policy (set status to archived)."""
    policy.status = PolicyStatus.archived
    db.commit()
    db.refresh(policy)
    return policy


def delete_policy(db: Session, policy: Policy) -> None:
    """Hard-delete a policy record."""
    db.delete(policy)
    db.commit()


def search_policies(
    db: Session,
    filters: PolicySearchFilters,
    skip: int = 0,
    limit: int = 100,
) -> List[Policy]:
    """Advanced search with keyword and multiple attribute filters."""
    query = db.query(Policy)

    if filters.keyword:
        like_pattern = f"%{filters.keyword}%"
        query = query.filter(
            or_(
                Policy.title.ilike(like_pattern),
                Policy.category.ilike(like_pattern),
                Policy.department.ilike(like_pattern),
                Policy.ministry.ilike(like_pattern),
            )
        )

    if filters.department:
        query = query.filter(Policy.department == filters.department)

    if filters.state:
        query = query.filter(Policy.state == filters.state)

    if filters.category:
        query = query.filter(Policy.category == filters.category)
        
    if filters.status:
        query = query.filter(Policy.status == filters.status)

    if filters.published_from:
        query = query.filter(Policy.published_date >= filters.published_from)

    if filters.published_to:
        query = query.filter(Policy.published_date <= filters.published_to)

    return query.order_by(Policy.created_at.desc()).offset(skip).limit(limit).all()
