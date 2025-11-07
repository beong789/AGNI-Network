// Main App Component
import React, { useState } from 'react';
import Header from './Header';
import FireRiskMap from './FireRiskMap';
import CurrentConditions from './CurrentConditions';
import RegionalStatus from "./RegionalStatus"
import InfoCard from './InfoCard';
import Footer from './Footer';

function App() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const mockRegions: Region[] = [
    { id: 1, name: 'Northern California', riskLevel: 'high', color: '#ef4444' },
    { id: 2, name: 'Bay Area', riskLevel: 'moderate', color: '#f59e0b' },
    { id: 3, name: 'Central Valley', riskLevel: 'low', color: '#22c55e' },
    { id: 4, name: 'Southern California', riskLevel: 'very-high', color: '#dc2626' },
  ];

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
    console.log('Selected region:', region);
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
            <RegionalStatus regions={mockRegions} onRegionSelect={handleRegionSelect} />
            <InfoCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;