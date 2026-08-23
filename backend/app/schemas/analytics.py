from datetime import date
from typing import Optional

from pydantic import BaseModel


class AnalyticsFilters(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    department: Optional[str] = None
    category: Optional[str] = None
