import uuid
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime

from .ai_service import ai_service
from ..database import db
from ..schemas.travel_schemas import (
    TripPlanRequest,
    TripPlanResponse,
    DayItinerary,
    RegenerateDayRequest,
    ModifyTripRequest,
    SaveTripRequest,
    SavedTripSummary,
    ChatMessageRequest,
    ChatMessageResponse
)

logger = logging.getLogger("travelai.travel_service")

class TravelService:
    async def create_trip_plan(self, req: TripPlanRequest) -> TripPlanResponse:
        """Generate a brand new AI trip plan and assign a unique tracking ID."""
        logger.info(f"Generating travel plan for destination={req.destination}, origin={req.origin}, budget={req.budget} {req.currency}")
        trip_plan = await ai_service.generate_itinerary(req)
        
        # Assign unique ID
        trip_plan.id = str(uuid.uuid4())
        trip_plan.created_at = datetime.utcnow().isoformat()
        trip_plan.is_saved = False
        
        # Save temporary cache to DB so it can be retrieved by ID
        await db.save_trip(trip_plan.model_dump())
        return trip_plan

    async def regenerate_day(self, req: RegenerateDayRequest) -> TripPlanResponse:
        """Regenerate a single day and update the full trip plan."""
        current_trip = req.trip_context
        day_number = req.day_number

        logger.info(f"Regenerating Day {day_number} for trip to {current_trip.destination}")
        new_day = await ai_service.regenerate_single_day(day_number, current_trip, req.custom_prompt)

        # Replace the day in current_trip
        updated_itinerary = []
        for day in current_trip.day_by_day_itinerary:
            if day.day_number == day_number:
                updated_itinerary.append(new_day)
            else:
                updated_itinerary.append(day)

        current_trip.day_by_day_itinerary = updated_itinerary
        
        # Recalculate activities list from days
        refreshed_activities = []
        for d in updated_itinerary:
            refreshed_activities.extend(d.morning_activities)
            refreshed_activities.extend(d.afternoon_activities)
            refreshed_activities.extend(d.evening_activities)
        current_trip.activities = refreshed_activities

        if current_trip.id:
            await db.save_trip(current_trip.model_dump())

        return current_trip

    async def modify_trip(self, req: ModifyTripRequest) -> TripPlanResponse:
        """Apply user modifications to an existing trip."""
        logger.info(f"Modifying trip {req.current_trip.destination} with instruction: {req.modification_instruction}")
        modified_trip = await ai_service.modify_itinerary(
            req.modification_instruction,
            req.current_trip,
            req.chat_history
        )
        if not modified_trip.id:
            modified_trip.id = req.current_trip.id or str(uuid.uuid4())

        await db.save_trip(modified_trip.model_dump())
        return modified_trip

    async def chat_assistant(self, req: ChatMessageRequest) -> ChatMessageResponse:
        """Chat with conversational AI travel advisor."""
        return await ai_service.chat_travel_assistant(
            req.message,
            req.trip_context,
            req.chat_history
        )

    async def save_trip(self, req: SaveTripRequest) -> Dict[str, Any]:
        """Save trip to persistent MongoDB or fallback store."""
        trip_dict = req.trip_data.model_dump()
        trip_dict["is_saved"] = True
        trip_dict["user_email"] = req.user_email
        trip_dict["notes"] = req.notes or trip_dict.get("notes", "")
        if req.title:
            trip_dict["title"] = req.title
        else:
            trip_dict["title"] = f"{trip_dict['duration_days']}-Day Journey to {trip_dict['destination']}"

        trip_id = await db.save_trip(trip_dict)
        return {
            "success": True,
            "message": "Trip successfully saved to your saved itineraries!",
            "trip_id": trip_id
        }

    async def get_trip_by_id(self, trip_id: str) -> Optional[TripPlanResponse]:
        """Retrieve a trip by ID."""
        trip_dict = await db.get_trip(trip_id)
        if not trip_dict:
            return None
        return TripPlanResponse.model_validate(trip_dict)

    async def list_saved_trips(self, user_email: Optional[str] = None) -> List[SavedTripSummary]:
        """Get all saved trips."""
        trips = await db.list_saved_trips()
        summaries = []
        for t in trips:
            summaries.append(SavedTripSummary(
                id=t.get("id", ""),
                title=t.get("title", f"{t.get('duration_days', 0)}-Day {t.get('destination', 'Trip')}"),
                destination=t.get("destination", ""),
                origin=t.get("origin", ""),
                start_date=t.get("start_date", ""),
                end_date=t.get("end_date", ""),
                duration_days=t.get("duration_days", 1),
                travelers=t.get("travelers", 1),
                estimated_total_budget=t.get("estimated_total_budget", 0.0),
                currency=t.get("currency", "USD"),
                created_at=t.get("created_at", datetime.utcnow().isoformat()),
                notes=t.get("notes")
            ))
        return summaries

    async def delete_trip(self, trip_id: str) -> bool:
        """Delete a saved trip."""
        return await db.delete_trip(trip_id)

travel_service = TravelService()
