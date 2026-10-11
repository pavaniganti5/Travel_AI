from datetime import date
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator, model_validator

class TripPlanRequest(BaseModel):
    origin: str = Field(..., example="San Francisco, CA")
    destination: str = Field(..., example="Tokyo, Japan")
    start_date: str = Field(..., example="2026-05-10")
    end_date: str = Field(..., example="2026-05-17")
    travelers: int = Field(default=2, ge=1, le=50, example=2)
    budget: float = Field(..., ge=1, example=3500.0)
    currency: str = Field(default="USD", example="USD")
    interests: List[str] = Field(default_factory=list, example=["Culture", "Food & Dining", "Sightseeing"])
    travel_style: str = Field(default="Moderate", example="Moderate")
    activity_level: str = Field(default="Moderate", example="Moderate")
    food_preferences: List[str] = Field(default_factory=list, example=["Local Cuisine", "Street Food"])
    additional_request: Optional[str] = Field(default=None, max_length=2000)

    @field_validator("start_date", "end_date")
    @classmethod
    def validate_iso_date(cls, value: str) -> str:
        try:
            date.fromisoformat(value)
        except ValueError as exc:
            raise ValueError("Dates must use the YYYY-MM-DD format") from exc
        return value

    @model_validator(mode="after")
    def validate_date_order(self):
        if date.fromisoformat(self.end_date) < date.fromisoformat(self.start_date):
            raise ValueError("End date must be on or after start date")
        return self


class VoicePlanRequest(TripPlanRequest):
    request_text: str = Field(..., min_length=1, max_length=2000)


class SpeakRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)

    @field_validator("text")
    @classmethod
    def validate_text(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Text must not be empty")
        return value.strip()


class SpeakResponse(BaseModel):
    audio_url: Optional[str] = None
    audio_data: Optional[str] = None
    audio_mime_type: str = "audio/mpeg"
    audio_length_seconds: Optional[float] = None

class ActivityItem(BaseModel):
    title: str = Field(..., example="Explore Senso-ji Temple and Nakamise Street")
    description: str = Field(..., example="Wander through Tokyo's oldest Buddhist temple and browse traditional souvenir stalls.")
    time: Optional[str] = Field(default="09:00 AM", example="09:00 AM")
    location: str = Field(..., example="Asakusa, Taito City")
    estimated_cost: float = Field(default=0.0, example=15.0)
    duration: str = Field(default="2 hours", example="2.5 hours")
    category: str = Field(default="Sightseeing", example="Culture")

class DayItinerary(BaseModel):
    day_number: int = Field(..., example=1)
    date: str = Field(..., example="2026-05-10")
    title: str = Field(..., example="Historic Roots & Vibrant Markets of Asakusa")
    morning_activities: List[ActivityItem] = Field(default_factory=list)
    afternoon_activities: List[ActivityItem] = Field(default_factory=list)
    evening_activities: List[ActivityItem] = Field(default_factory=list)
    estimated_daily_cost: float = Field(default=120.0, example=120.0)
    notes: List[str] = Field(default_factory=list, example=["Purchase Suica/Pasmo IC card at the station", "Wear comfortable walking shoes"])

class RestaurantRecommendation(BaseModel):
    name: str = Field(..., example="Ichiran Ramen Shibuya")
    cuisine: str = Field(..., example="Japanese / Ramen")
    price_range: str = Field(default="$$", example="$$")
    address_or_area: str = Field(..., example="Shibuya, Tokyo")
    highlight_dish: str = Field(..., example="Tonkotsu Ramen with custom spice blend")
    why_recommended: str = Field(..., example="Famous solo dining booths and rich aromatic broth.")

class PlaceToVisit(BaseModel):
    name: str = Field(..., example="Meiji Jingu Shrine")
    type: str = Field(default="Historic & Spiritual", example="Attraction")
    description: str = Field(..., example="Serene shrine set in a lush forest in the heart of Tokyo.")
    best_time_to_visit: str = Field(default="Early morning", example="08:00 AM - 10:00 AM")
    ticket_cost: str = Field(default="Free", example="Free entry")

class BudgetBreakdown(BaseModel):
    estimated_total_budget: float
    transportation_estimate: float
    accommodation_estimate: float
    food_estimate: float
    activity_estimate: float
    currency: str = "USD"

class TripPlanResponse(BaseModel):
    id: Optional[str] = None
    origin: str
    destination: str
    start_date: str
    end_date: str
    duration_days: int
    travelers: int
    budget: float
    currency: str
    trip_summary: str
    budget_breakdown: Optional[BudgetBreakdown] = None
    estimated_total_budget: float
    transportation_estimate: float
    accommodation_estimate: float
    food_estimate: float
    activity_estimate: float
    day_by_day_itinerary: List[DayItinerary]
    activities: List[ActivityItem] = Field(default_factory=list)
    recommended_restaurants: List[RestaurantRecommendation] = Field(default_factory=list)
    places_and_activities: List[PlaceToVisit] = Field(default_factory=list)
    travel_tips: List[str] = Field(default_factory=list)
    packing_suggestions: List[str] = Field(default_factory=list)
    is_saved: Optional[bool] = False
    created_at: Optional[str] = None
    ai_generated: bool = True
    live_api_notice: Optional[str] = "Estimates are generated based on current travel index averages and AI market models."

class RegenerateDayRequest(BaseModel):
    trip_id: Optional[str] = None
    trip_context: TripPlanResponse
    day_number: int
    custom_prompt: Optional[str] = None

class ModifyTripRequest(BaseModel):
    trip_id: Optional[str] = None
    current_trip: TripPlanResponse
    modification_instruction: str
    chat_history: Optional[List[Dict[str, Any]]] = None

class SaveTripRequest(BaseModel):
    trip_data: TripPlanResponse
    title: Optional[str] = None
    notes: Optional[str] = None
    user_email: Optional[str] = "traveler@travelai.local"

class SavedTripSummary(BaseModel):
    id: str
    title: str
    destination: str
    origin: str
    start_date: str
    end_date: str
    duration_days: int
    travelers: int
    estimated_total_budget: float
    currency: str
    created_at: str
    notes: Optional[str] = None

class ChatMessageRequest(BaseModel):
    message: str
    trip_context: Optional[TripPlanResponse] = None
    chat_history: Optional[List[Dict[str, Any]]] = None

class ChatMessageResponse(BaseModel):
    reply: str
    suggested_changes: Optional[str] = None
    updated_trip: Optional[TripPlanResponse] = None
