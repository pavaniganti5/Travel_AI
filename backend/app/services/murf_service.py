import logging

import httpx

from ..config import settings
from ..schemas.travel_schemas import SpeakResponse

logger = logging.getLogger("travelai.murf_service")


class MurfServiceError(Exception):
    """Raised when Murf speech generation is unavailable or unsuccessful."""


class MurfService:
    endpoint = "https://api.murf.ai/v1/speech/generate"

    async def generate_speech(self, text: str) -> SpeakResponse:
        if not settings.MURF_API_KEY.strip():
            raise MurfServiceError("MURF_API_KEY is not configured")

        payload = {
            "text": text,
            "voiceId": settings.MURF_VOICE_ID,
            "locale": settings.MURF_LOCALE,
            "modelVersion": "GEN2",
            "format": "MP3",
            "sampleRate": 44100,
            "encodeAsBase64": True,
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    self.endpoint,
                    headers={
                        "api-key": settings.MURF_API_KEY,
                        "Content-Type": "application/json",
                    },
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            logger.warning("Murf speech request failed: %s", exc)
            raise MurfServiceError("Murf speech generation failed") from exc

        audio_data = data.get("encodedAudio")
        audio_url = data.get("audioFile")
        if not audio_data and not audio_url:
            raise MurfServiceError("Murf returned no audio data")

        return SpeakResponse(
            audio_url=audio_url,
            audio_data=audio_data,
            audio_length_seconds=data.get("audioLengthInSeconds"),
        )


murf_service = MurfService()