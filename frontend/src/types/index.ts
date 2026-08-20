export interface ExtractedEntities {
  location?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impacted_count?: number;
  infrastructure_type?: string;
}

export interface CitizenRequest {
  id: string;
  region_id: string;
  source: string;
  language: string;
  original_text: string;
  translated_text: string;
  request_category: string;
  extracted_entities: ExtractedEntities;
  latitude: number;
  longitude: number;
  timestamp: string;
  confidence: number;
  is_demo: boolean;
}

export interface Region {
  id: string;
  country: string;
  country_code: string;
  state_province: string;
  district_city: string;
  latitude: number;
  longitude: number;
  population: number;
  vulnerability_index: number;
  primary_language: string;
  is_demo: boolean;
}

export interface InfrastructureIndicator {
  id: string;
  region_id: string;
  category: string;
  current_capacity_pct: number;
  demand_index: number;
  coverage_ratio_pct: number;
  gap_score: number;
  last_assessed: string;
  is_demo: boolean;
}

export interface InvestmentProject {
  id: string;
  project_name: string;
  region_id: string;
  category: string;
  budget_usd: number;
  status: 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
  planned_start: string;
  expected_capacity_addition?: string;
  is_demo: boolean;
}

export interface EvidenceCard {
  demand_signal_summary: string;
  infrastructure_deficit_summary: string;
  demographic_impact_summary: string;
  investment_status_summary: string;
  data_sources: string[];
}

export interface PriorityRecommendation {
  id: string;
  region_id: string;
  region_name: string;
  category: string;
  priority_score: number;
  confidence: number;
  evidence_card: EvidenceCard;
  reasoning: string;
  expected_impact: string;
  recommended_action: string;
  generated_at: string;
  is_demo: boolean;
}

export interface CitizenRequestIngestInput {
  source?: string;
  language?: string;
  raw_text: string;
  latitude?: number;
  longitude?: number;
  region_id?: string;
}

export interface ScenarioWhatIfInput {
  region_id: string;
  category: string;
  budget_allocation_usd: number;
  policy_urgency_override?: string;
  target_coverage_addition_pct?: number;
}

export interface ScenarioWhatIfResult {
  original_priority_score: number;
  simulated_priority_score: number;
  score_delta: number;
  projected_gap_score: number;
  expected_population_beneficiaries: number;
  simulation_notes: string;
}
