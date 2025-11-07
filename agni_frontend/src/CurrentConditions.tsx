// Current Conditions Component
import type { WeatherCondition } from "./types";

const CurrentConditions: React.FC = () => {
  const conditions: WeatherCondition[] = [
    { label: 'Temperature', value: '85°F' },
    { label: 'Humidity', value: '25%' },
    { label: 'Wind Speed', value: '15 mph' },
    { label: 'Fuel Moisture', value: '8%' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Current Conditions</h3>
      <div className="space-y-4">
        {conditions.map((condition) => (
          <div key={condition.label} className="flex justify-between items-center">
            <span className="text-gray-600">{condition.label}</span>
            <span className="font-semibold text-lg">{condition.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentConditions