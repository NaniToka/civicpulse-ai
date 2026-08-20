# CivicPulse AI — Hackathon Submission Project Summary

**Project Name**: CivicPulse AI  
**Track**: Track 1 — AI for Digital Public Infrastructure & Governance (BRICS Nations)  
**Version**: 0.5.0  
**License**: MIT License  

---

## 🎯 Executive Summary
Across BRICS nations and developing economies, millions of citizen voices—spoken in Hindi, Telugu, Zulu, Portuguese, Marathi, Bengali, or English—are processed in isolated administrative complaint silos. Governments spend billions on infrastructure without real-time, per-capita demand visibility.

**CivicPulse AI** is an open-source Digital Public Good that transforms unstructured multilingual citizen feedback into evidence-driven capital investment priorities. By cross-referencing per-capita demand hotspots with census vulnerability indices, infrastructure capacity gap scores, and active capital project alignment, CivicPulse generates traceable 6-step evidence trails for public policymakers.

---

## 🚀 Key Innovations
1. **Multilingual Voice Signal Ingestion**: Script-aware Unicode language detector supporting Telugu (`te`), Hindi (`hi`), Marathi (`mr`), Bengali (`bn`), Portuguese (`pt`), Zulu (`zu`), and English (`en`).
2. **Deterministic Priority Scoring Engine V2**: 8-factor mathematical model ($w_d=0.20, w_m=0.10, w_g=0.20, w_p=0.15, w_v=0.15, w_u=0.10, w_a=0.05, w_e=0.05$).
3. **Traceable 6-Step Evidence Trail ("Show Your Work")**: Complete transparency linking citizen voices down to capital project alignment.
4. **Multilingual AI Decision Briefs**: Language selector (**EN / HI / TE**) on evidence trail modals.
5. **Counterfactual Scenario Lab**: Simulator allowing policymakers to test budget allocations ($1M to $50M USD) with score deltas and beneficiary projections.
6. **Responsible AI Boundary**: LLM processes language; deterministic Python code computes decisions. Prompt injection defense and 1-time validation retry.
