from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud.eligibility_rule import (
    create_rule,
    delete_rule,
    get_all_rules,
    get_rule,
    update_rule,
)
from app.db.database import get_db
from app.schemas.eligibility_rule import (
    EligibilityRuleCreate,
    EligibilityRuleResponse,
    EligibilityRuleUpdate,
)

router = APIRouter(
    prefix="/eligibility-rules",
    tags=["Eligibility Rules"],
)


@router.post(
    "/",
    response_model=EligibilityRuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_rule(
    rule_data: EligibilityRuleCreate,
    scheme_id: UUID = Query(...),
    db: Session = Depends(get_db),
) -> EligibilityRuleResponse:
    """Create a new eligibility rule linked to a scheme."""
    try:
        return create_rule(db=db, scheme_id=scheme_id, rule_data=rule_data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "/",
    response_model=List[EligibilityRuleResponse],
)
def list_rules(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
) -> List[EligibilityRuleResponse]:
    """Get a paginated list of all eligibility rules."""
    return get_all_rules(db=db, skip=skip, limit=limit)


@router.get(
    "/{rule_id}",
    response_model=EligibilityRuleResponse,
)
def get_rule_by_id(
    rule_id: UUID,
    db: Session = Depends(get_db),
) -> EligibilityRuleResponse:
    """Fetch a single eligibility rule by its UUID."""
    rule = get_rule(db=db, rule_id=rule_id)
    if rule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Eligibility rule with id {rule_id} not found.",
        )
    return rule


@router.put(
    "/{rule_id}",
    response_model=EligibilityRuleResponse,
)
def update_existing_rule(
    rule_id: UUID,
    rule_data: EligibilityRuleUpdate,
    db: Session = Depends(get_db),
) -> EligibilityRuleResponse:
    """Update editable fields of an existing eligibility rule."""
    rule = get_rule(db=db, rule_id=rule_id)
    if rule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Eligibility rule with id {rule_id} not found.",
        )
    return update_rule(db=db, rule=rule, rule_data=rule_data)


@router.delete(
    "/{rule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_rule(
    rule_id: UUID,
    db: Session = Depends(get_db),
) -> None:
    """Hard-delete an eligibility rule."""
    rule = get_rule(db=db, rule_id=rule_id)
    if rule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Eligibility rule with id {rule_id} not found.",
        )
    delete_rule(db=db, rule=rule)
