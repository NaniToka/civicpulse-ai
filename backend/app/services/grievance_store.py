"""
grievance_store.py
──────────────────
Thread-safe in-memory grievance store for the Anti-Fake Closure feature.

In a production deployment this would be replaced by a PostgreSQL/SQLite
repository layer (via SQLAlchemy or Tortoise-ORM). The interface is kept
deliberately thin so swapping to a real DB requires only implementing the
same methods backed by SQL queries.
"""

from __future__ import annotations

import threading
import uuid
from datetime import datetime, timezone

from app.models.schemas import GrievanceRecord, GrievanceStatusEnum

_lock = threading.Lock()
_store: dict[str, GrievanceRecord] = {}  # grievance_id -> GrievanceRecord


def create_grievance(
    citizen_request_id: str,
    region_id: str,
    citizen_name: str = "Anonymous Citizen",
    citizen_user_id: str | None = None,
) -> GrievanceRecord:
    """
    Bootstrap a new GrievanceRecord from an existing CitizenRequest.
    Call this when a citizen first submits a complaint so the grievance
    lifecycle tracking starts at OPEN.
    """
    grievance = GrievanceRecord(
        id=f"GRV-{uuid.uuid4().hex[:8].upper()}",
        citizen_request_id=citizen_request_id,
        region_id=region_id,
        citizen_user_id=citizen_user_id,
        citizen_name=citizen_name,
        status=GrievanceStatusEnum.OPEN,
    )
    with _lock:
        _store[grievance.id] = grievance
    return grievance


def get_grievance(grievance_id: str) -> GrievanceRecord | None:
    with _lock:
        return _store.get(grievance_id)


def get_grievance_by_request_id(citizen_request_id: str) -> GrievanceRecord | None:
    with _lock:
        return next(
            (g for g in _store.values() if g.citizen_request_id == citizen_request_id),
            None,
        )


def list_grievances(
    status: GrievanceStatusEnum | None = None,
    region_id: str | None = None,
) -> list[GrievanceRecord]:
    with _lock:
        records = list(_store.values())
    if status:
        records = [r for r in records if r.status == status]
    if region_id:
        records = [r for r in records if r.region_id == region_id]
    return sorted(records, key=lambda r: r.updated_at, reverse=True)


def update_grievance(grievance: GrievanceRecord) -> GrievanceRecord:
    """Persist an updated grievance record (upsert by id)."""
    grievance.updated_at = datetime.now(timezone.utc)
    with _lock:
        _store[grievance.id] = grievance
    return grievance


