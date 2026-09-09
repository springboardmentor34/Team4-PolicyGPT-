from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from sqlalchemy import text
from app.db.database import engine
from app.db.base import Base
from app.api.auth import router as auth_router
from app.api.policy import router as policy_router
from app.api.scheme import router as scheme_router
from app.api.eligibility_rule import router as eligibility_router
from app.api.admin import router as admin_router
from app.api.notification import router as notification_router
from app.api.v1.endpoints.feedback import router as feedback_router
from app.api.reports import router as reports_router
from app.api.analytics import router as analytics_router
from app.api.usage_statistics import router as usage_statistics_router
from app.api.official import router as official_router
from app.db.database import SessionLocal
from app.db.seed import seed_departments

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    seed_departments(db)


app = FastAPI(
    title="PolicyGPT API",
    description="Government Policy & Public Scheme Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(policy_router)
app.include_router(scheme_router)
app.include_router(eligibility_router)
app.include_router(admin_router)
app.include_router(notification_router)
app.include_router(feedback_router)
app.include_router(reports_router)
app.include_router(analytics_router)
app.include_router(usage_statistics_router)
app.include_router(official_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to PolicyGPT Backend 🚀",
        "database": settings.DATABASE_URL,
        "algorithm": settings.ALGORITHM
    }

@app.get("/health")
def health_check():

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "database": "Connected Successfully ✅"
        }

    except Exception as e:

        return {
            "database": "Connection Failed ❌",
            "error": str(e)
        }
