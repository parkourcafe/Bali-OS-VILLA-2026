/**
 * Vercel adapter for POST /api/demo-request.
 * Canonical logic lives in netlify/functions/demo-request.mjs — this wrapper
 * reshapes a Vercel (req, res) into the Netlify-style event, mirroring api/lead.mjs.
 */
import { handler } from '../netlify/functions/demo-request.mjs';

async function readRawBody(req) {
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body); // Vercel pre-parsed JSON
  return await new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', () => resolve(''));
  });
}

export default async function vercelDemoRequest(req, res) {
  const rawBody = await readRawBody(req);
  const event = {
    httpMethod: req.method,
    headers: req.headers,
    body: rawBody,
  };
  const result = await handler(event);
  res.status(result.statusCode);
  for (const [k, v] of Object.entries(result.headers || {})) res.setHeader(k, v);
  res.send(result.body);
}
