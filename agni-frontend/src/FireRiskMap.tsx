import { useState, useEffect } from 'react';
// @ts-ignore
import Plot from 'react-plotly.js';
import MapLegend from './MapLegend';
import { MapPin } from 'lucide-react';
import { API_BASE_URL } from './services/api';

interface FireRiskMapProps {
  onCountyHover: (countyName: string | null) => void;
}

const FireRiskMap: React.FC<FireRiskMapProps> = ({ onCountyHover }) => {
  const [geojson, setGeojson] = useState<any>(null);
  const [fireData, setFireData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/geojson`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/fire-data`).then(res => res.json())
    ])
      .then(([geoData, fireDataRes]) => {
        setGeojson(geoData);
        
        const levelMap: Record<string, number> = {
          'Low': 1,
          'Moderate': 1.6,    
          'High': 3,
          'Very High': 4,
          'Extreme': 5
        };
        
        const processedData = fireDataRes.map((item: any) => ({
          county: item.county,
          danger_value: levelMap[item.fire_danger_level] || 1,
        }));
        
        setFireData(processedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load map data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Fire Risk Map</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      <div className="relative rounded-lg flex-1 min-h-[500px] bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading map...</p>
            </div>
          </div>
        ) : geojson && fireData.length > 0 ? (
          <Plot
            // @ts-ignore
            data={[
              {
                type: 'choropleth',
                geojson: geojson,
                locations: fireData.map(d => d.county),
                z: fireData.map(d => d.danger_value),
                featureidkey: 'properties.name',
                colorscale: [
                  [0, 'rgb(34, 197, 94)'],      // Green
                  [0.4, 'rgb(34, 197, 94)'],    
                  [0.4, 'rgb(245, 158, 11)'],   // Orange
                  [0.6, 'rgb(245, 158, 11)'],   
                  [0.6, 'rgb(239, 68, 68)'],    // Red
                  [1, 'rgb(220, 38, 38)']       // Dark red
                ],
                colorbar: {
                  title: { text: 'Risk' },
                  tickvals: [1, 2, 3, 4, 5],
                  ticktext: ['Low', 'Moderate', 'High', 'Very High', 'Extreme'],
                  len: 0.6
                },
                marker: {
                  line: {
                    color: 'white',
                    width: 0.5
                  }
                },
                hovertemplate: '<b>%{location}</b><br>Risk Level: %{z}<extra></extra>'
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
                bgcolor: 'rgb(243, 243, 243)',
                center: { lon: -119.4, lat: 37 },
                lonaxis: { range: [-125, -114] },
                lataxis: { range: [32, 42] }
              },
              margin: { r: 0, t: 0, l: 0, b: 0 },
              autosize: true,
              dragmode: false
            }}
            style={{ width: '100%', height: '100%' }}
            config={{ 
              responsive: true, 
              displayModeBar: false,
              staticPlot: false,
              scrollZoom: false,
              doubleClick: false
            }}
            useResizeHandler={true}
            onHover={(data) => {
              if (data.points && data.points.length > 0) {
                const countyName = data.points[0].location;
                onCountyHover(countyName as string);
              }
            }}
            onUnhover={() => {
              onCountyHover(null);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>

      <MapLegend />
    </div>
  );
};

export default FireRiskMap;