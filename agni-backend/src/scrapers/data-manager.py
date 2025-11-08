import requests
import csv
from datetime import datetime
import time
import os

class FireDangerDataCollector:
    """Collect fire danger factors for California counties"""
    
    def __init__(self):
        self.base_url = "https://api.weather.gov"
        self.headers = {
            'User-Agent': '(FireDangerApp, contact@example.com)',
            'Accept': 'application/json'
        }
    
    def get_county_coordinates(self):
        """Return coordinates for all 58 California counties"""
        return {
            # Southern California
            'Los Angeles': (34.0522, -118.2437),
            'San Diego': (32.7157, -117.1611),
            'Orange': (33.7175, -117.8311),
            'Riverside': (33.9533, -117.3962),
            'San Bernardino': (34.1083, -117.2898),
            'Ventura': (34.3705, -119.1391),
            'Santa Barbara': (34.4208, -119.6982),
            'Imperial': (32.8474, -115.5694),
            'San Luis Obispo': (35.2828, -120.6596),
            
            # Central Valley
            'Fresno': (36.7378, -119.7871),
            'Kern': (35.3733, -119.0187),
            'Kings': (36.0853, -119.8197),
            'Tulare': (36.2078, -118.8398),
            'Madera': (37.0549, -119.7703),
            'Merced': (37.3022, -120.4830),
            'Stanislaus': (37.5091, -120.9876),
            'San Joaquin': (37.9577, -121.2908),
            
            # Bay Area
            'San Francisco': (37.7749, -122.4194),
            'Alameda': (37.6017, -121.7195),
            'Contra Costa': (37.9161, -121.9544),
            'San Mateo': (37.5630, -122.3255),
            'Santa Clara': (37.3541, -121.9552),
            'Marin': (38.0834, -122.7633),
            'Sonoma': (38.2910, -122.4580),
            'Napa': (38.5025, -122.2654),
            'Solano': (38.2494, -121.9018),
            
            # Sacramento Region
            'Sacramento': (38.5816, -121.4944),
            'Placer': (39.0916, -120.8039),
            'El Dorado': (38.7296, -120.5357),
            'Yolo': (38.6846, -121.9018),
            'Sutter': (39.0270, -121.6922),
            'Yuba': (39.2696, -121.2617),
            
            # North State
            'Shasta': (40.5865, -122.3917),
            'Tehama': (40.1278, -122.3044),
            'Butte': (39.6519, -121.5991),
            'Glenn': (39.5985, -122.3916),
            'Colusa': (39.1796, -122.2411),
            'Siskiyou': (41.5982, -122.4719),
            'Modoc': (41.4452, -120.7397),
            'Lassen': (40.6613, -120.5572),
            'Plumas': (40.0049, -120.8326),
            'Trinity': (40.6666, -123.1108),
            'Humboldt': (40.7450, -123.8695),
            'Del Norte': (41.7437, -124.1120),
            'Mendocino': (39.4318, -123.3514),
            'Lake': (39.0935, -122.7594),
            
            # Sierra Nevada
            'Nevada': (39.2969, -120.7989),
            'Sierra': (39.5771, -120.5244),
            'Alpine': (38.5985, -119.8183),
            'Amador': (38.3496, -120.6538),
            'Calaveras': (38.1908, -120.5383),
            'Tuolumne': (37.9833, -119.9489),
            'Mariposa': (37.4849, -119.9663),
            'Mono': (37.9468, -118.9595),
            'Inyo': (36.5885, -117.4796),
            
            # Central Coast
            'Monterey': (36.5946, -121.8946),
            'San Benito': (36.5761, -121.0724),
            'Santa Cruz': (37.0510, -121.9952),
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
            print(f"  ⚠ Error fetching weather for {lat},{lon}: {e}")
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
        print("This may take a few minutes...\n")
        
        for i, (county, (lat, lon)) in enumerate(counties.items(), 1):
            print(f"[{i}/{len(counties)}] Processing {county} County...")
            weather = self.get_weather_data(lat, lon)
            factors = self.calculate_fire_danger_factors(weather, county)
            
            if factors:
                all_data.append(factors)
            
            # Be respectful to the API - small delay between requests
            if i < len(counties):
                time.sleep(0.5)
        
        return all_data
    
    def save_to_csv(self, data, filename='california_fire_danger_factors.csv'):
        """Save fire danger data to CSV in the same directory as the script"""
        if not data:
            print("No data to save.")
            return

        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(script_dir, filename)

        fieldnames = [
            'county', 'timestamp', 'temperature_f', 'wind_speed', 
            'wind_direction', 'relative_humidity', 'conditions',
            'high_temp_risk', 'low_humidity_risk', 'high_wind_risk',
            'fire_danger_level'
        ]
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        
        print(f"\n✓ Saved fire danger data for {len(data)} counties to {filepath}")
        return filepath


# Example usage
if __name__ == "__main__":
    collector = FireDangerDataCollector()
    
    # Collect data for all 58 California counties
    fire_data = collector.collect_all_data()
    
    # Save to CSV
    if fire_data:
        collector.save_to_csv(fire_data)
        
        # Print summary
        high_risk = sum(1 for d in fire_data if d['fire_danger_level'] == 'High')
        moderate_risk = sum(1 for d in fire_data if d['fire_danger_level'] == 'Moderate')
        low_risk = sum(1 for d in fire_data if d['fire_danger_level'] == 'Low')
        
        print(f"\n=== Fire Danger Summary ===")
        print(f"HIGH risk:     {high_risk} counties")
        print(f"MODERATE risk: {moderate_risk} counties")
        print(f"LOW risk:      {low_risk} counties")
    else:
        print("Failed to collect data")