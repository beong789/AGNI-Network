export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface FireDangerData {
  county: string;
  timestamp: string;
  temperature_f: number;
  wind_speed: string;
  wind_direction: string;
  relative_humidity: number;  // Changed from string to number
  conditions: string;
  high_temp_risk: string;
  low_humidity_risk: string;
  high_wind_risk: string;
  fire_danger_level: string;
  // Add the optional fields from FireData to match
  drought_level?: string;
  active_fires_nearby?: number;
  statewide_active_fires?: number;
  risk_score?: number;
}

export const api = {
  async getAllFireData(): Promise<FireDangerData[]> {
    const response = await fetch(`${API_BASE_URL}/api/fire-data`);
    if (!response.ok) throw new Error('Failed to fetch fire data');
    return response.json();
  },

  async getCountyData(county: string): Promise<FireDangerData> {
    const response = await fetch(`${API_BASE_URL}/api/fire-data/${county}`);
    if (!response.ok) throw new Error('Failed to fetch county data');
    return response.json();
  },

  async refreshData(): Promise<{ status: string; counties?: number }> {
    const response = await fetch(`${API_BASE_URL}/api/refresh-data`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to refresh data');
    return response.json();
  },
};