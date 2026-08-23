import {
  Region,
  CitizenRequest,
  InfrastructureIndicator,
  InvestmentProject,
  PriorityRecommendation,
  CitizenRequestIngestInput,
  ScenarioWhatIfInput,
  ScenarioWhatIfResult,
  CivicCategory,
  DemandMomentumSignal,
  InvestmentOverlapDetail,
  WhyThisRecommendation,
  DemandHotspot,
  CivicAnalysisResponse,
  CopilotChatRequest,
  CopilotChatResponse,
} from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const API_BASE = `${BASE_URL}/api/v1`;

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Request is temporarily rate-limited. Please try again shortly.');
      }
      throw new Error(`Unable to connect to CivicPulse Intelligence (${res.status}).`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[CivicPulse API] Service communication notice for endpoint ${endpoint}.`, err);
    throw err;
  }
}

export const api = {
  getHealth: () => fetchJSON<{ status: string; service: string; ai_provider: string }>('/health'),
  getCategories: () => fetchJSON<CivicCategory[]>('/categories'),
  getRegions: () => fetchJSON<Region[]>('/regions'),
  getCitizenRequests: (regionId?: string, category?: string) => {
    const params = new URLSearchParams();
    if (regionId) params.append('region_id', regionId);
    if (category) params.append('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJSON<CitizenRequest[]>(`/citizen-requests${query}`);
  },
  getIndicators: (regionId?: string) =>
    fetchJSON<InfrastructureIndicator[]>(`/infrastructure/gaps${regionId ? `?region_id=${regionId}` : ''}`),
  getInvestments: (regionId?: string) =>
    fetchJSON<InvestmentProject[]>(`/investments${regionId ? `?region_id=${regionId}` : ''}`),
  getRecommendations: () => fetchJSON<PriorityRecommendation[]>('/recommendations/ranked'),
  getEvidenceTrail: (recommendationId: string, targetLanguage: string = 'en') =>
    fetchJSON<WhyThisRecommendation>(`/recommendations/${recommendationId}/explain?target_language=${targetLanguage}`),
  getDemandTrends: () => fetchJSON<DemandMomentumSignal[]>('/demand/trends'),
  getDemandHotspots: () => fetchJSON<DemandHotspot[]>('/demand/hotspots'),
  getInvestmentOverlaps: () => fetchJSON<InvestmentOverlapDetail[]>('/investments/overlaps'),
  analyzeCitizenText: (payload: CitizenRequestIngestInput) =>
    fetchJSON<CivicAnalysisResponse>('/citizen-requests/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  ingestCitizenRequest: (payload: CitizenRequestIngestInput) =>
    fetchJSON<CitizenRequest>('/citizen-requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  runScenarioSimulation: (payload: ScenarioWhatIfInput) =>
    fetchJSON<ScenarioWhatIfResult>('/scenarios', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  sendCopilotChat: (payload: CopilotChatRequest) =>
    fetchJSON<CopilotChatResponse>('/copilot/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

