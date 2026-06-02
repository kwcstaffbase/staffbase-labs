export interface StaffbaseJWTPayload {
  sub?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  instance_id?: string;
  tenant?: string;
  iss?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export interface UserContext {
  userId: string | null;
  email: string | null;
  name: string | null;
  instanceId: string | null;
  /**
   * The full origin of the Staffbase instance extracted from the JWT `iss` claim.
   * e.g. "https://cckelvin.staffbase.com" or "https://intranet.company.com"
   * Used as the base URL for API calls — works with custom domains.
   */
  instanceOrigin: string | null;
}

/**
 * The Staffbase plugin runs inside an iframe embedded on the customer's
 * Staffbase instance. The browser sets document.referrer to the parent
 * page URL automatically, giving us the exact origin regardless of whether
 * the customer uses a staffbase.com subdomain or a custom domain.
 *
 * Falls back to parsing the JWT `iss` claim in case referrer is absent
 * (e.g. when opened directly in a browser tab for testing).
 */
function resolveInstanceOrigin(issFromJwt?: string): string | null {
  // Primary: use the parent page origin via document.referrer
  if (document.referrer) {
    try {
      const { origin } = new URL(document.referrer);
      if (origin && origin !== 'null') return origin;
    } catch {
      // fall through
    }
  }

  // Fallback: try to parse iss as a URL (some Staffbase environments set it
  // to a full URL rather than the plain string "staffbase-backend-live")
  if (issFromJwt) {
    try {
      const { origin } = new URL(issFromJwt);
      if (origin && origin !== 'null') return origin;
    } catch {
      // iss is not a URL — nothing more we can do
    }
  }

  return null;
}

export function parseJWT(token: string): StaffbaseJWTPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)) as StaffbaseJWTPayload;
  } catch {
    return null;
  }
}

export function getUserContext(): UserContext {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('jwt');

  const empty: UserContext = {
    userId: null,
    email: null,
    name: null,
    instanceId: null,
    instanceOrigin: null,
  };

  if (!token) return empty;

  const payload = parseJWT(token);
  if (!payload) return empty;

  const fullName =
    payload.name ??
    ([payload.given_name, payload.family_name].filter(Boolean).join(' ') || null);

  return {
    userId: payload.sub ?? null,
    email: payload.email ?? null,
    name: fullName,
    instanceId: payload.instance_id ?? payload.tenant ?? null,
    instanceOrigin: resolveInstanceOrigin(payload.iss),
  };
}

/** Build a Zendesk new-request URL pre-populated with solution and user context. */
export function buildZendeskUrl(
  solutionTitle: string,
  user: UserContext,
  formId = 'ZENDESK_FORM_ID',
): string {
  const base = 'https://staffbase.zendesk.com/hc/en-us/requests/new';
  const subject = `Add to Instance: ${solutionTitle}`;

  const lines = [`Solution: ${solutionTitle}`];
  if (user.instanceId) lines.push(`Instance: ${user.instanceId}`);
  if (user.instanceOrigin) lines.push(`Instance URL: ${user.instanceOrigin}`);
  if (user.email) lines.push(`Requested by: ${user.email}`);
  if (user.name) lines.push(`Name: ${user.name}`);

  const params = new URLSearchParams({
    ticket_form_id: formId,
    'tf_subject': subject,
    'tf_description': lines.join('\n'),
  });

  return `${base}?${params.toString()}`;
}
