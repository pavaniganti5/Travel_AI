import sys
import asyncio
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config import settings
from app.main import app
from app.services.murf_service import murf_service
from app.schemas.travel_schemas import TripPlanResponse


class TravelApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app, raise_server_exceptions=False)
        self.payload = {
            "origin": "Hyderabad, India",
            "destination": "Goa, India",
            "start_date": "2026-11-14",
            "end_date": "2026-11-18",
            "travelers": 2,
            "budget": 30000,
            "currency": "INR",
            "interests": ["Beaches"],
            "travel_style": "Easygoing",
            "activity_level": "Balanced",
            "food_preferences": ["Vegetarian"],
        }
        self.trip = TripPlanResponse(
            origin="Hyderabad, India",
            destination="Goa, India",
            start_date="2026-11-14",
            end_date="2026-11-18",
            duration_days=5,
            travelers=2,
            budget=30000,
            currency="INR",
            trip_summary="A coastal escape.",
            estimated_total_budget=28500,
            transportation_estimate=5000,
            accommodation_estimate=10000,
            food_estimate=8000,
            activity_estimate=5500,
            day_by_day_itinerary=[],
        )

    def test_plan_rejects_reversed_dates(self):
        payload = {**self.payload, "start_date": "2026-11-18", "end_date": "2026-11-14"}
        response = self.client.post("/api/travel/plan", json=payload)
        self.assertEqual(response.status_code, 422)

    @patch("app.routes.travel_routes.travel_service.create_trip_plan", new_callable=AsyncMock)
    def test_voice_request_becomes_planning_context(self, create_trip_plan):
        create_trip_plan.return_value = self.trip
        request_text = "Plan a beach trip with late starts."
        response = self.client.post(
            "/api/travel/voice",
            json={**self.payload, "request_text": request_text},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(create_trip_plan.await_args.args[0].additional_request, request_text)

    def test_speak_returns_service_unavailable_without_murf_key(self):
        with patch.object(settings, "MURF_API_KEY", ""):
            response = self.client.post("/api/travel/speak", json={"text": "Goa awaits."})
        self.assertEqual(response.status_code, 503)
        self.assertIn("still available as text", response.json()["detail"])

    def test_speak_rejects_blank_text(self):
        response = self.client.post("/api/travel/speak", json={"text": "   "})
        self.assertEqual(response.status_code, 422)


class MurfServiceTests(unittest.TestCase):
    def test_murf_audio_is_returned_without_exposing_api_key(self):
        response = unittest.mock.Mock()
        response.json.return_value = {
            "audioFile": "https://audio.example/trip.mp3",
            "encodedAudio": "bXVmZi1hdWRpbw==",
            "audioLengthInSeconds": 12.5,
        }
        client = unittest.mock.AsyncMock()
        client.__aenter__.return_value = client
        client.post.return_value = response

        with patch.object(settings, "MURF_API_KEY", "test-secret"), patch(
            "app.services.murf_service.httpx.AsyncClient", return_value=client
        ):
            result = asyncio.run(murf_service.generate_speech("A Goa trip."))

        self.assertEqual(result.audio_url, "https://audio.example/trip.mp3")
        self.assertEqual(result.audio_data, "bXVmZi1hdWRpbw==")
        self.assertEqual(result.audio_length_seconds, 12.5)
        headers = client.post.await_args.kwargs["headers"]
        self.assertEqual(headers["api-key"], "test-secret")
        self.assertNotIn("api-key", client.post.await_args.kwargs["json"])


if __name__ == "__main__":
    unittest.main()
