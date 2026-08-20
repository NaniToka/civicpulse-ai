import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardOverview } from './pages/DashboardOverview';
import { HotspotExplorer } from './pages/HotspotExplorer';
import { RecommendationsView } from './pages/RecommendationsView';
import { CitizenFeedbackFeed } from './pages/CitizenFeedbackFeed';
import { WhatIfScenario } from './pages/WhatIfScenario';
import { Alert } from './components/common/Alert';
import { api } from './services/api';
import { Region, CitizenRequest, InfrastructureIndicator, PriorityRecommendation } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [regions, setRegions] = useState<Region[]>([]);
  const [requests, setRequests] = useState<CitizenRequest[]>([]);
  const [indicators, setIndicators] = useState<InfrastructureIndicator[]>([]);
  const [recommendations, setRecommendations] = useState<PriorityRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [regData, reqData, indData, recData] = await Promise.all([
          api.getRegions(),
          api.getCitizenRequests(),
          api.getIndicators(),
          api.getRecommendations(),
        ]);
        setRegions(regData);
        setRequests(reqData);
        setIndicators(indData);
        setRecommendations(recData);
      } catch (err) {
        console.warn('Backend API offline. Operating in self-contained demo mode.', err);
        setError('Backend API server unattached. Operating in standalone demo mode.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleNewRequestAdded = (newReq: CitizenRequest) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-civic-950 text-civic-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 max-w-7xl mx-auto overflow-y-auto">
          {error && (
            <div className="mb-4">
              <Alert variant="warning">{error}</Alert>
            </div>
          )}

          {loading ? (
            <div className="h-64 flex items-center justify-center text-xs text-civic-400">
              Initializing CivicPulse Intelligence Platform...
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  recommendations={recommendations}
                  requests={requests}
                  regions={regions}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'hotspots' && (
                <HotspotExplorer regions={regions} indicators={indicators} requests={requests} />
              )}
              {activeTab === 'recommendations' && (
                <RecommendationsView recommendations={recommendations} />
              )}
              {activeTab === 'feedback' && (
                <CitizenFeedbackFeed requests={requests} onNewRequestAdded={handleNewRequestAdded} />
              )}
              {activeTab === 'scenarios' && <WhatIfScenario regions={regions} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
