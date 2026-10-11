from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class TripDocument(BaseModel):
    id: str
    user_id: Optional[str] = "default_user"
    user_email: Optional[str] = "traveler@travelai.local"
    title: str
    origin: str
    destination: str
    start_date: str
    end_date: str
    duration_days: int
    travelers: int
    budget: float
    currency: str
    interests: List[str] = []
    travel_style: str = "Moderate"
    activity_level: str = "Moderate"
    food_preferences: List[str] = []
    trip_summary: str
    estimated_total_budget: float
    transportation_estimate: float
    accommodation_estimate: float
    food_estimate: float
    activity_estimate: float
    day_by_day_itinerary: List[Dict[str, Any]]
    activities: List[Dict[str, Any]] = []
    recommended_restaurants: List[Dict[str, Any]] = []
    places_and_activities: List[Dict[str, Any]] = []
    travel_tips: List[str] = []
    packing_suggestions: List[str] = []
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class UserDocument(BaseModel):
    id: str
    email: str
    name: str
    preferences: Dict[str, Any] = {}
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class SavedItineraryDocument(BaseModel):
    id: str
    trip_id: str
    user_id: str
    saved_title: str
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
