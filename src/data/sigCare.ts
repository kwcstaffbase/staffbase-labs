// ============================================================================
// Signature Care + PSP / PSP+ contract-burn dataset
// ----------------------------------------------------------------------------
// Ported from the PS Time Tracker's server-rendered payload. In the source app
// these two record types come live from Supabase; here they ship as a static
// seed module (same shape) so the view + computation are fully self-contained.
//
// To swap in live data later, replace CARE_PLAN_DATA with a fetch that returns
// the same CarePlanData shape — nothing in src/lib/sigCare.ts needs to change.
// ============================================================================

export type CarePlanType =
  | 'Signature Care Bronze'
  | 'Signature Care Silver'
  | 'Signature Care Gold'
  | 'Signature Care Platinum'
  | 'PSP'
  | 'PSP+';

// The only "magic" lookup: contracted hour pool per package/tier.
// Platinum exists as a type but isn't present in this dataset.
export const BANK_HOURS: Record<CarePlanType, number> = {
  'Signature Care Bronze': 40,
  'Signature Care Silver': 80,
  'Signature Care Gold': 160,
  'Signature Care Platinum': 320,
  PSP: 24,
  'PSP+': 48,
};

export interface CarePlanEngagement {
  id: string;
  accountId: string;
  accountName: string;
  csmName: string | null;
  touchModelTier: string | null; // "Tier 1".."Tier 4"
  territory: string | null; // "APJ" | "Americas" | "DACH" | "NOBE" | "UKI-MEA"
  engagementType: CarePlanType;
  slug: string | null;
  bankHours: number; // allotted pool; derived from BANK_HOURS
  startDate: string | null;
  renewalDate: string | null;
}

export interface CarePlanTask {
  id: string;
  engagementId: string;
  name: string;
  status: 'scoped' | 'in_progress' | 'done' | 'cancelled';
  closedAt: string | null; // ISO timestamp; null while not done
  actualDeductionHours: number | null; // real hours drawn; null until done
  estLowHours: number; // low-end estimate, used for not-yet-done work
}

export interface CarePlanTimeEntry {
  engagementId: string;
  entryDate: string; // YYYY-MM-DD
  minutes: number;
  taskId: string | null;
}

export interface CarePlanData {
  engagements: CarePlanEngagement[];
  tasks: CarePlanTask[];
  timeEntries: CarePlanTimeEntry[];
}

// --- helpers to keep the seed terse and the bankHours map authoritative ------

function eng(
  id: string,
  accountId: string,
  accountName: string,
  csmName: string,
  touchModelTier: string,
  territory: string,
  engagementType: CarePlanType,
  startDate: string,
  renewalDate: string,
): CarePlanEngagement {
  return {
    id,
    accountId,
    accountName,
    csmName,
    touchModelTier,
    territory,
    engagementType,
    slug: `${accountId}-${engagementType.toLowerCase().replace(/[^a-z+]+/g, '-').replace(/^-|-$/g, '')}`,
    bankHours: BANK_HOURS[engagementType],
    startDate,
    renewalDate,
  };
}

function done(
  id: string,
  engagementId: string,
  name: string,
  actualDeductionHours: number,
  closedAt: string,
): CarePlanTask {
  return { id, engagementId, name, status: 'done', closedAt, actualDeductionHours, estLowHours: actualDeductionHours };
}

function scoped(id: string, engagementId: string, name: string, estLowHours: number): CarePlanTask {
  return { id, engagementId, name, status: 'scoped', closedAt: null, actualDeductionHours: null, estLowHours };
}

// --- Engagements (one row per contract) --------------------------------------

