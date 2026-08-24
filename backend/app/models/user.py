import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base


class UserRole(str, enum.Enum):
    administrator = "administrator"
    government_official = "government_official"
    citizen = "citizen"
    researcher = "researcher"
    organization = "organization"
    guest_user = "guest_user"


class User(Base):
    __tablename__ = "users"

    user_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    full_name = Column(
        String(255),
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
    )

    password_hash = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        Enum(UserRole, name="user_role"),
        nullable=False,
        default=UserRole.citizen,
    )

    phone = Column(String(20))

    state = Column(String(100))

    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.department_id", ondelete="SET NULL"), index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.organization_id", ondelete="SET NULL"), index=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    department = relationship("Department", back_populates="users")
    organization = relationship("Organization", back_populates="users")
