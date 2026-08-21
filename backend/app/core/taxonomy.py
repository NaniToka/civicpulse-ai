from enum import Enum

from pydantic import BaseModel


class CivicIntent(str, Enum):
    REQUEST_NEW_INFRASTRUCTURE = "request_new_infrastructure"
    REQUEST_IMPROVEMENT = "request_improvement"
    REPORT_SERVICE_GAP = "report_service_gap"
    REPORT_ACCESSIBILITY_ISSUE = "report_accessibility_issue"
    REPORT_OUTAGE = "report_outage"
    REQUEST_EXPANSION = "request_expansion"
    REQUEST_MAINTENANCE = "request_maintenance"
    REQUEST_EMERGENCY_SUPPORT = "request_emergency_support"
    GENERAL_FEEDBACK = "general_feedback"
    UNKNOWN = "unknown"


class CivicCategory(BaseModel):
    key: str
    display_name: str
    description: str
    aliases: list[str] = []


CIVIC_TAXONOMY: dict[str, CivicCategory] = {
    "healthcare": CivicCategory(
        key="healthcare",
        display_name="Healthcare",
        description="Hospitals, clinics, medical supply, doctor density, maternal & child healthcare services",
        aliases=["health", "hospital", "clinic", "medical", "Healthcare & Sanitation", "healthcare_and_sanitation", "Healthcare"]
    ),
    "education": CivicCategory(
        key="education",
        display_name="Education",
        description="Schools, primary/secondary education capacity, teacher density, digital learning access",
        aliases=["school", "college", "teachers", "learning", "classroom", "Education"]
    ),
    "transportation": CivicCategory(
        key="transportation",
        display_name="Transportation",
        description="Public transit, buses, trains, commuter transit coverage, traffic management",
        aliases=["transit", "bus", "train", "metro", "Public Transit & Roads", "public_transit", "Transportation"]
    ),
    "roads": CivicCategory(
        key="roads",
        display_name="Roads & Bridges",
        description="Road quality, street paving, pothole repairs, bridges, highway connectivity",
        aliases=["road", "pavement", "bridge", "highway", "street", "Roads & Bridges"]
    ),
    "water": CivicCategory(
        key="water",
        display_name="Clean Water",
        description="Clean drinking water supply, pipeline reliability, water treatment, reservoir capacity",
        aliases=["clean_water", "drinking_water", "water_supply", "Clean Water & Sanitation", "water_and_sanitation", "Clean Water"]
    ),
    "sanitation": CivicCategory(
        key="sanitation",
        display_name="Sanitation & Drainage",
        description="Sewage management, wastewater treatment, stormwater drainage, public latrines",
        aliases=["sewage", "drainage", "wastewater", "latrine", "sewer", "Sanitation & Drainage"]
    ),
    "electricity": CivicCategory(
        key="electricity",
        display_name="Electricity & Power",
        description="Power grid reliability, rural electrification, transformer capacity, renewable energy",
        aliases=["power", "grid", "outage", "energy", "Clean Energy & Grid Resilience", "electricity_and_power", "Electricity & Power"]
    ),
    "digital_connectivity": CivicCategory(
        key="digital_connectivity",
        display_name="Digital Connectivity",
        description="Broadband coverage, mobile cellular reception, fiber networks, public Wi-Fi access",
        aliases=["digital", "internet", "broadband", "cellular", "telecom", "Digital Infrastructure", "Digital Connectivity"]
    ),
    "public_safety": CivicCategory(
        key="public_safety",
        display_name="Public Safety",
        description="Street lighting, emergency response services, community policing, crime prevention",
        aliases=["safety", "police", "lighting", "security", "emergency", "Public Safety"]
    ),
    "housing": CivicCategory(
        key="housing",
        display_name="Housing & Shelter",
        description="Affordable housing, slum rehabilitation, urban shelter stability",
        aliases=["shelter", "slum", "residential", "housing_rehab", "Housing & Shelter"]
    ),
    "environment": CivicCategory(
        key="environment",
        display_name="Environment & Parks",
        description="Air quality monitoring, urban green spaces, pollution control, flood protection",
        aliases=["park", "pollution", "air_quality", "green_space", "climate", "Environment & Parks"]
    ),
    "waste_management": CivicCategory(
        key="waste_management",
        display_name="Waste Management",
        description="Municipal solid waste collection, recycling facilities, landfill management",
        aliases=["garbage", "trash", "waste", "rubbish", "recycling", "Waste Management"]
    ),
    "public_services": CivicCategory(
        key="public_services",
        display_name="Public Services",
        description="Civic registration, administrative offices, community centers, public documentation",
        aliases=["civic_center", "government_office", "admin_services", "Public Services"]
    ),
    "accessibility": CivicCategory(
        key="accessibility",
        display_name="Accessibility",
        description="Disability access ramps, tactile paving, inclusive public facilities",
        aliases=["disability", "wheelchair", "ramps", "inclusive_access", "Accessibility"]
    ),
    "other": CivicCategory(
        key="other",
        display_name="Other Civic Need",
        description="Unclassified or miscellaneous citizen infrastructure requests",
        aliases=["general", "General Infrastructure", "miscellaneous", "Other Civic Need"]
    ),
}


