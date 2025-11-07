import requests
import csv
from datetime import datetime

class FireDangerDataCollector:
    """Collect fire danger factors for California counties"""
    
    def __init__(self):
        self.base_url = "https://api.weather.gov"
        self.headers = {
            'User-Agent': '(FireDangerApp, contact@example.com)',
            'Accept': 'application/json'
        }
    
    def get_county_coordinates(self):
        """Return coordinates for major California counties"""
        return {
            'Los Angeles': (34.0522, -118.2437),
            'San Diego': (32.7157, -117.1611),
            'Orange': (33.7175, -117.8311),
            'Riverside': (33.9533, -117.3962),
            'San Bernardino': (34.1083, -117.2898),
            'Alameda': (37.6017, -121.7195),
            'Sacramento': (38.5816, -121.4944),
            'Contra Costa': (37.9161, -121.9544),
            'Fresno': (36.7378, -119.7871),
            'Kern': (35.3733, -119.0187),
            'San Francisco': (37.7749, -122.4194),
            'Ventura': (34.3705, -119.1391),
            'San Mateo': (37.5630, -122.3255),
            'Santa Clara': (37.3541, -121.9552),
            'Sonoma': (38.2910, -122.4580),
            'Placer': (39.0916, -120.8039),
            'Monterey': (36.5946, -121.8946),
            'Santa Barbara': (34.4208, -119.6982),
            'San Joaquin': (37.9577, -121.2908),
            'Stanislaus': (37.5091, -120.9876)
        }
    
    def get_weather_data(self, lat, lon):
        """Get weather data from NWS for a location"""
        try:
            # Get grid point
            point_url = f"{self.base_url}/points/{lat},{lon}"
            point_response = requests.get(point_url, headers=self.headers, timeout=10)
            point_response.raise_for_status()
            point_data = point_response.json()
            
            # Get forecast
            forecast_url = point_data['properties']['forecast']
            forecast_response = requests.get(forecast_url, headers=self.headers, timeout=10)
            forecast_response.raise_for_status()
            forecast_data = forecast_response.json()
            
            # Get current period
            current = forecast_data['properties']['periods'][0]
            
            return {
                'temperature': current.get('temperature', 'N/A'),
                'wind_speed': current.get('windSpeed', 'N/A'),
                'wind_direction': current.get('windDirection', 'N/A'),
                'relative_humidity': current.get('relativeHumidity', {}).get('value', 'N/A'),
                'short_forecast': current.get('shortForecast', 'N/A')
            }
        except Exception as e:
            print(f"Error fetching weather for {lat},{lon}: {e}")
            return None
    
    def calculate_fire_danger_factors(self, weather_data, county):
        """Calculate fire danger indicators from weather data"""
        if not weather_data:
            return None
        
        factors = {
            'county': county,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'temperature_f': weather_data['temperature'],
            'wind_speed': weather_data['wind_speed'],
            'wind_direction': weather_data['wind_direction'],
            'relative_humidity': weather_data['relative_humidity'],
            'conditions': weather_data['short_forecast']
        }
        
        # Add risk indicators
        temp = weather_data['temperature']
        humidity = weather_data['relative_humidity']
        
        # High fire danger indicators
        factors['high_temp_risk'] = 'Yes' if isinstance(temp, int) and temp >= 85 else 'No'
        factors['low_humidity_risk'] = 'Yes' if isinstance(humidity, (int, float)) and humidity <= 30 else 'No'
        
        # Parse wind speed (e.g., "10 mph" or "5 to 10 mph")
        wind_str = str(weather_data['wind_speed'])
        try:
            wind_nums = [int(s) for s in wind_str.split() if s.isdigit()]
            max_wind = max(wind_nums) if wind_nums else 0
            factors['high_wind_risk'] = 'Yes' if max_wind >= 25 else 'No'
        except:
            factors['high_wind_risk'] = 'Unknown'
        
        # Overall risk assessment
        risk_count = sum([
            factors['high_temp_risk'] == 'Yes',
            factors['low_humidity_risk'] == 'Yes',
            factors['high_wind_risk'] == 'Yes'
        ])
        
        if risk_count >= 2:
            factors['fire_danger_level'] = 'High'
        elif risk_count == 1:
            factors['fire_danger_level'] = 'Moderate'
        else:
            factors['fire_danger_level'] = 'Low'
        
        return factors
    
    def collect_all_data(self):
        """Collect fire danger data for all counties"""
        counties = self.get_county_coordinates()
        all_data = []
        
        print(f"Collecting fire danger data for {len(counties)} California counties...")
        
        for county, (lat, lon) in counties.items():
            print(f"Processing {county} County...")
            weather = self.get_weather_data(lat, lon)
            factors = self.calculate_fire_danger_factors(weather, county)
            
            if factors:
                all_data.append(factors)
        
        return all_data
    
    def save_to_csv(self, data, filename='california_fire_danger_factors.csv'):
        """Save fire danger data to CSV"""
        if not data:
            print("No data to save.")
            return
        
        fieldnames = [
            'county', 'timestamp', 'temperature_f', 'wind_speed', 
            'wind_direction', 'relative_humidity', 'conditions',
            'high_temp_risk', 'low_humidity_risk', 'high_wind_risk',
            'fire_danger_level'
        ]
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        
        print(f"\n✓ Saved fire danger data for {len(data)} counties to {filename}")
        return filename


# Example usage
if __name__ == "__main__":
    collector = FireDangerDataCollector()
    
    # Collect data for all counties
    fire_data = collector.collect_all_data()
    
    # Save to CSV
    if fire_data:
        collector.save_to_csv(fire_data)
        
        # Print summary
        high_risk = sum(1 for d in fire_data if d['fire_danger_level'] == 'High')
        print(f"\nSummary: {high_risk} counties with HIGH fire danger")
    else:
        print("Failed to collect data")