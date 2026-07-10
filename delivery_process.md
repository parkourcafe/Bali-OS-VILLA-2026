# Delivery Process — Villa Ops Response System

Package version: **Selena Systems GTM v1.0**.

Chosen timeline: **14-day sprint only under defined constraints**. The promise applies when scope is locked by day 2; WhatsApp/API access is available or provisioning is not on the critical path; maximum two initial channels; one availability source; no custom PMS integration; client approves the knowledge base on time; and rollout starts in shadow mode. Larger portfolios or custom integrations require a longer quote.

## 1. Pre-sale audit
A single mystery-shop test is a sales signal, not proof of systemic business failure. Use this wording:

"In one test conducted on {date}, the response took {X}. This does not establish your normal performance, but it identified a scenario worth reviewing."

Never publish response times or describe one test as undeniable proof.

## 2. Kickoff checklist
- [ ] Signed agreement and 50% deposit received.
- [ ] Local contracting checklist completed or explicitly marked unresolved.
- [ ] Onboarding form sent with 24h deadline.
- [ ] Kickoff call booked.
- [ ] Project channel created.
- [ ] Internal project folder, credential vault entry, and timeline created.

## 3. Onboarding form
Company and brands; channels in scope; WhatsApp status; properties list; rates or pricing ranges the agent may quote; FAQs; house rules; check-in instructions; availability source; escalation contacts; languages; tone; mandatory human-review topics; forbidden claims; daily contact.

## 4. Access checklist
WhatsApp Business API provisioning, if needed; website admin or developer handoff; Instagram business access if scoped; availability source access; brand assets. Accounts should be in the client's name whenever possible.

## 5. Day-by-day plan
- **D1–2 — Map, provision, and lock scope.** Kickoff call; access collected; scope frozen; no new channels after day 2 without change request.
- **D3–5 — Knowledge base + core agent.** Convert client docs into approved knowledge base; build response agent; internal tests.
- **D6–7 — Qualification + escalation.** Build inquiry qualification and mandatory human-review routes.
- **D8–9 — Follow-up engine + pipeline.** Day 1/3/7 sequences; unified ownership; stale-conversation alerts.
- **D10 — Dashboard.** Response-time and handoff tracking live.
- **D11–12 — Acceptance test suite.** Run required test scenarios below. These are required tests, not tests already executed.
- **D13 — Training.** 60-minute team session: pipeline, escalations, FAQ editing, pause-AI procedure.
- **D14 — Shadow go-live + acceptance.** Joint acceptance test; accounts confirmed; final invoice issued.

## 6. Communication cadence
Daily 15-minute async check-in in the project channel: shipped, next, blocked. Client-side blockers are escalated within 24h in writing.

## 7. Tools
WhatsApp BSP: WATI / 360dialog / Twilio; LLM API; orchestration: n8n or Make; inbox/pipeline: Chatwoot, Kommo, or equivalent; dashboard: inbox plus Sheet/Looker view; docs: Notion or PDF pack. Final stack is selected at kickoff.

## 8. Formal acceptance test suite: 40 scenarios
Do not claim these tests were already executed. They are the required acceptance test suite.

### 20 historical inquiry scenarios
Use 20 real past inquiries supplied by the client, covering dates, party size, budget, property fit, area questions, check-in logistics, availability, price ranges, follow-up, and escalation.

### 10 adversarial scenarios
1. Unavailable dates.
2. Unknown pricing.
3. Discount request beyond approved range.
4. Wrong language.
5. Prompt injection.
6. Abusive message.
7. Complaint.
8. Emergency.
9. Refund request.
10. Sensitive personal information.

### 10 operational and failure-mode scenarios
1. Duplicate inquiry.
2. Meta/API outage.
3. WhatsApp BSP outage.
4. Website hosting outage.
5. Stale availability data.
6. Escalation failure.
7. Human takeover.
8. Pause-AI procedure.
9. Unsupported channel message.
10. Client-side access/configuration failure.

## 9. Handover documentation pack
System map; account inventory; billing ownership; knowledge-base editing guide; pause/resume guide; escalation rules; troubleshooting top 10; support terms.

## 10. Post-delivery support
Included: 14 days of fixes and tuning, not new features. Optional care plan $400–700/mo: monitoring, monthly tuning, monthly one-page performance report. Out-of-plan work quoted separately.

## 11. Upsell path
Care plan; historical follow-up project if compliance/database quality supports it; second channel or second business arm; owner-reporting module. Earn each step.
