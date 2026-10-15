# AI Ads Analyst

Clickable Next.js prototype of AI Ads Analyst (formerly Clario; the repo and code names still say clario), the AI report and retention narrator for freelance marketers and small
agencies. The product spec is `design/uploads/AI_Report_Retention_Narrator_PRD.md`. All data is sample data
held in React state. There is no backend yet.

## Layout

- `design/`: the Claude Design source (`*.dc.html`, assets and uploads). It is the visual reference. Open a
  page in a browser to see the original, since `support.js` is the design runtime.
- `src/app/`: routes. `/` landing, `/login`, `/setup`, `/app`, and the info pages in `(site)/[slug]`.
- `src/screens/<page>/`: one folder per design page. `View.jsx` is the markup, `Screen.jsx` the behaviour
  (a React class whose `renderVals()` returns the flat values the view renders).
- `src/screens/app/modules/<feature>/`: the app is split into feature modules (dashboard, clients,
  reporting, goals, tasks, settings). Each exports `{ id, vals, View, Overlay?, methods? }` from `index.js`
  and is listed in `modules/index.js`. The shell (`Screen.jsx`, `View.jsx`) owns navigation, the header, the
  client switcher and Ask Analyst.
- `src/screens/app/data.js`: shared sample data (connected accounts, tasks, people, logos).
- `docs/integration-review.md`: which design assumptions break against the real platform APIs.
- `scripts/dc-to-react.mjs`: converts a `.dc.html` page to JSX. Convert into a scratch folder and copy
  changes across. Never overwrite `src/screens`.

## Working rules

- Keep the look identical to the design. Styles are inline, as in the design. Hover, focus and active styles
  are `dc…` classes defined in each view's `css` string.
- Every button must do something real in the prototype: change state, navigate, open a dialog or
  download a file. No "opens soon" toasts.
- Run `npm run build` before opening a PR.

## Design rules (from the design project)

Always apply `design/uploads/AI-Design-Guidelines.md`:

- No emojis, no purple or gradients, no glass, sentence case only.
- Borders only where they serve a purpose. Otherwise separate with spacing or background.
- Cards only for standalone or clickable items. Never nest cards, and don't box every stat.
- No icons inside small coloured rounded squares. Keep icons small and aligned with their label.
- Subheadings only where they help scanning. No decorative labels or repeated badges.
- Use colour for meaning (primary action, success, warning), not decoration.
- Clear hierarchy and specific copy. Design empty, loading and error states.
- Alt text, heading order, favicon, social tags, viewport, 44px touch targets.
