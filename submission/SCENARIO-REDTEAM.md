# Counterfactual Scenario Lab Red-Team Audit

## Executive Summary
This document records stress testing, boundary condition checks, and mathematical sanity validation performed on the interactive Counterfactual Scenario Lab.

---

## Scenario Simulation Stress Tests

| Test Case | Boundary Input Condition | Mathematical Result | UI Chart / Label Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Minimum Budget** | $\$0\text{ USD}$ | Score Delta: `0.0 pts`, Gap: `Unchanged`, Beneficiaries: `0` | Displays baseline state; no broken deltas. | **PASSED** |
| **Maximum Budget** | $\$50,000,000\text{ USD}$ | Added coverage capped at $+40.0\%$. Deficit gap bounded $\ge 0.05$. | Score Delta: `-32.5 pts`, Beneficiaries: max pop fraction. | **PASSED** |
| **Negative Budget** | $-\$5,000,000\text{ USD}$ | Pydantic schema validation `budget_allocation_usd: Field(ge=0.0)` rejects. | Returns HTTP 422 Unprocessable Entity. | **PASSED** |
| **Excessive Coverage Add** | `target_coverage_addition_pct = 150%` | Pydantic schema validation `Field(ge=0.0, le=100.0)` rejects. | Returns HTTP 422 Unprocessable Entity. | **PASSED** |
| **Rapid Slider Dragging** | Moving slider back and forth 50x | Client debounces / re-executes cleanly without memory growth. | Smooth recalculation without chart glitching. | **PASSED** |
| **Browser Refresh** | Hard refresh during simulation | State re-initializes cleanly to baseline parameters. | Default region & baseline values restored. | **PASSED** |

---

## Mathematical Sanity Guarantees
1. **No Negative Beneficiaries**: Beneficiary calculation `int(population * fraction)` is bounded $\ge 0$.
2. **No NaN / Infinity**: Deficit gap index is clamped using `max(0.05, current_gap - coverage_pct/100)`.
3. **No Fake Precision**: Priority score deltas are explicitly rounded to 1 decimal place (`round(delta, 1)`).