def get_all_categories() -> list[CivicCategory]:
    """Returns list of all controlled taxonomy categories."""
    return list(CIVIC_TAXONOMY.values())


def normalize_category(input_str: str) -> str:
    """
    Normalizes any category key or alias string to a canonical taxonomy key.
    If no match is found, defaults to 'other'.
    """
    if not input_str:
        return "other"

    cleaned = input_str.strip().lower()

    # Exact key match
    if cleaned in CIVIC_TAXONOMY:
        return cleaned

    # Alias or exact display name match
    for key, category in CIVIC_TAXONOMY.items():
        if cleaned == category.display_name.lower():
            return key
        for alias in category.aliases:
            if cleaned == alias.lower():
                return key

    # Substring keyword heuristics for multilingual inputs (Hindi, Marathi, Telugu, Portuguese, Zulu, Bengali, English)
    electricity_kw = ["electricity", "power", "grid", "outage", "energy", "बिजली", "कटौती", "जनरेटर", "luz", "ogesi", "light", "విద్యుత్", "కరెంట్"]
    healthcare_kw = ["healthcare", "health", "hospital", "clinic", "medic", "अस्पताल", "स्वास्थ्य", "डॉक्टर", "médico", "imithi", "doctor", "হাসপাতাল", "ఆసుపత్రి", "వైద్యం"]
    environment_kw = ["environment", "pollution", "air quality", "green space", "प्रदूषण", "पर्यावरण", "प्रदुषण", "दूषित"]
    water_kw = ["water", "drinking_water", "pipe", "aqua", "पानी", "पाणी", "पेयजल", "जल आपूर्ति", "água", "amanzi", "clean water", "నీరు", "తాగునీరు", "పైప్‌లైన్"]
    sanitation_kw = ["sewer", "sewage", "esgoto", "sanitat", "drain", "latrine", "waste water", "मुరుగునీరు", "नाला", "सफाई"]
    education_kw = ["school", "educat", "teach", "class", "स्कूल", "पढ़ाई", "छात्र", "विद्यार्थी", "বিদ্যালয়", "పాఠశాల", "బడి"]
    roads_kw = ["road", "pave", "street", "bridge", "highway", "मार्ग", "सड़क", "खड्डों", "pothole", "రోడ్డు", "రహదారి"]
    transportation_kw = ["transit", "bus", "train", "transport", "commute", "metro", "बस", "यातायात", "రవాణా", "బస్సు"]
    digital_kw = ["internet", "broadband", "wifi", "telecom", "digital", "इंटरनेट", "कनेक्शन", "संयोग", "सेलुलर", "ইন্টারনেট", "ఇంటర్నెట్", "నెట్‌వర్క్"]
    waste_kw = ["waste", "trash", "garbage", "rubbish", "landfill", "recycling", "कचरा", "गंदगी", "చెత్త"]
    safety_kw = ["police", "safety", "crime", "lighting", "security", "सुरक्षा", "पुलिस", "रक्षण"]

    if any(w in cleaned for w in electricity_kw):
        return "electricity"
    if any(w in cleaned for w in healthcare_kw):
        return "healthcare"
    if any(w in cleaned for w in environment_kw):
        return "environment"
    if any(w in cleaned for w in water_kw):
        return "water"
    if any(w in cleaned for w in sanitation_kw):
        return "sanitation"
    if any(w in cleaned for w in education_kw):
        return "education"
    if any(w in cleaned for w in roads_kw):
        return "roads"
    if any(w in cleaned for w in transportation_kw):
        return "transportation"
    if any(w in cleaned for w in digital_kw):
        return "digital_connectivity"
    if any(w in cleaned for w in waste_kw):
        return "waste_management"
    if any(w in cleaned for w in safety_kw):
        return "public_safety"

    return "other"


def get_category_display_name(key_or_alias: str) -> str:
    """Returns canonical display name for a given category key or alias."""
    canonical_key = normalize_category(key_or_alias)
    return CIVIC_TAXONOMY[canonical_key].display_name
