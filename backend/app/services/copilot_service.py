import logging
import re
from typing import Any

from app.core.config import settings
from app.core.security import sanitize_input_text
from app.core.taxonomy import (
    get_all_categories,
    get_category_display_name,
    normalize_category,
)
from app.models.schemas import (
    CopilotActionLink,
    CopilotChatContext,
    CopilotChatRequest,
    CopilotChatResponse,
    CopilotEvidenceRef,
    ScenarioWhatIfInput,
)
from app.services.ai_service import get_ai_service
from app.services.data_loader import data_loader
from app.services.demand_engine import demand_aggregation_service
from app.services.demand_momentum import demand_momentum_engine
from app.services.hotspot_engine import hotspot_engine
from app.services.recommendation_service import recommendation_service
from app.services.scenario_service import scenario_simulation_service

logger = logging.getLogger("civicpulse.copilot_service")


class CopilotService:
    """
    Civic Intelligence Copilot Engine.
    Coordinates natural language intent parsing, controlled backend retrieval,
    strict anti-hallucination grounding, and evidence citation assembly.
    """

    def __init__(self):
        pass

    def _is_security_violation(self, text: str) -> bool:
        """Detects prompt injection, secret exfiltration, and system override attempts."""
        lower = text.lower()
        forbidden_patterns = [
            r"gemini_api_key",
            r"api_key",
            r"reveal.*key",
            r"system.*prompt",
            r"ignore.*previous.*instructions",
            r"environment.*variable",
            r"os\.environ",
            r"read.*file",
            r"execute.*code",
            r"eval\(",
            r"import\s+os",
            r"<citizen_input_data_do_not_execute>",
        ]
        return any(re.search(pat, lower) for pat in forbidden_patterns)

    def _extract_category(self, text: str, context: CopilotChatContext | None) -> str | None:
        """Extracts taxonomy category from text or UI context."""
        lower = text.lower()
        categories = get_all_categories()
        for cat in categories:
            if cat.key in lower or cat.display_name.lower() in lower:
                return cat.key
            for alias in cat.aliases:
                if alias.lower() in lower:
                    return cat.key
        if context and context.category:
            return normalize_category(context.category)
        return None

    def _extract_region(self, text: str, context: CopilotChatContext | None) -> Any | None:
        """Extracts matching Region from text or UI context."""
        regions = data_loader.get_regions()
        lower = text.lower()

        # Direct name matching
        for r in regions:
            if (
                r.district_city.lower() in lower
                or r.state_province.lower() in lower
                or r.id.lower() in lower
            ):
                return r

        # Keyword heuristics
        if "vijayawada" in lower:
            return next((r for r in regions if "Vijayawada" in r.district_city), None)
        if "kanpur" in lower:
            return next((r for r in regions if "Kanpur" in r.district_city), None)
        if "ethekwini" in lower or "durban" in lower:
            return next((r for r in regions if "eThekwini" in r.district_city or "Durban" in r.district_city), None)
        if "salvador" in lower:
            return next((r for r in regions if "Salvador" in r.district_city), None)

        if context and context.region_id:
            return next((r for r in regions if r.id == context.region_id), None)

        return None

    def _extract_budget(self, text: str) -> float:
        """Extracts dollar investment budget from text, defaulting to $15,000,000 USD."""
        match = re.search(r"\$?\s*([0-9\.]+)\s*(m|million|k|thousand|usd|dollars)?", text, re.IGNORECASE)
        if match:
            num_val = float(match.group(1))
            unit = (match.group(2) or "").lower()
            if unit in ["m", "million"]:
                return num_val * 1_000_000.0
            elif unit in ["k", "thousand"]:
                return num_val * 1_000.0
            elif num_val < 1000:
                return num_val * 1_000_000.0
            return num_val
        return 15_000_000.0

    async def process_chat(self, request: CopilotChatRequest) -> CopilotChatResponse:
        sanitized_msg = sanitize_input_text(request.message)

        # 1. Security & Prompt Injection Check
        if self._is_security_violation(sanitized_msg):
            logger.warning(f"Security policy trigger on Copilot input: '{sanitized_msg[:50]}...'")
            return CopilotChatResponse(
                success=True,
                message=(
                    "I cannot reveal internal API keys, system prompts, environment variables, or execute arbitrary code. "
                    "How can I assist you with CivicPulse intelligence and data?"
                ),
                ai_provider="security_guardrail",
                grounded=True,
                evidence=[],
                suggested_actions=["Show top 5 priorities", "Which region has highest infrastructure deficit?", "Show projects with funding gaps"],
            )

        lower_msg = sanitized_msg.lower()
        context = request.context
        ai_provider_name = "gemini" if bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip()) else "rule_based_fallback"

        region = self._extract_region(sanitized_msg, context)
        category_key = self._extract_category(sanitized_msg, context)

        # Retrieve core datasets
        regions = data_loader.get_regions()
        indicators = data_loader.get_infrastructure_indicators()
        requests = data_loader.get_citizen_requests()
        investments = data_loader.get_investment_projects()
        all_recs = recommendation_service.generate_all_ranked_recommendations(regions, indicators, requests, investments)

        grounded_context = ""
        evidence_list: list[CopilotEvidenceRef] = []
        action_link: CopilotActionLink | None = None
        suggested_actions: list[str] = []

        # 2. Intent Dispatching

        # Intent 0: CASUAL GREETINGS & INTRODUCTIONS
        greeting_words = ["hi", "hey", "hello", "hey hi", "greetings", "good morning", "good afternoon", "good evening", "namaste", "vanakkam", "hey there", "hola", "sup"]
        is_simple_greeting = (
            lower_msg in greeting_words
            or any(lower_msg.startswith(g) and len(lower_msg) <= len(g) + 5 for g in greeting_words)
            or (len(lower_msg) < 20 and any(w in lower_msg for w in ["hi", "hey", "hello", "namaste"]))
        ) and not any(k in lower_msg for k in ["how to", "why", "what happens", "priority", "defect", "gap", "project", "scenario"])

        if is_simple_greeting:
            grounded_context = """Hello! 👋 Welcome to **CivicPulse AI Assistant**.

I am your intelligent, grounded civic intelligence assistant. I am here to help citizens, community leaders, and government decision-makers resolve local civic problems and prioritize infrastructure capital allocations!

#### How I can assist you right now:
1. 📝 **Log & Solve a Civic Problem**: Guide you step-by-step to report broken roads, water cuts, hospital delays, or power outages in your area.
2. 🚨 **View Urgent Regional Priorities**: Show the highest-ranked infrastructure shortfalls across 35 BRICS districts.
3. 💰 **Simulate $15M Funding Allocations**: Test counterfactual budget scenarios and see projected beneficiary counts before investing.
4. 🔍 **Traceable Evidence Trails**: Audit transparent 6-step evidence chains linking priority scores back to citizen feedback and census statistics.

*What civic problem or area would you like to explore today?*
"""
            evidence_list = [
                CopilotEvidenceRef(title="Supported Languages", metric="Count", value="7 Languages Active"),
                CopilotEvidenceRef(title="Ingestion Channels", metric="Channels", value="Web, Voice, SMS, App"),
            ]
            action_link = CopilotActionLink(label="Open Data Explorer to Submit Issue", action_type="navigate", target="/data")
            suggested_actions = [
                "How to post a complaint or submit a civic signal?",
                "Which civic problem needs attention most urgently?",
                "Tell me about CivicPulse AI",
                "What happens if we allocate $15M to healthcare?",
            ]

        # Intent 1: ABOUT CIVICPULSE / PLATFORM OVERVIEW
        elif any(w in lower_msg for w in ["tell me about civicpulse", "what is civicpulse", "about civicpulse", "what can you do", "who are you", "what is this platform", "how does civicpulse work", "features of civicpulse", "explain civicpulse"]):
            top_rec = all_recs[0]
            cat_disp = get_category_display_name(top_rec.category)
            grounded_context = f"""### About CivicPulse AI 🌐

**CivicPulse AI** is an intelligent, multi-tenant civic intelligence platform designed to bridge the gap between citizen voices and government capital allocation across BRICS regions.

#### Core Platform Capabilities:
1. 🗣️ **Multilingual Citizen Voice Ingestion**: Ingests citizen feedback in 7 regional languages (*Hindi, Telugu, Marathi, Bengali, Portuguese, Zulu, English*) via Web, Voice Notes, SMS, or App.
2. 🧮 **Deterministic 8-Factor Prioritization**: Ranks regional projects using an un-biased mathematical formula combining per-capita demand density, infrastructure deficits, demographic vulnerability, and capital overlap.
3. 🔬 **Counterfactual What-If Scenario Lab**: Allows policymakers to simulate allocating budget ($15M+) to calculate projected beneficiary counts and deficit gap reductions before spending.
4. 🔍 **Transparent 6-Step Evidence Chains**: Guarantees 100% auditability with citations linking every priority decision back to verified citizen feedback and census stats.

#### Live System Status:
- **Monitored Regions**: {len(regions)} BRICS Districts
- **Top Priority Focus**: **{top_rec.region_name}** ({cat_disp}) — Score `{top_rec.priority_score:.1f}/100`
- **Active Citizen Demands**: {len(requests):,} multilingual entries
- **Assessed Capital Projects**: {len(investments)} public investment initiatives

*Would you like to log a complaint or view the top priority regions right now?*
"""
            evidence_list = [
                CopilotEvidenceRef(title="Monitored Regions", metric="Count", value=str(len(regions))),
                CopilotEvidenceRef(title="Active Demands", metric="Count", value=str(len(requests))),
            ]
            action_link = CopilotActionLink(label="Open Data Explorer", action_type="navigate", target="/data")
            suggested_actions = [
                "How to post a complaint or submit a civic signal?",
                "Which civic problem needs attention most urgently?",
                "Which projects have funding gaps?",
            ]

        # Intent 2: HOW TO POST COMPLAINT / RAISE A PROBLEM / SUBMIT SIGNAL / SOLVE PROBLEM
        problem_submission_triggers = [
            "raise", "raise my problem", "raise problem", "raise a problem", "raise issue", "raise complaint",
            "how to raise", "how do i raise", "how can i raise", "want to raise", "need to raise",
            "how to post", "how to submit", "how to report", "how to log", "how to file", "how to register",
            "how do i post", "how do i submit", "how do i report", "how do i log", "how do i file",
            "how can i post", "how can i submit", "how can i report", "how to solve my problem",
            "how to solve a problem", "how to solve problem", "i have a problem", "i have an issue",
            "i have a complaint", "want to complain", "want to report", "tell me how to", "where can i submit",
            "where do i submit", "where do i report", "how to add signal", "complaint", "grievance"
        ]
        if any(w in lower_msg for w in problem_submission_triggers):
            grounded_context = """### How to Raise & Submit Your Civic Problem in CivicPulse AI 🛠️

To raise your civic problem or report a community infrastructure issue, follow these simple steps:

1. **Navigate to Data Explorer or Demand Intelligence**:
   - Click **[Data Explorer]** or **[Demand Intelligence]** in the left sidebar or top navigation bar.
   - Locate the **Citizen Voice Composer** panel.

2. **Enter Your Civic Feedback**:
   - Type your problem or record a voice note in any supported language (*Telugu, Hindi, Marathi, Bengali, Portuguese, Zulu, or English*).
   - Example: *"Severe drinking water supply disruption in Vijayawada Ward 4; urgent pipeline repair required."* or *"మా ప్రాంతంలో పిల్లలకు మంచి ఆసుపత్రి లేదు."*

3. **Select Input Channel & Location**:
   - Choose the source channel (*Web, Voice Note, Mobile App, Messaging, Survey*).
   - Specify latitude/longitude or select your target District/City.

4. **Analyze & Fast-Track Signal**:
   - Click **"Analyze Civic Signal"** followed by **"Add Signal to Civic Intelligence"**.
   - The Gemini AI NLP Engine detects the script, normalizes the text into English, classifies the category, extracts entities, and assigns urgency.
   - The signal is instantly added to CivicPulse, updating per-capita demand scores and regional hotspot rankings in real time!

*You can also type your problem details directly in this chat, and I will analyze it for you!*

### Evidence used:
• Ingestion Channels: Web, Voice, Messaging, Mobile App
• Supported Languages: Telugu, Hindi, Marathi, Bengali, Portuguese, Zulu, English
• Real-time Processing: Script Detection → Translation → Intent Classification → Hotspot Update
"""
            evidence_list = [
                CopilotEvidenceRef(title="Supported Languages", metric="Count", value="7 Languages Active"),
                CopilotEvidenceRef(title="Ingestion Channels", metric="Channels", value="Web, Voice, SMS, App"),
            ]
            action_link = CopilotActionLink(label="Open Data Explorer to Raise Problem", action_type="navigate", target="/data")
            suggested_actions = ["Show top 5 priorities", "Which region has highest infrastructure deficit?", "What happens if we allocate $15M?"]

        # Intent 3: DIRECT CIVIC PROBLEM TYPED INTO CHAT (e.g. "Water pipeline broken in Vijayawada", "No doctors at hospital")
        elif any(w in lower_msg for w in ["water", "road", "hospital", "power", "garbage", "electricity", "clinic", "drainage", "bridge", "school", "pothole", "broken", "cut", "shortage", "leak", "outage", "overflowing"]) and len(lower_msg) > 15:
            cat = category_key or "healthcare"
            cat_display = get_category_display_name(cat)
            target_reg = region or regions[0]
            urgency = "CRITICAL" if any(w in lower_msg for w in ["urgent", "severe", "emergency", "broken", "critical", "cut", "no water"]) else "HIGH"

            grounded_context = f"""### Civic Issue Signal Recognized & Analyzed 📌

Thank you for bringing this issue to light! Here is the automated classification breakdown of your signal:

- **Identified Sector**: **{cat_display}**
- **Assigned Urgency**: `{urgency}`
- **Target Location**: **{target_reg.district_city}, {target_reg.country}**
- **Extracted Summary**: *"{sanitized_msg}"*

#### Fast-Tracking Action:
To officially log this entry into the real-time CivicPulse per-capita demand index and flag it for local government budget prioritization:

Click **[Ingest Signal in Data Explorer]** below to record it into the regional database!

### Evidence used:
• Detected Category: {cat_display}
• Regional Population: {target_reg.population:,}
• Regional Vulnerability Index: {target_reg.vulnerability_index:.2f}
"""
            evidence_list = [
                CopilotEvidenceRef(title="Identified Sector", metric="Category", value=cat_display),
                CopilotEvidenceRef(title="Assigned Urgency", metric="Level", value=urgency),
                CopilotEvidenceRef(title="Target Region", metric="District", value=target_reg.district_city),
            ]
            action_link = CopilotActionLink(label="Ingest Signal in Data Explorer", action_type="navigate", target="/data")
            suggested_actions = [
                f"Why is {target_reg.district_city} ranked high?",
                "Show top 5 priorities",
                f"What happens if we allocate $15M to {cat_display.lower()}?",
            ]

        # Intent A: WHAT-IF SCENARIO
        elif any(w in lower_msg for w in ["scenario", "allocate", "if we invest", "what happens if", "$15m", "budget", "counterfactual", "simulate"]):

            budget = self._extract_budget(sanitized_msg)
            cat = category_key or "healthcare"
            target_region = region or regions[0]
            ind = next((i for i in indicators if i.region_id == target_region.id and i.category == cat), None)

            scenario_input = ScenarioWhatIfInput(
                region_id=target_region.id,
                category=cat,
                budget_allocation_usd=budget,
            )
            sim_res = scenario_simulation_service.simulate_scenario(scenario_input, target_region, ind, requests, investments)

            cat_display = get_category_display_name(cat)
            grounded_context = f"""### Counterfactual Scenario Simulation Result 🔬

**Investment Allocation**: ${budget:,.0f} USD
**Target Sector**: {cat_display}
**Region**: {target_region.district_city}, {target_region.country}

- **Baseline Priority Score**: {sim_res.original_priority_score:.1f}/100
- **Simulated Priority Score**: {sim_res.simulated_priority_score:.1f}/100
- **Deficit Score Delta**: {sim_res.score_delta:+.1f} points (Projected Gap Score: {sim_res.projected_gap_score:.2f})
- **Projected Beneficiaries**: ~{sim_res.expected_population_beneficiaries:,} residents

**Policy Summary**:
{sim_res.simulation_notes}

### Evidence used:
• Baseline Infrastructure Gap: {ind.gap_score if ind else 0.60:.2f}
• Regional Population: {target_region.population:,}
• Regional Vulnerability Index: {target_region.vulnerability_index:.2f}
• Calculated Beneficiary Coverage: +{((sim_res.expected_population_beneficiaries / target_region.population) * 100):.1f}%
"""
            evidence_list = [
                CopilotEvidenceRef(title="Original Priority Score", metric="Score", value=f"{sim_res.original_priority_score:.1f}/100"),
                CopilotEvidenceRef(title="Simulated Score", metric="Score", value=f"{sim_res.simulated_priority_score:.1f}/100"),
                CopilotEvidenceRef(title="Projected Beneficiaries", metric="Count", value=f"{sim_res.expected_population_beneficiaries:,}"),
            ]
            action_link = CopilotActionLink(label="Open Scenario Lab", action_type="navigate", target="/scenarios")
            suggested_actions = ["Run scenario for $25M in Water", "Show top priorities", "Which projects have funding gaps?"]

        # Intent B: CIVICFUND / CAPITAL PROJECTS / FUNDING GAPS
        elif any(w in lower_msg for w in ["funding gap", "csr", "csr support", "civicfund", "largest gap", "projects", "funding", "benefit from"]):
            # Process investment projects
            project_list = []
            for inv in investments:
                reg = next((r for r in regions if r.id == inv.region_id), None)
                reg_name = f"{reg.district_city}, {reg.country}" if reg else "Unknown Region"
                gap_est = inv.budget_usd * 0.45 if inv.status.lower() in ["active", "in_progress"] else inv.budget_usd
                pop_impact = int((reg.population if reg else 500000) * 0.35)
                project_list.append({
                    "name": inv.project_name,
                    "region": reg_name,
                    "category": get_category_display_name(inv.category),
                    "budget": inv.budget_usd,
                    "gap": gap_est,
                    "status": inv.status.upper(),
                    "beneficiaries": pop_impact,
                })

            project_list.sort(key=lambda x: x["gap"], reverse=True)
            top_projects = project_list[:4]

            lines = ["### CivicFund Capital Projects & CSR Investment Gaps\n"]
            lines.append("The following key infrastructure projects currently exhibit critical funding gaps suitable for government budget priority or CSR organization support:\n")
            for idx, p in enumerate(top_projects, 1):
                lines.append(
                    f"{idx}. **{p['name']}** ({p['region']})\n"
                    f"   - **Sector**: {p['category']}\n"
                    f"   - **Total Budget**: ${p['budget']:,.0f} USD\n"
                    f"   - **Remaining Funding Gap**: ${p['gap']:,.0f} USD *(Simulated/Demo)*\n"
                    f"   - **Estimated Beneficiaries**: ~{p['beneficiaries']:,} residents\n"
                    f"   - **Status**: `{p['status']}`\n"
                    f"   - **CSR Priority**: High (Matches BRICS infrastructure deficit mandate)\n"
                )

            lines.append("\n### Evidence used:")
            lines.append(f"• Evaluated Capital Projects: {len(investments)}")
            lines.append(f"• Total Combined Capital Budget: ${sum(p['budget'] for p in project_list):,.0f} USD")
            lines.append(f"• Highest Funding Deficit: ${top_projects[0]['gap']:,.0f} USD ({top_projects[0]['name']})")

            grounded_context = "\n".join(lines)
            evidence_list = [
                CopilotEvidenceRef(title=p['name'], metric="Funding Gap", value=f"${p['gap']:,.0f}") for p in top_projects[:3]
            ]
            action_link = CopilotActionLink(label="View Capital Projects Data", action_type="navigate", target="/data")
            suggested_actions = ["Show top 5 priorities", "What happens if we allocate $15M?", "Summarize today's civic intelligence"]

        # Intent C: EXPLAIN RECOMMENDATION / EVIDENCE TRAIL
        elif any(w in lower_msg for w in ["why is", "explain this recommendation", "evidence behind", "why vijayawada", "why ranked", "show evidence", "explain recommendation"]):
            target_rec = None
            if context and context.recommendation_id:
                target_rec = next((r for r in all_recs if r.id == context.recommendation_id), None)
            if not target_rec and region:
                target_rec = next((r for r in all_recs if r.region_id == region.id and (not category_key or r.category == category_key)), None)
            if not target_rec:
                target_rec = all_recs[0]

            why = target_rec.why_this_recommendation
            chain_text = ""
            if why and why.evidence_chain:
                chain_text = "\n".join([f"{step.step}. **{step.title}**: {step.finding} (Contribution: {step.contribution})" for step in why.evidence_chain])

            risks_text = ""
            if why and why.risks:
                risks_text = "\n".join([f"• {risk}" for risk in why.risks])

            cat_disp = get_category_display_name(target_rec.category)
            grounded_context = f"""### Priority Recommendation Breakdown: {target_rec.region_name}

**Category**: {cat_disp}
**Priority Score**: {target_rec.priority_score:.1f}/100 (**{target_rec.priority_level}**)
**Confidence Level**: {(target_rec.confidence * 100):.0f}%

#### Executive Reasoning
{target_rec.reasoning}

#### Traceable Evidence Chain
{chain_text}

#### Policy Risk Factors
{risks_text}

### Evidence used:
• Priority Score: {target_rec.priority_score:.1f}/100
• Demand Momentum: {target_rec.demand_momentum.trend if target_rec.demand_momentum else 'STABLE'} (+{target_rec.demand_momentum.percentage_change if target_rec.demand_momentum else 0:.1f}%)
• Investment Status: {target_rec.investment_overlap.explanation if target_rec.investment_overlap else 'No active overlap'}
• Recommended Action: {target_rec.recommended_action}
"""
            evidence_list = [
                CopilotEvidenceRef(title="Priority Score", metric="Score", value=f"{target_rec.priority_score:.1f}/100"),
                CopilotEvidenceRef(title="Priority Level", metric="Level", value=target_rec.priority_level),
                CopilotEvidenceRef(title="Confidence", metric="Confidence", value=f"{(target_rec.confidence * 100):.0f}%"),
            ]
            action_link = CopilotActionLink(label="View Full Evidence Trail", action_type="open_modal", target=target_rec.id)
            suggested_actions = ["Show top 5 priorities", "What happens if we allocate $15M to healthcare?", "Which projects have funding gaps?"]

        # Intent D: TOP PRIORITIES / URGENT PROBLEMS
        elif any(w in lower_msg for w in ["most urgent", "top priorities", "top 5", "highest priority", "recommendations", "urgent healthcare"]):
            filtered_recs = all_recs
            if category_key:
                filtered_recs = [r for r in filtered_recs if r.category == category_key]
            if region:
                filtered_recs = [r for r in filtered_recs if r.region_id == region.id]

            top_recs = filtered_recs[:5]
            cat_label = get_category_display_name(category_key) if category_key else "All Sectors"

            lines = [f"### Top Ranked Civic Priorities ({cat_label})\n"]
            for idx, r in enumerate(top_recs, 1):
                cat_disp = get_category_display_name(r.category)
                lines.append(
                    f"{idx}. **{r.region_name} — {cat_disp}**\n"
                    f"   - **Priority Score**: `{r.priority_score:.1f}/100` ({r.priority_level})\n"
                    f"   - **Impact**: {r.expected_impact}\n"
                    f"   - **Recommended Action**: {r.recommended_action}\n"
                )

            lines.append("### Evidence used:")
            lines.append(f"• Analyzed Recommendations: {len(all_recs)}")
            lines.append(f"• Top Priority Region: {top_recs[0].region_name} (Score: {top_recs[0].priority_score:.1f}/100)")
            lines.append(f"• Highest Priority Category: {get_category_display_name(top_recs[0].category)}")

            grounded_context = "\n".join(lines)
            evidence_list = [
                CopilotEvidenceRef(title=f"#{idx+1} {r.region_name}", metric=get_category_display_name(r.category), value=f"{r.priority_score:.1f}/100")
                for idx, r in enumerate(top_recs[:3])
            ]
            action_link = CopilotActionLink(label="Explore All Recommendations", action_type="navigate", target="/recommendations")
            suggested_actions = [f"Why is {top_recs[0].region_name.split(',')[0]} ranked high?", "Which projects have funding gaps?", "What happens if we allocate $15M?"]

        # Intent E: INFRASTRUCTURE DEFICITS / GAPS / HOTSPOTS
        elif any(w in lower_msg for w in ["deficit", "infrastructure gap", "hotspot", "shortfall", "risk heatmap"]):
            hotspots = hotspot_engine.detect_hotspots(regions, requests, indicators, category_filter=category_key)
            top_hotspots = hotspots[:5]

            lines = ["### Highest Infrastructure Shortfall & Demand Hotspots\n"]
            lines.append("Based on per-capita demand indexing and infrastructure gap scoring, the following regions present the highest deficits:\n")

            for idx, h in enumerate(top_hotspots, 1):
                cat_disp = get_category_display_name(h.category)
                lines.append(
                    f"{idx}. **{h.district_city}, {h.country}** ({cat_disp})\n"
                    f"   - **Hotspot Score**: `{h.hotspot_score:.1f}/100`\n"
                    f"   - **Infrastructure Gap Score**: {h.infrastructure_gap_score:.2f} (0=No gap, 1=Severe deficit)\n"
                    f"   - **Per-Capita Demand**: {h.per_capita_demand_per_100k:.1f} signals / 100k residents\n"
                    f"   - **Vulnerability Index**: {h.vulnerability_index:.2f}\n"
                )

            lines.append("\n### Evidence used:")
            lines.append(f"• Monitored Hotspot Regions: {len(hotspots)}")
            lines.append(f"• Critical Deficit Region: {top_hotspots[0].district_city} (Hotspot Score: {top_hotspots[0].hotspot_score:.1f}/100)")

            grounded_context = "\n".join(lines)
            evidence_list = [
                CopilotEvidenceRef(title=h.district_city, metric="Gap Score", value=f"{h.infrastructure_gap_score:.2f}")
                for h in top_hotspots[:3]
            ]
            action_link = CopilotActionLink(label="View Infrastructure Gaps", action_type="navigate", target="/gaps")
            suggested_actions = ["Show top 5 priorities", "What happens if we allocate $15M?", "Which projects have funding gaps?"]

        # Intent F: DEMAND TRENDS / MOMENTUM / SUMMARY
        elif any(w in lower_msg for w in ["increasing fastest", "trend", "momentum", "summarize demand", "today's civic intelligence", "voices"]):
            summary = demand_aggregation_service.aggregate_demand(requests)
            growing_trends = []
            for r_item in regions[:5]:
                for cat in ["healthcare", "water", "electricity", "transportation"]:
                    sig = demand_momentum_engine.calculate_momentum(r_item.id, cat, requests)
                    if sig.trend in ["INCREASING", "EMERGING"]:
                        growing_trends.append((r_item, cat, sig))

            growing_trends.sort(key=lambda x: x[2].percentage_change, reverse=True)
            top_trends = growing_trends[:4]

            lines = ["### Civic Demand Momentum & Trend Intelligence\n"]
            lines.append(f"**Total Ingested Signals**: {summary.total_requests:,} citizen requests across 7 languages.\n")
            lines.append("#### Fastest Growing Sector Demands:\n")
            for idx, (reg_item, cat_item, sig) in enumerate(top_trends, 1):
                cat_disp = get_category_display_name(cat_item)
                lines.append(
                    f"{idx}. **{reg_item.district_city} — {cat_disp}**\n"
                    f"   - **Trend Velocity**: `{sig.trend}` (+{sig.percentage_change:.1f}% surge)\n"
                    f"   - **Recent Window Signals**: {sig.recent_window_count} requests\n"
                    f"   - **Momentum Score**: {sig.momentum_score:.1f}/100\n"
                )

            lines.append("\n### Evidence used:")
            lines.append(f"• Total Active Signals: {summary.total_requests}")
            lines.append(f"• Highest Demand Sector: {max(summary.category_distribution.items(), key=lambda x: x[1])[0].title()}")

            grounded_context = "\n".join(lines)
            evidence_list = [
                CopilotEvidenceRef(title=f"{reg.district_city} {cat.title()}", metric="Trend", value=f"+{sig.percentage_change:.1f}%")
                for reg, cat, sig in top_trends[:3]
            ]
            action_link = CopilotActionLink(label="View Demand Intelligence", action_type="navigate", target="/demand")
            suggested_actions = ["Show top 5 priorities", "Which region has highest infrastructure deficit?", "What happens if we allocate $15M?"]

        # Intent G: REGION SUMMARY / GENERAL REGION QUERY
        elif region or (context and context.region_id):
            target_reg = region or next((r for r in regions if r.id == context.region_id), regions[0])
            reg_recs = [r for r in all_recs if r.region_id == target_reg.id]
            reg_inds = [i for i in indicators if i.region_id == target_reg.id]
            reg_reqs = [r for r in requests if r.region_id == target_reg.id]

            top_reg_rec = reg_recs[0] if reg_recs else all_recs[0]
            cat_disp = get_category_display_name(top_reg_rec.category)

            grounded_context = f"""### Regional Intelligence Summary: {target_reg.district_city}, {target_reg.country}

**Demographics**: Population {target_reg.population:,} | Density {target_reg.population_density or 0:,.0f}/km² | Primary Language: {target_reg.primary_language.upper()}
**Vulnerability Index**: {target_reg.vulnerability_index:.2f} (0=Low, 1=High Risk)

#### Key Infrastructure Deficits
- **Highest Priority Sector**: **{cat_disp}** (Priority Score: `{top_reg_rec.priority_score:.1f}/100`, Level: `{top_reg_rec.priority_level}`)
- **Logged Citizen Signals**: {len(reg_reqs)} direct requests
- **Assessed Indicators**: {len(reg_inds)} sector indicators

#### Recommended Executive Action
{top_reg_rec.recommended_action}

### Evidence used:
• Population Impact: ~{int(target_reg.population * 0.25):,} residents
• Vulnerability Index: {target_reg.vulnerability_index:.2f}
• Infrastructure Deficit Score: {top_reg_rec.priority_score:.1f}/100
"""
            evidence_list = [
                CopilotEvidenceRef(title="Population", metric="Count", value=f"{target_reg.population:,}"),
                CopilotEvidenceRef(title="Vulnerability Index", metric="Index", value=f"{target_reg.vulnerability_index:.2f}"),
                CopilotEvidenceRef(title="Top Priority", metric="Sector", value=cat_disp),
            ]
            action_link = CopilotActionLink(label="View Region Recommendations", action_type="navigate", target="/recommendations")
            suggested_actions = [f"Why is {target_reg.district_city} ranked high?", f"What happens if we allocate $15M to {cat_disp.lower()}?", "Show projects with funding gaps"]

        # Intent H: UNANSWERABLE / OUT OF BOUNDS QUERY
        elif any(w in lower_msg for w in ["who is", "weather", "recipe", "game", "movie", "joke", "code", "python", "javascript", "capital of"]):
            return CopilotChatResponse(
                success=True,
                message="I don't have enough verified CivicPulse data to answer that out-of-scope query. I am specialized in analyzing citizen demand signals, infrastructure deficits, priority recommendations, capital investments, and counterfactual scenario simulations for BRICS regions.",
                ai_provider=ai_provider_name,
                grounded=True,
                evidence=[],
                suggested_actions=["Which civic problem needs attention most urgently?", "Why is Vijayawada a high-priority region?", "Which projects have funding gaps?"],
            )

        # DEFAULT FALLBACK: Provide rich platform knowledge base to Gemini LLM for natural, conversational AI responses
        else:
            top_rec = all_recs[0]
            cat_disp = get_category_display_name(top_rec.category)
            grounded_context = f"""### System Knowledge Base Context for CivicPulse AI:

1. **Platform Purpose**: CivicPulse AI is an intelligent civic demand and infrastructure cockpit that ingests citizen complaints, measures per-capita infrastructure deficits, and prioritizes capital investments across 35 BRICS districts.

2. **How Citizens & Users Raise Problems or Log Complaints**:
   - Navigate to '/data' (Data Explorer) or '/demand' (Demand Intelligence).
   - Use the **Citizen Voice Composer** panel to type feedback or record voice notes in 7 languages (Hindi, Telugu, Marathi, Bengali, Portuguese, Zulu, English).
   - Select channel (Web/Voice Note/App/SMS) and location, then click "Analyze Civic Signal" -> "Add Signal".
   - The Gemini AI NLP Engine classifies sector, assigns urgency (CRITICAL/HIGH/MEDIUM/LOW), normalizes text into English, and updates regional per-capita demand indices in real time.

3. **Live System Snapshot**:
   - Monitored Regions: {len(regions)} BRICS Districts (including Kanpur South Belt, Vijayawada, Pune, eThekwini/Durban, Salvador, Ekurhuleni, Rio).
   - Top Priority Region: {top_rec.region_name} ({cat_disp}) — Priority Score `{top_rec.priority_score:.1f}/100` ({top_rec.priority_level}).
   - Active Citizen Demands: {len(requests):,} multilingual feedback entries.
   - Assessed Capital Projects: {len(investments)} public investment initiatives.

4. **Available Platform Views & Tools**:
   - Top Priority Projects ('/recommendations'): 8-factor deterministic priority ranking.
   - What-If Scenario Lab ('/scenarios'): Simulate $15M+ budget allocations to calculate projected beneficiary counts and gap reductions.
   - Infrastructure Shortfalls ('/gaps'): Sector-by-sector operational capacity deficit matrix.
   - Community Feedback Wall ('/feedback'): Verified public community comments.

### Instructions for AI Response:
Answer the user's input directly, warmly, and conversationally based on the knowledge base above. If the user asks how to raise a problem, report an issue, or ask a question, provide clear, step-by-step guidance!
"""
            evidence_list = [
                CopilotEvidenceRef(title="Monitored Regions", metric="Count", value=str(len(regions))),
                CopilotEvidenceRef(title="Active Signals", metric="Count", value=str(len(requests))),
            ]
            action_link = CopilotActionLink(label="Open Data Explorer to Raise Problem", action_type="navigate", target="/data")
            suggested_actions = ["How to post a complaint or submit a civic signal?", "Which civic problem needs attention most urgently?", "What happens if we allocate $15M to healthcare?"]

        # 3. Call AI Provider for final polished grounded response
        ai_provider = get_ai_service()
        history_dicts = [{"role": m.role, "content": m.content} for m in request.history]
        final_message = await ai_provider.generate_copilot_response(
            user_message=sanitized_msg,
            grounded_context=grounded_context,
            conversation_history=history_dicts,
        )

        return CopilotChatResponse(
            success=True,
            message=final_message,
            ai_provider=ai_provider_name,
            grounded=True,
            evidence=evidence_list,
            suggested_actions=suggested_actions,
            action_link=action_link,
        )


copilot_service = CopilotService()
