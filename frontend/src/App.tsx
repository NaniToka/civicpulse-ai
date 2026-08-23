import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { EvidenceTrailModal } from './components/common/EvidenceTrailModal';
import { AuthModal, UserProfile } from './components/common/AuthModal';
import { RaiseComplaintModal } from './components/common/RaiseComplaintModal';
import { DashboardOverview } from './pages/DashboardOverview';
import { DemandIntelligence } from './pages/DemandIntelligence';
import { HotspotExplorer } from './pages/HotspotExplorer';
import { InfrastructureGaps } from './pages/InfrastructureGaps';
import { RecommendationsView } from './pages/RecommendationsView';
import { EvidenceExplorer } from './pages/EvidenceExplorer';
import { WhatIfScenario } from './pages/WhatIfScenario';
import { DataExplorer } from './pages/DataExplorer';
import { CitizenFeedbackWall } from './pages/CitizenFeedbackWall';
import { CopilotView } from './pages/CopilotView';

import { api } from './services/api';
import {
  Region,
  CitizenRequest,
  InfrastructureIndicator,
  InvestmentProject,
  PriorityRecommendation,
  DemandMomentumSignal,
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [selectedModalRec, setSelectedModalRec] = useState<PriorityRecommendation | null>(null);

  // User Auth & Complaint Modal state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [raiseComplaintModalOpen, setRaiseComplaintModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('civicpulse_user_session');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [regions, setRegions] = useState<Region[]>([]);
  const [requests, setRequests] = useState<CitizenRequest[]>([]);
  const [indicators, setIndicators] = useState<InfrastructureIndicator[]>([]);
  const [investments, setInvestments] = useState<InvestmentProject[]>([]);
  const [recommendations, setRecommendations] = useState<PriorityRecommendation[]>([]);
  const [trends, setTrends] = useState<DemandMomentumSignal[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [regData, reqData, indData, invData, recData] = await Promise.all([
          api.getRegions().catch(() => []),
          api.getCitizenRequests().catch(() => []),
          api.getIndicators().catch(() => []),
          api.getInvestments().catch(() => []),
          api.getRecommendations().catch(() => []),
        ]);

        if (regData.length > 0) setRegions(regData);
        if (reqData.length > 0) setRequests(reqData);
        if (indData.length > 0) setIndicators(indData);
        if (invData.length > 0) setInvestments(invData);
        if (recData.length > 0) setRecommendations(recData);

        api.getDemandTrends().then((t) => setTrends(t)).catch(() => {});
      } catch (err) {
        console.warn('Backend API unattached. Operating with self-contained fallback state.', err);
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenRaiseComplaint={() => setRaiseComplaintModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenRaiseComplaint={() => setRaiseComplaintModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto w-full">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3 text-slate-400 text-xs font-mono">
              <div className="w-7 h-7 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span>Initializing CivicPulse Intelligence Platform...</span>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  recommendations={recommendations}
                  requests={requests}
                  regions={regions}
                  onNavigate={setActiveTab}
                  onOpenEvidenceModal={(rec) => setSelectedModalRec(rec)}
                />
              )}

              {activeTab === 'copilot' && (
                <CopilotView
                  onNavigate={setActiveTab}
                  onOpenEvidenceModal={(rec) => setSelectedModalRec(rec)}
                  recommendations={recommendations}
                />
              )}


              {activeTab === 'demand' && (
                <DemandIntelligence
                  requests={requests}
                  regions={regions}
                  trends={trends}
                  onNavigateToScenarios={() => setActiveTab('scenarios')}
                />
              )}

              {activeTab === 'feedback' && <CitizenFeedbackWall regions={regions} />}

              {activeTab === 'hotspots' && (
                <HotspotExplorer
                  regions={regions}
                  indicators={indicators}
                  requests={requests}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'gaps' && (
                <InfrastructureGaps
                  indicators={indicators}
                  regions={regions}
                  onNavigateToScenarios={() => setActiveTab('scenarios')}
                />
              )}

              {activeTab === 'recommendations' && (
                <RecommendationsView
                  recommendations={recommendations}
                  regions={regions}
                  onOpenEvidenceModal={(rec) => setSelectedModalRec(rec)}
                  onNavigateToScenarios={() => setActiveTab('scenarios')}
                />
              )}

              {activeTab === 'evidence' && (
                <EvidenceExplorer
                  recommendations={recommendations}
                  regions={regions}
                  onOpenEvidenceModal={(rec) => setSelectedModalRec(rec)}
                />
              )}

              {activeTab === 'scenarios' && <WhatIfScenario regions={regions} />}

              {activeTab === 'data' && (
                <DataExplorer
                  requests={requests}
                  regions={regions}
                  indicators={indicators}
                  investments={investments}
                  onNewRequestAdded={handleNewRequestAdded}
                />
              )}
            </>
          )}
        </main>
      </div>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setCommandPaletteOpen(false);
        }}
      />

      <EvidenceTrailModal
        recommendation={selectedModalRec}
        onClose={() => setSelectedModalRec(null)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
        regions={regions}
      />

      <RaiseComplaintModal
        isOpen={raiseComplaintModalOpen}
        onClose={() => setRaiseComplaintModalOpen(false)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onComplaintSubmitted={handleNewRequestAdded}
        regions={regions}
      />
    </div>
  );
};

export default App;
