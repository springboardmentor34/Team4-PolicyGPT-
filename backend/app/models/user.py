import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID

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

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
