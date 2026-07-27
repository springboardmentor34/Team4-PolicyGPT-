from fastapi import FastAPI
from app.core.config import settings
from sqlalchemy import text
from app.db.database import engine

app = FastAPI(
    title="PolicyGPT API",
    description="Government Policy & Public Scheme Intelligence Platform",
    version="1.0.0"
)

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