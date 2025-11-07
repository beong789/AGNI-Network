// Map Legend Component
const MapLegend: React.FC = () => {
  const legendItems = [
    { color: '#22c55e', label: 'Low' },
    { color: '#f59e0b', label: 'Moderate' },
    { color: '#ef4444', label: 'High' },
    { color: '#dc2626', label: 'Very High' },
  ];

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-700 mb-3">Risk Level Legend</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend