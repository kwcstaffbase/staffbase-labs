// GET /api/care-plan?host=<instanceHost>&slug=<branchSlug>   → one customer
// GET /api/care-plan?all=1                                    → all customers (admin)
//
// Maps a Staffbase instance to a PS Time Tracker account and relays the request
// to the tracker's /api/public/care-plan endpoint server-to-server (no CORS,
// the bearer secret never reaches the browser).
//
// Config (Vercel env vars):
//   TRACKER_BASE_URL   e.g. https://ps-time-tracker.vercel.app
//   CARE_PLAN_API_KEY  same secret set on the tracker
//
// The host→account map is the integration point. Until the tracker stores a
// Staffbase domain/slug on each customer, map the instance host (most reliable
// identifier the plugin has) to the tracker account name (or accountId).
const HOST_TO_ACCOUNT = {
  'ahconnect.agilonhealth.com': { account: 'Agilon Health, Inc.' },
  'insite.utmck.edu': { account: 'UT Medical Center' },
};

// Optional: map the Staffbase branch slug too, used only if the plugin manages
// to resolve a slug (it usually can't read it cross-origin — host is primary).
const SLUG_TO_ACCOUNT = {
  agilonhealth: { account: 'Agilon Health, Inc.' },
  utmc: { account: 'UT Medical Center' },
};

function lookupQuery(q) {
  const host = String(q.host || '').toLowerCase();
  const slug = String(q.slug || '');
  const mapped = HOST_TO_ACCOUNT[host] || SLUG_TO_ACCOUNT[slug];
  if (mapped && mapped.accountId) return 'accountId=' + encodeURIComponent(mapped.accountId);
  if (mapped && mapped.account) return 'account=' + encodeURIComponent(mapped.account);
  if (slug) return 'slug=' + encodeURIComponent(slug); // let the tracker try engagement.slug
  return null;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const base = process.env.TRACKER_BASE_URL;
  const key = process.env.CARE_PLAN_API_KEY;
  if (!base || !key) {
    res.status(503).json({ ok: false, error: 'Tracker integration not configured.' });
    return;
  }

  const q = req.query || {};
  const qs = q.all === '1' ? 'all=1' : lookupQuery(q);
  if (!qs) {
    res.status(200).json({ found: false });
    return;
  }

  try {
    const r = await fetch(base.replace(/\/$/, '') + '/api/public/care-plan?' + qs, {
      headers: { Authorization: 'Bearer ' + key, Accept: 'application/json' },
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) {
      res.status(502).json({ ok: false, error: 'Tracker responded ' + r.status });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ ok: false, error: err && err.message ? err.message : String(err) });
  }
};