const engagements: CarePlanEngagement[] = [
  // Energy Northwest — SC Bronze; ends up "5h over" once committed work counts.
  eng('e-enw-sc', 'energy-northwest', 'Energy Northwest', 'Dana Whitfield', 'Tier 2', 'Americas', 'Signature Care Bronze', '2025-07-01', '2026-06-30'),

  // Contoso Health — the "Both Packages" example: SC Silver 80 + PSP+ 48 = 128h.
  eng('e-contoso-sc', 'contoso-health', 'Contoso Health', 'Mette Larsen', 'Tier 2', 'NOBE', 'Signature Care Silver', '2025-09-01', '2026-08-31'),
  eng('e-contoso-psp', 'contoso-health', 'Contoso Health', 'Mette Larsen', 'Tier 2', 'NOBE', 'PSP+', '2025-09-01', '2026-08-31'),

  // Northwind Trading — SC Gold only.
  eng('e-northwind-sc', 'northwind-trading', 'Northwind Trading', 'Lukas Brandt', 'Tier 1', 'DACH', 'Signature Care Gold', '2025-03-15', '2026-03-14'),

  // Umbrella Corp — SC Gold + PSP (both packages).
  eng('e-umbrella-sc', 'umbrella-corp', 'Umbrella Corp', 'Dana Whitfield', 'Tier 1', 'Americas', 'Signature Care Gold', '2025-01-10', '2026-01-09'),
  eng('e-umbrella-psp', 'umbrella-corp', 'Umbrella Corp', 'Dana Whitfield', 'Tier 1', 'Americas', 'PSP', '2025-01-10', '2026-01-09'),

  // Stark Industries — SC Silver, runs hot (>80%).
  eng('e-stark-sc', 'stark-industries', 'Stark Industries', 'Priya Nair', 'Tier 2', 'APJ', 'Signature Care Silver', '2025-05-01', '2026-04-30'),

  // Globex — PSP only.
  eng('e-globex-psp', 'globex', 'Globex', 'Priya Nair', 'Tier 3', 'APJ', 'PSP', '2025-11-01', '2026-10-31'),

  // Initech — SC Bronze, lightly used.
  eng('e-initech-sc', 'initech', 'Initech', 'Tom Castellano', 'Tier 4', 'UKI-MEA', 'Signature Care Bronze', '2026-01-01', '2026-12-31'),

  // Soylent Corp — SC Silver + PSP+ (both packages).
  eng('e-soylent-sc', 'soylent-corp', 'Soylent Corp', 'Mette Larsen', 'Tier 2', 'NOBE', 'Signature Care Silver', '2025-08-01', '2026-07-31'),
  eng('e-soylent-psp', 'soylent-corp', 'Soylent Corp', 'Mette Larsen', 'Tier 2', 'NOBE', 'PSP+', '2025-08-01', '2026-07-31'),

  // Hooli — SC Gold.
  eng('e-hooli-sc', 'hooli', 'Hooli', 'Tom Castellano', 'Tier 1', 'UKI-MEA', 'Signature Care Gold', '2025-04-01', '2026-03-31'),

  // Acme Co — PSP+ only.
  eng('e-acme-psp', 'acme-co', 'Acme Co', 'Lukas Brandt', 'Tier 3', 'Americas', 'PSP+', '2025-10-01', '2026-09-30'),

  // Wayne Enterprises — SC Gold, mid usage.
  eng('e-wayne-sc', 'wayne-enterprises', 'Wayne Enterprises', 'Lukas Brandt', 'Tier 1', 'DACH', 'Signature Care Gold', '2025-06-01', '2026-05-31'),

  // UT Medical Center (Staffbase branch slug "utmc") — SC Silver + PSP+.
  eng('e-utmc-sc', 'ut-medical-center', 'UT Medical Center', 'Dana Whitfield', 'Tier 1', 'Americas', 'Signature Care Silver', '2025-09-01', '2026-08-31'),
  eng('e-utmc-psp', 'ut-medical-center', 'UT Medical Center', 'Dana Whitfield', 'Tier 1', 'Americas', 'PSP+', '2025-09-01', '2026-08-31'),
];

// --- Tasks (the deductions) --------------------------------------------------

