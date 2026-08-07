from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EligibilityRuleBase(BaseModel):
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    gender: Optional[str] = None
    max_income: Optional[Decimal] = None
    occupation: Optional[str] = None
    education_level: Optional[str] = None
    location: Optional[str] = None
    social_category: Optional[str] = None
    disability_status: Optional[bool] = False


class EligibilityRuleCreate(EligibilityRuleBase):
    pass


class EligibilityRuleUpdate(BaseModel):
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    gender: Optional[str] = None
    max_income: Optional[Decimal] = None
    occupation: Optional[str] = None
    education_level: Optional[str] = None
    location: Optional[str] = None
    social_category: Optional[str] = None
    disability_status: Optional[bool] = False


class EligibilityRuleResponse(EligibilityRuleBase):
    model_config = ConfigDict(from_attributes=True)

    scheme_id: UUID
    rule_id: UUID
