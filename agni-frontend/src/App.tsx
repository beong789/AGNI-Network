import { useState, useEffect } from 'react';
import Header from './Header';
import FireRiskMap from './FireRiskMap';
import CurrentConditions from './CurrentConditions';
import RegionalStatus from "./RegionalStatus"
import InfoCard from './InfoCard';
import ChatAssistant from './ChatAssistant';
import Footer from './Footer';
import { api } from './services/api';
import type { FireDangerData } from './services/api'

function App() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCountyData, setSelectedCountyData] = useState<FireDangerData | null>(null);
  const [allFireData, setAllFireData] = useState<FireDangerData[]>([]);

  useEffect(() => {
    api.getAllFireData()
      .then(data => {
        setAllFireData(data);
        
        const toColor = (level: string) =>
          level === 'High' ? '#ef4444' :
          level === 'Moderate' ? '#f59e0b' :
          '#22c55e';
        
        const formatted = data.map((item, index) => ({
          id: index,
          name: item.county,
          riskLevel: item.fire_danger_level,
          color: toColor(item.fire_danger_level),
        }));
        setRegions(formatted);
      })
      .catch(err => console.error("Failed to fetch regions:", err));
  }, []);

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    const countyData = allFireData.find(d => d.county === region.name);
    if (countyData) {
      setSelectedCountyData(countyData);
    }
  };

  const handleCountyHover = (countyName: string | null) => {
    if (countyName) {
      const countyData = allFireData.find(d => d.county === countyName);
      if (countyData) {
        setSelectedCountyData(countyData);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FireRiskMap onCountyHover={handleCountyHover} />
          </div>

          <div className="space-y-6">
            <CurrentConditions countyData={selectedCountyData} />
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