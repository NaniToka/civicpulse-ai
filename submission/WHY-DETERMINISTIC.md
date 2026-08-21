# CivicPulse AI — Why Deterministic Scoring?

---

## ⚖️ The Public Governance Mandate for Deterministic Logic

Public capital spending decisions require **absolute repeatability, mathematical auditability, and total transparency**. Forcing governments to spend millions of dollars based on non-deterministic LLM prompt outputs is dangerous and unacceptable in public administration.

---

## 📊 Priority Scoring Engine V2 Formula

Recommendations are ranked using an 8-factor weighted mathematical formula:

$$\text{Base Score} = (0.20 \cdot D_s) + (0.10 \cdot M_v) + (0.20 \cdot G_i) + (0.15 \cdot P_m) + (0.15 \cdot V_d) + (0.10 \cdot U_r) + (0.05 \cdot A_s) + (0.05 \cdot E_q)$$

| Factor | Name | Weight | Mathematical Definition |
| :--- | :--- | :---: | :--- |
| **$D_s$** | Demand Density | **20%** | Normalized request volume per 100,000 district residents. |
| **$M_v$** | Demand Acceleration | **10%** | 30-day temporal request velocity trend. |
| **$G_i$** | Infrastructure Deficit | **20%** | Operational capacity gap score ($0.00 \text{ to } 1.00$). |
| **$P_m$** | Population Scale | **15%** | Total resident population served. |
| **$V_d$** | Census Vulnerability | **15%** | Census demographic vulnerability index. |
| **$U_r$** | Signal Urgency | **10%** | Extracted severity rating (Critical, High, Medium, Low). |
| **$A_s$** | Investment Overlap | **5%** | Active project penalty (-15.0 pts) / delayed project boost (+10.0 pts). |
| **$E_q$** | Regional Equity | **5%** | Cross-district resource distribution balance. |

---

## 🎯 Key Benefits of Deterministic Scoring
1. **Mathematical Auditability**: Public works directors can verify every score down to raw factor inputs.
2. **Deterministic Repeatability**: Two identical demand profiles always produce the exact same priority rank.
3. **Counterfactual Simulation**: Enables the Scenario Lab to project exact score deltas (`-18.5 pts`) for budget allocations.
