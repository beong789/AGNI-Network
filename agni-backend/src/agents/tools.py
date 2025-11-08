import pandas as pd
import json
from langchain_core.tools import tool
from pathlib import Path

@tool
def fire_danger(county: str = "") -> str:
    """Get fire danger data for California counties. 
    
    Args:
        county: Optional county name to get specific data. If not provided, returns all counties.
        
    Returns:
        JSON string with fire danger information including temperature, wind, humidity, and risk levels.
    """
    # Get path to CSV
    csv_path = Path(__file__).parent.parent / "scrapers" / "california_fire_danger_factors.csv"
    
    print(f"[DEBUG] Looking for CSV at: {csv_path}")
    print(f"[DEBUG] File exists: {csv_path.exists()}")
    print(f"[DEBUG] Requested county: '{county}'")
    
    try:
        df = pd.read_csv(csv_path)
        print(f"[DEBUG] Successfully loaded CSV with {len(df)} rows")
        print(f"[DEBUG] Available counties: {df['county'].tolist()[:5]}...")
        
        if county and county.strip():
            # Filter for specific county
            county_data = df[df['county'].str.lower() == county.lower().strip()]
            if county_data.empty:
                available = df['county'].unique().tolist()
                return json.dumps({
                    "error": f"County '{county}' not found",
                    "available_counties": available[:10]
                })
            data_json = county_data.to_dict(orient="records")
        else:
            # Return all counties
            data_json = df.to_dict(orient="records")
        
        return json.dumps(data_json, indent=2)
    except FileNotFoundError as e:
        return json.dumps({
            "error": "Fire danger data file not found",
            "path": str(csv_path),
            "details": str(e)
        })
    except Exception as e:
        return json.dumps({
            "error": f"Error reading fire data: {str(e)}",
            "type": type(e).__name__
        })