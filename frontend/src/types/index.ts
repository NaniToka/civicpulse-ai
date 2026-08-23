export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MomentumTrend = 'INCREASING' | 'STABLE' | 'DECREASING' | 'EMERGING';
export type InvestmentStatus = 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
export type OverlapType = 'NONE' | 'PLANNED_PROJECT' | 'ACTIVE_PROJECT' | 'DELAYED_PROJECT' | 'COMPLETED_PROJECT';

export interface ExtractedEntities {
  location?: string;
  severity: UrgencyLevel;
  impacted_count?: number;
  infrastructure_type?: string;
  subcategory?: string;
}

export interface StructuredAIOutput {
  language: string;
  category: string;
  subcategory: string;
  intent: string;
  location?: string | null;
  urgency: UrgencyLevel;
  entities: string[];
  summary: string;
  confidence: number;
}

export interface CivicAnalysisResponse {
  success: boolean;
  data: {
    analysis: StructuredAIOutput;
    raw_text: string;
  };
  meta: {
    ai_provider: string;
    processing_mode: string;
    processing_time_ms: number;
  };
}

export interface CitizenRequest {
  id: string;
  region_id: string;
  source: string;
  language: string;
  original_text: string;
  normalized_text?: string;
  translated_text: string;
  category?: string;
  request_category: string;
  subcategory?: string;
  urgency?: UrgencyLevel;
  processing_status?: string;
  extracted_entities: ExtractedEntities;
  latitude: number;
  longitude: number;
  timestamp: string;
  confidence: number;
  is_synthetic?: boolean;
  is_demo?: boolean;
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
  population_density?: number;
  youth_percentage?: number;
  elderly_percentage?: number;
  household_count?: number;
  urbanization_rate?: number;
  digital_access_rate?: number;
  vulnerability_index: number;
  primary_language: string;
  is_synthetic?: boolean;
  is_demo?: boolean;
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
  is_synthetic?: boolean;
  is_demo?: boolean;
}

export interface InvestmentProject {
  id: string;
  project_name: string;
  region_id: string;
  category: string;
  budget_usd: number;
  status: string;
  planned_start: string;
  expected_capacity_addition?: string;
  coverage_area?: string;
  is_synthetic?: boolean;
  is_demo?: boolean;
}

export interface EvidenceCard {
  demand_signal_summary: string;
  infrastructure_deficit_summary: string;
  demographic_impact_summary: string;
  investment_status_summary: string;
  data_sources: string[];
}

export interface FactorContribution {
  name: string;
  raw_value: number;
  weight: number;
  contribution: number;
  explanation: string;
}

export interface ExplanationDetails {
  recommendation_id: string;
  region_id: string;
  region_name: string;
  category: string;
  priority_score: number;
  priority_level: UrgencyLevel;
  factors: FactorContribution[];
  risks: string[];
  existing_investment_context?: string;
  estimated_population_impact: number;
  recommended_action: string;
}

export interface EvidenceItem {
  id: string;
  type: 'citizen_demand' | 'demand_momentum' | 'infrastructure_gap' | 'demographic_need' | 'investment_context' | 'urgency' | 'population_impact' | 'coverage' | 'accessibility';
  source: string;
  region_id: string;
  category: string;
  metric: string;
  value: number;
  normalized_value: number;
  contribution: number;
  confidence: number;
  explanation: string;
  is_synthetic?: boolean;
}

export interface DemandMomentumSignal {
  region_id: string;
  category: string;
  trend: MomentumTrend;
  percentage_change: number;
  recent_window_count: number;
  previous_window_count: number;
  momentum_score: number;
}

export interface InvestmentOverlapDetail {
  has_overlap: boolean;
  overlap_type: OverlapType;
  project_id?: string;
  project_name?: string;
  project_status?: string;
  budget_usd?: number;
  explanation: string;
}

export interface EvidenceChainStep {
  step: number;
  title: string;
  finding: string;
  value: string;
  contribution: string;
  evidence_item_id?: string | null;
}

export interface WhyThisRecommendation {
  recommendation_id: string;
  summary: string;
  overall_confidence: number;
  evidence_chain: EvidenceChainStep[];
  factors: FactorContribution[];
  risks: string[];
}

export interface PriorityRecommendation {
  id: string;
  region_id: string;
  region_name: string;
  category: string;
  priority_score: number;
  priority_level: UrgencyLevel;
  confidence: number;
  evidence_card: EvidenceCard;
  explanation_details?: ExplanationDetails;
  evidence_items?: EvidenceItem[];
  demand_momentum?: DemandMomentumSignal;
  investment_overlap?: InvestmentOverlapDetail;
  evidence_chain?: EvidenceChainStep[];
  why_this_recommendation?: WhyThisRecommendation;
  reasoning: string;
  expected_impact: string;
  recommended_action: string;
  generated_at?: string;
  is_synthetic?: boolean;
  is_demo?: boolean;
}

export interface CivicCategory {
  key: string;
  display_name: string;
  description: string;
  aliases: string[];
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

export interface DemandHotspot {
  region_id: string;
  country: string;
  district_city: string;
  category: string;
  request_count: number;
  population: number;
  per_capita_demand_per_100k: number;
  hotspot_score: number;
  gap_score: number;
  urgency_level: UrgencyLevel;
}

export interface CopilotChatContext {
  route?: string;
  region_id?: string;
  category?: string;
  project_id?: string;
  recommendation_id?: string;
}

export interface CopilotChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CopilotActionLink {
  label: string;
  action_type: 'navigate' | 'open_modal' | 'run_scenario';
  target: string;
}

export interface CopilotEvidenceRef {
  title: string;
  metric: string;
  value: string;
  link?: string;
}

export interface CopilotChatRequest {
  message: string;
  conversation_id?: string;
  history?: CopilotChatMessage[];
  context?: CopilotChatContext;
}

export interface CopilotChatResponse {
  success: boolean;
  message: string;
  ai_provider: string;
  grounded: boolean;
  evidence: CopilotEvidenceRef[];
  suggested_actions: string[];
  action_link?: CopilotActionLink | null;
}

