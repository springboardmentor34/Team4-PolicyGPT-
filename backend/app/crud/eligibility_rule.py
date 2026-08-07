from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.eligibility_rule import EligibilityRule
from app.schemas.eligibility_rule import (
    EligibilityRuleCreate,
    EligibilityRuleUpdate,
)


def get_rule(db: Session, rule_id: UUID) -> Optional[EligibilityRule]:
    """Fetch a single eligibility rule by its UUID."""
    return db.query(EligibilityRule).filter(EligibilityRule.rule_id == rule_id).first()


def get_rule_by_scheme(db: Session, scheme_id: UUID) -> Optional[EligibilityRule]:
    """Fetch the eligibility rule associated with a scheme (one-to-one)."""
    return (
        db.query(EligibilityRule)
        .filter(EligibilityRule.scheme_id == scheme_id)
        .first()
    )


def get_all_rules(
    db: Session,
    skip: int = 0,
    limit: int = 100,
) -> List[EligibilityRule]:
    """Get a paginated list of all eligibility rules."""
    return db.query(EligibilityRule).offset(skip).limit(limit).all()


def create_rule(
    db: Session,
    scheme_id: UUID,
    rule_data: EligibilityRuleCreate,
) -> EligibilityRule:
    """Create a new eligibility rule linked to a scheme."""
    existing_rule = get_rule_by_scheme(db, scheme_id)
    if existing_rule is not None:
        raise ValueError(
            f"An eligibility rule already exists for scheme {scheme_id}"
        )
    rule = EligibilityRule(
        scheme_id=scheme_id,
        min_age=rule_data.min_age,
        max_age=rule_data.max_age,
        gender=rule_data.gender,
        max_income=rule_data.max_income,
        occupation=rule_data.occupation,
        education_level=rule_data.education_level,
        location=rule_data.location,
        social_category=rule_data.social_category,
        disability_status=rule_data.disability_status,
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule


def update_rule(
    db: Session,
    rule: EligibilityRule,
    rule_data: EligibilityRuleUpdate,
) -> EligibilityRule:
    """Update editable fields of an existing eligibility rule."""
    update_data = rule_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(rule, field, value)

    db.commit()
    db.refresh(rule)
    return rule


def delete_rule(db: Session, rule: EligibilityRule) -> None:
    """Hard-delete an eligibility rule."""
    db.delete(rule)
    db.commit()


def get_rules_for_multiple_schemes(
    db: Session,
    scheme_ids: List[UUID],
) -> List[EligibilityRule]:
    """Fetch eligibility rules for a list of scheme IDs (used by comparison)."""
    if not scheme_ids:
        return []

    return (
        db.query(EligibilityRule)
        .filter(EligibilityRule.scheme_id.in_(scheme_ids))
        .all()
    )
