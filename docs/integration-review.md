# Integration review: does the design work with real APIs?

This review checks the AI Ads Analyst design (formerly Clario) (`design/App.dc.html`, `design/Setup.dc.html`, `design/Landing Page.dc.html`)
against how each ad and analytics platform actually grants access. Each item says what the design assumes,
what the platform does, and what to change. The prototype now applies most of the changes. The status table
below says what changed and what is still open.

## Status in the prototype

| Finding | Status | Where |
|---|---|---|
| 1. Integrations under Account | Done. Integrations is under Workspace. Each connection shows who made it and can be reconnected by you, an admin, or a Meta system user without unassigning accounts | Settings › Integrations |
| 2. One connection per platform | Done. GA4, Google Ads, Search Console and Business Profile take another Google login. The account list says which login reads each account | Settings › Integrations |
| 3. Client connects their own account | Done. "Ask {client} to connect" sends a link and marks unlinked tools as waiting | Client profile › Tools |
| 4. Tools from two places | Done. Assignments are the only source. Wizard step 3 picks the agency's unassigned accounts and can connect a new tool | Clients, Screen.jsx |
| 5. "Connect" when only the link is missing | Done. The empty state says "Link an account" when the agency is connected | Dashboard › Analytics |
| 6. Slack per person | Done. Slack is a workspace connection with a channel. Notifications keep a personal "direct messages" toggle | Settings |
| Instagram listed twice | Done. Meta covers Facebook and Instagram everywhere | Setup, landing, settings, clients |
| Read-only promise | Done. Copy states the policy, not read-only access | Setup, connect dialog, info pages |
| Combined leads double counted | Done. Leads come from GA4 key events. Platform counts are shown as "leads they report" | Dashboard › All sources |
| Risk signals | Done. Reply time and email opens are replaced by portal visits and report views | Shell sample data, Tasks › Flagged, landing |
| Templates with no source | Done. Ecommerce, calls, CRM, email and organic social templates are hidden | Reporting |
| Booking funnel | Partly. The title says it comes from the site's GA4 events. Picking the steps is not built | Dashboard › GA4 |
| Freshness | Done. Each analytics view and the report editor say "data up to" with the platform's delay | Dashboard, report editor |
| Send-from domain | Done. "Verify domain" shows SPF and DKIM records and checks them | Report editor › Design |
| Team roles | Partly. The invite dialog says who manages integrations. Per-client visibility is not built | Settings › Team |
| Token expiry | Partly. Every connection has Reconnect. The prototype has no in-app alert list to put a button on | Settings › Integrations |
| Backfill | Copy only. Setup says the import runs in the background | Setup |
| Approvals (Meta, Google, TikTok) | Not a UI change. Start them now | |

Severity: **Blocker** means the screen cannot work as drawn. **High** means it works for some agencies and
breaks for others. **Medium** means the copy or numbers would mislead. **Low** means polish.

## How the design models integrations

- One connection per platform for the whole agency. Settings › Integrations shows a single "Connected as …"
  per tool (Meta Business Manager, `alex@riveradigital.com` for GA4, a Google Ads manager account, a TikTok
  Business Center).
- Each connection lists the accounts it can see. Each account is assigned to at most one client from a dropdown.
- A client's "tools" are the accounts assigned to it. The add-client wizard and the client profile send you
  to Settings to link accounts.

For Meta, Google Ads, TikTok and Microsoft Ads this is the right model: those platforms have an agency-level
container (Business Manager, manager account, Business Center), and one login sees every client account
linked to it. It breaks down for the Google products that have no agency container, and because
the connection belongs to one person.

## Per-user vs per-client vs per-agency findings

### 1. Integrations sit under "Account", but the whole agency uses them (High)

Settings puts **Integrations** in the *Account* group, next to My profile and Notifications. Those are
personal settings. But the connection feeds every client's reports, for every teammate.

Each connection is really one person's OAuth token. If that person leaves, gets their access removed in
Business Manager, or their Google password changes, every client report using that connection stops updating.

