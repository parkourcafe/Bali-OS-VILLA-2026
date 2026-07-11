# CRM Playbook — Outreach operating system (2 people, Google Sheet)

**Who runs it:** the assistant runs the whole tracker end-to-end. The founder reviews and handles
replies/calls. **System of record for now:** a shared Google Sheet built from `crm_google_sheet.csv`.
HubSpot comes later (see last section).

## 1. Set up the Google Sheet (one time, ~10 min)
1. Create a Google Sheet, e.g. **"Villa Ops — Outreach CRM"**. Share it with the founder (Editor).
2. **File → Import → Upload → `crm_google_sheet.csv` → Replace current sheet → Import.**
3. Freeze the header: **View → Freeze → 1 row**.
4. Add dropdowns so status is never free-typed:
   - Select the **Status** column → **Data → Data validation → Dropdown**, paste the values from §3.
   - Same for **Contact verified?** (`Yes` / `Verify`) and **Replied?** (`Yes` / `No`).
5. Add a filter: select header row → **Data → Create a filter**. Now anyone can filter by Owner, Status, Wave.
6. Optional colour: **Format → Conditional formatting** on Status — green = Replied/Call booked, yellow = follow-up due, grey = Not contacted.

That's the whole system. No add-ons needed.

## 2. Columns — what each one means
- **Send order** — execution order for the Top 10 (1 = send first). Blank = later wave.
- **Priority / Score / Wave / Segment-Type** — from the master ranking; read-only reference.
- **Decision maker / Best channel / Email / WhatsApp-Phone / Instagram-Social** — how to reach them.
- **Contact verified?** — `Verify` means confirm the number/inbox before sending (see verification blockers in `outreach_packs.md`). Flip to `Yes` once checked.
- **Message pack** — which copy to send; all live in `outreach_packs.md` under the company name.
- **Owner** — who is running this row (default: Assistant).
- **Status** — the single source of truth for where each prospect stands (§3).
- **Date 1st touch** — date the first message was sent.
- **Follow-up due** — auto-rule: **Date 1st touch + 2 days**. Fill it when you send.
- **Replied? / Reply notes** — flip to `Yes` and paste the gist of their reply.
- **Next action / Notes** — the very next concrete step, plus anything useful.

## 3. Status values (the pipeline)
Move a row down this list as it progresses. Never skip logging a step.

1. `Not contacted` — nothing sent yet.
2. `Contact verified` — number/inbox confirmed, ready to send.
3. `1st touch sent` — first message out. Set Date 1st touch + Follow-up due.
4. `Follow-up 1 sent` — 48h nudge sent.
5. `Follow-up 2 sent` — final nudge (last of max 4 touches; then park 60 days).
6. `Replied` — they answered. **→ hand to founder.**
7. `Audit offered` — Secret Guest Audit proposed / channel agreed.
8. `Audit delivered` — audit report sent.
9. `Call booked` — discovery call scheduled.
10. `Proposal sent` — proposal out.
11. `Pilot won` — signed / deposit.
12. `Not now` — soft no; revisit in 60 days.
13. `Lost` — hard no or disqualified.

## 4. Daily routine (assistant, ~20–30 min/day)
**Morning:**
1. Filter Status = `Not contacted`, sorted by Send order. Take the next 2–3.
2. If Contact verified? = `Verify`, confirm the channel first (blockers in `outreach_packs.md`). Flip to `Yes`.
3. Send the message from `outreach_packs.md`. Use the **cold-open soft CTA** for the First 3.
4. Set Status = `1st touch sent`, fill **Date 1st touch**, set **Follow-up due = today + 2 days**.

**Every day:**
5. Filter **Follow-up due ≤ today** and Replied? = `No`. Send the 48h follow-up, bump Status to `Follow-up 1/2 sent`, push Follow-up due +3 days.
6. Check inboxes/WhatsApp for replies. Any reply → Replied? = `Yes`, paste into Reply notes, Status = `Replied`, and **ping the founder** (that's the handoff — do not try to sell).

**Rules:**
- Max **4 touches** per prospect, then `Not now` and park 60 days.
- One prospect = one row. Never send from two channels the same day.
- Never invent audit results or scale numbers. For TJM write "70+ villas", not both figures.

## 5. Handoff to founder
When Status hits `Replied`, the assistant stops selling and notifies the founder with: company,
what they said (Reply notes), and the suggested next step (usually the reply-handler script in
`outreach_packs.md`). Founder takes the audit/call from there; assistant keeps logging status.

## 6. Weekly glance (founder, 5 min)
Filter by Status to see the funnel: how many `1st touch sent`, how many `Replied`, how many
`Call booked`. That's your whole dashboard until volume justifies HubSpot.

## 7a. Logging replies + measuring response time
Two logs, both in the shared Google Sheet:

**A. Outreach log** (`outreach_tracker.tsv`) — did the prospect reply to US, and how fast.
Fill on send: **Sent (YYYY-MM-DD HH:MM)** + Status = `1st touch sent`. On reply: **Replied? = Yes**,
**Reply (YYYY-MM-DD HH:MM)**, paste the gist in **Reply summary**, Status = `Replied`, ping founder.
Use real 24h datetimes (e.g. `2026-07-11 14:30`) so the maths works.

- **Response time (h)** column — paste this formula in row 2 and fill down (E = Sent, H = Reply):
  `=IF(AND(E2<>"",H2<>""),(H2-E2)*24,"")`
- **Summary counters** (put in a free cell block, ranges assume rows 2–21):
  - Sent: `=COUNTIF(F2:F21,"<>Not sent")`
  - Replied: `=COUNTIF(G2:G21,"Yes")`
  - Reply rate: `=IFERROR(COUNTIF(G2:G21,"Yes")/COUNTIF(F2:F21,"<>Not sent"),0)` → format as %
  - Avg time-to-reply (h): `=IFERROR(AVERAGE(I2:I21),"")`
  - Median time-to-reply (h): `=IFERROR(MEDIAN(I2:I21),"")`
  - Fastest / slowest: `=MIN(I2:I21)` / `=MAX(I2:I21)`

That answers "how many replied and after how long" automatically — no manual counting.

**B. Audit log** (`audit_log.tsv`) — how fast THEY answer a guest (mystery-shop). Log the test
datetime and their first-response datetime; their response time = same `(reply-sent)*24` formula.
This is the evidence for the pitch and the operator's own effectiveness signal. Required caveat
wording is in the file header. One test = a signal, not proof.

## 7. When to move to HubSpot
Move once you have **~3+ active conversations** or want reporting/automation. The import files are
already prepared: `outreach_crm.tsv` maps cleanly to HubSpot Company properties, and this sheet's
Status column maps 1:1 to a Deal pipeline (§3 = the deal stages). At that point: import Companies,
create the "Villa Ops Outreach" pipeline with the §3 stages, one deal per prospect, Owner = deal
owner. Ask and I'll produce the HubSpot-specific import + step-by-step.
