// Info Card Component
import { Info } from 'lucide-react';


const InfoCard: React.FC = () => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">How it works</h4>
          <p className="text-sm text-blue-800">
            Our model analyzes temperature, humidity, wind speed, and fuel moisture to predict fire risk in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard