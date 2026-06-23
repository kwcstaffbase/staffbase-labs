# Custom Solutions SLA Framework — DRAFT v0.1

**Owner:** Technical Services Manager, North America
**Status:** Working draft for internal review
**Scope:** Support & incident response + maintenance & lifecycle for custom solutions (custom widgets, plugins, scripts) built by the Customer Success Engineering (CSE) team.
**Commercial vehicle:** Support and maintenance under this framework are funded through **Signature Care** packages (Essentials → Platinum). Signature Care is the hours pool; this framework defines what level of support and SLA those hours buy.
**Out of scope:** Delivery/build turnaround commitments (covered separately in the scoping/estimation process), and SLAs for the core Staffbase product (governed by the standard product SLA).

> All numeric targets in this draft are **proposed defaults to calibrate**, not agreed commitments. They are placeholders for you to pressure-test against current team capacity before anything is published or sold.

---

## 0. Read this first — three design principles that shape everything below

These are the non-obvious decisions that make or break a custom-solutions SLA. They are called out up front because they constrain every target in the document.

**1. We commit to *response and remediation effort*, not *uptime*, for anything with an external dependency.**
Most custom solutions depend on something Staffbase does not control: a customer's API, an identity provider, a third-party service, browser/CSP behaviour, or a customer-side configuration. We cannot offer a 99.x% availability SLA on a component whose most common failure mode is *someone else's change*. Uptime/availability targets are only defensible for components that run entirely within Staffbase-controlled infrastructure. For everything else, the SLA is expressed as **time-to-respond** and **time-to-workaround/escalate**, never **time-to-fix** for externally-caused faults. Promising a fix time on a root cause we don't own is the fastest way to breach an SLA we wrote ourselves.

**2. No SLA without monitoring.** An SLA on resolution implies an SLA on *detection*. If a solution has no monitoring or alerting, "time to respond" can only start when the customer reports the problem — so detection is effectively the customer's job. Tier 1 (business-critical) status therefore has a **precondition**: monitoring/health-checking must exist and be funded. A business-critical solution with no monitoring is a contradiction we should refuse to sign.

**3. Criticality and severity are two different axes — keep them separate.**
- **Criticality** is the *inherent importance of the solution*. It is set once, at delivery, and rarely changes. (Is this thing business-critical?)
- **Severity** is *how bad a specific incident is right now*. It is set per ticket. (Is it fully down, degraded, or cosmetic?)

The SLA response target is a function of **both**, via a priority matrix (Section 3). A cosmetic glitch on a business-critical widget is not a P1. A full outage on a throwaway script is not a P1 either. Conflating the two axes is the most common SLA design error.

**4. A response-time SLA is reserved capacity; Signature Care is a consumptive hours pool — reconcile the two deliberately.**
Signature Care sells an annual bucket of hours, mostly framed for *proactive* work (design, building, advisory). A reactive incident SLA promises a *response speed regardless of how many hours remain*. These are different financial models. If we fund SLA-bound incident response purely out of a depletable bucket, a P1 outage can land the week after the hours run out — and we either breach our own SLA or do unpaid work. The framework resolves this two ways (Section 6.5): higher Signature Care packages unlock higher support tiers, **and** a safeguard guarantees critical-incident response even when hours are exhausted (with overage handling). Decide this consciously; it's the commercial crux of mixing support into Signature Care.

---

# PART A — Internal Operating Model

This part governs how the TC and CSE teams operate. It is the source of truth; the customer-facing version (Part B) is derived from it and is deliberately more conservative.

## 1. Criticality tiering — is this solution business-critical?

Criticality is assessed **during scoping/handover**, recorded with the deliverable, and re-confirmed at each renewal. Classification is by the **highest** triggered criterion, not an average — one Tier 1 trigger makes it Tier 1.

