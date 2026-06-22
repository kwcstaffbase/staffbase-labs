# Staffbase Labs

A Staffbase custom plugin that lets platform administrators **browse, request, and install** custom widgets, plugins, and integrations built by the Staffbase Customer Care (CC) team — directly from inside their own Staffbase instance.

It is essentially an in-platform catalog/marketplace for the CC team's solution library.

---

## What it does

Staffbase Labs runs as an embedded plugin (`kind: custom-plugin`) inside a customer's Staffbase environment. It renders a catalog UI with three views:

- **Browse All** — every solution in the catalog.
- **Supported** — curated, production-ready solutions maintained by the CC team. Each has a detail page (overview, use cases, prerequisites, configuration options, screenshots) and a one-click **Add to Instance** install action.
- **Experimental** — early-stage / self-service solutions, surfaced via an embedded view of the [`solutions-monorepo`](https://staffbase.github.io/solutions-monorepo/) GitHub Pages site. These are forked and deployed by the user rather than installed in one click.

For supported solutions, "Add to Instance" calls the customer's Staffbase Branch Widgets API (`POST /api/branch/widgets`) with the solution's CDN bundle URL and custom element name, registering the widget on that instance.

---

## Catalog

**Supported (13):** Celebration Widget, Clocks Widget, Countdown Widget, Digital Business Card, Print Button Widget, Scrolling Banner, Text on Image Widget, Qualtrics Insights Widget, Weather Widget, Image Comparison Slider, New Starter Widget, Analytics Email Open Viewer, Company Stock Widget.

**Experimental (3):** DOM Embedder, Config Lang JS, Textflow JS.

Catalog content lives in `src/data/catalog.ts`. Install metadata (CDN bundle URL + custom element name per solution) lives in `src/data/bundles.ts`.

---

## How it works

### Authentication & user context
The plugin is loaded inside an iframe on the customer's Staffbase instance. Staffbase passes a signed **JWT** (RS256) as a `?jwt=` query parameter; the public key used to verify it is declared in `plugin.json`. `src/utils/jwt.ts` parses the token to extract the user (id, email, name) and the **instance origin** — resolved primarily from `document.referrer` and falling back to the JWT `iss` claim — so API calls work on both `*.staffbase.com` subdomains and custom domains.

### Install flow
`src/utils/api.ts` performs `POST {instanceOrigin}/api/branch/widgets` with the bundle URL and element name, authenticated with an API token. The token is configured by an administrator in the plugin's **admin view** and stored in browser `localStorage` (Phase 1 — see Known limitations).

### Request flow
`buildZendeskUrl()` in `src/utils/jwt.ts` constructs a pre-populated Staffbase Zendesk request (solution name, instance, requester) for solutions that are requested rather than self-installed.

---

## Architecture

- **Stack:** React 18 + TypeScript + Vite.
- **Two entry points:**
  - `index.html` → `src/main.tsx` → `App.tsx` — the main catalog UI.
  - `admin.html` → `src/admin.tsx` → `AdminApp.tsx` — the admin configuration screen (API token management).
- **Deployment:** static build output (`dist/`) hosted on Vercel at `https://staffbase-labs.vercel.app/` (see `vercel.json`). The hosted URLs are referenced by `plugin.json` (`entry.url` and `entry.adminUrl`).

```
src/
├── App.tsx                 # Main app shell + view routing
├── main.tsx                # Catalog entry point
├── admin.tsx               # Admin entry point
├── components/
│   ├── Header.tsx          # Top nav (Browse All / Supported / Experimental)
│   ├── CatalogView.tsx     # Grid of solution cards
│   ├── SolutionCard.tsx    # Single catalog card
│   ├── DetailView.tsx      # Solution detail + "Add to Instance"
│   ├── ExperimentalView.tsx# Embedded solutions-monorepo view
│   ├── AdminApp.tsx        # API token configuration
│   └── Icon.tsx
├── data/
│   ├── catalog.ts          # Solution definitions (content)
│   └── bundles.ts          # Bundle URLs + element names (install)
├── utils/
│   ├── jwt.ts              # JWT parsing, user context, Zendesk URL builder
│   └── api.ts              # Branch Widgets install call
└── styles/
    ├── index.css
    └── admin.css
```

---

## Development

```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc + vite build → dist/
npm run preview   # preview the production build
```

To test outside Staffbase, append a `?jwt=<token>` query parameter when opening the dev server so user context resolves.

---

## Plugin manifest

Defined in `plugin.json`:

- **id:** `staffbase.sblabs`
- **kind:** `custom-plugin`
- **permissions:** `user.read`
- **SSO:** RS256, public key embedded for JWT verification

---

## Known limitations (Phase 1)

- **API token storage:** the Branch Widgets API token is stored in browser `localStorage` and sent client-side as a `Basic` auth header. This is a temporary Phase 1 approach; the code flags migration to a secure server-side config store once API endpoints are defined.
- **Debug banner:** `App.tsx` renders a debug banner (JWT presence, `iss`, referrer, instance origin, token status) that is marked for removal before final release.
