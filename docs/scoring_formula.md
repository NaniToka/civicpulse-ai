# CivicPulse AI Priority Scoring & Hotspot Formula Specification

To prevent "hallucinated" project priorities or opaque black-box recommendations, CivicPulse AI enforces transparent, reproducible, and configurable mathematical formulas.

---

## 1. Demand Hotspot Formula

The **Hotspot Score** evaluates per-capita complaint density alongside infrastructure deficits:

$$\text{Per-Capita Demand Signal} = \min\left(100, \frac{\text{Weighted Demand}}{\text{Population}} \times 100,000\right)$$

$$\text{Hotspot Score} = (0.40 \times \text{Per-Capita Demand Signal}) + (0.30 \times \text{Deficit Score}) + (0.15 \times \text{Urgency Score}) + (0.15 \times \text{Vulnerability Score})$$

Where:
- $\text{Weighted Demand} = \sum \text{SeverityWeight}(\text{request}_i)$ (`CRITICAL`=5.0, `HIGH`=3.5, `MEDIUM`=2.0, `LOW`=1.0)
- $\text{Deficit Score} = 100 \times \text{gap\_score}$
- $\text{Vulnerability Score} = 100 \times \text{vulnerability\_index}$

---

## 2. Infrastructure Priority Score Formula

$$\text{Priority Score} = \min\left(100, \max\left(0, \text{Base Score} - \text{Risk Penalties}\right)\right)$$

### Base Weighted Score Components
$$\text{Base Score} = (w_1 \cdot D_s) + (w_2 \cdot G_i) + (w_3 \cdot P_m) + (w_4 \cdot V_d) + (w_5 \cdot U_r) + (w_6 \cdot A_s)$$

| Metric | Dimension | Weight | Description |
|---|---|---|---|
| $D_s$ | Citizen Demand Signal | $w_1 = 0.25$ | Severity-weighted demand volume normalized (0-100) |
| $G_i$ | Infrastructure Deficit Index | $w_2 = 0.25$ | Measured capacity gap ($100 \times \text{gap\_score}$) |
| $P_m$ | Population Impact | $w_3 = 0.15$ | Log-scaled population size normalized (0-100) |
| $V_d$ | Demographic Vulnerability | $w_4 = 0.15$ | Socioeconomic deficit index ($100 \times \text{vulnerability\_index}$) |
| $U_r$ | Urgency Signal | $w_5 = 0.10$ | NLP emergency severity tag index |
| $A_s$ | Investment Alignment | $w_6 = 0.10$ | Absence of active capital investment bonus |

Total positive weight sum: $0.25 + 0.25 + 0.15 + 0.15 + 0.10 + 0.10 = 1.00$.

### Risk Modifiers & Deductions
$$\text{Risk Penalties} = (\text{Penalty}_{\text{coverage}}) + (\text{Penalty}_{\text{duplicate}})$$

* $\text{Penalty}_{\text{coverage}}$ = Deducts score if baseline coverage ratio exceeds 75% ($0.20 \times \text{coverage\_ratio\_pct}$).
* $\text{Penalty}_{\text{duplicate}}$ = Deducts 15 points if active capital projects exist in the sector (`status: active`).

---

## 3. Machine-Readable Explainability ("Why this recommendation?")

Every calculation outputs an `ExplanationDetails` payload detailing:
- Numerical weight, raw value, and score contribution for each factor.
- Plain-language explanation for policymakers.
- Explicit list of risk flags (e.g. duplicate active funding).
- Quantified estimated population impact.
