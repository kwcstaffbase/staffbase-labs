# Care Hours — live data integration

The Care Hours page reads real hours from the **PS Time Tracker** (Supabase) at
runtime, instead of the bundled seed data. Data flows server-to-server so the
secret never reaches the browser and there's no CORS:

```
Plugin (browser)  ──>  Plugin /api/care-plan (Vercel fn)  ──Bearer──>  Tracker /api/public/care-plan  ──>  Supabase (service role)
```

If the proxy isn't configured, the plugin falls back to the bundled seed data,
so local/preview builds still render.

## 1. PS Time Tracker (the Supabase app)

New endpoint: `GET /api/public/care-plan` (added in `src/app/api/public/care-plan/route.ts`).
It authenticates with a bearer secret and reads via the service-role client.

Set env vars on the tracker's deployment:

| Var | Value |
| --- | --- |
| `CARE_PLAN_API_KEY` | a long random string (the shared secret) |
| `SUPABASE_SERVICE_ROLE_KEY` | already required by the app |

Deploy the tracker. Quick check (replace host + key):

```
curl -H "Authorization: Bearer $CARE_PLAN_API_KEY" \
  "https://<tracker-host>/api/public/care-plan?account=Agilon%20Health%2C%20Inc."
```

Should return `{ "found": true, "engagements": [...], "tasks": [...] }`.

## 2. Staffbase Labs plugin

New proxy: `api/care-plan.js`. Set env vars on the plugin's Vercel project:

| Var | Value |
| --- | --- |
| `TRACKER_BASE_URL` | e.g. `https://<tracker-host>` |
| `CARE_PLAN_API_KEY` | **same** secret as the tracker |

Deploy the plugin.

## 3. Map each instance to a tracker account

The plugin can reliably read the instance **host** (e.g. `ahconnect.agilonhealth.com`),
not the branch slug (that needs an authenticated call we can't make cross-origin).
Edit the map in `api/care-plan.js`:

```js
const HOST_TO_ACCOUNT = {
  'ahconnect.agilonhealth.com': { account: 'Agilon Health, Inc.' },
  'insite.utmck.edu':          { account: 'UT Medical Center' },
};
```

`account` matches the tracker's `account_name` (case-insensitive). You can use
`{ accountId: '<tracker account_id>' }` instead for an exact match.

### Removing the map later (optional)

To drop the per-host map entirely, add a `staffbase_domain` (and/or
`staffbase_slug`) column to the tracker's `customers` table, populate it, and
have the endpoint match on it. Then the proxy can pass the host straight through.

## Notes

- `?account=all` on the plugin URL → internal all-customers table (also live).
- `?slug=<slug>` / `?account=<slug>` on the plugin URL → force a lookup (testing).
- The bundled seed data remains as the offline fallback only.
