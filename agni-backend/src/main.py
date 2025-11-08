from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path
from api.routes import router as chat_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Your browser accessing frontend
        "http://127.0.0.1:5173",      # Alternative localhost
        "http://frontend:5173",       # Docker internal (if needed)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "AGNI Backend API"}

@app.get("/api/fire-data")
def get_fire_data():
    """Get current fire danger data for all counties"""
    csv_path = Path(__file__).parent / "scrapers" / "california_fire_danger_factors.csv"
    df = pd.read_csv(csv_path, keep_default_na=False, na_values=[])
    records = df.replace([np.nan, np.inf, -np.inf], None).to_dict(orient="records")
    return JSONResponse(content=jsonable_encoder(records))

@app.get("/api/fire-data/{county}")
def get_county_data(county: str):
    """Get fire danger data for a specific county"""
    csv_path = Path(__file__).parent / "scrapers" / "california_fire_danger_factors.csv"
    df = pd.read_csv(csv_path, keep_default_na=False, na_values=[])
    county_data = df[df['county'].str.lower() == county.lower()]
    if county_data.empty:
        raise HTTPException(status_code=404, detail="County not found")
    record = county_data.replace([np.nan, np.inf, -np.inf], None).to_dict(orient="records")[0]
    return JSONResponse(content=jsonable_encoder(record))

@app.get("/api/geojson")
async def get_geojson():
    """Serve California counties GeoJSON"""
    from urllib.request import urlopen
    import json
    
    with urlopen('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/california-counties.geojson') as response:
        counties = json.load(response)
    return counties

@app.post("/api/refresh-data")
async def refresh_fire_data():
    """Trigger comprehensive data collection"""
    from scrapers.data_manager import ImprovedFireDataCollector
    
    collector = ImprovedFireDataCollector()
    fire_data = await collector.collect_all_data_async() 
    
    if fire_data:
        collector.save_to_csv(fire_data, 'california_fire_danger_factors.csv')
        return {"status": "success", "counties": len(fire_data)}
    return {"status": "error", "message": "Failed to collect data"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)