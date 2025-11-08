import { Info, Droplets, Wind, Thermometer, Flame } from 'lucide-react';

const InfoCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-2">How it works</h4>
          <p className="text-sm text-blue-800 mb-3">
            Our model analyzes multiple data sources to predict fire risk in real-time:
          </p>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              <span>Temperature & humidity from NWS</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              <span>Wind speed & direction</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              <span>Drought conditions</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span>Active fire detection (NASA FIRMS)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;