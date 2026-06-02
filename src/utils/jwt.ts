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
 * Normalise the JWT `iss` claim to a bare origin (no trailing slash).
 * iss is typically the full instance URL, e.g.
 *   "https://cckelvin.staffbase.com"
 *   "https://intranet.company.com"
 */
function originFromIss(iss?: string): string | null {
  if (!iss) return null;
  try {
    const { origin } = new URL(iss);
    return origin !== 'null' ? origin : null;
  } catch {
    return null;
  }
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
    instanceOrigin: originFromIss(payload.iss),
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
