/**
 * Vercel adapter for POST /api/lead.
 *
 * Vercel serverless functions live in /api and use (req, res); the canonical
 * logic lives once in netlify/functions/lead.mjs. This thin wrapper reshapes a
 * Vercel request into the Netlify-style event and forwards the response, so the
 * same validation + canonical scoring runs on either host with no duplication.
 *
 * Required Vercel environment variables (Project Settings -> Environment Variables):
 *   APPS_SCRIPT_WEBHOOK_URL, APPS_SCRIPT_SHARED_SECRET, ALLOWED_ORIGIN, IP_HASH_SALT
 */
import { handler } from '../netlify/functions/lead.mjs';

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

export default async function vercelLead(req, res) {
  const rawBody = await readRawBody(req);
  const event = {
    httpMethod: req.method,
    headers: req.headers, // Vercel provides lowercased header keys + x-forwarded-for
    body: rawBody,
  };
  const result = await handler(event);
  res.status(result.statusCode);
  for (const [k, v] of Object.entries(result.headers || {})) res.setHeader(k, v);
  res.send(result.body);
}
