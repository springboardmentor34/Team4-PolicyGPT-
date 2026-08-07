import uuid

from sqlalchemy import Boolean, Column, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    rule_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    scheme_id = Column(
        UUID(as_uuid=True),
        ForeignKey("schemes.scheme_id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    min_age = Column(Integer)

    max_age = Column(Integer)

    gender = Column(String(20))

    max_income = Column(Numeric(14, 2))

    occupation = Column(String(100))

    education_level = Column(String(100))

    location = Column(String(150))

    social_category = Column(String(100))

    disability_status = Column(
        Boolean,
        default=False,
    )

    scheme = relationship(
        "Scheme",
        back_populates="eligibility_rule",
    )
