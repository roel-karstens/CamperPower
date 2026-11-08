# CamperPower Architecture Blueprint

## System Goals
- Produce transparent and reproducible recommendations.
- Keep logic versioned, testable, and auditable.
- Separate content concerns from calculation correctness.

## Logical Components
1. Frontend Application
- Multi-step configurator UI.
- Real-time result preview and confidence messaging.
- Export and outbound click actions.

2. Rule Engine Service
- Sizing formulas and constraint evaluation.
- Compatibility rule evaluation.
- Safety warning generation.

3. Catalog and Compatibility Data
- Product class definitions.
- Compatibility matrices by charger/EBL/system profile.
- Optional pricing snapshots for comparison views.

4. Evidence and Source Registry
- Source references for formulas and assumptions.
- Rule metadata and last-reviewed timestamps.

5. Analytics Pipeline
- Funnel event capture.
- Recommendation quality and warning-rate metrics.

## Suggested API Surface (MVP)
- `POST /v1/calculate`
  - input: loads, autonomy, charging sources, existing hardware profile.
  - output: recommendation, confidence notes, warnings, assumptions.
- `POST /v1/compatibility/check`
  - input: existing system profile + proposed components.
  - output: compatible/incompatible/unknown with reasons.
- `GET /v1/rules/version`
  - output: current rule bundle id and review metadata.

## Data Model (Conceptual)
- `RuleBundle`
  - id, version, effective_date, reviewed_by, source_refs.
- `SizingRule`
  - key, formula, preconditions, output_field.
- `CompatibilityRule`
  - key, equipment_pattern, result, explanation, confidence.
- `SafetyRule`
  - key, trigger_condition, severity, user_message.
- `RecommendationRun`
  - run_id, inputs_hash, bundle_version, outputs, warning_count.

## Reliability Requirements
- Deterministic calculations for same inputs + rule bundle.
- Full trace object for each recommendation output.
- Golden tests for canonical user scenarios.

## Non-Functional Requirements
- Availability target: 99.5% for public calculator endpoint.
- p95 latency target: < 500 ms for calculation calls.
- Observability: logs, metrics, and error traces per endpoint.

## Security and Compliance
- Minimal PII collection.
- Strict output guardrails to avoid unsafe actionable mains advice.
- Mandatory affiliate disclosure in UI near commercial links.

## Deployment Stages
1. Local and staging with synthetic datasets.
2. Closed beta with instrumentation and feedback loop.
3. Public launch with monthly rule review cadence.
