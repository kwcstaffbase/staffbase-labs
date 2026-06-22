const TOKEN_KEY = 'sblabs_api_token';

export type InstallState = 'idle' | 'loading' | 'success' | 'error';

export interface InstallResult {
  success: boolean;
  error?: string;
}

/**
 * POST /api/branch/widgets on the customer's Staffbase instance.
 * Requires an API token saved in localStorage by the admin backoffice view.
 *
 * @param instanceOrigin - Full origin of the Staffbase instance from the JWT iss claim
 *                         e.g. "https://cckelvin.staffbase.com" or "https://intranet.company.com"
 * @param bundleUrl      - CDN URL of the widget JS bundle
 * @param elementName    - Custom element name registered by the bundle
 */
export async function installWidget(
  instanceOrigin: string | null,
  bundleUrl: string,
  elementName: string,
): Promise<InstallResult> {
  const apiToken = localStorage.getItem(TOKEN_KEY);

  if (!apiToken) {
    return {
      success: false,
      error: 'No API token configured. An administrator must add the token via the plugin admin settings.',
    };
  }

  if (!instanceOrigin) {
    return {
      success: false,
      error: 'Could not determine your Staffbase instance. Open this plugin from inside your Staffbase platform.',
    };
  }

  const endpoint = `${instanceOrigin}/api/branch/widgets`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${apiToken}`,
      },
      body: JSON.stringify({
        url: bundleUrl,
        elements: [elementName],
        attributes: [],
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      const preview = body ? `: ${body.slice(0, 140)}` : '';
      return { success: false, error: `API error ${response.status}${preview}` };
    }

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Surface CORS failures with a more helpful message
    if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network')) {
      return {
        success: false,
        error: 'Network request blocked. The Staffbase API may not allow cross-origin requests from this plugin. Contact your administrator.',
      };
    }
    return { success: false, error: msg };
  }
}

/**
 * Normalized view of what is already installed on the instance.
 * `ok: false` means the check could not be completed (no token, network,
 * unexpected shape) — callers should fail OPEN and still allow installing.
 */
export interface InstalledLookup {
  ok: boolean;
  error?: string;
  /** Lowercased bundle URLs currently registered on the instance. */
  urls: Set<string>;
  /** Custom element names currently registered on the instance. */
  elements: Set<string>;
}

/**
 * GET the custom widgets already registered on the instance.
 *
 * Custom script widgets are listed at /api/widgets (NOT /api/branch/widgets,
 * which is write-only, and NOT the Installations API). Each item is shaped:
 *   { id, url, elements: string[], attributes, flagProtected }
 * The parser still accepts a bare array or a {data:[]} / {widgets:[]} wrapper
 * defensively, and matches a solution by its bundle `url` or `elements` tag.
 */
// List endpoint is uncertain with the cross-origin Basic token:
// /api/widgets works with a session cookie, but the token may require the
// branch-scoped path (same one POST uses). Try both; first that returns a
// usable list wins. Logs the outcome to the console for diagnosis.
const WIDGET_LIST_PATHS = ['/api/widgets', '/api/branch/widgets'];

export async function fetchInstalledWidgets(
  instanceOrigin: string | null,
): Promise<InstalledLookup> {
  const empty: InstalledLookup = { ok: false, urls: new Set(), elements: new Set() };
  const apiToken = localStorage.getItem(TOKEN_KEY);

  if (!apiToken) return { ...empty, error: 'No API token configured.' };
  if (!instanceOrigin) return { ...empty, error: 'Could not determine your Staffbase instance.' };

  let lastError = 'No endpoint returned a widget list.';

  for (const path of WIDGET_LIST_PATHS) {
    try {
      const response = await fetch(`${instanceOrigin}${path}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${apiToken}`,
        },
      });

      if (!response.ok) {
        lastError = `GET ${path} → HTTP ${response.status}`;
        continue;
      }

      const body: unknown = await response.json().catch(() => null);

      const list: unknown[] = Array.isArray(body)
        ? body
        : Array.isArray((body as { data?: unknown[] })?.data)
          ? (body as { data: unknown[] }).data
          : Array.isArray((body as { widgets?: unknown[] })?.widgets)
            ? (body as { widgets: unknown[] }).widgets
            : [];

      const urls = new Set<string>();
      const elements = new Set<string>();

      for (const item of list) {
        const w = item as { url?: unknown; elements?: unknown; element?: unknown };
        if (typeof w.url === 'string') urls.add(w.url.toLowerCase());
        const els = w.elements ?? w.element ?? [];
        (Array.isArray(els) ? els : [els]).forEach((e) => {
          if (typeof e === 'string') elements.add(e);
        });
      }

      console.info(`[sblabs] install check OK via GET ${path}: ${list.length} widget(s) registered`);
      return { ok: true, urls, elements };
    } catch (err) {
      lastError = `GET ${path} → ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  console.warn(`[sblabs] install check failed (button fails open): ${lastError}`);
  return { ...empty, error: lastError };
}

/** True if a solution's bundle is already registered on the instance. */
export function isWidgetInstalled(
  lookup: InstalledLookup,
  bundleUrl: string,
  elementName: string,
): boolean {
  return lookup.elements.has(elementName) || lookup.urls.has(bundleUrl.toLowerCase());
}
