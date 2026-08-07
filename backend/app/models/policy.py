import enum
import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class PolicyStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    published = "published"
    archived = "archived"


class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    category = Column(String(100))

    department = Column(String(150))

    ministry = Column(String(150))

    state = Column(String(100))

    file_url = Column(String(500))

    status = Column(
        Enum(PolicyStatus, name="policy_status"),
        nullable=False,
        default=PolicyStatus.pending,
    )

    uploaded_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True,
    )

    approved_by = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
    )

    published_date = Column(Date)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    uploader = relationship(
        "User",
        foreign_keys=[uploaded_by],
        lazy="joined",
    )

    approver = relationship(
        "User",
        foreign_keys=[approved_by],
        lazy="joined",
    )