**Change:** move Integrations to the *Workspace* group. Show who made each connection ("Connected by Alex
Rivera"), and let an admin reconnect it as someone else without unassigning every account. For Meta, offer a
Business Manager **system user** token. It does not belong to a person and does not expire after 60 days.

### 2. One connection per platform does not work for GA4, Search Console or Business Profile (High)

The design allows a single "Connected as" per tool. GA4, Search Console and Google Business Profile have no
agency container. Access is granted to a **Google user** on each property, site or location. In practice
clients share their GA4 property with whichever team member asked: Jordan may see a property that Alex
cannot. With one connection per tool, those properties never appear in the list.

**Change:** allow several connections per platform ("Add another Google login"), merge their account lists,
and remember which connection reads which account. The same applies to Google Ads accounts that are not
linked under the agency's manager account.

### 3. There is no way for a client to connect their own account (Medium)

Every flow assumes the agency already has access. Some clients will not add an agency to their Business
Manager or GA4, or do not know how. Reporting tools usually solve this with a "send a connect link to your
client" flow, where the client signs in on their side.

**Change:** on the client profile, next to "Link account", add "Ask {client} to connect". It sends a link
that runs the OAuth flow under the client's own login and attaches the result to that client only.

### 4. A client's "tools" come from two different places (Medium)

The add-client wizard (step 3, "Which accounts does this client use?") saves platform checkboxes. Those
checkboxes drive the logos on the client and whether Dashboard › Analytics shows data or the "not connected"
empty state. The client profile and the clients list instead read the **account assignments** from
Settings. After adding a client with "Meta" ticked, the dashboard treats Meta as connected even though no
Meta account is assigned.

**Change:** keep a single source of truth, the account assignments. Turn wizard step 3 into "pick their
accounts" from the agency's connected accounts (with "connect a new tool" if one is missing).

### 5. The "Connect {tool}" empty state is wrong when the agency is already connected (Low)

On Dashboard › Analytics, choosing a client and a tool they don't use shows "Connect Meta" even when the
agency's Meta connection exists and only the assignment is missing. The client profile handles this case
("Link account" vs "Connect"); the dashboard should do the same.

### 6. Slack and email alerts are set per person, but Slack posts to a shared channel (Low)

Notifications › Slack is a personal toggle, but posting to a channel needs a workspace-level Slack app
install and a channel choice. Put the Slack connection under Workspace, and keep the personal toggle for
"also DM me".

## Platform-by-platform

| Tool | Agency container? | Access needs approval? | Design status |
|---|---|---|---|
| Meta Ads | Yes, Business Manager | App Review for `ads_read` (plus Advanced Access to read accounts your app does not own) | Fits. Use a system user token |
| Google Analytics 4 | No, per Google user per property | No review for `analytics.readonly` (sensitive scope, needs OAuth verification) | Needs several connections (finding 2) |
| Google Ads | Yes, manager account | A developer token, with Basic access approved before production use | Fits |
| TikTok Ads | Yes, Business Center | Developer app approval for the Marketing API | Fits |
| LinkedIn Ads | Partly, ad accounts are shared to users | Advertising API access is by application and is selective | Plan for a long lead time |
| Microsoft Ads | Yes, manager account | Developer token | Fits |
| Search Console | No, per Google user per site | OAuth verification | Needs several connections |
| Business Profile | Location groups, per Google user | API access is by application | Plan for a long lead time |
| Instagram Ads | Not a separate integration | | See below |

### Instagram Ads is listed twice (Medium)

Instagram ads run in Meta ad accounts and are reported through the Meta Marketing API (placement breakdowns
already show Instagram Reels and feed). The design lists "Instagram Ads" as its own tool in Setup, the
add-client wizard, the client profile and on the landing page (alongside "Facebook Ads"). Connecting it
separately would ask for the same login twice and double-count spend.
The prototype's tool picker now says "Instagram ads live in your Meta ad accounts. Connect Meta to report on them."

**Change:** remove Instagram Ads and Facebook Ads as separate tools. Keep "Meta (Facebook and Instagram)".
If you want **organic** Instagram (followers, post reach), that is a different API (Instagram Graph API via a
connected Facebook Page) with its own permissions and app review.

### "Only reads the data and never changes your ads" (Medium)

Setup promises read-only access. Meta (`ads_read`) and TikTok can be scoped read-only. **Google Ads has no
read-only OAuth scope**: the `adwords` scope allows changes. The promise has to be kept by policy and code
review, not by the permission screen. Reword it as "Analyst only reads your data and never changes your ads",
and check that the Google consent screen will not contradict the copy.

## Numbers the design shows that the APIs cannot give

### Combined leads are double counted (Blocker for the "All sources" view)

Dashboard › Analytics › All sources adds Meta leads, Google Ads conversions, TikTok leads and "Website
(organic)" from GA4 into one total (533 leads). Each ad platform counts the leads it *claims* (Meta counts
view-throughs too), and GA4 counts the same form submissions again. Ad platforms do not share user-level
data, so there is no way to de-duplicate them.

