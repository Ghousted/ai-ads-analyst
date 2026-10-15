// KPIs and goals.
import { clSplit } from '../../data';

export function goalsVals(app, ctx) {
  // eslint-disable-next-line no-unused-vars
  const { SL: S, live, v, go, ST, L, C, clients, inDash, rkCount, atRisk, defTasks, TCOLS, PEOPLE, tkSrc, setTasks, moveTask, tasksAll } = ctx;
  return {
      ...(() => {
        const cpl = [12.9, 10.6, 8.73, 7.4, 9.1], conv = [2.6, 3.1, 3.4, 3.7, 4.0], spent = [1170, 1968, 960, 1280, 696], pace = 20 / 31;
        const money = v => '$' + (v >= 100 ? Math.round(v).toLocaleString() : v.toFixed(2));
        const GT = {
          cpl: { label: 'Cost per lead', desc: 'Stay under a limit', op: 'under', pre: '$', suf: '', ph: '10.00', cur: i => cpl[i] ?? 0, fmt: money, alert: 'goes above' },
          leads: { label: 'Leads per week', desc: 'Reach a minimum', op: 'over', pre: '', suf: 'leads', ph: '50', cur: i => C[i].leads, fmt: v => Math.round(v) + ' leads', alert: 'drops below' },
          conv: { label: 'Conversion rate', desc: 'Reach a minimum', op: 'over', pre: '', suf: '%', ph: '3.0', cur: i => conv[i] ?? 0, fmt: v => v.toFixed(1) + '%', alert: 'drops below' },
          budget: { label: 'Monthly budget', desc: 'Pace spending', op: 'pace', pre: '$', suf: '', ph: '2,000', cur: i => spent[i] ?? 0, fmt: money, alert: 'spends too fast or too slow' }
        };
        const defs = [{ id: 1, c: 0, t: 'cpl', v: 12 }, { id: 2, c: 0, t: 'budget', v: 1800 }, { id: 3, c: 1, t: 'cpl', v: 9 }, { id: 4, c: 1, t: 'budget', v: 2400 }, { id: 5, c: 2, t: 'cpl', v: 10 }, { id: 6, c: 3, t: 'leads', v: 100 }, { id: 7, c: 3, t: 'budget', v: 2000 }, { id: 8, c: 4, t: 'leads', v: 35 }];
        const goals = S.goals || (live ? [] : defs), F = S.gForm, E = S.gErr || {};
        const selC = inDash && S.sel != null ? S.sel : null;
        const list = goals.filter(g => selC == null || g.c === selC).slice().sort((a, b) => a.c - b.c || a.id - b.id);
        const toast = (text, undo) => { clearTimeout(app.gtT); app.setState({ gToast: text, gUndo: undo || null }); app.gtT = setTimeout(() => app.setState({ gToast: null, gUndo: null }), 5000); };
        const tone = { good: ['#2f9e5b', '#e3f3e8', '#1d6b3a'], bad: ['#e0481a', '#fde2d6', '#a3330c'], warn: ['#e8a33a', '#fff6c2', '#7a5a00'] };
        const gRows = list.map((g, k) => {
          const T = GT[g.t], cur = T.cur(g.c), name = C[g.c].name; let w, mk, st, status, caption, mkTitle;
          if (T.op === 'under') { w = Math.min(cur / (g.v * 1.5), 1); mk = 66.67; st = cur <= g.v ? 'good' : 'bad'; status = st === 'good' ? 'On track' : 'Over target'; caption = 'Now ' + T.fmt(cur) + ' · limit ' + T.fmt(g.v); mkTitle = 'Limit ' + T.fmt(g.v); }
          else if (T.op === 'over') { w = Math.min(cur / (g.v * 1.25), 1); mk = 80; st = cur >= g.v ? 'good' : 'bad'; status = st === 'good' ? 'On track' : 'Below target'; caption = 'Now ' + T.fmt(cur) + ' · target ' + T.fmt(g.v); mkTitle = 'Target ' + T.fmt(g.v); }
          else { const fr = cur / g.v; w = Math.min(fr, 1); mk = pace * 100; st = fr > pace + 0.1 ? 'bad' : fr < pace - 0.15 ? 'warn' : 'good'; status = st === 'good' ? 'On pace' : st === 'bad' ? 'Spending fast' : 'Spending slow'; caption = T.fmt(cur) + ' / ' + T.fmt(g.v) + ' budget'; mkTitle = 'Where spend should be today'; }
          const first = k === 0 || list[k - 1].c !== g.c;
          return { first, bd: first ? '#e6ebf2' : '#f4f7fb', client: name, initials: C[g.c].i, label: T.label, target: (T.op === 'under' ? 'Under ' : T.op === 'over' ? 'At least ' : '') + T.fmt(g.v) + (T.op === 'pace' ? ' a month' : T.op === 'over' && g.t === 'leads' ? ' a week' : ''),
            w: Math.round(w * 100) + '%', mk: mk.toFixed(1) + '%', mkTitle, col: tone[st][0], pBg: tone[st][1], pC: tone[st][2], status, caption,
            editLabel: 'Edit ' + T.label.toLowerCase() + ' goal for ' + name, removeLabel: 'Remove ' + T.label.toLowerCase() + ' goal for ' + name,
            rowBg: S.gOpen === g.id ? '#eef3fd' : 'transparent', open: e => { if (e.target.closest('button')) return; app.setState({ gOpen: g.id }); },
            id: g.id, cur, T, st, name, gc: g.c, v: g.v, gt: g.t,
            edit: () => app.setState({ gOpen: null, gForm: { id: g.id, client: String(g.c), type: g.t, target: String(g.v) }, gErr: {} }),
            remove: () => { app.setState(s => ({ goals: (s.goals || defs).filter(x => x.id !== g.id) })); toast('Goal removed', g); } };
        });
        const fT = F ? GT[F.type] : GT.cpl, fC = F && F.client !== '' ? Number(F.client) : null;
        return {
          ...(() => { const r = gRows.find(x => x.id === S.gOpen); if (!r) return { gpOn: false, gpO: 0, gpPe: 'none', gpX: '100%', gpVis: 'hidden', gpTrend: [], gpClose: () => app.setState({ gOpen: null }) };
            const F6 = { cpl: { bad: [0.82, 0.86, 0.9, 0.94, 0.98, 1], good: [1.14, 1.1, 1.06, 1.04, 1.02, 1] }, conv: { bad: [1.2, 1.15, 1.1, 1.06, 1.02, 1], good: [0.86, 0.9, 0.93, 0.96, 0.98, 1] }, leads: null, budget: { bad: [0.8, 0.9, 1, 1.1, 1.2, 1.3], good: [1, 1, 1, 1, 1, 1], warn: [1, 0.9, 0.8, 0.7, 0.65, 0.6] } };
            const f = r.gt === 'leads' ? C[r.gc].bars.map(b => b / C[r.gc].bars[5]) : (F6[r.gt][r.st] || F6[r.gt].good);
            const base = r.gt === 'budget' ? r.v / 4.4 : r.cur, vals = f.map(x => base * x), mx = Math.max(...vals, r.gt === 'budget' ? 0 : r.v);
            const WK = ['Sep 7', 'Sep 14', 'Sep 21', 'Sep 28', 'Oct 5', 'Oct 12'];
            const fmtV = r.gt === 'budget' ? (v => '$' + Math.round(v).toLocaleString()) : r.T.fmt;
            const WHY = { cpl: { bad: 'Costs climbed after the Meta audience got smaller. The same people are seeing the ads again, so each lead costs more.', good: 'Retargeting and brand search are bringing in cheap leads. Keep budget on them.' }, leads: { bad: 'Fewer people are clicking the ads, and the booking form loses half of mobile visitors.', good: 'Lead volume is steady and above target.' }, conv: { bad: 'More visitors arrive but fewer finish the form, mostly on mobile.', good: 'The landing page is converting well. No changes needed.' }, budget: { bad: 'Spend is ahead of schedule. At this rate the budget runs out before the end of the month.', warn: 'Spend is behind schedule. Campaigns may be held back by low bids.', good: 'Spend is right where it should be for this point in the month.' } };
            const TA = { cpl: 'Refresh the ad creative for ' + r.name, leads: 'Find out why leads dropped for ' + r.name, conv: 'Shorten the form on ' + r.name + '\'s landing page', budget: 'Rebalance ' + r.name + '\'s budget pacing' };
            const close = () => app.setState({ gOpen: null });
            return { gpOn: true, gpO: 1, gpPe: 'auto', gpX: '0', gpVis: 'visible', gpClose: close,
              gpClient: r.client, gpLabel: r.label, gpStatus: r.status, gpPBg: r.pBg, gpPC: r.pC, gpCol: r.col, gpW: r.w, gpMk: r.mk,
              gpNow: r.gt === 'budget' ? r.T.fmt(r.cur) : r.T.fmt(r.cur), gpNowLabel: r.gt === 'budget' ? 'Spent this month' : 'Right now', gpTarget: r.target, gpCaption: r.caption,
              gpTrendLabel: r.gt === 'budget' ? 'Spend per week' : 'Last 6 weeks',
              gpTrend: vals.map((v, j) => ({ h: Math.max(6, Math.round(v / mx * 96)) + 'px', c: j === 5 ? r.col : '#d6e4f8', v: fmtV(v), wk: WK[j] })),
              gpWhy: (WHY[r.gt][r.st] || WHY[r.gt].good), gpAlert: clSplit('Analyst alerts you when ' + r.T.label.toLowerCase() + ' ' + r.T.alert + ' ' + (r.gt === 'budget' ? 'its schedule' : 'the target') + '.'),
              gpNeedsTask: r.st !== 'good', gpTask: () => app.setState(s => ({ gOpen: null, gToast: 'Task added to To do', tasks: [{ title: TA[r.gt], desc: r.label + ' is ' + r.status.toLowerCase() + '. ' + r.caption + '.', client: r.name, status: 'todo', sub: [0, 0], due: '', who: ['AR'], cm: 0 }, ...(s.tasks || defTasks)] })),
              gpEdit: r.edit, gpRemove: () => { close(); r.remove(); } };
          })(),
          gHasRows: gRows.length > 0, gRows, gEmpty: gRows.length === 0 && !F, gEmptyTitle: selC != null ? 'No goals for ' + C[selC].name + ' yet' : 'No goals yet',
          gToast: !!S.gToast, gToastText: S.gToast || '', gCanUndo: !!S.gUndo,
          gUndo: () => { const g = S.gUndo; if (!g) return; app.setState(s => ({ goals: [...(s.goals || defs), g], gToast: null, gUndo: null })); },
          gAdd: () => app.setState({ gForm: { id: null, client: selC != null ? String(selC) : '', type: 'cpl', target: '' }, gErr: {} }),
          gFormOpen: !!F, gFormTitle: F && F.id ? 'Edit goal' : 'New goal', gSaveLabel: F && F.id ? 'Save changes' : 'Add goal',
          gfClient: F ? F.client : '', gfTarget: F ? F.target : '',
          gClientOpts: C.map((c, i) => ({ v: String(i), t: c.name })),
          gErrClient: !!E.client, gfClientBd: E.client ? '#e0481a' : '#d3dbe6',
          gErrTargetOn: !!E.target, gErrTarget: E.target || '', gfTargetBd: E.target ? '#e0481a' : '#d3dbe6',
          gTypes: Object.keys(GT).map(k => ({ label: GT[k].label, desc: GT[k].desc, on: F ? F.type === k : false, bd: F && F.type === k ? '#1f6be2' : '#e6ebf2', pick: () => app.setState(s => ({ gForm: { ...s.gForm, type: k }, gErr: { ...(s.gErr || {}), target: null } })) })),
          gTargetLabel: fT.op === 'under' ? 'Keep it under' : fT.op === 'over' ? 'Reach at least' : 'Budget for the month', gPrefix: fT.pre, gSuffix: fT.suf, gPlaceholder: fT.ph,
          gHelperOn: fC != null && !E.target, gHelper: fC != null ? 'Now ' + fT.fmt(fT.cur(fC)) + '. Analyst alerts you when it ' + fT.alert + ' your target.' : '',
          gSetClient: e => { const val = e.target.value; app.setState(s => ({ gForm: { ...s.gForm, client: val }, gErr: { ...(s.gErr || {}), client: false } })); },
          gSetTarget: e => { const val = e.target.value.replace(/[^0-9.]/g, ''); app.setState(s => ({ gForm: { ...s.gForm, target: val }, gErr: { ...(s.gErr || {}), target: null } })); },
          gCancel: () => app.setState({ gForm: null, gErr: {} }),
          gSave: e => {
            e.preventDefault(); const err = {}, num = parseFloat(F.target);
            if (F.client === '') err.client = true;
            if (!F.target) err.target = 'Enter a target.'; else if (!(num > 0)) err.target = 'Enter a number above 0.';
            if (!err.client && !err.target && goals.some(g => g.c === Number(F.client) && g.t === F.type && g.id !== F.id)) err.target = C[Number(F.client)].name + ' already has a ' + GT[F.type].label.toLowerCase() + ' goal. Edit that one instead.';
            if (err.client || err.target) { app.setState({ gErr: err }); return; }
            const item = { id: F.id || Date.now(), c: Number(F.client), t: F.type, v: num };
            app.setState(s => ({ goals: F.id ? (s.goals || defs).map(g => g.id === F.id ? item : g) : [...(s.goals || defs), item], gForm: null, gErr: {} }));
            toast(F.id ? 'Goal updated' : 'Goal added for ' + C[item.c].name);
          }
        };
      })(),
  };
}
