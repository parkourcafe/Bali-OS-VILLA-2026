import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateResult } from '../assets/js/scoring.js';

const BASE = {
  channels: ['whatsapp'], channelManagement: 'centralized',
  afterHours: 'rotation', responseTime: 'under_5m',
  qualification: 'structured', followUp: 'scheduled',
  escalation: 'documented', visibility: 'live_dashboard',
};

function gateOf(villaCount, whoAnswers) {
  return calculateResult({ ...BASE, villaCount, whoAnswers }).gate;
}

test('1–4 villas + owner → playbook', () => {
  assert.equal(gateOf('one', 'owner'), 'playbook');
  assert.equal(gateOf('two_to_four', 'owner'), 'playbook');
});

test('5+ villas → audit regardless of who answers', () => {
  assert.equal(gateOf('five_to_nine', 'owner'), 'audit');
  assert.equal(gateOf('ten_to_twenty_four', 'owner'), 'audit');
  assert.equal(gateOf('twenty_five_plus', 'owner'), 'audit');
});

test('team-based answering → audit regardless of size', () => {
  for (const who of ['manager', 'reservation_staff', 'mixed', 'external_agency']) {
    assert.equal(gateOf('one', who), 'audit', who);
    assert.equal(gateOf('two_to_four', who), 'audit', who);
  }
});

test('score does not override the gate (perfect small owner still playbook, terrible big operator still audit)', () => {
  const perfectSmall = calculateResult({ ...BASE, villaCount: 'one', whoAnswers: 'owner' });
  assert.equal(perfectSmall.score, 100);
  assert.equal(perfectSmall.gate, 'playbook');

  const badBig = calculateResult({
    villaCount: 'twenty_five_plus', whoAnswers: 'reservation_staff',
    channels: ['whatsapp', 'website', 'instagram', 'airbnb', 'agoda'],
    channelManagement: 'no_process', afterHours: 'next_morning', responseTime: 'next_day_plus',
    qualification: 'rarely', followUp: 'none', escalation: 'shift_dependent', visibility: 'none',
  });
  assert.equal(badBig.riskLevel, 'high');
  assert.equal(badBig.gate, 'audit');
});
