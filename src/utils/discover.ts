// Reads the Staffbase branch slug from the instance's /auth/discover endpoint.
//
// When the plugin runs embedded in a customer's Staffbase instance, the parent
// page origin (document.referrer / JWT iss) tells us which instance we're on.
// /auth/discover returns the branch for that domain, including branch.slug.
//
// IMPORTANT: this is a NO-credentials (anonymous) cross-origin GET. branch.slug
// is a property of the domain, not the logged-in user, so it's present in the
// public discover payload — and Staffbase serves that endpoint with
// `Access-Control-Allow-Origin: *`. A wildcard ACAO is rejected by the browser
// if the request is credentialed, so we must NOT send credentials here.

export interface BranchInfo {
  slug: string | null;
  name: string | null;
  id: string | null;
}

export async function fetchBranchInfo(instanceOrigin: string | null): Promise<BranchInfo | null> {
  if (!instanceOrigin) return null;
  try {
    const res = await fetch(`${instanceOrigin}/auth/discover`, {
      method: 'GET',
      credentials: 'omit',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    const branch = data?.user?.branch;
    if (!branch) return null;
    return {
      slug: typeof branch.slug === 'string' ? branch.slug : null,
      name: typeof branch.name === 'string' ? branch.name : null,
      id: typeof branch.id === 'string' ? branch.id : null,
    };
  } catch {
    return null; // network / CORS failure — caller falls back
  }
}
