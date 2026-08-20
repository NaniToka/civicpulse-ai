from abc import ABC, abstractmethod
import json
import logging
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.security import sanitize_input_text

logger = logging.getLogger("civicpulse.ai_service")


class BaseAIService(ABC):
    """Abstract Base Class for Multilingual Citizen Intelligence AI Provider."""

    @abstractmethod
    async def process_citizen_text(self, text: str, language_hint: str = "auto") -> Dict[str, Any]:
        """
        Translates, classifies, and extracts entities from unstructured citizen input.
        Must return a dictionary matching:
        {
          "translated_text": str,
          "detected_language": str,
          "category": str,
          "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
          "impacted_count": int,
          "location": str,
          "confidence": float
        }
        """
        pass

    @abstractmethod
    async def generate_recommendation_reasoning(
        self,
        region_name: str,
        category: str,
        priority_score: float,
        evidence_summary: str
    ) -> str:
        """Generates plain-language explainable reasoning for policymaker evidence cards."""
        pass


class FallbackAIService(BaseAIService):
    """Rule-based heuristic fallback AI service when Gemini API key is absent or offline."""

    async def process_citizen_text(self, text: str, language_hint: str = "auto") -> Dict[str, Any]:
        cleaned = sanitize_input_text(text)
        lower_text = cleaned.lower()

        # Heuristic Category Classification
        category = "General Infrastructure"
        if any(w in lower_text for w in ["water", "pipe", "sewage", "drain", "पानी", "esgoto", "água"]):
            category = "Clean Water & Sanitation"
        elif any(w in lower_text for w in ["power", "electricity", "grid", "Outage", "बिजली", "luz", "ogesi"]):
            category = "Clean Energy & Grid Resilience"
        elif any(w in lower_text for w in ["health", "hospital", "clinic", "doctor", "अस्पताल", "médico", "imithi"]):
            category = "Healthcare & Sanitation"
        elif any(w in lower_text for w in ["road", "transit", "bus", "train", "traffic", "मार्ग"]):
            category = "Public Transit & Roads"
        elif any(w in lower_text for w in ["internet", "broadband", "digital", "network"]):
            category = "Digital Infrastructure"

        # Heuristic Severity & Impact Estimation
        severity = "MEDIUM"
        impacted_count = 500
        if any(w in lower_text for w in ["critical", "emergency", "week", "dying", "failing", "फूटली"]):
            severity = "CRITICAL"
            impacted_count = 5000
        elif any(w in lower_text for w in ["daily", "daily outage", "broken", "disrupted"]):
            severity = "HIGH"
            impacted_count = 2500

        return {
            "translated_text": f"[Analyzed via Graceful Fallback] {cleaned}",
            "detected_language": language_hint if language_hint != "auto" else "en",
            "category": category,
            "severity": severity,
            "impacted_count": impacted_count,
            "location": "Extracted Regional Hotspot",
            "confidence": 0.88,
        }

    async def generate_recommendation_reasoning(
        self,
        region_name: str,
        category: str,
        priority_score: float,
        evidence_summary: str
    ) -> str:
        return (
            f"Based on aggregated citizen demand signals and deficit indexing, {region_name} exhibits a critical "
            f"infrastructure deficit in '{category}' (Priority Score: {priority_score:.1f}/100). "
            f"Key factors include: {evidence_summary}. Immediate capital investment is strongly recommended."
        )


class GeminiAIService(BaseAIService):
    """Google Gemini AI implementation using official google-genai SDK."""

    def __init__(self, api_key: str, model_name: str):
        self.api_key = api_key
        self.model_name = model_name
        self.fallback = FallbackAIService()
        self._client = None
        try:
            from google import genai
            self._client = genai.Client(api_key=api_key)
        except Exception as e:
            logger.warning(f"Failed to initialize Gemini Client: {e}. Falling back.")

    async def process_citizen_text(self, text: str, language_hint: str = "auto") -> Dict[str, Any]:
        if not self._client:
            return await self.fallback.process_citizen_text(text, language_hint)

        cleaned = sanitize_input_text(text)
        prompt = f"""
You are the Multilingual NLP Engine for CivicPulse AI. Analyze the following citizen input text:
"{cleaned}"

Return a valid JSON object with EXACTLY these keys:
{{
  "translated_text": "English translation of citizen text",
  "detected_language": "BCP-47 code or name",
  "category": "One of: ['Clean Water & Sanitation', 'Clean Energy & Grid Resilience', 'Healthcare & Sanitation', 'Public Transit & Roads', 'Digital Infrastructure']",
  "severity": "One of: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']",
  "impacted_count": estimated integer count of impacted citizens (default 100),
  "location": "Extracted landmark or neighborhood name",
  "confidence": float between 0.0 and 1.0
}}
Return JSON only. No markdown formatting around JSON.
"""
        try:
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            raw_json = response.text.strip()
            if raw_json.startswith("```json"):
                raw_json = raw_json.strip("```json").strip("```")
            data = json.loads(raw_json)
            return data
        except Exception as err:
            logger.error(f"Gemini API invocation error: {err}. Falling back.")
            return await self.fallback.process_citizen_text(text, language_hint)

    async def generate_recommendation_reasoning(
        self,
        region_name: str,
        category: str,
        priority_score: float,
        evidence_summary: str
    ) -> str:
        if not self._client:
            return await self.fallback.generate_recommendation_reasoning(region_name, category, priority_score, evidence_summary)

        prompt = f"""
You are an executive civic infrastructure AI advisor for BRICS policymakers.
Draft a 2-sentence explainable reasoning statement for why the following project should be prioritized:

Region: {region_name}
Category: {category}
Priority Score: {priority_score:.1f} / 100
Evidence Summary: {evidence_summary}

Be clear, factual, objective, and executive-level.
"""
        try:
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            return response.text.strip()
        except Exception as err:
            logger.error(f"Gemini API error: {err}. Falling back.")
            return await self.fallback.generate_recommendation_reasoning(region_name, category, priority_score, evidence_summary)


def get_ai_service() -> BaseAIService:
    """Factory method to get active AI service provider."""
    if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip():
        logger.info("Initializing GeminiAIService provider.")
        return GeminiAIService(api_key=settings.GEMINI_API_KEY.strip(), model_name=settings.GEMINI_MODEL_NAME)
    else:
        logger.info("GEMINI_API_KEY unconfigured. Using FallbackAIService provider.")
        return FallbackAIService()
