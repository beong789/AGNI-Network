import type { FireDangerData } from "./services/api";

interface CurrentConditionsProps {
  countyData: FireDangerData | null;
}

const CurrentConditions: React.FC<CurrentConditionsProps> = ({ countyData }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {countyData ? `${countyData.county} County` : 'Current Conditions'}
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Temperature</span>
          <span className="font-semibold text-lg">
            {countyData ? `${countyData.temperature_f}°F` : '--'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Humidity</span>
          <span className="font-semibold text-lg">
            {countyData ? `${countyData.relative_humidity}%` : '--'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Wind Speed</span>
          <span className="font-semibold text-lg">
            {countyData ? countyData.wind_speed : '--'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Conditions</span>
          <span className="font-semibold text-sm text-right">
            {countyData ? countyData.conditions : '--'}
          </span>
        </div>
        {countyData && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fire Danger</span>
              <span className={`font-bold text-lg ${
                countyData.fire_danger_level === 'High' ? 'text-red-600' :
                countyData.fire_danger_level === 'Moderate' ? 'text-orange-600' :
                'text-green-600'
              }`}>
                {countyData.fire_danger_level}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentConditions;