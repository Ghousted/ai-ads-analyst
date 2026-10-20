import { saveGoalAction } from '@/app/actions/goals';
import { currencyOf, money as fmtMoney, symbolOf } from '@/lib/money';

// Budget and goals for one client, shown and edited in their profile. Goals are { id, c (client index), t (type), v }.
// Live agencies' goals are saved in the database; sample agencies keep theirs in the page.
// A "budget" goal is the client's monthly ad budget. Spend is Meta spend plus Google Ads cost (from GA4); until any is
// stored, a live client shows no spend (sample agencies use sample spend).

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysIn = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
const key = (y, m, d) => y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');

// Sample agency: the goals each sample client starts with.
export const SAMPLE_GOALS = [{ id: 1, c: 0, t: 'cpl', v: 12 }, { id: 2, c: 0, t: 'budget', v: 1800 }, { id: 3, c: 1, t: 'cpl', v: 9 }, { id: 4, c: 1, t: 'budget', v: 2400 }, { id: 5, c: 2, t: 'cpl', v: 10 }, { id: 6, c: 3, t: 'leads', v: 100 }, { id: 7, c: 3, t: 'budget', v: 2000 }, { id: 8, c: 4, t: 'leads', v: 35 }];

// The agency's goals: edited here, else saved (live) or the samples.
export function goalsOf(S, live, C) {
  const base = !live ? SAMPLE_GOALS : (live.goals || []).map(g => ({ id: g.clientId + ':' + g.type, c: C.findIndex(x => x.extra && x.extra.id === g.clientId), t: g.type, v: g.target }));
  return (S.goals || base).filter(g => C[g.c]);
}

const RATES = [58.5, 98.4, 48, 64, 34.8];
function spendFor(live, C, i, today) {
  const [y, m, d] = today.split('-').map(Number), out = {};
  const m0 = live && live.metrics, id = live && C[i].extra && C[i].extra.id;
  if (m0) for (const [a, day, dim, , metric, v] of m0.rows || []) {
    const acct = (m0.accounts || [])[a];
    if (acct && acct.clientId === id && ((acct.tool === 'meta' && metric === 'spend' && dim === 'total') || (acct.tool === 'ga4' && metric === 'adCost' && dim === 'campaign'))) out[day] = (out[day] || 0) + v;
  }
  if (Object.values(out).some(Boolean)) return { days: out, none: false };
  if (live) return { days: {}, none: true };
  // Sample agency: a steady daily rate with a weekly rhythm.
  const rate = RATES[i % RATES.length];
  for (let day = 1; day <= d; day++) { const wd = new Date(Date.UTC(y, m - 1, day)).getUTCDay(); out[key(y, m - 1, day)] = rate * [0.8, 1.1, 1.05, 1, 1, 0.95, 0.85][wd] * (1 + Math.sin(i * 7 + day * 3) * 0.08); }
  return { days: out, none: false };
}

