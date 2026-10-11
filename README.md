# TravelAI — Full-Stack AI Travel Assistant with Murf Voice Engine

TravelAI is a full-stack, intelligent travel planning application. It allows travelers to plan, refine, customize, and listen to personalized multi-day itineraries using text and voice.

---

## 🏛️ System Architecture

```
User (Browser)
   │
   ├── 📝 Form & Text Preferences ──┐
   │                                 │
   └── 🎤 Voice Request (WebSpeech) ──┤
                                     ▼
                      ┌──────────────────────────────┐
                      │    React + Vite Frontend     │
                      │  (Tailwind CSS, Axios, Lucide)│
                      └──────────────┬───────────────┘
                                     │ HTTP / JSON
                                     ▼
                      ┌──────────────────────────────┐
                      │    FastAPI Python Backend    │
                      │  (Pydantic V2, Motor/Async)  │
                      └──────┬───────────────┬───────┘
                             │               │
                 LLM Request │               │ Text-to-Speech
                             ▼               ▼
                      ┌──────────────┐ ┌──────────────┐
                      │ Google Gemini│ │   Murf AI    │
                      │   / OpenAI   │ │ Voice Engine │
                      └──────┬───────┘ └──────┬───────┘
                             │                │
            Structured JSON  ▼                ▼ MP3 / Base64 Audio
                      ┌──────────────┐ ┌──────────────┐
                      │ MongoDB / DB │ │ Audio Stream │
                      │ Persistence  │ │   Playback   │
                      └──────────────┘ └──────────────┘
```

> **Security Note:** All external AI credentials (`MURF_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`) are kept strictly on the FastAPI backend and are never exposed to the frontend client.

---

## 🚀 Key Features

1. **Dual-Mode Interaction**:
   - **Text Mode:** Customize origin, destination, travel dates, travelers, budget (₹ / $), travel style, activity pace, and food preferences.
   - **Voice Mode:** Speak naturally (e.g., *"Plan a 5-day Goa trip for two people under ₹30,000"*). Browser speech recognition transcribes and forwards the prompt as rich planning context.
2. **Structured AI Travel Engine**:
   - Generates trip overview, itemized cost estimates (Transportation, Accommodation, Food, Activities), and comprehensive day-by-day itineraries (Morning, Afternoon, Evening).
   - Curates must-visit locations, recommended local dining spots, travel safety tips, and packing lists.
3. **Murf AI Voice Integration**:
   - Backend service (`backend/app/services/murf_service.py`) sends narration summaries to the Murf AI API (`GEN2` model) and streams audio playback directly in the web UI.
   - Graceful fallback: If Murf AI is offline or credentials are not yet configured, the itinerary remains fully viewable and customizable as text.
4. **Conversational Trip Modification**:
   - Modify trips in natural language (e.g., *"Make Day 2 cheaper"*, *"Add more water sports"*, *"Avoid early morning starts"*).
5. **Day Regeneration**:
   - Regenerate individual days with fresh activities while preserving the rest of the itinerary.
6. **MongoDB Persistence & Local JSON Fallback**:
   - Full persistence for trips, user collections, and saved itineraries.
   - Automatically falls back to local file storage (`backend/data/db.json`) if MongoDB is not running locally.

---

## 📋 Requirements

- **Python**: 3.11 or newer
- **Node.js**: 20.19+ or 22.12+
- **MongoDB**: MongoDB Community Server locally or MongoDB Atlas connection (optional; file store fallback is automatic)
- **API Keys** (optional for local fallback mode):
  - `MURF_API_KEY`: For Murf AI voice synthesis
  - `GEMINI_API_KEY` or `OPENAI_API_KEY`: For live LLM reasoning

---

## 🛠️ Setup and Installation

### 1. Backend Setup

Open a terminal at the repository root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Configure your environment variables in `backend/.env`:

```dotenv
APP_NAME=TravelAI API
ENVIRONMENT=development
PORT=8000
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=travelai_db

# AI Provider ("auto", "gemini", "openai", "mock")
AI_PROVIDER=auto
GEMINI_API_KEY=your_gemini_key_here
GEMINI_MODEL=gemini-1.5-flash
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4o-mini

# Murf AI Voice Synthesis
MURF_API_KEY=your_murf_key_here
MURF_VOICE_ID=Natalie
MURF_LOCALE=en-US
```

Start the backend server:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- **Interactive API Docs:** <http://127.0.0.1:8000/docs>
- **Health Check Endpoint:** <http://127.0.0.1:8000/api/health>

---

### 2. Frontend Setup

In a second terminal at the repository root:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will be live at <http://127.0.0.1:5173/>.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/travel/plan` | Generate a structured multi-day travel itinerary |
| `POST` | `/api/travel/voice` | Generate a plan from recognized voice instructions |
| `POST` | `/api/travel/speak` | Synthesize spoken narration using Murf AI |
| `POST` | `/api/travel/modify` | Apply conversational modifications to an existing trip |
| `POST` | `/api/travel/regenerate-day` | Regenerate activities for a single day |
| `POST` | `/api/travel/save` | Save an itinerary to MongoDB / persistent storage |
| `GET` | `/api/travel/saved` | List all saved user itineraries |
| `GET` | `/api/travel/{trip_id}` | Fetch full itinerary details by ID |
| `DELETE` | `/api/travel/{trip_id}` | Delete a saved trip |
| `GET` | `/api/health` | System and database connection health check |

---

## 🧪 Verification & Testing

### Backend Unit Tests

Run the test suite from the repository root:

```powershell
.\backend\venv\Scripts\python.exe -m unittest discover -s .\backend\tests -v
```

Tests cover:
- Request date order validation
- Voice prompt context injection
- Blank speech input rejection
- Murf API authorization header encapsulation and error isolation

### Frontend Lint & Build

```powershell
cd frontend
npm run lint
npm run build
```
