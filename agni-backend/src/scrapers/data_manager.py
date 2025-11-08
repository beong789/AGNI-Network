import aiohttp
import asyncio
import csv
import pandas as pd
from datetime import datetime, timedelta
import time
import os
from tqdm.asyncio import tqdm
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).parent.parent.parent / '.env')
import json

class ImprovedFireDataCollector:
    """Fast multi-source fire danger data collector"""
    
    def __init__(self):
        self.nws_base_url = "https://api.weather.gov"
        self.firms_url = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
        self.drought_url = "https://droughtmonitor.unl.edu/DmData/DataDownload/ComprehensiveStatistics.aspx"
        self.nasa_api_key = os.getenv('NASA_FIRMS_API_KEY')
        if not self.nasa_api_key:
            print("⚠️  Warning: NASA_FIRMS_API_KEY not found in .env file")
        self.headers = {
            'User-Agent': '(FireDangerApp, contact@example.com)',
            'Accept': 'application/json'
        }
        
        # Cache directory
        self.cache_dir = os.path.join(os.path.dirname(__file__), 'cache')
        os.makedirs(self.cache_dir, exist_ok=True)
    
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
    
    async def fetch_with_retry(self, session, url, max_retries=3):
        """Fetch URL with automatic retries"""
        for attempt in range(max_retries):
            try:
                async with session.get(url, timeout=10) as response:
                    if response.status == 200:
                        return await response.json()
                    elif response.status == 429:
                        # Rate limited - wait and retry
                        await asyncio.sleep(2 ** attempt)
                        continue
            except asyncio.TimeoutError:
                if attempt == max_retries - 1:
                    return None
                await asyncio.sleep(1)
            except Exception as e:
                print(f"Error fetching {url}: {e}")
                return None
        return None
    
    async def get_nws_weather(self, session, county, lat, lon):
        """Async NWS weather data fetch with humidity"""
        try:
            # Check cache first
            cached = self.get_cache(f"nws_{county}")
            if cached:
                return cached
            
            # Get grid point
            point_url = f"{self.nws_base_url}/points/{lat},{lon}"
            point_data = await self.fetch_with_retry(session, point_url)
            
            if not point_data:
                return None
            
            # Get forecast for basic info
            forecast_url = point_data['properties']['forecast']
            forecast_data = await self.fetch_with_retry(session, forecast_url)
            
            if not forecast_data:
                return None
            
            current = forecast_data['properties']['periods'][0]
            
            # Get grid data for humidity
            try:
                gridpoint_url = point_data['properties']['forecastGridData']
                grid_data = await self.fetch_with_retry(session, gridpoint_url)
                
                # Extract latest humidity value
                if grid_data and 'properties' in grid_data and 'relativeHumidity' in grid_data['properties']:
                    humidity_data = grid_data['properties']['relativeHumidity']['values']
                    if humidity_data and len(humidity_data) > 0:
                        humidity = humidity_data[0]['value']
                    else:
                        humidity = 'N/A'
                else:
                    humidity = 'N/A'
            except:
                humidity = 'N/A'
            
            result = {
                'temperature': current.get('temperature', 'N/A'),
                'wind_speed': current.get('windSpeed', 'N/A'),
                'wind_direction': current.get('windDirection', 'N/A'),
                'relative_humidity': humidity,
                'short_forecast': current.get('shortForecast', 'N/A')
            }
            
            # Cache it
            self.set_cache(f"nws_{county}", result, duration_minutes=60)
            return result
            
        except Exception as e:
            print(f"  ⚠ NWS error for {county}: {e}")
            return None
    
    async def get_nasa_firms_data(self, session, lat, lon, radius_km=50):
        """Get NASA FIRMS active fire data (requires API key)"""
        try:
            # Check cache
            cache_key = f"firms_{lat}_{lon}"
            cached = self.get_cache(cache_key)
            if cached:
                return cached
            
            # Note: You need to get a free API key from https://firms.modaps.eosdis.nasa.gov/api/
            # For demo, returning mock data structure
            result = {
                'active_fires_nearby': 0,
                'has_recent_fire_activity': False
            }
            
            self.set_cache(cache_key, result, duration_minutes=120)
            return result
            
        except Exception as e:
            print(f"  ⚠ FIRMS error: {e}")
            return {'active_fires_nearby': 0, 'has_recent_fire_activity': False}
    
    async def get_drought_data(self, session, county):
        """Get drought monitor data for county"""
        try:
            cache_key = f"drought_{county}"
            cached = self.get_cache(cache_key)
            if cached:
                return cached
            
            # The drought monitor data would be fetched here
            # For now, returning structure
            result = {
                'drought_level': 'None',
                'drought_severity_score': 0
            }
            
            self.set_cache(cache_key, result, duration_minutes=1440)  # Cache for 24 hours
            return result
            
        except Exception as e:
            return {'drought_level': 'Unknown', 'drought_severity_score': 0}
    
    async def get_calfire_incidents(self, session):
        """Get recent CAL FIRE incidents (statewide, not per county)"""
        try:
            cache_key = "calfire_incidents"
            cached = self.get_cache(cache_key)
            if cached:
                return cached
            
            # CAL FIRE has incident feeds
            # This would fetch their incident data
            result = {
                'total_active_incidents': 0,
                'acres_burned_today': 0
            }
            
            self.set_cache(cache_key, result, duration_minutes=30)
            return result
            
        except Exception as e:
            return {'total_active_incidents': 0, 'acres_burned_today': 0}
    
    def get_cache(self, key):
        """Check if we have valid cached data"""
        cache_file = os.path.join(self.cache_dir, f"{key}.json")
        
        if os.path.exists(cache_file):
            # Check if cache is still valid (within 1 hour)
            file_time = datetime.fromtimestamp(os.path.getmtime(cache_file))
            if datetime.now() - file_time < timedelta(hours=1):
                with open(cache_file, 'r') as f:
                    return json.load(f)
        return None
    
    def set_cache(self, key, data, duration_minutes=60):
        """Cache data"""
        cache_file = os.path.join(self.cache_dir, f"{key}.json")
        with open(cache_file, 'w') as f:
            json.dump(data, f)
    
    def calculate_comprehensive_risk(self, county, weather, drought, firms, calfire):
        """Calculate fire danger from all data sources with better estimation"""
        if not weather:
            return None
        
        factors = {
            'county': county,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'temperature_f': weather['temperature'],
            'wind_speed': weather['wind_speed'],
            'wind_direction': weather['wind_direction'],
            'relative_humidity': weather['relative_humidity'],
            'conditions': weather['short_forecast'],
            'drought_level': drought.get('drought_level', 'Unknown'),
            'active_fires_nearby': firms.get('active_fires_nearby', 0),
            'statewide_active_fires': calfire.get('total_active_incidents', 0)
        }
        
        # Calculate risk factors with better thresholds and estimation
        risk_score = 0
        temp = weather['temperature']
        humidity = weather['relative_humidity']
        conditions = weather.get('short_forecast', '').lower()
        
        # Temperature risk (adjusted for realistic CA temps)
        if isinstance(temp, (int, float)):
            if temp >= 90:
                risk_score += 3
            elif temp >= 75:
                risk_score += 2
            elif temp >= 60:
                risk_score += 1
            # Cold temps can still be risky if vegetation is dry
        
        # Humidity risk - estimate if missing
        estimated_humidity = None
        if isinstance(humidity, (int, float)):
            estimated_humidity = humidity
        else:
            # Estimate humidity from conditions if N/A
            if any(word in conditions for word in ['clear', 'sunny']):
                estimated_humidity = 35  # Assume drier
            elif any(word in conditions for word in ['fog', 'cloudy']):
                estimated_humidity = 65  # Assume more humid
            else:
                estimated_humidity = 50  # Neutral estimate
        
        if estimated_humidity:
            if estimated_humidity <= 20:
                risk_score += 3
            elif estimated_humidity <= 35:
                risk_score += 2
            elif estimated_humidity <= 50:
                risk_score += 1
        
        # Wind risk (more realistic thresholds)
        wind_str = str(weather['wind_speed'])
        try:
            wind_nums = [int(s) for s in wind_str.split() if s.isdigit()]
            max_wind = max(wind_nums) if wind_nums else 0
            if max_wind >= 30:
                risk_score += 3
            elif max_wind >= 20:
                risk_score += 2
            elif max_wind >= 10:
                risk_score += 1
        except:
            pass
        
        # Seasonal adjustment (November-May is fire season in CA)
        month = datetime.now().month
        if month in [6, 7, 8, 9, 10, 11]:  # Peak fire season
            risk_score += 1
        
        # Red Flag conditions (hot, dry, windy combo)
        if (isinstance(temp, (int, float)) and temp >= 70 and 
            estimated_humidity and estimated_humidity <= 30 and 
            max_wind >= 15):
            risk_score += 2  # Bonus for dangerous combo
        
        # Drought impact
        if drought.get('drought_level') in ['Extreme', 'Exceptional']:
            risk_score += 2
        elif drought.get('drought_level') in ['Severe', 'Moderate']:
            risk_score += 1
        
        # Nearby fires
        if firms.get('active_fires_nearby', 0) > 0:
            risk_score += 2
        
        # Cap at 10
        risk_score = min(risk_score, 10)
        
        # Determine risk level
        if risk_score >= 8:
            factors['fire_danger_level'] = 'Very High'
        elif risk_score >= 6:
            factors['fire_danger_level'] = 'High'
        elif risk_score >= 4:
            factors['fire_danger_level'] = 'Elevated'
        elif risk_score >= 2:
            factors['fire_danger_level'] = 'Moderate'
        else:
            factors['fire_danger_level'] = 'Low'
        
        factors['risk_score'] = risk_score
        
        return factors
    
    async def collect_county_data(self, session, county, lat, lon, calfire_data):
        """Collect all data for one county (ASYNC!)"""
        # Fetch all sources in PARALLEL
        weather_task = self.get_nws_weather(session, county, lat, lon)
        drought_task = self.get_drought_data(session, county)
        firms_task = self.get_nasa_firms_data(session, lat, lon)
        
        # Wait for all to complete
        weather, drought, firms = await asyncio.gather(
            weather_task,
            drought_task,
            firms_task,
            return_exceptions=True
        )
        
        # Calculate comprehensive risk
        return self.calculate_comprehensive_risk(
            county, weather, drought, firms, calfire_data
        )
    
    async def collect_all_data_async(self):
        """Main async collection - FAST!"""
        counties = self.get_county_coordinates()
        
        async with aiohttp.ClientSession(headers=self.headers) as session:
            # Get CAL FIRE data once (statewide)
            calfire_data = await self.get_calfire_incidents(session)
            
            # Create tasks for ALL counties at once
            tasks = [
                self.collect_county_data(session, county, lat, lon, calfire_data)
                for county, (lat, lon) in counties.items()
            ]
            
            # Process all counties in parallel with progress bar
            results = []
            for coro in tqdm.as_completed(tasks, total=len(tasks), desc="Collecting data"):
                result = await coro
                if result:
                    results.append(result)
            
            return results
    
    def save_to_csv(self, data, filename='california_fire_danger_factors.csv'):
        """Save to CSV"""
        if not data:
            print("No data to save.")
            return
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(script_dir, filename)
        
        # Use pandas for easier CSV handling
        df = pd.DataFrame(data)
        df.to_csv(filepath, index=False)
        
        print(f"\n✓ Saved comprehensive fire danger data for {len(data)} counties to {filepath}")
        return filepath


# Main execution
async def main():
    print("🔥 Starting Improved Fire Data Collection...\n")
    start_time = time.time()
    
    collector = ImprovedFireDataCollector()
    
    # Collect data (ASYNC - much faster!)
    fire_data = await collector.collect_all_data_async()
    
    # Save to CSV
    if fire_data:
        collector.save_to_csv(fire_data)
        
        # Print summary
        risk_levels = {}
        for d in fire_data:
            level = d.get('fire_danger_level', 'Unknown')
            risk_levels[level] = risk_levels.get(level, 0) + 1
        
        print(f"\n=== Fire Danger Summary ===")
        for level, count in sorted(risk_levels.items()):
            print(f"{level}: {count} counties")
        
        elapsed = time.time() - start_time
        print(f"\n⚡ Completed in {elapsed:.2f} seconds!")
    else:
        print("Failed to collect data")


if __name__ == "__main__":
    asyncio.run(main())