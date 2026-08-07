from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud.policy import (
    archive_policy,
    count_policies,
    create_policy,
    delete_policy,
    get_policies,
    get_policy,
    update_policy,
    update_policy_status,
)
from app.db.database import get_db
from app.models.policy import PolicyStatus
from app.schemas.policy import (
    PolicyApprovalUpdate,
    PolicyCreate,
    PolicyList,
    PolicyResponse,
    PolicyUpdate,
)

router = APIRouter(
    prefix="/policies",
    tags=["Policies"],
)


@router.post(
    "/",
    response_model=PolicyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_policy(
    policy_data: PolicyCreate,
    db: Session = Depends(get_db),
    uploaded_by: Optional[UUID] = Query(default=None),
) -> PolicyResponse:
    """Create a new policy record with pending status."""
    return create_policy(db=db, policy_data=policy_data, uploaded_by=uploaded_by)


@router.get(
    "/",
    response_model=PolicyList,
)
def list_policies(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    status_filter: Optional[PolicyStatus] = Query(default=None, alias="status"),
) -> PolicyList:
    """Get a paginated list of policies, optionally filtered by status."""
    items = get_policies(
        db=db,
        skip=skip,
        limit=limit,
        status=status_filter,
    )
    total = count_policies(db=db)
    return PolicyList(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{policy_id}",
    response_model=PolicyResponse,
)
def get_policy_by_id(
    policy_id: UUID,
    db: Session = Depends(get_db),
) -> PolicyResponse:
    """Fetch a single policy by its UUID."""
    policy = get_policy(db=db, policy_id=policy_id)
    if policy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy with id {policy_id} not found.",
        )
    return policy


@router.put(
    "/{policy_id}",
    response_model=PolicyResponse,
)
def update_existing_policy(
    policy_id: UUID,
    policy_data: PolicyUpdate,
    db: Session = Depends(get_db),
) -> PolicyResponse:
    """Update editable fields of an existing policy."""
    policy = get_policy(db=db, policy_id=policy_id)
    if policy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy with id {policy_id} not found.",
        )
    return update_policy(db=db, policy=policy, policy_data=policy_data)


@router.delete(
    "/{policy_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_policy(
    policy_id: UUID,
    db: Session = Depends(get_db),
) -> None:
    """Hard-delete a policy record."""
    policy = get_policy(db=db, policy_id=policy_id)
    if policy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy with id {policy_id} not found.",
        )
    delete_policy(db=db, policy=policy)


@router.patch(
    "/{policy_id}/archive",
    response_model=PolicyResponse,
)
def archive_existing_policy(
    policy_id: UUID,
    db: Session = Depends(get_db),
) -> PolicyResponse:
    """Archive a policy (set status to archived)."""
    policy = get_policy(db=db, policy_id=policy_id)
    if policy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy with id {policy_id} not found.",
        )
    return archive_policy(db=db, policy=policy)


@router.patch(
    "/{policy_id}/approval-status",
    response_model=PolicyResponse,
)
def update_policy_approval_status(
    policy_id: UUID,
    approval_data: PolicyApprovalUpdate,
    db: Session = Depends(get_db),
) -> PolicyResponse:
    """Update the approval/publishing status of a policy."""
    policy = get_policy(db=db, policy_id=policy_id)
    if policy is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy with id {policy_id} not found.",
        )
    return update_policy_status(
        db=db,
        policy=policy,
        new_status=approval_data.status,
        approved_by=approval_data.approved_by,
    )
