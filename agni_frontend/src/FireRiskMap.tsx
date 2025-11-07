// Fire Risk Map Component
import MapLegend from './MapLegend'
import { MapPin } from 'lucide-react';


const FireRiskMap: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Fire Risk Map</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>
      
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-[500px] flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <svg className="w-64 h-64 mx-auto text-gray-300" viewBox="0 0 200 300" fill="currentColor">
            <path d="M150,20 L160,40 L170,80 L175,120 L180,160 L180,200 L175,240 L165,270 L150,290 L130,295 L110,290 L90,280 L75,260 L65,230 L60,200 L55,170 L50,140 L45,110 L50,80 L60,50 L75,30 L95,20 L120,15 Z" 
                  opacity="0.3" />
          </svg>
          <p className="text-gray-500 mt-4 text-lg font-semibold">Map will load here</p>
          <p className="text-gray-400 text-sm">Integrate with Mapbox or Leaflet</p>
        </div>
      </div>

      <MapLegend />
    </div>
  );
};

export default FireRiskMap