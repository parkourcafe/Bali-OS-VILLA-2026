import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateResult, CATEGORY_MAX, CATEGORY_ORDER } from '../assets/js/scoring.js';

const BEST = {
  villaCount: 'ten_to_twenty_four', whoAnswers: 'reservation_staff',
  channels: ['whatsapp'], channelManagement: 'centralized',
  afterHours: 'rotation', responseTime: 'under_5m',
  qualification: 'structured', followUp: 'scheduled',
  escalation: 'documented', visibility: 'live_dashboard',
};
const WORST = {
  villaCount: 'one', whoAnswers: 'owner',
  channels: ['whatsapp', 'website', 'instagram', 'airbnb', 'booking_com'],
  channelManagement: 'no_process',
  afterHours: 'next_morning', responseTime: 'next_day_plus',
  qualification: 'rarely', followUp: 'none',
  escalation: 'shift_dependent', visibility: 'none',
};

test('category maxima sum to exactly 100', () => {
  assert.equal(Object.values(CATEGORY_MAX).reduce((a, b) => a + b, 0), 100);
});

test('maximum score is 100, low risk', () => {
  const r = calculateResult(BEST);
  assert.equal(r.score, 100);
  assert.equal(r.riskLevel, 'low');
  assert.equal(r.riskLabel, 'Low leakage risk');
  for (const c of CATEGORY_ORDER) assert.equal(r.categoryScores[c].score, r.categoryScores[c].max);
});

test('minimum score: worst answers with 5 unmanaged channels', () => {
  const r = calculateResult(WORST);
  // channelControl = max(0, 2 - 3) = 0; qualification=2, escalation=2, everything else 0
  assert.equal(r.score, 4);
  assert.equal(r.riskLevel, 'high');
  assert.equal(r.categoryScores.channelControl.score, 0);
});

test('spec worked example (§10.3) reproduces exactly', () => {
  const r = calculateResult({
    villaCount: 'ten_to_twenty_four', whoAnswers: 'reservation_staff',
    channels: ['whatsapp', 'website', 'instagram'],
    channelManagement: 'mixed_inboxes', afterHours: 'whoever_sees',
    responseTime: 'thirty_m_to_2h', qualification: 'usually_informal',
    followUp: 'manual', escalation: 'informal', visibility: 'asking_staff',
  });
  assert.equal(r.score, 48);
  assert.equal(r.riskLevel, 'medium_high');
  assert.deepEqual(r.categoryScores.response, { score: 10, max: 25, percentage: 0.4 });
  assert.deepEqual(r.categoryScores.qualification, { score: 13, max: 20, percentage: 0.65 });
  assert.deepEqual(r.categoryScores.followUp, { score: 12, max: 20, percentage: 0.6 });
  assert.deepEqual(r.categoryScores.channelControl, { score: 5, max: 15, percentage: 0.3333 });
  assert.deepEqual(r.categoryScores.escalation, { score: 5, max: 10, percentage: 0.5 });
  assert.deepEqual(r.categoryScores.visibility, { score: 3, max: 10, percentage: 0.3 });
  assert.equal(r.strongestArea, 'qualification');
  assert.deepEqual(r.riskAreas, ['visibility', 'channelControl', 'response']);
  assert.equal(r.gate, 'audit');
});

/** Build an input that lands on an exact total score. */
function scoreOf(input) {
  return calculateResult({ ...BEST, ...input }).score;
}

