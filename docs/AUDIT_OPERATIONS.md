# Live Guest Inquiry Audit — manual operating protocol

Documentation for Selena (FINAL TZ §16). This is a manual pre-sale workflow — the website only collects the request. Nothing here is automated.

## Hard gates — do not send a test until ALL are true

```text
Authority confirmed
Channel confirmed
Scenario confirmed
Test window confirmed
Representative understands exact test time is not disclosed to staff
```

## Test restrictions

- one pre-sale test per company;
- one public channel per test;
- use a realistic but low-disruption inquiry;
- do not reserve inventory;
- do not request payment;
- do not provide false identity documents;
- do not publish screenshots or response times;
- do not test emergency or complaint handling through a fabricated crisis;
- close the inquiry politely after the tracking period;
- paid implementation acceptance tests are separate and clearly identified.

## Kickoff WhatsApp script

```text
Hi [Name], thanks for requesting a Live Guest Inquiry Audit for [Company].

Before we run it, please confirm:

1. You're authorised to approve this test for [Company].
2. Channel: WhatsApp / website form / Instagram DM.
3. Scenario:
   "Hi, do you have a 3-bedroom villa in [area] for [dates],
   for 4 adults?"
4. Test window: any time between [date] and [date].
   Your team will not know the exact moment.

We assess the first response, answer quality, qualification,
human escalation and follow-up after silence.

We do not access private inboxes, guest data, your PMS or internal systems.
Nothing is sent until you approve these details.
```

## Rapid Report (deliver within 48 hours after the test is sent)

If no reply has arrived, state that fact and continue tracking.

```text
[Company] — Live Guest Inquiry Audit
Rapid Report

Test:
[channel] · [date/time]

First response:
[X minutes / no response within 48 hours]

First-answer quality:
[factual observations only]

Qualification:
Dates: yes/no
Guest count: yes/no
Budget or preference: yes/no

Escalation:
[factual observation]

Our implementation benchmark:
A useful approved first response within five minutes on covered channels.

Follow-up is still being tracked.
Part 2 arrives on day 7.

Three practical improvements:
1. ...
2. ...
3. ...

15-minute review:
[calendar link]
```

Do NOT write "top Bali operators reply in under five minutes" unless a verified source and citation are added.

## Day-7 Follow-up Report

```text
[Company] — Live Guest Inquiry Audit
Follow-up Report

Seven days have passed since the test inquiry became quiet.

Follow-ups received:
[none / factual list with dates]

Observation:
[neutral description]

Recommended process:
- day 1 reminder;
- day 3 value-led follow-up;
- day 7 final close-the-loop message.

This is one of the workflows installed in the Villa Ops Response System.

15-minute review:
[calendar link]
```

## Close the test thread

After the tracking period (adapt to the actual scenario):

```text
Thanks for the information. We won't proceed with the booking,
but I appreciate your help.
```

## Sheet statuses (manual pipeline)

Audit branch: `Instant score completed → Audit requested → Authority confirmed → Scenario confirmed → Test scheduled → Test sent → Waiting for response → Rapid report drafted → Rapid report sent → Day-7 tracking → Day-7 report sent → Call booked → Proposal sent → Won / Not fit / No response / Closed`

Playbook branch: `Instant score completed → Playbook requested → Playbook sent → Call booked → Proposal sent → Won / Not fit / No response / Closed`

Automated events only ever set the first two statuses of each branch; every later stage is yours to move manually. Automated updates never overwrite the manual columns (Channel to test, Scenario, Test window, Next action, Notes…).
