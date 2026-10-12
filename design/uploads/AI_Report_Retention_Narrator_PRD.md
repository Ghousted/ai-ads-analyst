# PRD: AI Report & Retention Narrator

**Cohort:** B2C Online (serves freelance marketers / small agency owners — income-protection framing)
**Platform:** Web app (Next.js), responsive, desktop-leaning (dashboard-style product)
**Status:** Draft v1 — Apex Human reference product candidate
**Owner:** Apex Human course design team

---

## 1. One-line summary

A tool that automatically pulls a marketer's ad data from every connected platform, turns it into a plain-language
report that keeps clients calm and informed, and warns the marketer before a client is about to churn.

## 2. Problem

This problem is grounded in real discussion threads from r/digital_marketing (see Section 13 for sources), not
assumed. Two distinct pains showed up repeatedly:

1. **Reporting is manual, repetitive, time-consuming work.** Marketers and small agency owners pull numbers from
   separate platforms (Meta Ads, Google Ads, TikTok Ads, GA4) that don't talk to each other, then manually build
   a client-facing report every week or month. One marketer described losing "half my Friday cleaning up charts."
   This doesn't scale — more clients means more hours lost to formatting, not more time spent on actual marketing work.

2. **Clients churn from misunderstanding, not from bad results.** A marketer summarized this exactly: *"they see
   the overhaul, but don't see overnight results, so they're convinced it didn't work... then they cancel."*
   Marketing results are often slow and uneven, but most clients aren't marketing experts — handed a bare chart
   with no explanation, they interpret a normal dip as failure and lose trust.

These are two sides of the same root cause: **reporting that shows numbers without context, built manually,
under time pressure.**

## 3. Target user

- Primary: solo freelance marketers and small agency owners (1-5 people) managing paid ads and/or analytics for
  multiple clients
- Framing note: for a Filipino-context cohort, this includes the large population of Filipino freelancers who
  manage ads/social media for overseas clients — reporting time and client retention both directly affect their
  income capacity

## 4. Goals

1. Automatically pull and normalize data from a marketer's connected ad/analytics accounts — no manual
   copy-pasting between platforms.
2. Turn raw numbers into a plain-language narrative report that explains *what* happened and *why*, at two
   levels: a combined cross-platform story and a focused per-source explanation.
3. Flag a client as at-risk of churning *before* they cancel, based on explainable signals — not a black-box score.
4. Make the whole experience pick-up-and-go — a new user should reach their first generated report within
   minutes of signing up, no training required.
5. Reach a demoable, teachable version within a course build cycle (see: Buildable/Teachable/Formidable scoring
   below).

### Non-goals (v1)
- Not a full ad-campaign management tool — it reports and warns, it doesn't create or optimize ad campaigns.
- Not a CRM — client records here are scoped to reporting/risk tracking, not full client/project management.
- Not analyzing private client communications by default — any message/sentiment analysis is opt-in only (see
  Section 11 risks).

## 5. Core user flow

1. **Landing page → Sign up** — marketer signs up (email or Google login).
2. **Personalization (setup wizard)** — short, guided, skippable where possible:
   - Name your team/agency (+ optional logo)
   - Connect ad/analytics platforms (Meta Ads, GA4 first; others as stretch) — one-click OAuth per platform,
     skippable to finish later
   - Add your first client, mapping connected accounts to that client
   - (Optional) Set report frequency and tone preference
3. **Dashboard** — lands here after setup. Shows every client as a card with a health status badge (Healthy /
   Needs Attention / At Risk), last report date, and quick stats across the whole client base.
4. **Click into a client → Client Detail view** — opens on a combined "All Sources" view by default:
   - Combined summary metric cards (cross-platform)
   - Combined narrative report (the plain-language story across all sources)
   - Risk indicator panel for this specific client
5. **Switch to a single-source tab** (e.g. GA4, Meta Ads, Meta Pixel) — same client header stays fixed, content
   panel swaps to that platform's focused metrics + a shorter, source-specific narrative. Both narrative tiers
   are pre-generated on schedule, so tab switching is instant, no loading wait.
