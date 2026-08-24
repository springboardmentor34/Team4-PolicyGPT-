import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, JSON, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class SearchHistory(Base):
    __tablename__ = "search_history"

    search_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    query_text = Column(String(500))
    filters_json = Column(JSON)
    searched_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