test('risk band boundaries 39/40, 59/60, 79/80 are inclusive as specified', () => {
  // 39: 100 - 61 → build precisely: response 25, qual 7, follow 4, cc max(0,2-0)=2, esc 10... easier: craft combos
  const cases = [
    // [expected score, expected level, overrides]
    [39, 'high', { afterHours: 'owner', responseTime: 'same_day', qualification: 'sometimes', followUp: 'unknown', channelManagement: 'mixed_inboxes', channels: ['whatsapp'], escalation: 'informal', visibility: 'asking_staff' }],
    // 8+3+7+4+6+5+3 = 36 — adjust to exactly 39: use visibility reports(7) → 40? compute below instead
  ];
  // Deterministic construction: qualification varies by 20/13/7/2, followUp 20/12/4/0 — search combos:
  function make(total) {
    // brute force over enum combos to find an exact total
    const AH = { rotation: 13, owner: 8, whoever_sees: 4, next_morning: 0 };
    const RT = { under_5m: 12, five_to_30m: 9, thirty_m_to_2h: 6, same_day: 3, next_day_plus: 0, unknown: 1 };
    const Q = { structured: 20, usually_informal: 13, sometimes: 7, rarely: 2 };
    const F = { scheduled: 20, manual: 12, unknown: 4, none: 0 };
    const CM = { centralized: 15, assigned_separate: 11, mixed_inboxes: 6, no_process: 2, unknown: 2 };
    const E = { documented: 10, informal: 5, shift_dependent: 2 };
    const V = { live_dashboard: 10, reports: 7, asking_staff: 3, none: 0 };
    for (const [ah, ahv] of Object.entries(AH))
      for (const [rt, rtv] of Object.entries(RT))
        for (const [q, qv] of Object.entries(Q))
          for (const [f, fv] of Object.entries(F))
            for (const [cm, cmv] of Object.entries(CM))
              for (const [e, ev] of Object.entries(E))
                for (const [v, vv] of Object.entries(V)) {
                  if (ahv + rtv + qv + fv + cmv + ev + vv === total) {
                    return { afterHours: ah, responseTime: rt, qualification: q, followUp: f, channelManagement: cm, escalation: e, visibility: v, channels: ['whatsapp'] };
                  }
                }
    throw new Error('no combo for ' + total);
  }
  for (const [total, level] of [[39, 'high'], [40, 'medium_high'], [59, 'medium_high'], [60, 'medium'], [79, 'medium'], [80, 'low']]) {
    const input = { ...BEST, ...make(total) };
    const r = calculateResult(input);
    assert.equal(r.score, total);
    assert.equal(r.riskLevel, level, `score ${total} should be ${level}`);
  }
});

test('channel control: 1 centralized channel → 15; 5 centralized → 12; 5 unmanaged → 0', () => {
  assert.equal(calculateResult({ ...BEST, channels: ['whatsapp'], channelManagement: 'centralized' }).categoryScores.channelControl.score, 15);
  assert.equal(calculateResult({ ...BEST, channels: ['whatsapp', 'website', 'instagram', 'airbnb', 'agoda'], channelManagement: 'centralized' }).categoryScores.channelControl.score, 12);
  assert.equal(calculateResult({ ...BEST, channels: ['whatsapp', 'website', 'instagram', 'airbnb', 'agoda'], channelManagement: 'no_process' }).categoryScores.channelControl.score, 0);
});

test('channel complexity penalty tiers: 2 → 0, 3 → -1, 4 → -1', () => {
  assert.equal(calculateResult({ ...BEST, channels: ['whatsapp', 'email'], channelManagement: 'centralized' }).categoryScores.channelControl.score, 15);
  assert.equal(calculateResult({ ...BEST, channels: ['whatsapp', 'email', 'phone'], channelManagement: 'centralized' }).categoryScores.channelControl.score, 14);
  assert.equal(calculateResult({ ...BEST, channels: ['whatsapp', 'email', 'phone', 'other'], channelManagement: 'centralized' }).categoryScores.channelControl.score, 14);
});

test('unknown responses score their specified low values', () => {
  const r = calculateResult({ ...BEST, responseTime: 'unknown', followUp: 'unknown', channelManagement: 'unknown' });
  assert.equal(r.categoryScores.response.score, 13 + 1);
  assert.equal(r.categoryScores.followUp.score, 4);
  assert.equal(r.categoryScores.channelControl.score, 2);
});

test('strongest-area tie breaks by reverse display order (visibility first)', () => {
  const r = calculateResult(BEST); // all at 100%
  assert.equal(r.strongestArea, 'visibility');
});

test('risk-area tie breaks by priority follow-up > response > qualification > channelControl > escalation > visibility', () => {
  const r = calculateResult(WORST);
  // percentages: response 0, followUp 0, visibility 0, channelControl 0, qualification .1, escalation .2
  assert.deepEqual(r.riskAreas, ['followUp', 'response', 'channelControl']);
});

test('missing answers throw', () => {
  assert.throws(() => calculateResult({ ...BEST, followUp: undefined }));
  assert.throws(() => calculateResult({ ...BEST, channels: [] }));
});

test('invalid enum values throw', () => {
  assert.throws(() => calculateResult({ ...BEST, escalation: 'yes' }));
});
