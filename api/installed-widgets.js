// GET /api/installed-widgets?instanceOrigin=https://<instance>
// Returns the normalized list of registered widgets so the client can decide
// whether a solution's "Add to Instance" button should be disabled.
const { validateOrigin, listWidgets } = require('./_staffbase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  // Per-instance token supplied by the client in a header (see install.js).
  const token = req.headers['x-sb-api-token'];
  if (!token) {
    res.status(400).json({ ok: false, error: 'No API token provided. Configure it in the plugin admin settings.' });
    return;
  }

  const origin = validateOrigin(req.query && req.query.instanceOrigin);
  if (!origin) {
    res.status(400).json({ ok: false, error: 'Missing or invalid instanceOrigin.' });
    return;
  }

  const lookup = await listWidgets(origin, token);
  res.status(lookup.ok ? 200 : 502).json(lookup);
};
