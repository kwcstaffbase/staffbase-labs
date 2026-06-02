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
 * @param tenant   - Staffbase tenant slug from the JWT (e.g. "cckelvin")
 * @param bundleUrl   - CDN URL of the widget JS bundle
 * @param elementName - Custom element name registered by the bundle
 */
export async function installWidget(
  tenant: string | null,
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

  if (!tenant) {
    return {
      success: false,
      error: 'Could not determine your Staffbase instance. Open this plugin from inside your Staffbase platform.',
    };
  }

  const endpoint = `https://${tenant}.staffbase.com/api/branch/widgets`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
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
