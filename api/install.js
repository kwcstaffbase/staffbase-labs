// POST /api/install  { instanceOrigin, bundleUrl, elementName }
// Checks server-side whether the widget is already registered; installs only
// if it is not. This makes the duplicate guard authoritative (the browser can
// no longer bypass it) and keeps the API token on the server.
const { validateOrigin, listWidgets, isInstalled, installWidget } = require('./_staffbase');

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return await new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  // The per-instance token is supplied by the client (entered by the admin and
  // kept in their browser), passed here in a header, and used only to relay the
  // call server-side. It is never stored on the server.
  const token = req.headers['x-sb-api-token'];
  if (!token) {
    res.status(400).json({ ok: false, error: 'No API token provided. Configure it in the plugin admin settings.' });
    return;
  }

  const body = await readJson(req);
  const origin = validateOrigin(body.instanceOrigin);
  const bundleUrl = body.bundleUrl;
  const elementName = body.elementName;

  if (!origin || !bundleUrl || !elementName) {
    res.status(400).json({ ok: false, error: 'instanceOrigin, bundleUrl and elementName are required.' });
    return;
  }

  // Authoritative duplicate guard.
  const lookup = await listWidgets(origin, token);
  if (lookup.ok && isInstalled(lookup, bundleUrl, elementName)) {
    res.status(200).json({ ok: true, alreadyInstalled: true, installed: false });
    return;
  }

  const result = await installWidget(origin, token, bundleUrl, elementName);
  if (!result.ok) {
    res.status(502).json({ ok: false, error: result.error });
    return;
  }

  res.status(200).json({ ok: true, alreadyInstalled: false, installed: true });
};