| Dimension | Tier 1 — Business Critical | Tier 2 — Standard | Tier 3 — Non-Critical / Best-Effort |
|---|---|---|---|
| **Business function** | Failure blocks a core business process: payroll, safety/compliance comms, emergency/crisis notification, regulated disclosures, frontline operations | Failure degrades an important but non-blocking workflow; manual workaround exists | Convenience, cosmetic, or experimental; no real business process depends on it |
| **Reach** | Affects all or most employees, or a critical population (e.g. frontline, deskless) | Affects a department, region, or defined segment | Affects a small group or single team |
| **Workaround** | No viable manual workaround; the solution *is* the process | Workaround exists but is costly/slow | Easy workaround or the function is optional |
| **Compliance / contractual** | Tied to a legal, regulatory, or contractual obligation | Internal policy relevance only | None |
| **Visibility** | Executive / board / external-facing | Manager-level | Low |
| **Data sensitivity** | Handles sensitive personal, financial, or regulated data | Handles internal-only data | Public or trivial data |

**Tier 1 preconditions (all must be true to *accept* Tier 1 status):**
- Monitoring/health check in place and funded.
- Named technical owner on the Staffbase side and a named customer-side contact for external dependencies.
- Active support retainer or contractual support coverage (see Section 6).
- Documented runbook (how to detect, triage, and restore).

If a solution meets the Tier 1 *criteria* but not the Tier 1 *preconditions*, it is supported at Tier 2 with the gap recorded as a risk. This is the lever that stops "business critical" from being a label with no operational backing.

## 2. Incident severity — how bad is *this* incident?

| Severity | Definition | Examples |
|---|---|---|
| **Sev 1 — Critical** | Solution fully down or unusable; core function it provides is blocked; no workaround | Widget renders nothing for all users; plugin auth broken; script not running at all |
| **Sev 2 — Major** | Significant degradation or partial outage; affects many users; no acceptable workaround | Data loads intermittently; one major feature broken; wrong data shown |
| **Sev 3 — Minor** | Limited or cosmetic impact; workaround exists | Styling glitch, edge-case error, slow under rare conditions |
| **Sev 4 — Request** | Question, config request, enhancement, or non-defect change | "Can we change the colour?", "How do I…", small content update |

Severity is set by the responding engineer at triage and may be adjusted as understanding improves. Customers can *propose* a severity; the engineer confirms it against these definitions to prevent severity inflation.

## 3. Priority matrix — criticality × severity → response target

Priority (P1–P4) is what actually drives the clock. It is derived, not declared.

| | Sev 1 | Sev 2 | Sev 3 | Sev 4 |
|---|---|---|---|---|
| **Tier 1 (Critical)** | P1 | P2 | P3 | P4 |
| **Tier 2 (Standard)** | P2 | P3 | P3 | P4 |
| **Tier 3 (Best-effort)** | P3 | P4 | P4 | P4 |

### Response & restoration targets (PROPOSED — calibrate against capacity)

All targets are in **business hours** unless an after-hours/on-call option is separately funded (see Section 5). "Response" = human acknowledgement and ownership, not resolution. "Restoration" = service restored *or* a viable workaround in place — **not** necessarily permanent root-cause fix.

| Priority | Target response | Target restoration / workaround | Update cadence |
|---|---|---|---|
| **P1** | 1 business hour | 1 business day (best effort; subject to external dependencies) | Every 4 business hours |
| **P2** | 4 business hours | 3 business days | Daily |
| **P3** | 1 business day | Next planned maintenance window or as scheduled | On status change |
| **P4** | 3 business days | Backlog / as capacity allows | On status change |

**Restoration caveat (applies to all priorities):** Where the root cause is an external dependency (customer API change, third-party outage, browser/platform change), the commitment is to **respond, diagnose, provide a workaround where feasible, and escalate to the responsible party** — not to deliver a fix within the restoration target. The clock on a Staffbase-owned fix pauses while we are blocked on an external party (a "dependency hold"), and this is logged on the ticket.

## 4. Support process & escalation

**Intake:** single defined channel (e.g. support ticket queue / dedicated alias) — *not* direct messages to engineers. One front door enables tracking and SLA measurement. (Decision needed: which channel; see open questions.)

**Triage flow:** Intake → assign criticality (from record) + severity → derive priority → acknowledge within response target → diagnose → restore/workaround → root-cause fix or change request → close → (for P1/P2) post-incident note.

**Escalation path:**
1. Assigned CSE
2. CSE lead / senior engineer
3. Technical Services Manager
4. (P1 only) Engineering / Product if core-product fault suspected; account team informed in parallel

