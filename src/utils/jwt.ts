export interface StaffbaseJWTPayload {
  sub?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  instance_id?: string;
  tenant?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export interface UserContext {
  userId: string | null;
  email: string | null;
  name: string | null;
  instanceId: string | null;
  tenant: string | null;
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
    tenant: null,
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
    tenant: payload.tenant ?? null,
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
  if (user.email) lines.push(`Requested by: ${user.email}`);
  if (user.name) lines.push(`Name: ${user.name}`);

  const params = new URLSearchParams({
    ticket_form_id: formId,
    'tf_subject': subject,
    'tf_description': lines.join('\n'),
  });

  return `${base}?${params.toString()}`;
}
