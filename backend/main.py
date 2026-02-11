from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from ai_models.inference import detect_trash_in_image, analyze_truck_load
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

@app.get("/api/stats")
def get_stats():
    """
    Returns simple statistics for the dashboard.
    """
    # Load the data
    with open(INCIDENTS_FILE, "r") as f:
        data = json.load(f)
        
    # Calculate stats
    total = len(data)
    pending = sum(1 for i in data if i.get('status') == 'Pending' or i.get('status') == 'Open')
    resolved = total - pending
    
    return {
        "total_incidents": total,
        "pending_cases": pending,
        "resolved_cases": resolved
    }

@app.get("/api/users")
def get_users():
    """Returns list of registered contractors for Preventive Mode"""
    path = os.path.join("data", "mock_users.json")
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return json.load(f)

@app.get("/api/teams")
def get_teams():
    """Returns list of cleaning crews."""
    path = os.path.join("data", "mock_teams.json")
    if not os.path.exists(path): return []
    with open(path, "r") as f: return json.load(f)

@app.post("/api/assign")
def assign_task(incident_id: int, team_id: str):
    """
    Mock endpoint to assign a team to an incident.
    In a real app, this would send an SMS/Telegram to the driver.
    """
    return {"status": "success", "message": f"Team {team_id} dispatched to Incident #{incident_id}"}

@app.post("/api/analyze-truck")
async def api_analyze_truck(file: UploadFile = File(...)):
    """Receives a truck image and returns volume estimates + base64 processed image."""
    image_bytes = await file.read()
    
    # Run the computer vision function
    stats, processed_image_bytes = analyze_truck_load(image_bytes)
    
    import base64
    base64_encoded_img = base64.b64encode(processed_image_bytes).decode("utf-8")
    
    return {
        "stats": stats,
        "processed_image_base64": f"data:image/jpeg;base64,{base64_encoded_img}"
    }

# Run with: uvicorn main:app --reload