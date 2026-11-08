# CamperPower Rule Engine Specification (MVP)

## Scope
Define an explainable rule engine that converts user inputs into sizing outputs, compatibility checks, and safety alerts.

## Input Schema (logical)
- `daily_load_wh`: number > 0
- `autonomy_days`: integer >= 1
- `battery_voltage_v`: default 12.8
- `charging_sources`: array from {solar, dcdc, shore, powerstation}
- `existing_system`: optional object with charger/EBL metadata

## Output Schema (logical)
- `battery_capacity_ah_target`
- `solar_wp_target`
- `mppt_current_a_target`
- `dcdc_current_a_target` (if selected)
- `fuse_and_cable_guidance`
- `compatibility_result`
- `safety_warnings[]`
- `assumptions[]`
- `confidence_level`

## Baseline Formula Set
Let:
- $E_d$ = daily load (Wh/day)
- $D$ = autonomy days
- $V$ = nominal battery voltage
- $U$ = usable depth factor (LiFePO4 assumption)

Battery target (Ah):
$$
Ah_{target} = \frac{E_d \cdot D}{V \cdot U}
$$

Solar target (Wp) with peak-sun approximation:
$$
Wp_{target} = \frac{E_d}{H_{sun} \cdot \eta_{sys}}
$$

Where:
- $H_{sun}$ = equivalent sun-hours assumption
- $\eta_{sys}$ = system efficiency factor

MPPT current approximation:
$$
I_{mppt} \approx \frac{Wp_{target}}{V_{charge}}
$$

## Rule Categories
1. Sizing rules
- Pure formulas and rounding policy.

2. Compatibility rules
- Equipment-specific constraints and known incompatibilities.
- Result states: `compatible`, `incompatible`, `unknown`.

3. Safety rules
- Trigger warnings for high current, missing protection, or uncertain compatibility.
- Severity levels: `info`, `warning`, `critical`.

## Explainability Contract
Every computed field must return:
- formula id,
- input values used,
- assumption values,
- plain-language explanation.

## Validation and Testing
- Unit tests per formula rule.
- Property tests for monotonic behavior (higher load should not lower capacity).
- Golden scenario tests for known profiles.
- Regression suite pinned to rule-bundle versions.

## Versioning
- Rule bundles are immutable after release.
- New versions require change note + review signature.
- Recommendation responses always include `bundle_version`.

## Safety Boundary
The rule engine may advise low-voltage component sizing and compatibility checks only. It must not produce procedural instructions for high-risk mains wiring tasks.
