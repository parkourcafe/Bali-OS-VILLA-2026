/**
 * Assessment flow schema — 12 screens (FINAL TZ §8).
 * Copy lives here; scoring enums must match assets/js/scoring.js ENUMS.
 */

export const TOTAL_STEPS = 12;

export const STEPS = [
  {
    id: 'company', type: 'fields', title: "What's your company name?",
    fields: [
      { name: 'company', label: 'Company name', type: 'text', required: true, maxLength: 120, autocomplete: 'organization' },
      { name: 'publicUrl', label: 'Public website or Instagram', type: 'text', required: false, maxLength: 300, placeholder: 'yourvillas.com or @yourvillas' },
    ],
    helper: 'Used only to identify your operation and prepare a requested audit. It does not affect your score.',
  },
  {
    id: 'villaCount', type: 'radio', store: 'profile', title: 'How many villas do you manage?',
    options: [
      { value: 'one', label: '1' },
      { value: 'two_to_four', label: '2–4' },
      { value: 'five_to_nine', label: '5–9' },
      { value: 'ten_to_twenty_four', label: '10–24' },
      { value: 'twenty_five_plus', label: '25+' },
    ],
  },
  {
    id: 'whoAnswers', type: 'radio', store: 'profile', title: 'Who typically answers guest inquiries?',
    options: [
      { value: 'owner', label: 'The owner personally' },
      { value: 'manager', label: 'A manager' },
      { value: 'reservation_staff', label: 'Reservation staff' },
      { value: 'mixed', label: 'Mixed — whoever is available' },
      { value: 'external_agency', label: 'An external agency' },
    ],
  },
  {
    id: 'channels', type: 'multi', store: 'profile', title: 'Where do guest inquiries come from?',
    helper: 'Select all that apply.',
    options: [
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'website', label: 'Website form' },
      { value: 'instagram', label: 'Instagram DM' },
      { value: 'airbnb', label: 'Airbnb' },
      { value: 'booking_com', label: 'Booking.com' },
      { value: 'agoda', label: 'Agoda' },
      { value: 'email', label: 'Direct email' },
      { value: 'phone', label: 'Phone' },
      { value: 'other', label: 'Other', otherField: { name: 'otherChannel', maxLength: 80, label: 'Which other channel?' } },
    ],
    minSelected: 1,
  },
  {
    id: 'channelManagement', type: 'radio', store: 'answers', title: 'How are inquiries across those channels managed?',
    options: [
      { value: 'centralized', label: 'One shared inbox or CRM, with clear ownership' },
      { value: 'assigned_separate', label: 'Separate inboxes, but each channel has an assigned owner' },
      { value: 'mixed_inboxes', label: 'A mix of shared and personal inboxes' },
      { value: 'no_process', label: 'No central process — whoever notices responds' },
      { value: 'unknown', label: "Honestly, we're not sure" },
    ],
  },
  {
    id: 'afterHours', type: 'radio', store: 'answers', title: 'Who handles inquiries outside working hours?',
    options: [
      { value: 'rotation', label: 'Dedicated staff on rotation' },
      { value: 'owner', label: 'The owner personally' },
      { value: 'whoever_sees', label: 'Whoever sees it first' },
      { value: 'next_morning', label: 'No one until the next morning' },
    ],
  },
  {
    id: 'responseTime', type: 'radio', store: 'answers', title: "What's your typical first-response time?",
    options: [
      { value: 'under_5m', label: 'Under 5 minutes' },
      { value: 'five_to_30m', label: '5–30 minutes' },
      { value: 'thirty_m_to_2h', label: '30 minutes–2 hours' },
      { value: 'same_day', label: 'Same day' },
      { value: 'next_day_plus', label: 'Next day or longer' },
      { value: 'unknown', label: "Honestly, we don't know" },
    ],
  },
  {
    id: 'qualification', type: 'radio', store: 'answers', title: 'Do you collect dates, guest count and budget before handing off to a person?',
    options: [
      { value: 'structured', label: 'Always — we use a structured set of questions' },
      { value: 'usually_informal', label: 'Usually, but informally' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'rarely', label: 'Rarely — we handle it ad hoc' },
    ],
  },
  {
    id: 'followUp', type: 'radio', store: 'answers', title: 'Do quiet inquiries receive planned follow-up after day 1, day 3 and day 7?',
    options: [
      { value: 'scheduled', label: 'Yes — follow-ups are scheduled' },
      { value: 'manual', label: 'Manually, when someone remembers' },
      { value: 'none', label: 'No' },
      { value: 'unknown', label: 'Not sure' },
    ],
  },
  {
    id: 'escalation', type: 'radio', store: 'answers', title: 'Are complaints and unusual requests routed by clear rules?',
    options: [
      { value: 'documented', label: 'Yes — documented rules' },
      { value: 'informal', label: 'The team follows informal habits' },
      { value: 'shift_dependent', label: "It depends on who's on shift" },
    ],
  },
  {
    id: 'visibility', type: 'radio', store: 'answers', title: 'Can management see response times and inquiry status?',
    options: [
      { value: 'live_dashboard', label: 'Yes — in a live dashboard or CRM' },
      { value: 'reports', label: 'Through regular reports' },
      { value: 'asking_staff', label: 'Only by asking staff' },
      { value: 'none', label: 'No visibility' },
    ],
  },
  {
    id: 'contact', type: 'contact', title: 'See your full readiness breakdown',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 100, autocomplete: 'name' },
      { name: 'whatsapp', label: 'WhatsApp number', type: 'tel', required: true, placeholder: '+62 812 3456 7890', autocomplete: 'tel' },
      { name: 'email', label: 'Email (optional)', type: 'email', required: false, maxLength: 254, autocomplete: 'email' },
    ],
    headache: {
      label: "What's the biggest response headache right now? (optional)",
      options: [
        { value: '', label: 'Choose one (optional)' },
        { value: 'slow_first_response', label: 'Slow first response' },
        { value: 'repetitive_questions', label: 'Too many repetitive questions' },
        { value: 'guests_disappear', label: 'Guests disappear after the first reply' },
        { value: 'staff_overloaded', label: 'Staff overloaded' },
        { value: 'no_follow_up', label: 'No clear follow-up' },
        { value: 'too_many_channels', label: 'Too many channels' },
        { value: 'owner_communication', label: 'Owner communication' },
        { value: 'not_sure', label: 'Not sure' },
        { value: 'other', label: 'Other', otherField: { name: 'otherHeadache', maxLength: 120, label: 'Tell us in a few words' } },
      ],
    },
    submitLabel: 'Show my score',
    microcopy: 'Your result appears instantly.\nWe use your contact details only to save this assessment and deliver an audit or playbook you explicitly request.',
  },
];

/** Normalize a WhatsApp number: strip spaces/brackets/dashes/dots; 00 → +.
 * Valid = "+" followed by 8–15 digits. Returns normalized string or null. */
export function normalizeWhatsapp(raw) {
  if (typeof raw !== 'string') return null;
  let v = raw.replace(/[\s().\-]/g, '');
  if (v.startsWith('00')) v = '+' + v.slice(2);
  if (/^\+\d{8,15}$/.test(v)) return v;
  return null;
}

/** Light e-mail syntax check (server re-validates). */
export function isValidEmail(v) {
  return typeof v === 'string' && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}
