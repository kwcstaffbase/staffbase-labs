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

## 3. Link each customer to its Staffbase instance (in the tracker — no hardcoding)

Nothing is mapped in the plugin. The plugin sends the identity it reads on its
own (instance **host**, and **slug** when available); the tracker matches it
against two columns on `customers` (added by migration
`20260623120000_staffbase_link.sql`):

- `staffbase_domain` — the instance frontend host, e.g. `ahconnect.agilonhealth.com`
- `staffbase_slug` — the branch slug, e.g. `agilonhealth` (optional)

Run the migration, then populate per customer:

```sql
update public.customers
  set staffbase_domain = 'ahconnect.agilonhealth.com', staffbase_slug = 'agilonhealth'
  where account_name = 'Agilon Health, Inc.';

update public.customers
  set staffbase_domain = 'energyhub.energy-northwest.com'
  where account_name = '<Energy Northwest account name>';
```

That's the only per-customer step, and it lives in the tracker (your system of
record) — not in the plugin. New customers work the moment their row has a
`staffbase_domain`.

## Notes

- `?account=all` on the plugin URL → internal all-customers table (also live).
- `?slug=<slug>` / `?account=<slug>` on the plugin URL → force a lookup (testing).
- The bundled seed data remains as the offline fallback only.