**P1 handling:** immediate ownership, a single incident owner, customer kept updated on cadence above, and a short post-incident review for any P1 (what broke, why, prevention).

## 5. Coverage hours

**Default: business hours, single region (NA), Mon–Fri excluding holidays.**

Honest constraint to decide on explicitly: a true 24/7 or 1-hour-anytime response on Tier 1 requires either an on-call rotation or follow-the-sun coverage across regions. If the team does not have that today, do **not** publish a sub-day response time that implies after-hours coverage. Options:
- **(a)** Business-hours SLA only (recommended default; applies to all Signature Care packages).
- **(b)** Premium after-hours/on-call add-on — gated to **Signature Care Platinum** (or sold as a named add-on on top of Gold/Platinum), separately scoped and funded, for genuinely critical 24/7 solutions (e.g. emergency comms).
- **(c)** Follow-the-sun using EMEA/other TS regions — requires cross-region agreement and shared runbooks.

Pick one before any Tier 1 commitment is sold. This is the single biggest capacity risk in the framework.

## 6. Maintenance & lifecycle

Support (fixing breakage) and maintenance (keeping it working as the world changes) are different activities. Both are funded from the customer's **Signature Care** hours pool (see 6.2A for the package mapping), with the safeguard in 6.5 governing what happens when hours run out.

### 6.1 Ownership
Default: **Staffbase authors the solution; the customer owns the operational dependency.** Define per engagement:
- Who owns the source code and where it lives.
- Who owns the external dependencies (customer API/credentials/config).
- Whether the customer can self-modify (self-modification voids support on changed components — see exclusions).

### 6.2 Coverage models
| Model | What it covers | Funded by |
|---|---|---|
| **Warranty period** | Defect fixes for bugs present at delivery, for a fixed window (proposed: 30–90 days) after go-live, at no extra cost | Included with delivery (no Signature Care hours consumed) |
| **Support (incident response)** | Ongoing incident response per the SLA above | Signature Care hours |
| **Maintenance (proactive)** | Adaptation to known upcoming changes (API versions, browser, platform releases), dependency upgrades, periodic health review | Signature Care hours |
| **Best-effort / none** | No commitment; addressed as capacity allows, billable | No Signature Care plan → no SLA |

### 6.2A Signature Care package → support entitlement (PROPOSED — calibrate)

This is how Signature Care packages translate into the support tier and SLA a custom solution receives. **Recommended model:** bundle the *eligible support tier* into the package level, and sell *after-hours coverage* as a separate add-on. Hours are the *budget*; the package level is the *entitlement*.

| Signature Care package | Hours/yr | Price/yr | Max criticality supported | Coverage | Maintenance included |
|---|---|---|---|---|---|
| *(none — warranty only)* | — | — | Tier 3 (best-effort after warranty) | None | None |
| **Essentials** | 20 | $6k | Tier 2 (Standard) | Business hours | Reactive only |
| **Bronze** | 40 | $10k | Tier 2 (Standard) | Business hours | Reactive only |
| **Silver** | 80 | $16k | Tier 2 (Standard) | Business hours | + periodic health review |
| **Gold** | 160 | $25k | **Tier 1 eligible** (if preconditions met) | Business hours, priority | + proactive dependency maintenance |
| **Platinum** | 240 | $30k | **Tier 1 eligible** | Business hours + after-hours/on-call add-on available | + proactive maintenance & monitoring setup |

**Two hard constraints on this mapping:**
- **Tier 1 needs Gold or above.** Tier 1 preconditions (monitoring, on-call readiness, runbook) realistically cannot be funded from a 20–80 hour pool. A business-critical solution on Essentials/Bronze/Silver is supported at Tier 2 with the gap logged as a risk (per Section 1).
- **Hours adequacy is the customer's risk to understand.** 20 hours/year is roughly half a working week — enough for light reactive fixes, not for sustained Tier 1 operation. Size the package to the solution's criticality at sale, not after the first incident.