6. **Risk Alert** — surfaces in two places: the status badge on the Dashboard, and a dedicated panel on the
   Client Detail view, showing which specific signals triggered the flag and a suggested action (optionally a
   drafted outreach message).
7. **Marketer acts** — reviews/sends the client report, or acts on a risk warning (reaches out proactively)
   before the client has a chance to churn.

## 6. Core features (MVP scope)

| Feature | In v1? | Notes |
|---|---|---|
| Setup wizard (team, integrations, first client) | Yes | Core onboarding — must be fast and skippable |
| Platform integrations: Meta Ads + GA4 | Yes | Most requested in research; other platforms are stretch |
| Platform integrations: TikTok Ads, LinkedIn Ads, Meta Pixel | Stretch | Add once Meta Ads + GA4 flow is proven |
| Data normalization across sources | Yes | Required for the combined narrative to work at all |
| Combined cross-source narrative report | Yes | The primary client-facing deliverable |
| Single-source narrative report (per platform tab) | Yes | For the marketer's own diagnostic drill-down |
| Dashboard with client health status badges | Yes | The "control tower" view across all clients |
| Risk scoring (rule-based, explainable signals) | Yes | Never a bare score with no explanation |
| Suggested action / drafted outreach message per risk flag | Yes | Reuses the narrative LLM capability |
| Email digest for risk alerts | Yes | So marketers don't have to check the dashboard proactively |
| Sentiment analysis of client messages | Stretch, opt-in only | Real privacy implication — flagged, not default-on |
| Scheduled report generation (not on-demand) | Yes | Keeps tab-switching instant in the Client Detail view |

## 7. Buildable / Teachable / Formidable / Market Gap assessment

- **Buildable (3/5):** The narrative-generation layer (LLM over normalized metrics, two tiers) is a well-known
  pattern with no custom model training needed. The real complexity is **OAuth integration breadth** — each ad
  platform (Meta, Google, TikTok, LinkedIn) has its own API quirks and approval requirements. Scoping v1 to
  Meta Ads + GA4 keeps this realistic; treating all 5 platforms as day-one scope would meaningfully lower this score.
- **Teachable (4/5):** The core concept ("turns your ad data into a report that explains itself, and warns you
  before a client leaves") is a clean, one-sentence pitch. The build pattern (connect → normalize → generate
  narrative → surface risk) is repeatable and maps cleanly onto course modules. The OAuth/integration piece is
  the one part needing more technical scaffolding than a typical module.
- **Formidable (4/5):** Watching raw, disconnected platform numbers turn into one coherent, reassuring narrative
  report — and seeing a churn-risk warning fire with a specific, explainable reason — is a strong demo moment
  for an audience that explicitly complained about losing hours to this exact manual process.
- **Market Gap (3/5):** AgencyAnalytics, Swydo, and Looker Studio already solve the dashboard/reporting half
  well. The differentiated angle is the **retention-focused narrative layer and explainable churn-risk warning**
  — none of the named tools in the research claim to manage client psychology/expectations directly, which is
  the sharper, less-covered half of the problem.
- **Total: 14/20**

## 8. Business model / monetization

- **Primary:** monthly subscription, priced per number of clients managed (e.g. tiered: up to 5 clients / up to
  20 clients / unlimited) — this maps naturally onto how agencies already think about their own client-based revenue.
- **Why people will pay:** this directly protects and grows the marketer's own income — time saved on reporting
  is billable hours recovered, and every client retained because of an early risk warning is monthly recurring
  revenue that would otherwise have been lost. The research shows both of these are already real, acknowledged
  pains people are actively looking to solve (AgencyAnalytics/Swydo prove willingness to pay for the reporting
  half alone).
- **Secondary:** could offer a free tier capped at 1-2 clients, to let solo freelancers try it before paying —
  matches the target user's likely budget sensitivity, especially in a Filipino freelancer context.

## 9. Mobile-first / responsive design requirements

This is a dashboard-style, desktop-leaning product (marketers reviewing data, building reports) — unlike the
Outfit Curator, it is **not** mobile-first, but should remain responsive:

