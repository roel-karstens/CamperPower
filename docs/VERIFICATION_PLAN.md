# CamperPower Verification Plan

## Goal
Validate that CamperPower has commercial viability and can safely deliver trusted recommendations.

## Two-Week Validation Sprint
1. Keyword and intent validation
- Build a list of 50 core keywords (NL/BE).
- Validate search volume and intent clusters.
- Exit threshold: combined monthly volume >= 15,000.

2. SERP vulnerability assessment
- Manually inspect top-10 results for 15 high-intent terms.
- Exit threshold: >= 3/10 results are weakly defended (forums, thin brand pages, generic posts).

3. Affiliate program validation
- Apply to direct and network programs.
- Exit threshold: >= 2 accepted programs with either >= 4% commission or >= EUR 20 lead equivalent.

4. Legal and policy validation
- Confirm disclosure obligations and content boundaries.
- Confirm no employment or contract restrictions on side activity.

## MVP Verification (post-build)
1. Functional verification
- Correct outputs for known benchmark scenarios.
- Stable behavior for edge inputs.

2. Safety verification
- High-risk recommendations require warning state.
- No output should imply 230V mains execution guidance.

3. UX verification
- >= 70% completion rate from calculator start to recommendation view in test cohorts.
- User interviews confirm recommendation explanations are understandable.

4. Revenue funnel verification
- Track tool starts, list exports, and outbound clicks.
- Initial success signal: repeatable outbound click activity from organic traffic.

## 3-Month and 6-Month Kill Criteria
- 3 months post-launch:
  - >= 90% indexation on target pages.
  - first outbound clicks observed.
- 6 months post-launch:
  - if < 2,000 monthly organic visits and no commissions, pivot or stop.

## Evidence and Reporting
- Keep a weekly validation log.
- Track assumptions as [A], qualitative judgments as [K], and source-backed claims as [B].
- Publish monthly review notes in docs.
