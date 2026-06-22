// Shared server-side helpers for talking to a Staffbase instance.
// Files prefixed with "_" are NOT exposed as routes by Vercel.
// The API token is read from the SB_API_TOKEN environment variable and never
// leaves the server.

// Where custom widgets are listed. /api/widgets is the session-context path;
// /api/branch/widgets is the branch-scoped path the token uses for POST. We
// try both so the duplicate check works whichever one the token can read.
const LIST_PATHS = ['/api/widgets', '/api/branch/widgets'];

/** Returns the validated https origin, or null if invalid. */
function validateOrigin(value) {
  try {
    const u = new URL(String(value));
    if (u.protocol !== 'https:') return null;
    return u.origin;
  } catch {
    return null;
  }
}

/** Fetch the widgets registered on the instance, normalized to url/element lists. */
async function listWidgets(origin, token) {
  let lastError = 'No endpoint returned a widget list.';

  for (const path of LIST_PATHS) {
    try {
      const r = await fetch(origin + path, {
        headers: { Accept: 'application/json', Authorization: 'Basic ' + token },
      });

      if (!r.ok) {
        lastError = `GET ${path} -> HTTP ${r.status}`;
        continue;
      }

      const body = await r.json().catch(() => null);
      const list = Array.isArray(body)
        ? body
        : Array.isArray(body && body.data)
          ? body.data
          : Array.isArray(body && body.widgets)
            ? body.widgets
            : [];

      const urls = [];
      const elements = [];
      for (const item of list) {
        if (item && typeof item.url === 'string') urls.push(item.url.toLowerCase());
        const els = (item && (item.elements || item.element)) || [];
        (Array.isArray(els) ? els : [els]).forEach((e) => {
          if (typeof e === 'string') elements.push(e);
        });
      }

      return { ok: true, via: path, count: list.length, urls, elements };
    } catch (e) {
      lastError = `GET ${path} -> ${e && e.message ? e.message : String(e)}`;
    }
  }

  return { ok: false, error: lastError, urls: [], elements: [] };
}

/** True if a bundle is already registered (by element tag or bundle URL). */
function isInstalled(lookup, bundleUrl, elementName) {
  return (
    lookup.elements.includes(elementName) ||
    lookup.urls.includes(String(bundleUrl).toLowerCase())
  );
}

/** Register a custom widget on the instance. */
async function installWidget(origin, token, bundleUrl, elementName) {
  const r = await fetch(origin + '/api/branch/widgets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Basic ' + token,
    },
    body: JSON.stringify({ url: bundleUrl, elements: [elementName], attributes: [] }),
  });

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    return { ok: false, error: `POST /api/branch/widgets -> HTTP ${r.status}${text ? ': ' + text.slice(0, 160) : ''}` };
  }
  return { ok: true };
}

module.exports = { validateOrigin, listWidgets, isInstalled, installWidget };
