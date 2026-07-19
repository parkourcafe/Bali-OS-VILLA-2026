/**
 * Vercel adapter for POST /api/demo-agent.
 * Canonical logic in netlify/functions/demo-agent.mjs (mirrors api/lead.mjs).
 */
import { handler } from '../netlify/functions/demo-agent.mjs';

async function readRawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body);
  return await new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => resolve(data));
    req.on('error', () => resolve(''));
  });
}

export default async function vercelDemoAgent(req, res) {
  const rawBody = await readRawBody(req);
  const result = await handler({ httpMethod: req.method, headers: req.headers, body: rawBody });
  res.status(result.statusCode);
  for (const [k, v] of Object.entries(result.headers || {})) res.setHeader(k, v);
  res.send(result.body);
}
