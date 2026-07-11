/**
 * API client for POST /api/lead (FINAL TZ §10).
 * The browser sends raw answers only; the server result is canonical.
 */

const ENDPOINT = '/api/lead';

export function uuid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  // RFC4122-ish fallback for very old browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * @returns {Promise<object>} parsed JSON body; throws {code,message} on failure
 */
export async function postLead(body) {
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw { code: 'NETWORK', message: "We couldn't reach the server." };
  }
  let json = null;
  try {
    json = await res.json();
  } catch { /* fallthrough */ }
  if (!json || json.ok !== true) {
    throw {
      code: (json && json.code) || 'INTERNAL_ERROR',
      message: (json && json.message) || 'Something went wrong. Please try again.',
    };
  }
  return json;
}
