from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AGNI Backend API"}

@app.get("/api/fire-data")
def get_fire_data():
    """Get current fire danger data for all counties"""
    csv_path = Path(__file__).parent / "scrapers" / "california_fire_danger_factors.csv"
    df = pd.read_csv(csv_path)
    return df.to_dict(orient="records")

@app.get("/api/fire-data/{county}")
def get_county_data(county: str):
    """Get fire danger data for a specific county"""
    csv_path = Path(__file__).parent / "scrapers" / "california_fire_danger_factors.csv"
    df = pd.read_csv(csv_path)
    county_data = df[df['county'] == county]
    if county_data.empty:
        return {"error": "County not found"}
    return county_data.to_dict(orient="records")[0]

@app.post("/api/refresh-data")
async def refresh_fire_data():
    """Trigger data collection from NWS API"""
    from scrapers.data_manager import FireDangerDataCollector
    
    collector = FireDangerDataCollector()
    fire_data = collector.collect_all_data()
    
    if fire_data:
        collector.save_to_csv(fire_data)
        return {"status": "success", "counties": len(fire_data)}
    return {"status": "error", "message": "Failed to collect data"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)