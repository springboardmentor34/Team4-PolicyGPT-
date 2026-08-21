from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.feedback import FeedbackCategory, FeedbackStatus


class FeedbackCreate(BaseModel):
    subject: str = Field(..., min_length=1, max_length=255)
    category: FeedbackCategory


class FeedbackStatusUpdate(BaseModel):
    status: FeedbackStatus


class FeedbackResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    feedback_id: UUID
    user_id: UUID
    subject: Optional[str] = None
    category: FeedbackCategory
    status: FeedbackStatus
    response_text: Optional[str] = None
    resolved_by: Optional[UUID] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime