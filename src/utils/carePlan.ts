// Loads care-plan data from the plugin's own /api/care-plan proxy, which relays
// to the PS Time Tracker server-to-server. Falls back to the bundled static
// seed when the proxy isn't configured or is unreachable, so local/preview
// builds still render.

import { CARE_PLAN_DATA, type CarePlanData } from '../data/sigCare';

export interface CarePlanResult {
  data: CarePlanData;
  found: boolean;
  live: boolean; // true when the answer came from the tracker (even if not found)
}

interface LoadOpts {
  host?: string | null;
  slug?: string | null;
  all?: boolean;
}

export async function loadCarePlan(opts: LoadOpts): Promise<CarePlanResult> {
  const qs = new URLSearchParams();
  if (opts.all) qs.set('all', '1');
  else {
    if (opts.host) qs.set('host', opts.host);
    if (opts.slug) qs.set('slug', opts.slug);
  }

  try {
    const res = await fetch(`/api/care-plan?${qs.toString()}`, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const d = await res.json().catch(() => null);
      if (d && d.found && Array.isArray(d.engagements)) {
        return {
          data: { engagements: d.engagements, tasks: Array.isArray(d.tasks) ? d.tasks : [], timeEntries: [] },
          found: true,
          live: true,
        };
      }
      if (d && d.found === false) {
        return { data: { engagements: [], tasks: [], timeEntries: [] }, found: false, live: true };
      }
    }
    // 503 (not configured) or any non-OK → fall through to static fallback.
    console.info('[CareHours] /api/care-plan unavailable (HTTP', res.status, ') — using bundled data');
  } catch (err) {
    console.info('[CareHours] /api/care-plan fetch failed — using bundled data', err);
  }

  return { data: CARE_PLAN_DATA, found: true, live: false };
}
