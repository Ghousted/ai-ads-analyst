// Copy for the marketing pages linked from the landing page and login footers.
export type InfoPage = { title: string; lead: string; sections: { heading: string; items: string[] }[]; cta?: { label: string; href: string } };

const signup = { label: 'Start free with 2 clients', href: '/login?mode=signup' };

export const PAGES: Record<string, InfoPage> = {
  integrations: {
    title: 'Integrations',
    lead: 'Sign in once with your agency login. Clario finds the client accounts you manage and only reads the data.',
    sections: [
      { heading: 'Available at launch', items: ['Meta Ads (Facebook and Instagram ads)', 'Google Analytics 4'] },
      { heading: 'Coming next', items: ['Google Ads', 'TikTok Ads', 'LinkedIn Ads', 'Microsoft Ads', 'Google Search Console', 'Google Business Profile'] },
      { heading: 'How access works', items: ['Facebook and Instagram ads are reported through your Meta ad accounts, so there is one Meta connection for both.', 'Google tools connect per Google login. If a client shared their property with a teammate, that teammate connects too.', 'You assign each account to a client once. New accounts show up for you to assign.'] },
    ],
    cta: signup,
  },
  'report-examples': {
    title: 'Report examples',
    lead: 'Every report starts from a template and is written in plain language your client can follow.',
    sections: [
      { heading: 'Templates', items: ['Weekly update: a short summary, key numbers and next steps', 'Monthly summary: results, breakdowns, top campaigns and goals', 'Campaign deep-dive: which ads worked and why', 'Website analytics: visitors, sources and conversions from GA4'] },
    ],
    cta: signup,
  },
  freelancers: { title: 'For freelancers', lead: 'Spend Friday on marketing, not on screenshots. Clario writes each client’s report and tells you who might be about to leave.', sections: [{ heading: 'What you get', items: ['Free for your first two clients', 'Reports written on schedule, ready for you to review', 'Risk alerts with the reasons and a drafted check-in'] }], cta: signup },
  agencies: { title: 'For small agencies', lead: 'One place for every client’s results, with tasks and alerts your whole team can see.', sections: [{ heading: 'What you get', items: ['Shared client list with health status', 'Tasks board linked to each client', 'Your logo and colour on every report'] }], cta: signup },
  'in-house': { title: 'For in-house marketers', lead: 'Turn ad and analytics data into an update your manager can read in two minutes.', sections: [{ heading: 'What you get', items: ['One combined view across ad platforms', 'Plain-language summaries of what changed and why', 'Goals and budget pacing alerts'] }], cta: signup },
  help: { title: 'Help center', lead: 'Answers to the questions people ask most.', sections: [{ heading: 'Getting started', items: ['Connect your agency accounts from Settings, Integrations.', 'Assign each ad account or property to a client.', 'Pick a template in Reporting and Clario fills in the numbers.'] }, { heading: 'Still stuck?', items: ['Email help@clario.app and we reply within one working day.'] }] },
  blog: { title: 'Blog', lead: 'Notes on client reporting and keeping clients. The first posts are on their way.', sections: [] },
  changelog: { title: 'What’s new', lead: 'Product updates as they ship.', sections: [{ heading: 'October 2026', items: ['Clickable prototype of the app: dashboard, clients, reports, tasks, goals and settings.'] }] },
  privacy: { title: 'Privacy', lead: 'Clario only reads the ad and analytics data you connect. It never changes your campaigns and never sells data.', sections: [{ heading: 'Draft', items: ['The full privacy policy will be published before launch.'] }] },
  terms: { title: 'Terms', lead: 'The terms of service will be published before launch.', sections: [] },
  contact: { title: 'Contact', lead: 'Questions, partnerships or press: hello@clario.app.', sections: [] },
};
