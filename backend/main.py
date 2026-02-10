from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# --- 1. CONFIGURATION ---
# Allow the Frontend (React) to talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace * with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to data
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
INCIDENTS_FILE = os.path.join(DATA_DIR, "mock_incidents.json")

# --- 2. ROUTES (The Endpoints) ---

@app.get("/")
def read_root():
    """Health check to see if server is running."""
    return {"status": "System Operational", "module": "Smart City Monitor"}

@app.get("/api/incidents")
def get_incidents():
    """
    Returns the list of illegal dumping incidents.
    Used by the Map and Dashboard.
    """
    with open(INCIDENTS_FILE, "r") as f:
        data = json.load(f)
    return data

@app.post("/api/detect")
async def detect_trash(file: UploadFile = File(...)):
    """
    This is where the AI will eventually live.
    For now, it returns a mock response so frontend can test the 'Upload' button.
    """
    # TODO: Load YOLO model and run inference here
    return {
        "filename": file.filename,
        "detection": "Construction Debris",
        "confidence": 0.95,
        "message": "This is a mock AI response."
    }

# Run with: uvicorn main:app --reload