const tasks: CarePlanTask[] = [
  // Energy Northwest: 20h drawn (2026) on a 40h pool, +25h committed → 5h over.
  done('t-enw-1', 'e-enw-sc', 'Custom onboarding journey widget', 12, '2026-03-10T16:00:00Z'),
  done('t-enw-2', 'e-enw-sc', 'SSO / SAML debugging session', 8, '2026-04-22T10:30:00Z'),
  scoped('t-enw-3', 'e-enw-sc', 'Mobile launch package scoping', 25),
  done('t-enw-4', 'e-enw-sc', 'Annual platform health check (2025)', 6, '2025-09-18T14:00:00Z'),

  // Contoso Health — SC Silver 80.
  done('t-con-1', 'e-contoso-sc', 'Pulse survey widget build', 18, '2026-03-05T12:00:00Z'),
  done('t-con-2', 'e-contoso-sc', 'Branded newsletter template', 9.5, '2026-04-19T09:00:00Z'),
  scoped('t-con-3', 'e-contoso-sc', 'Org-chart integration', 15),
  done('t-con-4', 'e-contoso-sc', 'Launch-day support (2025)', 11, '2025-10-02T15:00:00Z'),
  // Contoso Health — PSP+ 48.
  done('t-con-5', 'e-contoso-psp', 'Priority incident: login outage', 6, '2026-02-11T08:15:00Z'),
  scoped('t-con-6', 'e-contoso-psp', 'API rate-limit investigation', 4),

  // Northwind Trading — SC Gold 160.
  done('t-nw-1', 'e-northwind-sc', 'Advanced analytics dashboard', 40, '2026-02-14T17:00:00Z'),
  done('t-nw-2', 'e-northwind-sc', 'Comms-hub content migration', 35, '2026-05-08T13:00:00Z'),
  scoped('t-nw-3', 'e-northwind-sc', 'Q3 campaign microsite', 20),
  done('t-nw-4', 'e-northwind-sc', 'Theme refresh (2025)', 22, '2025-11-20T11:00:00Z'),

  // Umbrella Corp — SC Gold 160 + PSP 24.
  done('t-umb-1', 'e-umbrella-sc', 'Multi-brand space rollout', 58, '2026-01-30T16:00:00Z'),
  done('t-umb-2', 'e-umbrella-sc', 'Custom directory plugin', 30, '2026-04-12T10:00:00Z'),
  scoped('t-umb-3', 'e-umbrella-sc', 'Workflow automation phase 2', 18),
  done('t-umb-4', 'e-umbrella-psp', 'Hotfix: push notification delivery', 9, '2026-03-01T07:30:00Z'),
  scoped('t-umb-5', 'e-umbrella-psp', 'Mobile config audit', 6),

  // Stark Industries — SC Silver 80, runs hot.
  done('t-stk-1', 'e-stark-sc', 'Executive comms portal', 44, '2026-02-22T18:00:00Z'),
  done('t-stk-2', 'e-stark-sc', 'Event registration widget', 24, '2026-05-15T14:30:00Z'),
  scoped('t-stk-3', 'e-stark-sc', 'Accessibility remediation', 9),

  // Globex — PSP 24.
  done('t-glo-1', 'e-globex-psp', 'Field-mapping script', 5, '2026-03-28T09:45:00Z'),
  scoped('t-glo-2', 'e-globex-psp', 'CSV import automation', 8),

  // Initech — SC Bronze 40, light.
  done('t-ini-1', 'e-initech-sc', 'Homepage hero widget', 6.5, '2026-04-02T12:00:00Z'),

  // Soylent Corp — SC Silver 80 + PSP+ 48.
  done('t-soy-1', 'e-soylent-sc', 'Recognition & rewards widget', 28, '2026-03-17T15:00:00Z'),
  scoped('t-soy-2', 'e-soylent-sc', 'Multilingual content sync', 12),
  done('t-soy-3', 'e-soylent-psp', 'Escalation: SSO certificate renewal', 7, '2026-01-19T08:00:00Z'),

  // Hooli — SC Gold 160.
  done('t-hoo-1', 'e-hooli-sc', 'Knowledge-base search plugin', 52, '2026-02-05T16:30:00Z'),
  done('t-hoo-2', 'e-hooli-sc', 'Custom analytics export', 31, '2026-05-22T11:15:00Z'),
  scoped('t-hoo-3', 'e-hooli-sc', 'Single sign-on hardening', 14),

  // Acme Co — PSP+ 48.
  done('t-acm-1', 'e-acme-psp', 'Priority build: shift-scheduling widget', 19, '2026-04-09T13:30:00Z'),
  scoped('t-acm-2', 'e-acme-psp', 'Calendar sync investigation', 10),

  // Wayne Enterprises — SC Gold 160.
  done('t-way-1', 'e-wayne-sc', 'Frontline app launch package', 46, '2026-03-21T17:00:00Z'),
  scoped('t-way-2', 'e-wayne-sc', 'Survey analytics dashboard', 22),

  // UT Medical Center — SC Silver 80 + PSP+ 48.
  done('t-utmc-1', 'e-utmc-sc', 'Custom gauge widgets (intranet homepage)', 16, '2026-03-12T15:00:00Z'),
  done('t-utmc-2', 'e-utmc-sc', 'SSO / SAML onboarding configuration', 9.5, '2026-04-25T10:00:00Z'),
  scoped('t-utmc-3', 'e-utmc-sc', 'Department directory integration', 18),
  done('t-utmc-4', 'e-utmc-psp', 'Priority incident: push notification delivery', 5, '2026-02-18T08:00:00Z'),
  scoped('t-utmc-5', 'e-utmc-psp', 'Mobile launch readiness review', 8),
];

