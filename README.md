# AI Ads Analyst

Clickable prototype of AI Ads Analyst (formerly Clario): weekly ad reports in plain English, and a warning before a client leaves.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

| Route | What it is |
|---|---|
| `/` | Landing page |
| `/login` | Log in, or sign up with `/login?mode=signup` |
| `/setup` | Onboarding wizard |
| `/app` | The app: dashboard, clients, reporting, tasks, KPIs and goals, settings |
| `/integrations`, `/help`, … | Info pages linked from the landing page |

Everything runs on sample data in the browser. Read `docs/integration-review.md` before building the real
integrations, and `AGENTS.md` for how the code is laid out.
