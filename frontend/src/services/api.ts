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
} from '../types';

const API_BASE = '/api/v1';

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
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[CivicPulse API] Failed to fetch ${endpoint}.`, err);
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
};
