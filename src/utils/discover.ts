// Reads the Staffbase branch slug from the instance's /auth/discover endpoint.
//
// When the plugin runs embedded in a customer's Staffbase instance, the parent
// page origin (document.referrer / JWT iss) tells us which instance we're on.
// /auth/discover is a session endpoint, so the call is made with credentials so
// the browser sends the user's instance session cookie. Whether the response is
// readable cross-origin depends on the instance allowing the plugin origin via
// CORS; if it doesn't, this resolves to null and the caller falls back to the
// instanceId map or an explicit ?slug= / ?account= override.

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
      credentials: 'include',
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