export const CARE_PLAN_DATA: CarePlanData = {
  engagements,
  tasks,
  timeEntries: [], // unscoped time entries unused in this seed; kept for shape parity
};

// ----------------------------------------------------------------------------
// Instance → account mapping
// ----------------------------------------------------------------------------
// When the plugin runs inside a customer's Staffbase instance, the JWT/referrer
// identifies that instance. We map it to the customer's accountId so the view
// only ever shows that customer's hours. Keys are matched against the JWT
// `instance_id`/`tenant` AND the instance origin hostname (e.g. from a custom
// domain). In production this table is the integration point — populate it with
// each customer's real instance identifier(s).
export const INSTANCE_TO_ACCOUNT: Record<string, string> = {
  // instanceId (tenant) ─────────────────────────────────────────────
  energynw: 'energy-northwest',
  contosohealth: 'contoso-health',
  northwind: 'northwind-trading',
  umbrella: 'umbrella-corp',
  stark: 'stark-industries',
  globex: 'globex',
  initech: 'initech',
  soylent: 'soylent-corp',
  hooli: 'hooli',
  acme: 'acme-co',
  wayne: 'wayne-enterprises',
  // instance origin hostname ────────────────────────────────────────
  'energynw.staffbase.com': 'energy-northwest',
  'contoso.staffbase.com': 'contoso-health',
  'northwind.staffbase.com': 'northwind-trading',

  // UT Medical Center — keyed on values available in the plugin JWT with no
  // network call (the branch slug is only in the *authenticated* discover,
  // which the cross-origin plugin can't read). Host + JWT instance_id + branchID.
  'insite.utmck.edu': 'ut-medical-center',
  '6a3acaabbec0ec7db89f107a': 'ut-medical-center', // JWT instance_id / tenant
  '641486916db2ba4a44daa9e2': 'ut-medical-center', // Staffbase branch id
};

// Used only when the plugin is opened standalone (no instance context at all),
// so a preview renders something. A recognised-but-unmapped instance does NOT
// fall back to this — it shows a "not recognised" state instead.
export const DEFAULT_DEMO_ACCOUNT = 'energy-northwest';

// ----------------------------------------------------------------------------
// Branch slug → account mapping  (primary lookup)
// ----------------------------------------------------------------------------
// The Staffbase /auth/discover response exposes `user.branch.slug` — a stable,
// human-readable id for the instance (e.g. "utmc" for UT Medical Center). This
// is the key we match the care-plan tracker on. Populate one entry per customer.
export const SLUG_TO_ACCOUNT: Record<string, string> = {
  utmc: 'ut-medical-center',
  energynw: 'energy-northwest',
  contoso: 'contoso-health',
  northwind: 'northwind-trading',
  umbrella: 'umbrella-corp',
  stark: 'stark-industries',
  globex: 'globex',
  initech: 'initech',
  soylent: 'soylent-corp',
  hooli: 'hooli',
  acme: 'acme-co',
  wayne: 'wayne-enterprises',
};

/** True if the account holds at least one Signature Care engagement. */
export function accountHasSignatureCare(accountId: string): boolean {
  return engagements.some(
    (e) => e.accountId === accountId && e.engagementType.startsWith('Signature Care'),
  );
}

/** Does any account exist for this id (regardless of package)? */
export function accountExists(accountId: string): boolean {
  return engagements.some((e) => e.accountId === accountId);
}
