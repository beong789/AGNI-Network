import pandas as pd
import json
from langchain_core.tools import tool

@tool
def fire_danger(county: str = None) -> str:
    """Get fire danger data for California counties. 
    
    Args:
        county: Optional county name to get specific data. If not provided, returns all counties.
        
    Returns:
        JSON string with fire danger information including temperature, wind, humidity, and risk levels.
    """
    # Adjust path based on where tools.py is located relative to the CSV
    csv_path = "california_fire_danger_factors.csv"
    
    try:
        df = pd.read_csv(csv_path)
        
        if county:
            # Filter for specific county
            county_data = df[df['county'].str.lower() == county.lower()]
            if county_data.empty:
                return json.dumps({"error": f"County '{county}' not found"})
            data_json = county_data.to_dict(orient="records")
        else:
            # Return all counties
            data_json = df.to_dict(orient="records")
        
        return json.dumps(data_json, indent=2)
    except FileNotFoundError:
        return json.dumps({"error": "Fire danger data file not found"})
    except Exception as e:
        return json.dumps({"error": f"Error reading fire data: {str(e)}"})


# Keep the old class for backward compatibility if needed
class FireDangerTool:
    name = "fire_danger"
    description = "Get fire danger data for California counties"

    def __init__(self, csv_path: str):
        self.csv_path = csv_path
    
    def invoke(self, args=None):
        try:
            df = pd.read_csv(self.csv_path)
            data_json = df.to_dict(orient="records")
            return json.dumps(data_json, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})