### 6.3 Adapting to customer-side and third-party change
Custom solutions break most often because *something they depend on changed*. Classify the response:
- **Covered under maintenance retainer:** adapting to a dependency change *if* a maintenance retainer is active.
- **Change request (billable):** new functionality, scope change, or re-platforming.
- **Not covered:** adapting to changes the customer made without notice, or to unsupported customer modifications of the solution.

Where feasible, require **advance notice of customer-side API/platform changes** as a customer responsibility in the agreement — it is the cheapest way to prevent self-inflicted Sev 1s.

### 6.4 Compatibility & deprecation
- State supported Staffbase platform versions, browsers, and (for plugins) SDK/API versions at delivery.
- **Deprecation / EOL:** when an underlying Staffbase API, SDK, or third-party dependency is deprecated, notify the customer (proposed: ≥90 days where we have notice) with options: migrate (change request), accept degraded support, or sunset. Unmaintained solutions move to "best-effort, no SLA" and are flagged as risk.

### 6.5 What happens when Signature Care hours run out (the safeguard)

The crux of mixing SLA-bound support into a consumptive hours pool. Without an explicit rule, a depleted pool either silently voids the SLA or forces unpaid work. **Proposed rule:**

- **P1 and P2 incidents are always honoured to the SLA, even at zero remaining hours.** Safety first — a business-critical outage is never gated on a depleted bucket. Overage is handled per the customer's chosen mechanism below.
- **P3 and P4 work pauses** when hours are exhausted, resuming on renewal or top-up.
- **Maintenance (proactive) pauses** when hours are exhausted; the customer is notified that the solution is drifting toward unsupported.

**Overage handling (pick one at contract time):**
- **(a) True-up / overage billing** — P1/P2 work beyond the pool is billed at the standard rate, or
- **(b) Reserved buffer** — a defined % of the annual pool (proposed: 20%) is ring-fenced for reactive incident response and cannot be spent on proactive work, or
- **(c) Auto top-up** — pool replenishes in blocks when it hits a threshold.

**Burn transparency:** customers on Gold/Platinum get periodic hours-burn reporting so depletion is never a surprise mid-incident. Recommend (b) reserved buffer for any Tier 1 solution — it's the only option that structurally guarantees capacity for the incident you can't predict.

## 7. Exclusions — what voids or pauses the SLA

The SLA does **not** apply when:
- No active support/maintenance retainer (outside warranty period).
- The solution was modified by the customer or a third party outside Staffbase's control.
- Root cause is a customer-side or third-party change made without notice (we still help; targets are best-effort).
- Required preconditions (monitoring, named contacts, runbook) are not in place.
- Force majeure / upstream provider outages.
- The request is a new feature or scope change (handled as a change request, not an incident).

Dependency holds (waiting on customer or third party) **pause** the restoration clock; they do not count as breach.

## 8. Measurement & governance
- Track per ticket: criticality, severity, derived priority, response time, restoration time, dependency-hold time, breach (Y/N).
- Report monthly: SLA attainment by priority, breach reasons, recurring root causes, retainer-hour burn.
- Review the framework quarterly; recalibrate targets against actual attainment. If P1 response is consistently missed, the target is wrong or capacity is short — fix one of those, don't paper over it.

---

# PART B — Customer-Facing Summary

> Plain-language version for customers and account teams. Deliberately more conservative than Part A. **Must be reviewed by Legal before use in any SOW or contract** — anything here can become a binding commitment.

## What this covers
Staffbase builds custom solutions — widgets, plugins, and scripts — tailored to your needs. This describes the support and maintenance we provide for those solutions once they are live. It is separate from the standard Staffbase product SLA.

## Your support plan: Signature Care
Ongoing support and maintenance for your custom solutions is delivered through **Signature Care**, our premium service. Your Signature Care package sets both the pool of hours available each year and the level of support your solutions receive — higher packages unlock support for business-critical solutions and faster, broader coverage.

| Package | Hours/year | Price/year | Support level for custom solutions |
|---|---|---|---|
| **Essentials** | 20 | $6k | Standard support, business hours |
| **Bronze** | 40 | $10k | Standard support, business hours |
| **Silver** | 80 | $16k | Standard support + periodic health review |
| **Gold** | 160 | $25k | Business-critical support eligible, priority response, proactive maintenance |
| **Platinum** | 240 | $30k | Business-critical support, proactive maintenance & monitoring, after-hours/on-call add-on available |

