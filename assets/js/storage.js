/**
 * Session state — sessionStorage only (FINAL TZ §18).
 * No PII in localStorage, URLs or analytics.
 */

const KEYS = Object.freeze({
  quizState: 'villaReadiness.quizState',
  result: 'villaReadiness.result',
  leadId: 'villaReadiness.leadId',
  startedAt: 'villaReadiness.startedAt',
  utm: 'villaReadiness.utm',
});

function read(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) — quiz still works in memory */
  }
}

export const storage = {
  getQuizState: () => read(KEYS.quizState),
  setQuizState: (s) => write(KEYS.quizState, s),
  getResult: () => read(KEYS.result),
  setResult: (r) => write(KEYS.result, r),
  getLeadId: () => read(KEYS.leadId),
  setLeadId: (id) => write(KEYS.leadId, id),
  getStartedAt: () => read(KEYS.startedAt),
  setStartedAt: (iso) => write(KEYS.startedAt, iso),
  getUtm: () => read(KEYS.utm),
  setUtm: (u) => write(KEYS.utm, u),
  clearAll() {
    try {
      Object.values(KEYS).forEach((k) => sessionStorage.removeItem(k));
    } catch { /* noop */ }
  },
};

/** Capture UTM params once per session (no PII). */
export function captureUtm() {
  try {
    if (storage.getUtm()) return;
    const p = new URLSearchParams(window.location.search);
    const utm = {
      source: p.get('utm_source') || '',
      medium: p.get('utm_medium') || '',
      campaign: p.get('utm_campaign') || '',
      content: p.get('utm_content') || '',
      term: p.get('utm_term') || '',
    };
    storage.setUtm(utm);
  } catch { /* noop */ }
}
