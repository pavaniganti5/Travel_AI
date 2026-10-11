import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status

from ..schemas.travel_schemas import (
    TripPlanRequest,
    TripPlanResponse,
    RegenerateDayRequest,
    ModifyTripRequest,
    SaveTripRequest,
    SavedTripSummary,
    ChatMessageRequest,
    ChatMessageResponse,
    VoicePlanRequest,
    SpeakRequest,
    SpeakResponse
)
from ..services.travel_service import travel_service
from ..services.murf_service import murf_service, MurfServiceError

logger = logging.getLogger("travelai.routes")

router = APIRouter(prefix="/api/travel", tags=["Travel Itineraries"])

@router.post(
    "/plan",
    response_model=TripPlanResponse,
    summary="Generate a comprehensive AI Travel Itinerary",
    status_code=status.HTTP_200_OK
)
async def plan_trip(request: TripPlanRequest):
    """Generate a multi-day personalized travel plan based on user preferences and constraints."""
    try:
        trip = await travel_service.create_trip_plan(request)
        return trip
    except Exception as e:
        logger.error(f"Error planning trip: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate travel plan: {str(e)}"
        )

@router.post(
    "/voice",
    response_model=TripPlanResponse,
    summary="Generate a trip from a recognized voice request"
)
async def plan_voice(request: VoicePlanRequest):
    """Use the browser-recognized voice request as added context for itinerary generation."""
    try:
        plan_request = TripPlanRequest.model_validate({
            **request.model_dump(exclude={"request_text"}),
            "additional_request": request.request_text
        })
        return await travel_service.create_trip_plan(plan_request)
    except Exception as e:
        logger.error("Error planning voice request: %s", e, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate travel plan from voice request"
        ) from e

@router.post(
    "/speak",
    response_model=SpeakResponse,
    summary="Synthesize itinerary narration with Murf AI"
)
async def speak_text(request: SpeakRequest):
    """Generate speech using the backend-configured Murf API key."""
    try:
        return await murf_service.generate_speech(request.text)
    except MurfServiceError as e:
        logger.warning("Murf speech generation failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Speech generation is unavailable. Your itinerary is still available as text."
        ) from e

@router.post(
    "/regenerate-day",
    response_model=TripPlanResponse,
    summary="Regenerate a specific day's activities in the itinerary"
)
async def regenerate_day(request: RegenerateDayRequest):
    """Regenerate morning, afternoon, and evening activities for a specific day."""
    try:
        updated_trip = await travel_service.regenerate_day(request)
        return updated_trip
    except Exception as e:
        logger.error(f"Error regenerating day: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to regenerate day: {str(e)}"
        )

@router.post(
    "/modify",
    response_model=TripPlanResponse,
    summary="Modify an entire trip based on natural language instructions"
)
async def modify_trip(request: ModifyTripRequest):
    """Update trip schedule, themes, or budget using AI conversational modification."""
    try:
        updated_trip = await travel_service.modify_trip(request)
        return updated_trip
    except Exception as e:
        logger.error(f"Error modifying trip: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to modify trip: {str(e)}"
        )

@router.post(
    "/chat",
    response_model=ChatMessageResponse,
    summary="Chat with conversational travel advisor"
)
async def chat_assistant(request: ChatMessageRequest):
    """Get instant advice, local tips, transit recommendations, and dining highlights from AI advisor."""
    try:
        reply = await travel_service.chat_assistant(request)
        return reply
    except Exception as e:
        logger.error(f"Error in chat assistant: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat assistant error: {str(e)}"
        )

@router.post(
    "/save",
    summary="Save trip to database"
)
async def save_trip(request: SaveTripRequest):
    """Persist the trip itinerary to MongoDB/Database for future reference."""
    try:
        result = await travel_service.save_trip(request)
        return result
    except Exception as e:
        logger.error(f"Error saving trip: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save trip: {str(e)}"
        )

@router.get(
    "/saved",
    response_model=List[SavedTripSummary],
    summary="Get all saved trips"
)
async def get_saved_trips():
    """Retrieve list of all saved itineraries."""
    try:
        trips = await travel_service.list_saved_trips()
        return trips
    except Exception as e:
        logger.error(f"Error fetching saved trips: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load saved trips: {str(e)}"
        )

@router.get(
    "/{trip_id}",
    response_model=TripPlanResponse,
    summary="Get detailed trip itinerary by ID"
)
async def get_trip(trip_id: str):
    """Fetch complete itinerary and breakdown for a specific trip ID."""
    trip = await travel_service.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' was not found."
        )
    return trip

@router.delete(
    "/{trip_id}",
    summary="Delete a saved trip"
)
async def delete_trip(trip_id: str):
    """Delete a saved itinerary by ID."""
    success = await travel_service.delete_trip(trip_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trip with ID '{trip_id}' not found or already deleted."
        )
    return {"success": True, "message": f"Trip {trip_id} deleted successfully."}
