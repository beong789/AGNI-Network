import { useState, useEffect } from 'react';
import FireRiskMap from './FireRiskMap';
import CurrentConditions from './CurrentConditions';
import RegionalStatus from "./RegionalStatus"
import InfoCard from './InfoCard';
import ChatAssistant from './ChatAssistant';
import { api } from './services/api';
import type { FireDangerData } from './services/api';
import type { Region } from './types';

function Home() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCountyData, setSelectedCountyData] = useState<FireDangerData | null>(null);
  const [allFireData, setAllFireData] = useState<FireDangerData[]>([]);

  useEffect(() => {
    api.getAllFireData()
      .then(data => {
        setAllFireData(data);
        
        const toColor = (level: string) => {
            switch(level) {
              case 'Very High': return '#ef4444';      // Red
              case 'High': return '#f97316';           // Orange
              case 'Elevated': return '#fbbf24';       // Yellow/amber
              case 'Moderate': return '#a3e635';       // Light green
              case 'Low': return '#22c55e';            // Green
              default: return '#9ca3af';               // Gray
            }
          };
        
        const formatted = data.map((item, index) => ({
          id: index,
          name: item.county,
          riskLevel: item.fire_danger_level,
          color: toColor(item.fire_danger_level),
        }));
        setRegions(formatted);
        
        // Set first county as default for Current Conditions
        if (data.length > 0) {
          setSelectedCountyData(data[0]);
        }
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
    console.log('Looking for county:', countyName);  
    if (countyName) {
      const countyData = allFireData.find(d => d.county === countyName);
      console.log('Found data:', countyData);  
      if (countyData) {
        setSelectedCountyData(countyData);
      }
    }
  };

  return (
    <>
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
      <ChatAssistant />
    </>
  );
}

export default Home;