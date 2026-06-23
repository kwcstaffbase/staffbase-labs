// ============================================================================
// Pure aggregation for the Signature Care + PSP report.
// Faithful port of the PS Time Tracker's reporting/sig-care.ts. Burn follows
// the engagement_balances semantics:
//
//   scoped_drawn   = sum(coalesce(actual_deduction_hours, est_low_hours))
//                    from tasks where status='done'
//                    OR (status='cancelled' AND actual_deduction_hours > 0)
//   unscoped_drawn = sum(time_entries.minutes / 60) where task_id IS NULL
//   drawn          = scoped_drawn + unscoped_drawn
//   committed      = sum(est_low_hours) for tasks in (scoped, in_progress)
//   available      = bank_hours - drawn - committed
//
// When a year is selected, drawn is restricted to tasks whose closedAt falls
// in that year (and unscoped entries whose entryDate falls in that year).
// Committed is a forward-looking snapshot and is never year-scoped.
// ============================================================================

import type { CarePlanData, CarePlanEngagement, CarePlanTask } from '../data/sigCare';

export interface SigCareRow {
  accountId: string;
  accountName: string;
  csmName: string | null;
  touchModelTier: string | null;
  territory: string | null;

  scProductName: string | null;
  scSlug: string | null;
  scAllotted: number;
  scUsed: number;
  scCommitted: number;
  scAvailable: number;
  scEngagementIds: string[];

  pspPackage: 'PSP' | 'PSP+' | null;
  pspSlug: string | null;
  pspAllotted: number;
  pspUsed: number;
  pspCommitted: number;
  pspAvailable: number;
  pspEngagementIds: string[];

  totalAllotted: number;
  totalUsed: number;
  totalCommitted: number;
  totalAvailable: number;
  pctUsed: number; // drawn / allotted
}

export interface CapacityTotals {
  allotted: number;
  used: number; // drawn
  committed: number;
  available: number;
  pctUsed: number;
}

export interface SigCareAggregate {
  totalCustomers: number;
  scCount: number;
  pspCount: number;
  pspPlusCount: number;
  bothCount: number;
  totals: {
    sigCare: CapacityTotals;
    psp: CapacityTotals;
    pspPlus: CapacityTotals;
  };
}

export interface SigCareStats extends SigCareAggregate {
  rows: SigCareRow[];
}

