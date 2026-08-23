from app.db.database import Base
from app.models.user import User
from app.models.policy import Policy
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule
from app.models.notification import Notification
from app.models.feedback import Feedback
from app.models.department import Department
from app.models.organization import Organization
from app.models.application import Application
from app.models.report import Report
from app.models.search_history import SearchHistory
from app.models.policy_view import PolicyView
from app.models.engagement_event import EngagementEvent
from app.models.saved_policy import SavedPolicy


# Import all models here
# All models are imported here so Alembic autogenerate
# and Base.metadata.create_all can discover every table.
