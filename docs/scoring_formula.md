# CivicPulse AI Priority Scoring Engine Formula

To prevent "hallucinated" project priorities or opaque black-box recommendations, CivicPulse AI enforces a transparent, reproducible, and configurable mathematical scoring formula.

## The Formula

The **Priority Score** for a given infrastructure category in a specific region is calculated as:

$$\text{Priority Score} = \min\left(100, \max\left(0, \text{Base Score} - \text{Risk Penalties}\right)\right)$$

### 1. Base Score Components
$$\text{Base Score} = (w_1 \cdot D_s) + (w_2 \cdot G_i) + (w_3 \cdot P_m) + (w_4 \cdot V_d) + (w_5 \cdot U_r)$$

Where:
* $D_s$ = **Citizen Demand Signal Volume** (0-100 normalized score derived from complaint volume & severity weighting). Default weight $w_1 = 0.30$.
* $G_i$ = **Infrastructure Deficit Index** ($100 \times \text{gap\_score}$, where $1.0$ is maximum deficit). Default weight $w_2 = 0.25$.
* $P_m$ = **Population Impact Multiplier** (Log-scaled population size normalized to 0-100). Default weight $w_3 = 0.15$.
* $V_d$ = **Demographic Need / Vulnerability Index** ($100 \times \text{vulnerability\_index}$). Default weight $w_4 = 0.15$.
* $U_r$ = **Urgency / Critical Incident Index** (Derived from NLP severity tags: `CRITICAL`=100, `HIGH`=70, `MEDIUM`=40, `LOW`=10). Default weight $w_5 = 0.15$.

Total positive weight sum: $0.30 + 0.25 + 0.15 + 0.15 + 0.15 = 1.00$.

### 2. Risk Penalties & Modifiers

$$\text{Risk Penalties} = (\text{Penalty}_{\text{coverage}}) + (\text{Penalty}_{\text{duplicate}})$$

Where:
* $\text{Penalty}_{\text{coverage}}$ = Penalizes regions with existing high coverage: $0.25 \times \text{coverage\_ratio\_pct}$.
* $\text{Penalty}_{\text{duplicate}}$ = Deducts score if active funding already exists for the sector in that region (Status: `IN_PROGRESS` -> -25 pts, `APPROVED` -> -15 pts).

## Explainability Assurance
Every priority score calculation outputs an explicit **Evidence Card** detailing:
* Breakdown of each sub-score contribution.
* List of underlying citizen requests.
* Specific infrastructure baseline metrics.
* Existing public investment project status.
