// GET /api/care-plan?host=<instanceHost>&slug=<branchSlug>   → one customer
// GET /api/care-plan?all=1                                    → all customers (admin)
//
// Relays to the PS Time Tracker's /api/public/care-plan endpoint server-to-server
// (no CORS, the bearer secret never reaches the browser). Nothing is hardcoded:
// the plugin sends the identity it derived on its own (instance host, and slug
// when available) and the tracker matches it against the staffbase_domain /
// staffbase_slug columns it stores per customer.
//
// Config (Vercel env vars):
//   TRACKER_BASE_URL   e.g. https://ps-time-tracker.vercel.app
//   CARE_PLAN_API_KEY  same secret set on the tracker

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
  const params = new URLSearchParams();
  if (q.all === '1') {
    params.set('all', '1');
  } else {
    if (q.host) params.set('domain', String(q.host)); // tracker matches staffbase_domain
    if (q.slug) params.set('slug', String(q.slug)); // tracker matches staffbase_slug
    if (![...params.keys()].length) {
      res.status(200).json({ found: false });
      return;
    }
  }

  try {
    const r = await fetch(base.replace(/\/$/, '') + '/api/public/care-plan?' + params.toString(), {
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
