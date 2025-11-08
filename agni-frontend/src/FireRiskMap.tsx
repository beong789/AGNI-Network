import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import MapLegend from './MapLegend';
import { MapPin, Flame } from 'lucide-react';
import { API_BASE_URL } from './services/api';
import type { FireData } from './types';

interface FireRiskMapProps {
  onCountyHover: (countyName: string | null) => void;
  fireData: FireData[]; 
}

const FireRiskMap: React.FC<FireRiskMapProps> = ({ onCountyHover, fireData }) => {
  const [geojson, setGeojson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, setUpdateCounter] = useState(0);

  useEffect(() => {
    // Only fetch geojson, not fire data
    fetch(`${API_BASE_URL}/api/geojson`)
      .then(res => res.json())
      .then(geoData => {
        setGeojson(geoData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load map data:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Update counter every minute to refresh timestamp display
    const interval = setInterval(() => {
      setUpdateCounter(c => c + 1); // Force re-render
    }, 60000); // 60 seconds
    
    return () => clearInterval(interval);
  }, []); // ← Empty dependency array!

  // Calculate total active fires
  const totalActiveFires = fireData.reduce((sum, d) => 
    sum + (d.active_fires_nearby || 0), 0
  );

  // Get counties with active fires
  const countiesWithFires = fireData.filter(d => 
    (d.active_fires_nearby || 0) > 0
  ).length;

  // Format last update time
  const getLastUpdateText = () => {
    if (fireData.length === 0) return 'Loading...';
    
    // Get timestamp from first county (they're all updated at the same time)
    const timestamp = fireData[0].timestamp;
    const lastUpdate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    // For older data, show the actual time
    return lastUpdate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Fire Risk Map</h2>
        <div className="flex items-center gap-4">
          {totalActiveFires > 0 && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              <Flame className="w-4 h-4" />
              <span>{totalActiveFires} Active Fires</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Last updated: {getLastUpdateText()}</span>
          </div>
        </div>
      </div>

      <div className="relative rounded-lg flex-1 min-h-[600px] bg-gray-50">       
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading map...</p>
            </div>
          </div>
        ) : geojson && fireData.length > 0 ? (
          <Plot
            data={[
              {
                type: 'choropleth',
                geojson: geojson,
                locations: fireData.map(d => d.county),
                z: fireData.map(d => d.risk_score || 0),
                zmin: 0,
                zmax: 10,
                featureidkey: 'properties.name',
                colorscale: [
                  [0, '#22c55e'],      // 0-1 Low = Green
                  [0.2, '#22c55e'],    
                  [0.2, '#a3e635'],    // 2-3 Moderate = Light green
                  [0.4, '#a3e635'],    
                  [0.4, '#fbbf24'],    // 4-5 Elevated = Yellow
                  [0.6, '#fbbf24'],    
                  [0.6, '#f97316'],    // 6-7 High = Orange
                  [0.8, '#f97316'],    
                  [0.8, '#ef4444'],    // 8-10 Very High = Red
                  [1, '#ef4444']
                ],
                colorbar: {
                  title: { text: 'Risk Level', font: { size: 14, color: '#374151' } },
                  tickvals: [1, 2.5, 4.5, 6.5, 9],
                  ticktext: ['Low', 'Moderate', 'Elevated', 'High', 'Very High'],
                  len: 0.7,
                  thickness: 15,
                  outlinewidth: 0
                },
                marker: {
                  line: {
                    color: 'white',
                    width: 0.5
                  }
                },
                customdata: fireData.map(d => ([
                  d.fire_danger_level,
                  Math.round(d.temperature_f),
                  d.relative_humidity,
                  d.drought_level || 'Unknown',
                  d.active_fires_nearby || 0
                ])),
                hovertemplate: 
                  '<b>%{location} County</b><br>' +
                  'Risk Score: %{z}/10<br>' +
                  'Level: %{customdata[0]}<br>' +
                  'Temp: %{customdata[1]}°F<br>' +
                  'Humidity: %{customdata[2]}%<br>' +
                  'Drought: %{customdata[3]}<br>' +
                  'Active Fires: %{customdata[4]}<br>' +
                  '<extra></extra>'
              }
            ]}
              layout={{
                geo: {
                  scope: 'usa',
                  projection: { 
                    type: 'albers usa',
                    scale: 1
                  },
                  showlakes: false,
                  showland: false,
                  showcoastlines: false,
                  showframe: false,
                  bgcolor: 'rgb(249, 250, 251)',
                  center: { lon: -119.4, lat: 37 },
                  lonaxis: { range: [-125, -114] },
                  lataxis: { range: [32, 42] },
                  fitbounds: false  
                },
                margin: { r: 0, t: 0, l: 0, b: 0 },
                autosize: true,
                dragmode: false,
                hovermode: 'closest',
                uirevision: 'constant',
                datarevision: 0, 
                hoverlabel: {
                  bgcolor: 'white',
                  bordercolor: '#e5e7eb',
                  font: { 
                    size: 13,
                    color: '#1f2937' 
                  }
                }
                }}
                style={{ width: '100%', height: '100%' }}
                config={{ 
                  responsive: false,
                  displayModeBar: false,
                  staticPlot: false,
                  scrollZoom: false,
                  doubleClick: false
                }}
                useResizeHandler={true}
                onHover={(data: any) => {
                  if (data.points && data.points.length > 0) {
                    const countyName = data.points[0].location;
                    onCountyHover(countyName as string);
                  }
                }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>

      <MapLegend />
      
      {countiesWithFires > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
          <p className="text-red-800">
            ⚠️ <span className="font-semibold">{countiesWithFires}</span> counties have active fire activity
          </p>
        </div>
      )}
    </div>
  );
};

export default FireRiskMap;