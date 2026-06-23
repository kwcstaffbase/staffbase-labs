// Reads the Staffbase branch slug from the instance's /auth/discover endpoint.
//
// When the plugin runs embedded in a customer's Staffbase instance, the parent
// page origin (document.referrer / JWT iss) tells us which instance we're on.
// /auth/discover returns branding for that domain, including the branch slug.
//
// IMPORTANT: this is a NO-credentials (anonymous) cross-origin GET. Staffbase
// serves discover with `Access-Control-Allow-Origin: *`, which the browser
// rejects for credentialed requests — so we must NOT send credentials.
//
// The catch: the AUTHENTICATED discover nests branch under `user.branch`, but
// the ANONYMOUS payload has no `user` object and nests branch elsewhere. Rather
// than guess the exact path, we deep-scan the JSON for the branch object — the
// only object that carries string `id`, `name` AND `slug` together.

export interface BranchInfo {
  slug: string | null;
  name: string | null;
  id: string | null;
}

// Recursively find the first object that looks like a branch: string id+name+slug.
function findBranch(node: unknown, depth = 0): BranchInfo | null {
  if (!node || typeof node !== 'object' || depth > 8) return null;
  const obj = node as Record<string, unknown>;
  if (
    typeof obj.slug === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.id === 'string'
  ) {
    return { slug: obj.slug, name: obj.name, id: obj.id };
  }
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const found = findBranch(value, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

export async function fetchBranchInfo(instanceOrigin: string | null): Promise<BranchInfo | null> {
  if (!instanceOrigin) return null;
  try {
    const res = await fetch(`${instanceOrigin}/auth/discover`, {
      method: 'GET',
      credentials: 'omit',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      console.warn('[CareHours] discover HTTP', res.status, instanceOrigin);
      return null;
    }
    const data = await res.json().catch(() => null);
    if (!data) {
      console.warn('[CareHours] discover returned no JSON', instanceOrigin);
      return null;
    }

    // Preferred explicit paths, then a guarded deep scan for the branch object.
    const candidate =
      (data?.user?.branch as Record<string, unknown> | undefined) ??
      (data?.branch as Record<string, unknown> | undefined);
    const info =
      (candidate && findBranch(candidate)) || findBranch(data);

    if (!info) {
      console.warn('[CareHours] discover: no branch object found', instanceOrigin, Object.keys(data));
      return null;
    }
    console.info('[CareHours] discover slug =', info.slug, 'from', instanceOrigin);
    return info;
  } catch (err) {
    console.warn('[CareHours] discover fetch failed', instanceOrigin, err);
    return null; // network / CORS failure — caller falls back
  }
}
