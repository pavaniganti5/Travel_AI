from fastapi import APIRouter
from ..database import db
from ..config import settings

router = APIRouter(prefix="/api", tags=["Health & System"])

@router.get("/health", summary="Health check endpoint")
async def health_check():
    db_status = await db.get_status()
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "ai_provider": settings.AI_PROVIDER,
        "database": db_status
    }
