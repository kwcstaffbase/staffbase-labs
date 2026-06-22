// The client no longer calls the Staffbase API directly. It calls our own
// same-origin serverless functions under /api, which relay to the instance
// server-side (no browser CORS). The per-instance API token is entered by the
// admin, kept in localStorage, and passed to the proxy in the x-sb-api-token
// header — it is not stored on the server.

const TOKEN_KEY = 'sblabs_api_token';
const TOKEN_HEADER = 'x-sb-api-token';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export type InstallState = 'idle' | 'loading' | 'success' | 'error';

export interface InstallResult {
  success: boolean;
  error?: string;
  alreadyInstalled?: boolean;
}

/**
 * Install a widget via the server-side proxy. The proxy performs its own
 * duplicate check before registering, so this is the authoritative guard.
 */
export async function installWidget(
  instanceOrigin: string | null,
  bundleUrl: string,
  elementName: string,
): Promise<InstallResult> {
  if (!instanceOrigin) {
    return {
      success: false,
      error: 'Could not determine your Staffbase instance. Open this plugin from inside your Staffbase platform.',
    };
  }

  const token = getToken();
  if (!token) {
    return {
      success: false,
      error: 'No API token configured. An administrator must add the token via the plugin admin settings.',
    };
  }

  try {
    const response = await fetch('/api/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', [TOKEN_HEADER]: token },
      body: JSON.stringify({ instanceOrigin, bundleUrl, elementName }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data || data.ok === false) {
      return { success: false, error: (data && data.error) || `Install failed (HTTP ${response.status})` };
    }
    return { success: true, alreadyInstalled: !!data.alreadyInstalled };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Normalized view of what is already installed on the instance.
 * `ok: false` means the check could not be completed — callers should fail
 * OPEN and still allow installing (the server-side guard is the real backstop).
 */
export interface InstalledLookup {
  ok: boolean;
  error?: string;
  urls: Set<string>;
  elements: Set<string>;
}

/** Ask the proxy which widgets are registered on the instance. */
export async function fetchInstalledWidgets(
  instanceOrigin: string | null,
): Promise<InstalledLookup> {
  const empty: InstalledLookup = { ok: false, urls: new Set(), elements: new Set() };
  if (!instanceOrigin) return { ...empty, error: 'Could not determine your Staffbase instance.' };

  const token = getToken();
  if (!token) return { ...empty, error: 'No API token configured.' };

  try {
    const response = await fetch(
      `/api/installed-widgets?instanceOrigin=${encodeURIComponent(instanceOrigin)}`,
      { headers: { 'Accept': 'application/json', [TOKEN_HEADER]: token } },
    );

    const data = await response.json().catch(() => null);
    if (!response.ok || !data || data.ok === false) {
      return { ...empty, error: (data && data.error) || `HTTP ${response.status}` };
    }

    const urls = new Set<string>((data.urls || []).map((u: string) => u.toLowerCase()));
    const elements = new Set<string>(data.elements || []);
    return { ok: true, urls, elements };
  } catch (err) {
    return { ...empty, error: err instanceof Error ? err.message : String(err) };
  }
}

/** True if a solution's bundle is already registered on the instance. */
export function isWidgetInstalled(
  lookup: InstalledLookup,
  bundleUrl: string,
  elementName: string,
): boolean {
  return lookup.elements.has(elementName) || lookup.urls.has(bundleUrl.toLowerCase());
}
