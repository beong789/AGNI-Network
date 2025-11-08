import { useState, useEffect } from 'react';
import Header from './Header';
import FireRiskMap from './FireRiskMap';
import CurrentConditions from './CurrentConditions';
import RegionalStatus from "./RegionalStatus"
import InfoCard from './InfoCard';
import ChatAssistant from './ChatAssistant';
import Footer from './Footer';

function App() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/fire-data")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((item: any, index: number) => ({
          id: index,
          name: item.county,
          riskLevel: item.fire_danger_level,  // adjust if your CSV uses different field names
          color: item.color || "#f59e0b"      // placeholder or logic for color mapping
        }));
        setRegions(formatted);
      })
      .catch(err => console.error("Failed to fetch regions:", err));
  }, []);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    console.log("Selected region:", region);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FireRiskMap />
          </div>

          <div className="space-y-6">
            <CurrentConditions />
            <RegionalStatus regions={regions} onRegionSelect={handleRegionSelect} />
            <InfoCard />
          </div>
        </div>
      </main>

      <Footer />
      <ChatAssistant />
    </div>
  );
}

export default App;
