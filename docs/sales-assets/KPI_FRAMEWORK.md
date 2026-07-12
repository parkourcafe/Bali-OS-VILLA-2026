# Villa Ops OS — KPI framework (shared)

Applies to every Villa Ops OS implementation; per-client targets live in the
client's proposal. Every target below is a **TARGET** agreed during Days 1–2,
not a guarantee. Baselines are measured in shadow mode (Days 11–12) or from
the client's own historical data where it exists.

## 1. Technical KPIs (system behavior — fully controllable)

| KPI | Definition | Measured from | Typical target (TARGET) |
|---|---|---|---|
| Median first acknowledgement time | Enquiry received → first structured acknowledgement sent (any channel) | Pipeline timestamps | < 60 seconds, 24/7 |
| Enquiry capture rate | % of enquiries from connected channels that create a pipeline record | Channel logs vs pipeline records | > 95% |
| Context completeness | % of WhatsApp enquiries arriving with villa + dates + source attached | Lead records | > 80% of website-originated chats |
| Source attribution completeness | % of leads with a known source (website / IG / OTA / referral / walk-in) | Lead records | > 90% |
| System uptime of the responder | Responder available and answering | Provider status + logs | Per provider SLA — REQUIRES VALIDATION during Days 5–7 |

## 2. Operational KPIs (team + system together)

| KPI | Definition | Measured from | Typical target (TARGET) |
|---|---|---|---|
| Human response time (business hours) | Qualified enquiry handed off → first human reply | Pipeline timestamps | < 15 min business hours; < 12 h overnight |
| % enquiries with complete guest details | Dates, guests, budget band, villa interest captured before human handoff | Lead records | > 70% |
| % enquiries assigned to an owner | Every lead has a named responsible staff member | Pipeline | 100% |
| Follow-up completion rate | % of open enquiries that received the agreed follow-up touch(es) on schedule | Pipeline reminders | > 90% |
| Abandoned enquiry recovery | % of stalled conversations re-engaged within 48 h | Pipeline | Baseline set in shadow mode, then improve |
| Unresolved conversations | Count of conversations with no reply > 24 h | Pipeline dashboard | Trending to 0 |
| Staff adoption | % of enquiries worked inside the pipeline (not in private chats) | Pipeline vs channel audit | > 90% by Day 14 |

## 3. Commercial KPIs (monitored, NOT promised)

| KPI | Definition | Why it is not guaranteed |
|---|---|---|
| Enquiry-to-booking conversion | Confirmed bookings ÷ qualified enquiries | Depends on availability, pricing, property quality, season, guest budget |
| Direct booking share | Direct bookings ÷ all bookings | Depends on OTA strategy and rate parity |
| Revenue per enquiry | Booking value ÷ enquiries | Depends on portfolio mix and season |

**Explicitly out of our control and never promised:** villa availability,
nightly pricing, property quality/reviews, seasonality, individual staff
performance, guest decision speed, and advertising traffic volumes. Villa Ops
OS controls the *speed, structure and completeness of the response process* —
commercial outcomes are tracked so the owner can see them, not promised.

## Baseline → target protocol

1. Days 1–2: agree definitions + targets with the owner (this table, adjusted).
2. Days 11–12 (shadow mode): record the baseline for every operational KPI.
3. Day 14 handover: dashboard shows baseline vs current for each KPI.
4. Days 15–30: weekly review; targets adjusted only by mutual agreement.
