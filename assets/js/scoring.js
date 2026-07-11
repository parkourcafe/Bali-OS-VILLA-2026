/**
 * Canonical scoring model — Villa Response Readiness Score.
 * Single source of truth for browser preview AND server calculation.
 * Locked business rules per FINAL_TZ_VILLA_RESPONSE_READINESS_V1.md §9.
 * Do NOT edit weights, bands or tie-breakers without a new approved spec.
 * Pure module: no DOM, no I/O, no Date.
 */

export const ENUMS = Object.freeze({
  villaCount: ['one', 'two_to_four', 'five_to_nine', 'ten_to_twenty_four', 'twenty_five_plus'],
  whoAnswers: ['owner', 'manager', 'reservation_staff', 'mixed', 'external_agency'],
  channels: ['whatsapp', 'website', 'instagram', 'airbnb', 'booking_com', 'agoda', 'email', 'phone', 'other'],
  channelManagement: ['centralized', 'assigned_separate', 'mixed_inboxes', 'no_process', 'unknown'],
  afterHours: ['rotation', 'owner', 'whoever_sees', 'next_morning'],
  responseTime: ['under_5m', 'five_to_30m', 'thirty_m_to_2h', 'same_day', 'next_day_plus', 'unknown'],
  qualification: ['structured', 'usually_informal', 'sometimes', 'rarely'],
  followUp: ['scheduled', 'manual', 'none', 'unknown'],
  escalation: ['documented', 'informal', 'shift_dependent'],
  visibility: ['live_dashboard', 'reports', 'asking_staff', 'none'],
  headache: ['slow_first_response', 'repetitive_questions', 'guests_disappear', 'staff_overloaded',
    'no_follow_up', 'too_many_channels', 'owner_communication', 'not_sure', 'other', ''],
});

const AFTER_HOURS_POINTS = { rotation: 13, owner: 8, whoever_sees: 4, next_morning: 0 };            // max 13
const RESPONSE_TIME_POINTS = { under_5m: 12, five_to_30m: 9, thirty_m_to_2h: 6, same_day: 3, next_day_plus: 0, unknown: 1 }; // max 12
const QUALIFICATION_POINTS = { structured: 20, usually_informal: 13, sometimes: 7, rarely: 2 };     // max 20
const FOLLOW_UP_POINTS = { scheduled: 20, manual: 12, unknown: 4, none: 0 };                        // max 20
const CHANNEL_MGMT_POINTS = { centralized: 15, assigned_separate: 11, mixed_inboxes: 6, no_process: 2, unknown: 2 }; // max 15
const ESCALATION_POINTS = { documented: 10, informal: 5, shift_dependent: 2 };                      // max 10
const VISIBILITY_POINTS = { live_dashboard: 10, reports: 7, asking_staff: 3, none: 0 };             // max 10

export const CATEGORY_MAX = Object.freeze({
  response: 25, qualification: 20, followUp: 20, channelControl: 15, escalation: 10, visibility: 10,
});

/** Display order (result page). */
export const CATEGORY_ORDER = Object.freeze(['response', 'qualification', 'followUp', 'channelControl', 'escalation', 'visibility']);

/** Tie-break priority for RISK areas (§9.10): earlier wins the tie for "weaker". */
const RISK_TIE_ORDER = ['followUp', 'response', 'qualification', 'channelControl', 'escalation', 'visibility'];

/** Tie-break priority for STRONGEST area (§9.10): reverse display order; earlier wins the tie. */
const STRONGEST_TIE_ORDER = ['visibility', 'escalation', 'channelControl', 'qualification', 'response', 'followUp'];

export const RISK_BANDS = Object.freeze([
  { min: 80, max: 100, level: 'low', label: 'Low leakage risk' },
  { min: 60, max: 79, level: 'medium', label: 'Medium leakage risk' },
  { min: 40, max: 59, level: 'medium_high', label: 'Medium-high leakage risk' },
  { min: 0, max: 39, level: 'high', label: 'High leakage risk' },
]);

function channelComplexityPenalty(channelCount) {
  if (channelCount >= 5) return -3;
  if (channelCount >= 3) return -1;
  return 0;
}

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

/**
 * @param {object} input
 * @param {string} input.villaCount        enum ENUMS.villaCount
 * @param {string} input.whoAnswers        enum ENUMS.whoAnswers
 * @param {string[]} input.channels        1..9 of ENUMS.channels
 * @param {string} input.channelManagement enum
 * @param {string} input.afterHours        enum
 * @param {string} input.responseTime      enum
 * @param {string} input.qualification     enum
 * @param {string} input.followUp          enum
 * @param {string} input.escalation        enum
 * @param {string} input.visibility        enum
 * @returns {{score:number, riskLevel:string, riskLabel:string, categoryScores:object,
 *            strongestArea:string, riskAreas:string[], gate:'audit'|'playbook'}}
 */
