import os
import json
import asyncio
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

logger = logging.getLogger("travelai.database")

class DatabaseManager:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.is_mongodb_connected: bool = False
        self.fallback_file = os.path.join(os.path.dirname(__file__), "..", "data", "db.json")
        self._ensure_fallback_dir()

    def _ensure_fallback_dir(self):
        os.makedirs(os.path.dirname(self.fallback_file), exist_ok=True)
        if not os.path.exists(self.fallback_file):
            initial_data = {
                "trips": [],
                "users": [],
                "saved_itineraries": []
            }
            with open(self.fallback_file, "w", encoding="utf-8") as f:
                json.dump(initial_data, f, indent=2)

    def _read_fallback(self) -> Dict[str, List[Dict[str, Any]]]:
        try:
            with open(self.fallback_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error reading fallback database: {e}")
            return {"trips": [], "users": [], "saved_itineraries": []}

    def _write_fallback(self, data: Dict[str, List[Dict[str, Any]]]):
        try:
            with open(self.fallback_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error writing fallback database: {e}")

    async def connect(self):
        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2000,
                connectTimeoutMS=2000
            )
            # Test connection
            await self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_mongodb_connected = True
            logger.info("Successfully connected to MongoDB.")
        except Exception as e:
            self.is_mongodb_connected = False
            self.client = None
            self.db = None
            logger.warning(
                f"MongoDB connection failed ({e}). Using local persistent JSON store at {self.fallback_file}."
            )

    async def disconnect(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

    async def save_trip(self, trip_data: Dict[str, Any]) -> str:
        trip_id = trip_data.get("id")
        if not trip_id:
            import uuid
            trip_id = str(uuid.uuid4())
            trip_data["id"] = trip_id

        trip_data["updated_at"] = datetime.utcnow().isoformat()
        if "created_at" not in trip_data or not trip_data["created_at"]:
            trip_data["created_at"] = datetime.utcnow().isoformat()

        if self.is_mongodb_connected and self.db is not None:
            try:
                await self.db.trips.replace_one(
                    {"id": trip_id},
                    trip_data,
                    upsert=True
                )
                return trip_id
            except Exception as e:
                logger.error(f"MongoDB write failed: {e}. Falling back to file store.")

        # File store fallback
        data = self._read_fallback()
        trips = data.get("trips", [])
        existing_index = next((i for i, t in enumerate(trips) if t.get("id") == trip_id), None)
        if existing_index is not None:
            trips[existing_index] = trip_data
        else:
            trips.append(trip_data)
        data["trips"] = trips
        self._write_fallback(data)
        return trip_id

    async def get_trip(self, trip_id: str) -> Optional[Dict[str, Any]]:
        if self.is_mongodb_connected and self.db is not None:
            try:
                trip = await self.db.trips.find_one({"id": trip_id}, {"_id": 0})
                if trip:
                    return trip
            except Exception as e:
                logger.error(f"MongoDB read failed: {e}. Checking file store.")

        data = self._read_fallback()
        for trip in data.get("trips", []):
            if trip.get("id") == trip_id:
                return trip
        return None

    async def list_saved_trips(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.is_mongodb_connected and self.db is not None:
            try:
                query = {"is_saved": True}
                if user_id and user_id != "default_user":
                    query["user_id"] = user_id
                cursor = self.db.trips.find(query, {"_id": 0}).sort("created_at", -1)
                trips = await cursor.to_list(length=100)
                return trips
            except Exception as e:
                logger.error(f"MongoDB read failed: {e}. Checking file store.")

        data = self._read_fallback()
        saved = [t for t in data.get("trips", []) if t.get("is_saved", False)]
        saved.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return saved

    async def delete_trip(self, trip_id: str) -> bool:
        deleted = False
        if self.is_mongodb_connected and self.db is not None:
            try:
                result = await self.db.trips.delete_one({"id": trip_id})
                if result.deleted_count > 0:
                    deleted = True
            except Exception as e:
                logger.error(f"MongoDB delete failed: {e}.")

        data = self._read_fallback()
        trips = data.get("trips", [])
        before_count = len(trips)
        trips = [t for t in trips if t.get("id") != trip_id]
        if len(trips) < before_count:
            deleted = True
            data["trips"] = trips
            self._write_fallback(data)
        return deleted

    async def get_status(self) -> Dict[str, Any]:
        return {
            "mongodb_connected": self.is_mongodb_connected,
            "storage_type": "MongoDB" if self.is_mongodb_connected else "Local File Store (Persistent JSON)",
            "database_name": settings.DATABASE_NAME
        }

db = DatabaseManager()