Business-critical (fastest) support requires a **Gold or Platinum** package, because it depends on monitoring and readiness that a smaller hours pool can't sustain. We'll recommend a package sized to how critical your solution is. Critical issues (P1/P2) are always handled to the response targets below, even if your hours for the year are used up; we'll agree up front how additional time is handled (overage billing, a reserved buffer, or top-ups).

## How we prioritise issues
Every custom solution is classified by **business criticality** when it is delivered, and every issue you raise is classified by **severity** when you report it. Together these set the priority of your request, so the most important problems on the most important solutions get the fastest attention.

**Criticality (set at delivery):**
- **Business Critical** — your business process depends on it; failure has major impact.
- **Standard** — important, but a workaround exists if it fails.
- **Non-Critical** — convenience or optional; supported on a best-effort basis.

**Severity (set per issue):**
- **Critical** — completely unavailable, no workaround.
- **Major** — significant problem affecting many users.
- **Minor** — limited or cosmetic; a workaround exists.
- **Request** — a question or change request.

## Target response times (business hours)
| Priority | We respond within | We aim to restore service or provide a workaround within |
|---|---|---|
| **P1** | 1 business hour | 1 business day |
| **P2** | 4 business hours | 3 business days |
| **P3** | 1 business day | Scheduled |
| **P4** | 3 business days | As capacity allows |

"Respond" means a person has acknowledged and taken ownership of your issue. "Restore" means service is back or a workaround is in place — which may precede a permanent fix.

## Important to understand
Custom solutions often rely on systems outside Staffbase's control — your own APIs, identity providers, third-party services, or browser/platform behaviour. When an issue is caused by one of these, we commit to respond quickly, diagnose, provide a workaround where possible, and escalate to the responsible party — but the time to a permanent fix depends on that party. For solutions whose failure would be business-critical, monitoring and an active support plan are required so we can meet these targets.

## Coverage
Support is provided during business hours (Mon–Fri, excluding holidays). After-hours or 24/7 coverage for business-critical solutions is available as a premium add-on with a Platinum package.

## Keeping your solution working over time
- **Warranty:** defects present at delivery are fixed at no cost for [30–90] days after go-live (no Signature Care hours used).
- **Ongoing support & maintenance:** provided through your Signature Care package, which also covers adapting your solution to upcoming changes in the dependencies it relies on. Proactive maintenance is included from Gold upward.
- **Changes on your side:** please give us advance notice of changes to your APIs, systems, or configuration so we can keep your solution running. Adapting to undisclosed changes, or to modifications made outside Staffbase, is handled as new work.
- **Deprecation:** if an underlying technology your solution depends on is being retired, we will give you notice [≥90 days where possible] and options to migrate or update.

## What's not included
New features, scope changes, issues caused by undisclosed customer-side changes, solutions modified outside Staffbase, and problems with third-party providers fall outside these targets. We will always help, but on a best-effort or change-request basis.

---

## Open questions to resolve before v1.0
1. **Coverage model** — business hours only, or fund an on-call/premium tier for Tier 1? (Biggest decision; gates whether sub-day P1 response is honest.)
2. **Intake channel** — what is the single front door for custom-solution support?
3. **Numeric calibration** — are the proposed response/restoration targets achievable at current headcount? Pull historical ticket data if available.
4. **Warranty window** — 30, 60, or 90 days?
5. **Signature Care mechanics** — confirm the package→tier mapping (6.2A), and pick the overage model (6.5): true-up billing, reserved buffer, or auto top-up. Reserved buffer recommended for Tier 1.
8. **Package→entitlement bundling** — confirm support tier is *bundled into* package level (recommended) vs sold as a separate SLA add-on on top of any package.
9. **Lower-package Tier 1 conflict** — confirm we will downgrade business-critical solutions sold on Essentials/Bronze/Silver to Tier 2, or require an upsell to Gold+.
6. **Legal review** — Part B language for contractual use.
7. **Tier 1 enforcement** — confirm we will actually decline/downgrade Tier 1 when preconditions (monitoring etc.) aren't met.