export function calculateResult(input) {
  const missing = [];
  for (const key of ['villaCount', 'whoAnswers', 'channels', 'channelManagement', 'afterHours',
    'responseTime', 'qualification', 'followUp', 'escalation', 'visibility']) {
    if (input == null || input[key] == null || (key === 'channels' && (!Array.isArray(input.channels) || input.channels.length === 0))) {
      missing.push(key);
    }
  }
  if (missing.length) throw new Error('Missing answers: ' + missing.join(', '));

  const raw = {
    response: AFTER_HOURS_POINTS[input.afterHours] + RESPONSE_TIME_POINTS[input.responseTime],
    qualification: QUALIFICATION_POINTS[input.qualification],
    followUp: FOLLOW_UP_POINTS[input.followUp],
    channelControl: Math.max(0, CHANNEL_MGMT_POINTS[input.channelManagement] + channelComplexityPenalty(input.channels.length)),
    escalation: ESCALATION_POINTS[input.escalation],
    visibility: VISIBILITY_POINTS[input.visibility],
  };
  for (const [cat, val] of Object.entries(raw)) {
    if (!Number.isFinite(val)) throw new Error('Invalid enum value for category: ' + cat);
  }

  const categoryScores = {};
  for (const cat of CATEGORY_ORDER) {
    categoryScores[cat] = { score: raw[cat], max: CATEGORY_MAX[cat], percentage: round4(raw[cat] / CATEGORY_MAX[cat]) };
  }

  const score = CATEGORY_ORDER.reduce((s, c) => s + raw[c], 0);
  const band = RISK_BANDS.find((b) => score >= b.min && score <= b.max);

  // Strongest: highest percentage; ties broken by STRONGEST_TIE_ORDER position.
  const strongestArea = [...CATEGORY_ORDER].sort((a, b) => {
    const d = categoryScores[b].percentage - categoryScores[a].percentage;
    if (d !== 0) return d;
    return STRONGEST_TIE_ORDER.indexOf(a) - STRONGEST_TIE_ORDER.indexOf(b);
  })[0];

  // Risk areas: three lowest percentages ascending; ties broken by RISK_TIE_ORDER position.
  const riskAreas = [...CATEGORY_ORDER].sort((a, b) => {
    const d = categoryScores[a].percentage - categoryScores[b].percentage;
    if (d !== 0) return d;
    return RISK_TIE_ORDER.indexOf(a) - RISK_TIE_ORDER.indexOf(b);
  }).slice(0, 3);

  const teamBased = ['manager', 'reservation_staff', 'mixed', 'external_agency'].includes(input.whoAnswers);
  const portfolioFit = ['five_to_nine', 'ten_to_twenty_four', 'twenty_five_plus'].includes(input.villaCount);
  const gate = (teamBased || portfolioFit) ? 'audit' : 'playbook';

  return { score, riskLevel: band.level, riskLabel: band.label, categoryScores, strongestArea, riskAreas, gate };
}

/** Result-page copy, locked with the scoring rules (§9.12). */
export const CATEGORY_META = Object.freeze({
  response: {
    title: 'Response coverage',
    risk: 'Speed and after-hours gaps can leave a guest waiting while they compare other villas.',
    strong: 'Your current answers indicate comparatively strong response coverage and speed.',
  },
  qualification: {
    title: 'Qualification',
    risk: 'Without dates, guest count and budget captured early, the team spends time on weak-fit conversations.',
    strong: 'Your team has a relatively clear process for collecting the core booking details.',
  },
  followUp: {
    title: 'Follow-up discipline',
    risk: 'Most inquiries do not decide in the first exchange. Without planned follow-up, warm leads quietly disappear.',
    strong: 'Your follow-up process is less likely to let quiet inquiries disappear without another touch.',
  },
  channelControl: {
    title: 'Channel control',
    risk: 'When channels have no central owner, inquiries are easier to miss, duplicate or leave unresolved.',
    strong: 'Ownership across your inquiry channels appears comparatively controlled.',
  },
  escalation: {
    title: 'Escalation readiness',
    risk: 'When unusual requests depend on whoever is on shift, one difficult conversation can become a public complaint.',
    strong: 'Sensitive and unusual requests have a clearer path to the right person.',
  },
  visibility: {
    title: 'Management visibility',
    risk: 'If management cannot see response time and status, problems surface only after the opportunity is gone.',
    strong: 'Management has comparatively useful visibility into response performance.',
  },
});