- Desktop is the primary design target — dense tables, multi-column dashboards, side-by-side comparisons
- Mobile/tablet should still render usably (e.g. for checking a risk alert on the go), but as a secondary,
  simplified view — not the primary design driver

## 10. Success metrics (for course demo purposes)

- Time from sign-up to first generated report (target: a few minutes for a demo, including OAuth connection)
- Whether the combined narrative correctly references a cross-platform relationship a human reviewer would also flag
- Whether a simulated "at risk" scenario (e.g. synthetic data showing a performance dip + slow client replies)
  triggers the correct risk flag with a sensible explanation

## 11. Risks / open questions (flagged, not resolved)

- **OAuth integration breadth is the single biggest build risk** — each platform has its own API quirks, rate
  limits, and in some cases requires app review before production use. v1 must stay scoped to Meta Ads + GA4.
- **Risk signal thresholds are not yet defined** — "N consecutive down periods," "slower than usual response
  time" etc. need real threshold values decided through testing, not assumed correct on the first pass.
- **Sentiment analysis of client messages is a real privacy concern** — must be strictly opt-in, clearly
  disclosed, and should be treated as a stretch feature, not core v1 scope.
- **Narrative quality depends entirely on prompt design** — a poorly scoped prompt could produce a
  plausible-sounding but inaccurate or misleading explanation of *why* a metric moved; this is a real quality
  risk, not just a technical one, especially since the narrative is client-facing.
- **Competitor claims (AgencyAnalytics, Swydo, Looker Studio) are drawn from real Reddit discussion threads**
  (see Section 13) but have not been independently re-verified against their current feature sets — worth a
  direct check before finalizing positioning language.

## 12. Suggested build milestones (for a course setting)

1. Setup wizard (team name, first client, skip-friendly flow) — no integrations yet, seed with manual/sample data
2. Meta Ads OAuth integration + data pull
3. GA4 OAuth integration + data pull
4. Data normalization layer (common schema across both sources)
5. Combined narrative generation (LLM over normalized data)
6. Single-source narrative generation (per platform)
7. Dashboard (client list + health status badges) and Client Detail view (tabs, combined/single-source switching)
8. Scheduled report generation job (background job, not on-demand)
9. Rule-based risk scoring engine + explanation/draft-message generation
10. Email digest for risk alerts
11. (Stretch) Additional platform integrations (TikTok, LinkedIn, Meta Pixel)
12. (Stretch, opt-in) Sentiment analysis of client messages

## 13. Tech stack per feature

See the companion doc **AI_Report_Retention_Narrator_Tech_Stack.md** for the full breakdown. Summary:

| Feature | Tech stack |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS + shadcn/ui (tabs, cards) + Tremor/Recharts |
| Data fetching/caching | React Query |
| Auth | Clerk |
| Database | Neon (Postgres) + Drizzle ORM |
| Ad platform integrations | Meta Marketing API, GA4 Data API (v1); TikTok/LinkedIn Marketing APIs (stretch); Nango considered for OAuth management at scale |
| Narrative generation (combined + per-source) | OpenRouter (LLM) |
| Risk scoring | Rule-based logic (TypeScript) + OpenRouter for explanation/draft message |
| Scheduled report generation | Inngest or Vercel Cron |
| Email digests | Resend |
| Hosting | Vercel |

## 14. Research sources (grounding Section 2's problem statement)

Pulled from live r/digital_marketing threads during this ideation session:
- "Has anyone solved the 'dashboard overload' problem for good?" — cross-platform reporting pain, inconsistent
  client-by-client structure
- "What's the most annoying/time consuming part of running a small agency?" — reporting as a named time-sink,
  churn tied to unmet/misunderstood expectations (direct quote used in Section 2)
- "Biggest pain points in digital marketing when working with multiple channels?" — consolidated reporting
  named as a top pain

These are real discussion threads, not invented personas — direct quotes are used in Section 2 to keep the
problem statement grounded rather than assumed.

---
*This PRD is a course reference-product spec for teaching purposes, not a funded product roadmap. Competitor
claims (AgencyAnalytics, Swydo, Looker Studio) are based on mentions found in the research threads, not a fresh
independent verification — recommend a direct check before finalizing positioning language for student-facing
course materials.*
