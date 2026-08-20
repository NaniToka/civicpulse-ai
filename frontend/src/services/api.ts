import {
  Region,
  CitizenRequest,
  InfrastructureIndicator,
  InvestmentProject,
  PriorityRecommendation,
  CitizenRequestIngestInput,
  ScenarioWhatIfInput,
  ScenarioWhatIfResult
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
    console.warn(`[CivicPulse API] Failed to fetch ${endpoint}. Returning fallback data.`, err);
    throw err;
  }
}

export const api = {
  getHealth: () => fetchJSON<{ status: string; service: string }>('/health'),
  getRegions: () => fetchJSON<Region[]>('/regions'),
  getCitizenRequests: (regionId?: string) =>
    fetchJSON<CitizenRequest[]>(`/requests${regionId ? `?region_id=${regionId}` : ''}`),
  getIndicators: (regionId?: string) =>
    fetchJSON<InfrastructureIndicator[]>(`/indicators${regionId ? `?region_id=${regionId}` : ''}`),
  getInvestments: (regionId?: string) =>
    fetchJSON<InvestmentProject[]>(`/investments${regionId ? `?region_id=${regionId}` : ''}`),
  getRecommendations: () => fetchJSON<PriorityRecommendation[]>('/recommendations'),
  ingestCitizenRequest: (payload: CitizenRequestIngestInput) =>
    fetchJSON<CitizenRequest>('/ingest', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  runScenarioWhatIf: (payload: ScenarioWhatIfInput) =>
    fetchJSON<ScenarioWhatIfResult>('/scenario/what-if', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
