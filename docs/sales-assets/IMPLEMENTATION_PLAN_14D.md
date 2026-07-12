# Villa Ops OS — 14-day implementation plan (shared template)

The per-client proposal references this plan; client-specific systems, channel
lists and KPI targets are agreed on Days 1–2 and recorded in the project doc.
Roles: **Implementer** (Selena Systems), **Owner/GM**, **Reservations team**.

Working assumption for every day: passive access only until the client grants
the specific accounts listed under "Access needed". Nothing goes live to
guests before Day 13; Days 11–12 run in shadow mode.

## Days 1–2 — Confirm reality

| | |
|---|---|
| Actions | Kick-off interview with Owner/GM (60–90 min) and reservations team (45 min per person); map every enquiry source (website forms, wa.me links, IG, OTAs, phone, walk-in/referral); confirm the real current process vs the public audit; inventory systems (booking engine/PMS/channel manager, WhatsApp number type: personal / Business app / API, shared inboxes); agree KPI definitions and targets from `KPI_FRAMEWORK.md`; agree escalation contacts. |
| Deliverable | Signed-off "Current State Map" (1 page) + agreed KPI sheet + access checklist. |
| Responsible | Implementer (leads), Owner/GM + team (input). |
| Access needed | None beyond interviews; view-only walkthrough of existing tools on the client's screen. |
| Depends on | Contract signed; 50% deposit received. |
| Acceptance | Owner confirms in writing the Current State Map is accurate; KPI sheet approved. |

## Days 3–4 — Design the new funnel

| | |
|---|---|
| Actions | Design lead lifecycle statuses (New → Acknowledged → Qualified → Handed off → Follow-up → Won/Lost with reasons); write qualification rules (dates, party size, budget band, villa interest, language); define human-handoff triggers (complex requests, complaints, price negotiation, VIP, any low-confidence reply); define escalation scenarios and after-hours behavior; draft the WhatsApp first-responder conversation flows on paper. |
| Deliverable | Funnel design doc: status model, qualification schema, handoff/escalation rules, flow scripts — in the client's tone of voice. |
| Responsible | Implementer; Owner/GM reviews. |
| Access needed | Sample of 20–50 past guest conversations (anonymized or on the client's screen) to calibrate tone and FAQs. |
| Depends on | Days 1–2 sign-off. |
| Acceptance | Owner/GM approves the flow scripts and handoff rules in writing. |

## Days 5–7 — Build the plumbing

| | |
|---|---|
| Actions | Set up WhatsApp Business platform access (or API provider) on the client's number — REQUIRES VALIDATION of number eligibility on Day 1; connect website enquiry points so villa name, dates and source travel into the chat/pipeline (prefilled wa.me texts and/or form → pipeline webhook); stand up the unified pipeline (client's existing CRM if adequate, otherwise the agreed lightweight pipeline tool); wire notifications to staff (new lead, stalled lead, handoff); set up response-time and source analytics dashboards. |
| Deliverable | Working pipeline receiving real enquiries in shadow (no auto-replies to guests yet); staff notification channel live. |
| Responsible | Implementer; client's website maintainer applies the small site snippets (or Implementer, if granted CMS access). |
| Access needed | WhatsApp Business account admin; website/CMS or dev contact; list of staff phone numbers/emails for notifications; read access to booking engine/PMS for availability context (view-only is enough for V1 — REQUIRES VALIDATION per system). |
| Depends on | Days 3–4 design approval. |
| Acceptance | Test enquiry from each source appears in the pipeline with correct source + context within 60 seconds. |

## Days 8–10 — Content and training

| | |
|---|---|
| Actions | Load response templates (availability, rates protocol, location, facilities, payment, transfers, policies) from the approved scripts; build the FAQ knowledge base from real past conversations; configure automatic reminders (unanswered lead, follow-up cadence for open enquiries, abandoned-enquiry recovery touch); train the reservations team (2 sessions × 60–90 min: pipeline hygiene, handoff, overrides); train Owner/GM on the dashboard. |
| Deliverable | Template library + FAQ live in the system; reminder rules active in shadow; team trained with a written cheat-sheet. |
| Responsible | Implementer (build + training); Reservations team (attendance, feedback). |
| Access needed | Final tone-of-voice sign-off; team availability for training slots. |
| Depends on | Days 5–7 plumbing accepted. |
| Acceptance | Each team member completes a supervised test conversation end-to-end; Owner/GM can read the dashboard unaided. |

## Days 11–12 — Shadow mode

| | |
|---|---|
| Actions | System drafts replies and routes real enquiries but **sends nothing to guests without staff approval**; implementer and team review every drafted reply; measure baseline KPIs; fix wrong answers, tighten qualification, verify human handoff fires correctly; verify no enquiry source is leaking around the pipeline. |
| Deliverable | Shadow-mode report: accuracy of drafts, handoff correctness, baseline KPI numbers, list of fixes applied. |
| Responsible | Implementer (review + fixes); team (approving/correcting drafts). |
| Access needed | Same as Days 5–10. |
| Depends on | Days 8–10 acceptance. |
| Acceptance | ≥ 90% of drafted replies approved without edits across the final 20 shadow conversations; zero missed handoffs in shadow; Owner signs go-live approval. |

## Days 13–14 — Controlled launch and handover

| | |
|---|---|
| Actions | Go live on the agreed channels with human-in-the-loop for the first day; monitor every conversation live on Day 13; Day 14: final dashboard configuration, handover documentation (runbook: how to pause the responder, edit templates, add villas, read KPIs, escalate issues), recorded walkthrough video, final review meeting with Owner/GM; agree the Days 15–30 check-in cadence. |
| Deliverable | Live system + runbook + recorded walkthrough + handover sign-off + 30-day support terms in writing. |
| Responsible | Implementer; Owner/GM (sign-off). |
| Access needed | Same as prior days. |
| Depends on | Day 12 go-live approval. |
| Acceptance | System answering live enquiries within target acknowledgement time; team resolving conversations in the pipeline; Owner/GM signs handover; final 50% invoice issued. |

## Standing risk controls

- Any day's acceptance failing pauses the clock — the plan resumes when the
  blocker clears; the calendar may shift, the scope does not.
- WhatsApp number/API eligibility, booking-engine read access and CMS access
  are validated on Days 1–2 — every integration stays marked REQUIRES
  VALIDATION until proven in the client's own accounts.
- Shadow mode is non-negotiable: no AI reply reaches a guest before Day 13.
- Rollback: the responder can be paused in one click at any time; the pipeline
  keeps working as a manual tool if the responder is off.
