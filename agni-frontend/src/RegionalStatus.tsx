// Regional Status Component
import type { Region } from "./types";

interface RegionalStatusProps {
  regions: Region[];
  onRegionSelect: (region: Region) => void;
}

const RegionalStatus: React.FC<RegionalStatusProps> = ({ regions, onRegionSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Regional Status</h3>
      <div className="space-y-3">
        {regions.map((region) => (
          <div 
            key={region.id}
            className="p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition"
            style={{ borderColor: region.color }}
            onClick={() => onRegionSelect(region)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: region.color }}
                ></div>
                <span className="font-medium text-sm">{region.name}</span>
              </div>
              <span className="text-xs uppercase font-semibold" style={{ color: region.color }}>
                {region.riskLevel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default RegionalStatus