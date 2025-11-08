// Types
export interface Region {
  id: number;
  name: string;
  riskLevel: string;
  color: string;
}

export interface WeatherCondition {
  label: string;
  value: string;
}

// NEW: Complete fire data interface
export interface FireData {
  county: string;
  timestamp: string;
  temperature_f: number;
  wind_speed: string;
  wind_direction: string;
  relative_humidity: number;
  conditions: string;
  fire_danger_level: string;
  // New fields from improved scraper
  drought_level?: string;
  active_fires_nearby?: number;
  statewide_active_fires?: number;
  risk_score?: number;
}