const TIER_RANK: Record<string, number> = {
  'Signature Care Bronze': 1,
  'Signature Care Silver': 2,
  'Signature Care Gold': 3,
  'Signature Care Platinum': 4,
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function taskContributesToDrawn(t: CarePlanTask): boolean {
  if (t.status === 'done') return true;
  if (t.status === 'cancelled' && (t.actualDeductionHours ?? 0) > 0) return true;
  return false;
}

function taskDrawnHours(t: CarePlanTask): number {
  return t.actualDeductionHours ?? t.estLowHours;
}

function taskCommitted(t: CarePlanTask): boolean {
  return t.status === 'scoped' || t.status === 'in_progress';
}

interface EngagementBurn {
  drawn: number;
  committed: number;
}

function computeBurnByEngagement(
  data: CarePlanData,
  year: number | null,
): Record<string, EngagementBurn> {
  const out: Record<string, EngagementBurn> = {};
  const bump = (id: string) => {
    if (!out[id]) out[id] = { drawn: 0, committed: 0 };
    return out[id];
  };

  for (const t of data.tasks) {
    if (taskContributesToDrawn(t)) {
      if (year != null) {
        if (!t.closedAt) continue;
        if (new Date(t.closedAt).getFullYear() !== year) continue;
      }
      bump(t.engagementId).drawn += taskDrawnHours(t);
    } else if (taskCommitted(t)) {
      bump(t.engagementId).committed += t.estLowHours;
    }
  }

  // Unscoped drawn: time entries with task_id IS NULL on the bank engagement.
  for (const te of data.timeEntries) {
    if (te.taskId !== null) continue;
    if (year != null) {
      const y = Number(te.entryDate.slice(0, 4));
      if (y !== year) continue;
    }
    bump(te.engagementId).drawn += te.minutes / 60;
  }

  return out;
}

function pickHighestSigCareTier(engs: CarePlanEngagement[]): string | null {
  let best: CarePlanEngagement | null = null;
  for (const e of engs) {
    if (!e.engagementType.startsWith('Signature Care')) continue;
    if (!best || (TIER_RANK[e.engagementType] ?? 0) > (TIER_RANK[best.engagementType] ?? 0)) {
      best = e;
    }
  }
  return best?.engagementType ?? null;
}

export function getSigCareStats(data: CarePlanData, year: number | null): SigCareStats {
  const byAccount = new Map<string, CarePlanEngagement[]>();
  for (const e of data.engagements) {
    const arr = byAccount.get(e.accountId) ?? [];
    arr.push(e);
    byAccount.set(e.accountId, arr);
  }

  const burn = computeBurnByEngagement(data, year);

  const rows: SigCareRow[] = [];
  for (const [accountId, engs] of Array.from(byAccount.entries())) {
    const first = engs[0];
    const { accountName, csmName, touchModelTier, territory } = first;

    const scEngs = engs.filter((e) => e.engagementType.startsWith('Signature Care'));
    const pspEngs = engs.filter((e) => e.engagementType === 'PSP' || e.engagementType === 'PSP+');

    const sumSide = (sideEngs: CarePlanEngagement[]) => {
      let allotted = 0;
      let drawn = 0;
      let committed = 0;
      for (const e of sideEngs) {
        allotted += e.bankHours;
        const b = burn[e.id];
        if (b) {
          drawn += b.drawn;
          committed += b.committed;
        }
      }
      return { allotted, drawn, committed };
    };

    const sc = sumSide(scEngs);
    const psp = sumSide(pspEngs);

    const scUsed = round2(sc.drawn);
    const scCommitted = round2(sc.committed);
    const scAvailable = round2(sc.allotted - sc.drawn - sc.committed);

    const pspUsed = round2(psp.drawn);
    const pspCommitted = round2(psp.committed);
    const pspAvailable = round2(psp.allotted - psp.drawn - psp.committed);

    const hasPspPlus = pspEngs.some((e) => e.engagementType === 'PSP+');
    const hasPsp = pspEngs.some((e) => e.engagementType === 'PSP');
    const pspPackage: SigCareRow['pspPackage'] = hasPspPlus ? 'PSP+' : hasPsp ? 'PSP' : null;

    const totalAllotted = sc.allotted + psp.allotted;
    const totalUsed = round1(sc.drawn + psp.drawn);
    const totalCommitted = round1(sc.committed + psp.committed);
    const totalAvailable = round1(totalAllotted - totalUsed - totalCommitted);
    const pctUsed = totalAllotted > 0 ? Math.round((totalUsed / totalAllotted) * 100) : 0;

    rows.push({
      accountId,
      accountName,
      csmName,
      touchModelTier,
      territory,
      scProductName: pickHighestSigCareTier(scEngs),
      scSlug: scEngs.find((e) => e.slug)?.slug ?? null,
      scAllotted: sc.allotted,
      scUsed,
      scCommitted,
      scAvailable,
      scEngagementIds: scEngs.map((e) => e.id),
      pspPackage,
      pspSlug: pspEngs.find((e) => e.slug)?.slug ?? null,
      pspAllotted: psp.allotted,
      pspUsed,
      pspCommitted,
      pspAvailable,
      pspEngagementIds: pspEngs.map((e) => e.id),
      totalAllotted,
      totalUsed,
      totalCommitted,
      totalAvailable,
      pctUsed,
    });
  }

  rows.sort((a, b) => a.accountName.localeCompare(b.accountName));

  return { rows, ...aggregateSigCareRows(rows) };
}

// Counts + capacity totals derived purely from a row set, so the KPI cards and
// Capacity Overview recompute from the filtered subset.
export function aggregateSigCareRows(rows: SigCareRow[]): SigCareAggregate {
  return {
    totalCustomers: rows.length,
    scCount: rows.filter((r) => r.scAllotted > 0).length,
    pspCount: rows.filter((r) => r.pspPackage === 'PSP').length,
    pspPlusCount: rows.filter((r) => r.pspPackage === 'PSP+').length,
    bothCount: rows.filter((r) => r.scAllotted > 0 && r.pspAllotted > 0).length,
    totals: {
      sigCare: sumPackageTotals(rows, (r) => r.scAllotted > 0, 'sc'),
      psp: sumPackageTotals(rows, (r) => r.pspPackage === 'PSP', 'psp'),
      pspPlus: sumPackageTotals(rows, (r) => r.pspPackage === 'PSP+', 'psp'),
    },
  };
}

function sumPackageTotals(
  rows: SigCareRow[],
  predicate: (r: SigCareRow) => boolean,
  prefix: 'sc' | 'psp',
): CapacityTotals {
  const allottedKey = prefix === 'sc' ? 'scAllotted' : 'pspAllotted';
  const usedKey = prefix === 'sc' ? 'scUsed' : 'pspUsed';
  const committedKey = prefix === 'sc' ? 'scCommitted' : 'pspCommitted';
  let allotted = 0;
  let used = 0;
  let committed = 0;
  for (const r of rows) {
    if (!predicate(r)) continue;
    allotted += r[allottedKey];
    used += r[usedKey];
    committed += r[committedKey];
  }
  return {
    allotted: round2(allotted),
    used: round2(used),
    committed: round2(committed),
    available: round2(allotted - used - committed),
    pctUsed: allotted > 0 ? Math.round((used / allotted) * 100) : 0,
  };
}

// Year list from tasks (closedAt), plus the current year so the toggle always
// has something to click.
export function availableYears(data: CarePlanData): number[] {
  const set = new Set<number>();
  for (const t of data.tasks) {
    if (!t.closedAt) continue;
    const y = new Date(t.closedAt).getFullYear();
    if (Number.isFinite(y)) set.add(y);
  }
  for (const te of data.timeEntries) {
    const y = Number(te.entryDate.slice(0, 4));
    if (Number.isFinite(y)) set.add(y);
  }
  set.add(new Date().getFullYear());
  return Array.from(set).sort((a, b) => b - a);
}

export interface SigCareTaskDetail {
  taskId: string;
  engagementId: string;
  engagementType: string;
  taskName: string;
  status: CarePlanTask['status'];
  closedAt: string | null;
  hours: number;
  bucket: 'drawn' | 'committed';
}

export function getTaskDetail(
  data: CarePlanData,
  row: SigCareRow,
  year: number | null,
  side: 'sc' | 'psp' | 'all',
): SigCareTaskDetail[] {
  const ids = new Set(
    side === 'sc'
      ? row.scEngagementIds
      : side === 'psp'
        ? row.pspEngagementIds
        : [...row.scEngagementIds, ...row.pspEngagementIds],
  );
  const engById = new Map(data.engagements.map((e) => [e.id, e]));
  const result: SigCareTaskDetail[] = [];

  for (const t of data.tasks) {
    if (!ids.has(t.engagementId)) continue;

    let bucket: SigCareTaskDetail['bucket'] | null = null;
    let hours = 0;
    if (taskContributesToDrawn(t)) {
      if (year != null) {
        if (!t.closedAt) continue;
        if (new Date(t.closedAt).getFullYear() !== year) continue;
      }
      bucket = 'drawn';
      hours = taskDrawnHours(t);
    } else if (taskCommitted(t)) {
      bucket = 'committed';
      hours = t.estLowHours;
    } else {
      continue;
    }

    result.push({
      taskId: t.id,
      engagementId: t.engagementId,
      engagementType: engById.get(t.engagementId)?.engagementType ?? '—',
      taskName: t.name,
      status: t.status,
      closedAt: t.closedAt,
      hours: round2(hours),
      bucket,
    });
  }

  // Drawn first (most-recent closedAt desc), then committed (by name).
  result.sort((a, b) => {
    if (a.bucket !== b.bucket) return a.bucket === 'drawn' ? -1 : 1;
    if (a.bucket === 'drawn') {
      const at = a.closedAt ? new Date(a.closedAt).getTime() : 0;
      const bt = b.closedAt ? new Date(b.closedAt).getTime() : 0;
      return bt - at;
    }
    return a.taskName.localeCompare(b.taskName);
  });
  return result;
}
