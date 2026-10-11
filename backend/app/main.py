import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import db
from .routes import travel_router, health_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("travelai.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing TravelAI Backend Services...")
    await db.connect()
    yield
    logger.info("Shutting down TravelAI Backend Services...")
    await db.disconnect()

app = FastAPI(
    title=settings.APP_NAME,
    description="Full-stack AI Travel Planner backend offering dynamic itinerary generation, conversational modifications, budget estimation, and MongoDB persistence.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(travel_router)
app.include_router(health_router)

@app.get("/", summary="Root API Index")
async def root():
    return {
        "message": "Welcome to TravelAI API — Next-Generation Travel Planning Engine",
        "docs": "/docs",
        "health": "/api/health",
        "endpoints": {
            "plan_trip": "POST /api/travel/plan",
            "plan_voice": "POST /api/travel/voice",
            "speak": "POST /api/travel/speak",
            "regenerate_day": "POST /api/travel/regenerate-day",
            "modify_trip": "POST /api/travel/modify",
            "chat_assistant": "POST /api/travel/chat",
            "save_trip": "POST /api/travel/save",
            "saved_trips": "GET /api/travel/saved",
            "get_trip": "GET /api/travel/{trip_id}",
            "delete_trip": "DELETE /api/travel/{trip_id}"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
