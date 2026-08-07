import enum
import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class SchemeStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    inactive = "inactive"
    expired = "expired"


class Scheme(Base):
    __tablename__ = "schemes"

    scheme_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name = Column(
        String(255),
        nullable=False,
    )

    category = Column(String(100))

    department = Column(String(150))

    state = Column(String(100))

    benefits = Column(Text)

    application_start_date = Column(Date)

    application_end_date = Column(Date)

    status = Column(
        Enum(SchemeStatus, name="scheme_status"),
        nullable=False,
        default=SchemeStatus.draft,
    )

    created_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    creator = relationship(
        "User",
        foreign_keys=[created_by],
        lazy="joined",
    )

    eligibility_rule = relationship(
        "EligibilityRule",
        back_populates="scheme",
        uselist=False,
        cascade="all, delete-orphan",
    )