**Change:** pick one source of truth for leads (GA4 key events, or the client's CRM when connected) and use ad
platforms for spend and platform-attributed results. Label platform numbers as "reported by Meta" etc. The
blended cost per lead should be total spend divided by the source-of-truth leads.

### Risk signals need data no integration provides (High)

The flagged-client reasons include "Slower replies: 3.8 days, usually 1". Reply time means reading the
marketer's email. That needs a Gmail or Outlook integration with mailbox read access. For Gmail that is a
**restricted scope** that requires a yearly third-party security assessment. It is also the privacy-sensitive
opt-in feature the PRD marks as stretch. None of this appears in Integrations.

"Last report unopened" is feasible only if Analyst sends the report email itself and tracks opens. Apple Mail
privacy protection makes open tracking unreliable, so prefer "link clicked" or "portal viewed".

**Change:** for v1, base risk on performance trends, goal status and report engagement (portal views and
link clicks). Add email reply time later as an opt-in Gmail or Outlook connection, with its own consent screen.

### Templates that have no data source (High)

The report template gallery offers templates whose data no listed integration provides:

| Template | Needs |
|---|---|
| Ecommerce sales (revenue, orders, best sellers) | Shopify or WooCommerce, or GA4 ecommerce events set up by the client |
| Call tracking summary | A call tracking tool (CallRail and similar). Google Ads call assets only cover calls from ads |
| Leads to sales (qualified, won, revenue) | A CRM (HubSpot, Salesforce, Pipedrive) |
| Email campaigns | Mailchimp, Klaviyo and similar. The design maps this template to GA4, which has no email send data |
| Social media report (reach, followers, best posts) | Organic Facebook Page and Instagram insights, and LinkedIn Pages. These are not the ads APIs |

**Change:** hide templates until their source is connected, or add those integrations to the roadmap.

### GA4 booking funnel depends on each client's setup (Medium)

"Booking funnel" (viewed a page, started the form, reached step 2, submitted) only exists if the client's
GA4 sends those events. The funnel endpoint of the GA4 Data API is also still alpha. Show it when the events
exist, and let the marketer pick the steps.

### Freshness (Low)

"Synced 4 minutes ago" and "Filled with live numbers … updated today" suggest real-time data. Platform data
settles later: Google Ads is a few hours behind, GA4 can take 24–48 hours to finish processing, Search
Console is 2–3 days behind, and Meta revises recent days as attribution comes in. Weekly narratives should
use settled data, and the UI should say "data up to {date}".

## Smaller notes

- **White label "Send from"** (`reports@riveradigital.com`) needs domain verification (SPF and DKIM) with the
  email provider. A plain text field isn't enough. Add a "Verify domain" step.
- **Team roles** have no per-client visibility. Agencies often want a member to see only their own clients.
  Who can manage integrations (owner and admin only) should be stated in the role picker. The prototype's invite dialog now says so.
- **Token expiry:** Meta user tokens last about 60 days and LinkedIn tokens 60 days. The design's "An account disconnects and
  data stops" alert is the right idea. Add a reconnect button straight from the alert.
- **Rate limits and backfill:** Setup promises importing "the last 90 days" for every account. GA4 has
  per-property daily quotas and Meta has per-ad-account limits. Run the backfill as a background job with
  progress, not during onboarding.

## What to do first

1. Move Integrations to Workspace and allow several connections per platform (findings 1 and 2).
2. Make account assignments the only source of a client's tools (finding 4).
3. Replace the summed "All sources" leads with a source-of-truth model.
4. Remove the separate Instagram and Facebook Ads tools, and hide templates without a data source.
5. Start the approval processes now. They take the longest: Meta App Review, Google Ads developer token
   (Basic access), TikTok developer app, Google OAuth verification for the analytics scopes.
