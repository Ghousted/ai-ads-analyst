// Example numbers and words for previewing a report template before using it.

const addDays = (day, n) => { const d = new Date(day + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

// Two weeks against the two before, with a gentle upward trend and a weekly rhythm.
export function sampleFacts(end) {
  const n = 14, start = addDays(end, -n + 1), prevStart = addDays(start, -n);
  const daily = Array.from({ length: n * 2 }, (_, i) => {
    const wave = [1, 1.08, 1.12, 1.06, 0.98, 0.72, 0.66][i % 7], base = 300 + i * 4;
    const sessions = Math.round(base * wave);
    return { day: addDays(prevStart, i), sessions, leads: Math.round(sessions * (0.032 + (i % 5) * 0.002)), engaged: Math.round(sessions * 0.61), pageViews: Math.round(sessions * 2.3) };
  });
  const sum = (arr, k) => arr.reduce((t, d) => t + d[k], 0), cur = daily.slice(n), prev = daily.slice(0, n);
  const tot = arr => ({ sessions: sum(arr, 'sessions'), engagedSessions: sum(arr, 'engaged'), leads: sum(arr, 'leads'), pageViews: sum(arr, 'pageViews'), adCost: 0 });
  return {
    periodDays: n, start, end, prevStart, prevEnd: addDays(start, -1), properties: ['Example website'],
    totals: tot(cur), prev: tot(prev), daily,
    channels: [['Organic search', 2180, 77, 1900], ['Paid social', 1350, 63, 1110], ['Direct', 920, 22, 905], ['Referral', 340, 12, 230], ['Email', 254, 8, 280]].map(([name, sessions, leads, prevSessions]) => ({ name, sessions, leads, prevSessions })),
    devices: [['mobile', 3280, 113], ['desktop', 1550, 61], ['tablet', 214, 8]].map(([name, sessions, leads]) => ({ name, sessions, leads, prevSessions: 0 })),
    pages: [['/', 1980, 36], ['/book-a-visit', 990, 90], ['/services', 740, 26], ['/pricing', 520, 22], ['/about', 260, 4]].map(([name, sessions, leads]) => ({ name, sessions, leads, prevSessions: 0 })),
    campaigns: [],
  };
}

// The words Analyst would write, shaped like a real report so the layout reads true.
const WORDS = {
  weekly: {
    headline: 'Leads up 18% on the previous two weeks',
    summary: 'The site brought in 182 leads in the last two weeks, 28 more than the two weeks before. Most of the growth came from organic search and paid social.',
    sections: [{ heading: 'What happened', body: 'Visits rose steadily through the period, with the usual dip at weekends. More visitors went on to book, so conversion edged up too.' }, { heading: 'Where visitors came from', body: 'Organic search is still the biggest source. Paid social grew the fastest and brought in a third of all leads.' }],
    nextSteps: ['Move budget towards the paid social ads that bring the most bookings.', 'Add a booking button to the services page, which gets a lot of visits but few leads.'],
  },
  traffic: {
    headline: '5,044 visits, up 17% on the previous two weeks',
    summary: 'More people found the site, mostly through search. Two thirds of visits were on a phone.',
    sections: [{ heading: 'Where visitors came from', body: 'Organic search grew by 280 visits. Direct visits held steady, and email was slightly down.' }, { heading: 'What they looked at', body: 'The home page and the booking page took most visits. The pricing page is getting more attention than last period.' }],
    nextSteps: ['Speed up the booking page on phones, where most visits now happen.', 'Refresh the email newsletter to win back the small drop in email visits.'],
  },
  leads: {
    headline: '182 leads, up 18% on the previous two weeks',
    summary: 'Leads grew across most channels. Paid social converts best, with one lead for every 21 visits.',
    sections: [{ heading: 'Which channels brought leads', body: 'Organic search brought the most leads. Paid social brought nearly as many from fewer visits.' }, { heading: 'Conversion', body: 'Conversion rose slightly, helped by more visitors reaching the booking page.' }],
    nextSteps: ['Put more of the budget into paid social while it converts this well.', 'Test a shorter booking form to lift conversion from search visitors.'],
  },
};

export const sampleWritten = id => WORDS[id] || WORDS.weekly;