def _seed_demo_grievances() -> None:
    """
    Seeds realistic demo grievances so the UI has data to display on first load.
    These cover all lifecycle states to demonstrate the full state machine.
    """
    from datetime import timedelta
    from app.models.schemas import GrievanceResolutionEvidence

    now = datetime.now(timezone.utc)

    demo_records = [
        # 1 — Open complaint
        GrievanceRecord(
            id="GRV-DEMO-0001",
            citizen_request_id="REQ-DEMO-WTR-001",
            region_id="REG-IND-UP-KANP-02",
            citizen_name="Rajesh Kumar",
            citizen_user_id="user_demo_1",
            status=GrievanceStatusEnum.OPEN,
            created_at=now - timedelta(days=5),
            updated_at=now - timedelta(days=5),
            is_demo=True,
        ),
        # 2 — Pending verification (citizen needs to confirm)
        GrievanceRecord(
            id="GRV-DEMO-0002",
            citizen_request_id="REQ-DEMO-RD-002",
            region_id="REG-IND-MH-PUNE-01",
            citizen_name="Priya Sharma",
            citizen_user_id="user_demo_2",
            status=GrievanceStatusEnum.RESOLVED_PENDING_VERIFICATION,
            resolution_evidence=GrievanceResolutionEvidence(
                original_description="Large pothole on MG Road causing accidents to two-wheelers daily.",
                original_category="roads",
                original_urgency="HIGH",
                original_submitted_at=now - timedelta(days=10),
                resolution_notes=(
                    "Pothole on MG Road has been filled with bituminous concrete mix. "
                    "Road surface leveled and reflective markers installed on both sides. "
                    "Work completed by Public Works Department on 28-Sep-2026."
                ),
                resolved_by_staff_id="STAFF-PWD-MH-042",
                resolved_by_staff_name="Er. Sanjay Patil (PWD Maharashtra)",
                resolution_submitted_at=now - timedelta(days=1),
            ),
            created_at=now - timedelta(days=10),
            updated_at=now - timedelta(days=1),
            is_demo=True,
        ),
        # 3 — Verified closed (success path)
        GrievanceRecord(
            id="GRV-DEMO-0003",
            citizen_request_id="REQ-DEMO-WTR-003",
            region_id="REG-IND-AP-VIZ-03",
            citizen_name="Lakshmi Devi",
            citizen_user_id="user_demo_3",
            status=GrievanceStatusEnum.VERIFIED_CLOSED,
            resolution_evidence=GrievanceResolutionEvidence(
                original_description="Broken municipal water pipeline on Krishna Colony causing no water supply for 3 days.",
                original_category="water",
                original_urgency="CRITICAL",
                original_submitted_at=now - timedelta(days=15),
                resolution_notes=(
                    "Burst pipeline section (200mm dia) replaced with new GI pipe over 45 metres. "
                    "Water supply restored to Krishna Colony. Pressure testing completed successfully. "
                    "GWMC crew completed repairs on 25-Sep-2026."
                ),
                resolved_by_staff_id="STAFF-GWMC-AP-007",
                resolved_by_staff_name="Er. Ramana Rao (GWMC Vizag)",
                resolution_submitted_at=now - timedelta(days=3),
            ),
            ai_confidence_score=87.5,
            ai_validation_notes=(
                "High-confidence genuine resolution. Staff notes specifically address the water pipeline "
                "category, include repair dimensions, and reference the original locality. Photographic "
                "evidence strongly corroborates the closure claim."
            ),
            verified_at=now - timedelta(days=2),
            created_at=now - timedelta(days=15),
            updated_at=now - timedelta(days=2),
            is_demo=True,
        ),
        # 4 — Rejected/Reopened (citizen dispute path)
        GrievanceRecord(
            id="GRV-DEMO-0004",
            citizen_request_id="REQ-DEMO-ELC-004",
            region_id="REG-IND-UP-KANP-02",
            citizen_name="Mohammed Aslam",
            citizen_user_id="user_demo_4",
            status=GrievanceStatusEnum.REJECTED_REOPENED,
            resolution_evidence=GrievanceResolutionEvidence(
                original_description="Power outages daily 4-8 hours in Kidwai Nagar area. Transformers overloaded.",
                original_category="electricity",
                original_urgency="HIGH",
                original_submitted_at=now - timedelta(days=20),
                resolution_notes="Issue resolved.",
                resolved_by_staff_id="STAFF-UPPCL-001",
                resolved_by_staff_name="UPPCL Field Officer",
                resolution_submitted_at=now - timedelta(days=4),
            ),
            ai_confidence_score=31.0,
            ai_validation_notes=(
                "Suspicious closure flagged. Resolution note is a generic one-word phrase 'Issue resolved' "
                "with no specific action taken, no mention of transformer repair or load balancing, "
                "and no after-image submitted. This does not address the reported electricity outage."
            ),
            citizen_feedback=(
                "The power cuts are still happening! Nothing was actually fixed. The transformer on "
                "Block C is still sparking. Please reopen this complaint."
            ),
            created_at=now - timedelta(days=20),
            updated_at=now - timedelta(days=3),
            is_demo=True,
        ),
        # 5 — Suspicious Closure (AI-flagged, awaiting citizen decision)
        GrievanceRecord(
            id="GRV-DEMO-0005",
            citizen_request_id="REQ-DEMO-SAN-005",
            region_id="REG-IND-WB-KOLKATA-04",
            citizen_name="Anita Ghosh",
            citizen_user_id="user_demo_5",
            status=GrievanceStatusEnum.SUSPICIOUS_CLOSURE,
            resolution_evidence=GrievanceResolutionEvidence(
                original_description="Open sewer drain outside Dum Dum market causing disease outbreak risk.",
                original_category="sanitation",
                original_urgency="CRITICAL",
                original_submitted_at=now - timedelta(days=8),
                resolution_notes="Drain work done.",
                resolved_by_staff_id="STAFF-KMC-SAN-018",
                resolved_by_staff_name="KMC Sanitation Dept",
                resolution_submitted_at=now - timedelta(hours=6),
            ),
            ai_confidence_score=42.0,
            ai_validation_notes=(
                "Suspicious closure detected. Notes are too brief ('Drain work done' — 15 chars), "
                "no specific action described, no after-image provided. "
                "Citizen verification is required before permanent closure."
            ),
            created_at=now - timedelta(days=8),
            updated_at=now - timedelta(hours=6),
            is_demo=True,
        ),
    ]

    with _lock:
        for record in demo_records:
            _store[record.id] = record


# Seed demo data on module import
_seed_demo_grievances()