export function clientGoalVals(app, { S, live, C }, i, toast) {
  const goals = goalsOf(S, live, C), c = C[i];
  // Money in the client's currency (their ad account's); sample clients are in dollars. Cents under 100.
  const currency = live && live.metrics && c.extra ? currencyOf(live.metrics.accounts.filter(a => a.clientId === c.extra.id)) : 'USD';
  const money = v => fmtMoney(v, currency, v < 100), sym = symbolOf(currency);
  const setGoals = fn => app.setState(s => ({ goals: fn(goalsOf(s, live, C).slice()) }));
  // Live: save the change. If it fails, say so and go back to what is saved.
  const persist = (type, target, replaces) => { if (!live || !c.extra) return;
    saveGoalAction({ clientId: c.extra.id, type, target, replaces }).then(x => { if (x.error) { toast(x.error); app.setState({ goals: undefined }); } else app.props.refresh?.(); },
      () => { toast('Couldn\u2019t save the goal. Check your connection and try again.'); app.setState({ goals: undefined }); }); };
  // Current values over the last 7 days. Live: leads as shown on the client, cost per lead from Meta spend and Meta
  // leads, conversion rate from GA4 key events and sessions.
  const SAMPLE = { cpl: [12.9, 10.6, 8.73, 7.4, 9.1], conv: [2.6, 3.1, 3.4, 3.7, 4.0] }, wk = c.week;
  const cur = live ? { cpl: wk && wk.metaLeads > 0 ? wk.spend / wk.metaLeads : null, leads: wk ? c.leads : null, conv: wk && wk.source === 'ga4' && wk.sessions > 0 ? wk.leads / wk.sessions * 100 : null }
    : { cpl: SAMPLE.cpl[i] ?? null, leads: c.leads, conv: SAMPLE.conv[i] ?? null };
  const GT = {
    cpl: { label: 'Cost per lead', op: 'under', pre: sym, suf: '', ph: '10.00', cur: cur.cpl, fmt: money, help: 'Analyst alerts you when it goes above this.' },
    leads: { label: 'Leads per week', op: 'over', pre: '', suf: 'leads', ph: '50', cur: cur.leads, fmt: v => Math.round(v) + ' leads', help: 'Analyst alerts you when it drops below this.' },
    conv: { label: 'Conversion rate', op: 'over', pre: '', suf: '%', ph: '3.0', cur: cur.conv, fmt: v => v.toFixed(1) + '%', help: 'Analyst alerts you when it drops below this.' },
  };
  const tone = { good: ['#2f9e5b', '#e3f3e8', '#1d6b3a'], bad: ['#e0481a', '#fde2d6', '#a3330c'], warn: ['#e8a33a', '#fff6c2', '#7a5a00'], none: ['#97a2b2', '#eef1f6', '#45505f'] };

  // Monthly budget and how spending is pacing against it.
  const today = live ? (live.metrics && live.metrics.through) || new Date(Date.now() - 86400000).toISOString().slice(0, 10) : '2026-10-20';
  const [ty, tm, td] = today.split('-').map(Number), dim = daysIn(ty, tm - 1), pace = td / dim;
  const sp = spendFor(live, C, i, today), spent = Object.entries(sp.days).filter(([d]) => d.startsWith(today.slice(0, 8))).reduce((t, [, v]) => t + v, 0), fc = spent / td * dim;
  const bg = goals.find(g => g.c === i && g.t === 'budget'), b = bg ? bg.v : null;
  const bst = b == null || sp.none ? 'none' : spent / b > pace + 0.1 ? 'bad' : spent / b < pace - 0.15 ? 'warn' : 'good';
  const BD = S.cgBudgetDraft != null && S.cgBudgetFor === i ? S.cgBudgetDraft : null;
  const saveBudget = e => { e.preventDefault(); const v = parseFloat(BD); if (BD.trim() && !(v > 0)) { app.setState({ cgBudgetErr: 'Enter an amount above 0, or leave it empty for no budget.' }); return; }
    setGoals(gs => [...gs.filter(g => !(g.c === i && g.t === 'budget')), ...(v > 0 ? [{ id: Date.now(), c: i, t: 'budget', v }] : [])]); persist('budget', v > 0 ? v : null);
    app.setState({ cgBudgetDraft: null, cgBudgetErr: null }); toast(v > 0 ? 'Budget saved' : 'Budget removed'); };

  // Goals other than the budget.
  const mine = goals.filter(g => g.c === i && g.t !== 'budget');
  const F = S.cgForm && S.cgForm.c === i ? S.cgForm : null, FE = S.cgErr || {};
  const free = Object.keys(GT).filter(t => !mine.some(g => g.t === t) || (F && F.id && mine.find(g => g.id === F.id)?.t === t));
  const rows = mine.map(g => {
    const T = GT[g.t], cur = T.cur; let w = 0, st = 'none', status = 'No numbers yet', now = 'No numbers yet';
    if (cur != null) { now = 'Now ' + T.fmt(cur); if (T.op === 'under') { w = Math.min(cur / (g.v * 1.5), 1); st = cur <= g.v ? 'good' : 'bad'; status = st === 'good' ? 'On track' : 'Over target'; } else { w = Math.min(cur / (g.v * 1.25), 1); st = cur >= g.v ? 'good' : 'bad'; status = st === 'good' ? 'On track' : 'Below target'; } }
    return { id: g.id, label: T.label, target: (T.op === 'under' ? 'Under ' : 'At least ') + T.fmt(g.v) + (g.t === 'leads' ? ' a week' : ''), now, status, w: Math.round(w * 100) + '%', mk: T.op === 'under' ? '66.7%' : '80%', col: tone[st][0], pBg: tone[st][1], pC: tone[st][2],
      edit: () => app.setState({ cgForm: { c: i, id: g.id, type: g.t, target: String(g.v) }, cgErr: {} }), editLabel: 'Edit ' + T.label.toLowerCase() + ' goal',
      remove: () => app.confirm({ title: 'Remove the ' + T.label.toLowerCase() + ' goal?', body: 'Analyst stops tracking ' + T.label.toLowerCase() + ' for ' + c.name + ' and won\u2019t alert you about it.', confirm: 'Remove goal', tone: 'danger',
        onConfirm: () => { setGoals(gs => gs.filter(x => x.id !== g.id)); persist(g.t, null); toast('Goal removed'); } }), removeLabel: 'Remove ' + T.label.toLowerCase() + ' goal' };
  });
  const fT = F ? GT[F.type] : null;

  const editing = F && F.id ? mine.find(g => g.id === F.id) : null;
  return {
    // Unsaved edits in this section, so closing the profile can ask first.
    cgDirty: (BD != null && BD !== (b != null ? String(b) : '')) || (!!F && !!F.target && (!editing || F.target !== String(editing.v) || F.type !== editing.t)),
    cgSym: sym, cgHasBudget: b != null, cgShowBar: b != null && !sp.none, cgBudget: b != null ? money(b) + ' a month' : 'No budget yet',
    cgBudgetNote: sp.none ? 'No ad spend for ' + c.name + ' yet. Pacing shows once Meta or Google Ads spend arrives for them.' : b != null ? money(spent) + ' spent by ' + MON[tm - 1] + ' ' + td + ', on course for ' + money(fc) + '.' : money(spent) + ' spent by ' + MON[tm - 1] + ' ' + td + '. Set a budget and Analyst tells you when spending drifts.',
    cgBudgetStatus: { good: 'On pace', bad: 'Spending fast', warn: 'Spending slow', none: '' }[bst], cgBPBg: tone[bst][1], cgBPC: tone[bst][2], cgBCol: tone[bst][0],
    cgBW: b && !sp.none ? Math.min(100, Math.round(spent / b * 100)) + '%' : '0%', cgBMk: (pace * 100).toFixed(1) + '%',
    cgBudgetEditing: BD != null, cgBudgetDraft: BD || '', cgBudgetBtn: b != null ? 'Change' : 'Set budget',
    cgEditBudget: () => app.setState({ cgBudgetFor: i, cgBudgetDraft: b != null ? String(b) : '', cgBudgetErr: null }),
    cgSetBudget: e => app.setState({ cgBudgetDraft: e.target.value.replace(/[^0-9.]/g, ''), cgBudgetErr: null }),
    cgCancelBudget: () => app.setState({ cgBudgetDraft: null, cgBudgetErr: null }), cgSaveBudget: saveBudget, cgBudgetErr: S.cgBudgetErr || '',
    cgGoals: rows, cgNoGoals: rows.length === 0 && !F, cgCanAdd: !F && free.length > 0,
    cgAdd: () => app.setState({ cgForm: { c: i, id: null, type: free[0], target: '' }, cgErr: {} }),
    cgFormOn: !!F, cgFormTitle: F && F.id ? 'Edit goal' : 'New goal', cgFormSave: F && F.id ? 'Save goal' : 'Add goal',
    cgTypes: F ? free.map(t => ({ label: GT[t].label, on: F.type === t, pick: () => app.setState(s => ({ cgForm: { ...s.cgForm, type: t }, cgErr: {} })) })) : [],
    cgTarget: F ? F.target : '', cgPre: fT ? fT.pre : '', cgSuf: fT ? fT.suf : '', cgPh: fT ? fT.ph : '', cgTargetLabel: fT ? (fT.op === 'under' ? 'Keep it under' : 'Reach at least') : '',
    cgHelp: fT ? (fT.cur == null ? 'No numbers for this yet. Analyst starts tracking it when they arrive.' : 'Now ' + fT.fmt(fT.cur) + '. ' + fT.help) : '', cgTargetErr: FE.target || '',
    cgSetTarget: e => { const val = e.target.value.replace(/[^0-9.]/g, ''); app.setState(s => ({ cgForm: { ...s.cgForm, target: val }, cgErr: {} })); },
    cgCancel: () => app.setState({ cgForm: null, cgErr: {} }),
    cgSave: e => { e.preventDefault(); const num = parseFloat(F.target);
      if (!F.target) { app.setState({ cgErr: { target: 'Enter a target.' } }); return; } if (!(num > 0)) { app.setState({ cgErr: { target: 'Enter a number above 0.' } }); return; }
      const item = { id: F.id || Date.now(), c: i, t: F.type, v: num };
      setGoals(gs => F.id ? gs.map(g => g.id === F.id ? item : g) : [...gs, item]); persist(F.type, num, editing ? editing.t : null); app.setState({ cgForm: null, cgErr: {} }); toast(F.id ? 'Goal updated' : 'Goal added'); },
  };
}
