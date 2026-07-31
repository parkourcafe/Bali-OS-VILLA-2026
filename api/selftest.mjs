/**
 * Vercel adapter for GET /api/selftest — setup diagnostics.
 *
 *   /api/selftest?secret=<IP_HASH_SALT>          → what is configured
 *   /api/selftest?secret=<IP_HASH_SALT>&send=1   → also deliver a test message
 *
 * Canonical logic lives in lib/selftest.mjs; this only reshapes the request.
 */
import { selftestHandler } from '../lib/selftest.mjs';

export default async function vercelSelftest(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const result = await selftestHandler({
    query: Object.fromEntries(url.searchParams),
    env: process.env,
  });
  res.status(result.statusCode);
  for (const [k, v] of Object.entries(result.headers || {})) res.setHeader(k, v);
  res.send(result.body);
}
