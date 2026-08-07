from app.db.database import Base
from app.models.user import User
from app.models.policy import Policy
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule


# Import all models here
# All models are imported here so Alembic autogenerate
# and Base.metadata.create_all can discover every table.
