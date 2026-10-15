// Tasks: board, list, flagged clients and the new-task wizard.
import { clSplit } from '../../data';
import { analyzeFlagAction, dismissFlagAction } from '@/app/actions/flags';

export function tasksVals(app, ctx) {
  // eslint-disable-next-line no-unused-vars
  const { live, S, v, go, ST, L, C, clients, inDash, rkCount, atRisk, defTasks, TCOLS, PEOPLE, tkSrc, setTasks, moveTask, tasksAll } = ctx;
  return {
      ...(() => { const gone = S.rkGone || {}; const list = C.map((c, i) => ({ c, i })).filter(({ c }) => c.s !== 'h' && !c.dismissed && !gone[c.name]);
        const PILL = { r: ['#fde2d6', '#a3330c', 'At risk', '#e0481a'], n: ['#fff6c2', '#7a5a00', 'Needs attention', '#e8a33a'] };
        const hide = c => { app.setState(s => ({ rkGone: { ...(s.rkGone || {}), [c.name]: true } })); if (live && c.extra) dismissFlagAction({ clientId: c.extra.id, keys: c.flagKeys || '' }); };
        const fl = S.tkView === 'flagged';
        // Claude's analysis of a flag: saved with the client (live), built in (sample), or being written now.
        const AI = S.flagAi || {}, setAi = (n, o) => app.setState(s => ({ flagAi: { ...(s.flagAi || {}), [n]: { ...((s.flagAi || {})[n] || {}), ...o } } }));
        const analyse = (c, fresh) => { if (!live || !c.extra) return; setAi(c.name, { busy: true, err: '' });
          analyzeFlagAction({ clientId: c.extra.id, fresh }).then(r => setAi(c.name, r.error ? { busy: false, err: r.error } : { busy: false, analysis: r.analysis }), () => setAi(c.name, { busy: false, err: 'Couldn’t reach the server. Try again.' })); };
        const addTask = (c, title, desc) => app.setState(s => ({ tasks: [{ title, desc, client: c.name, status: 'todo', sub: [0, 1], due: 'This week', who: ['AR'], cm: 0 }, ...(s.tasks || defTasks)] }));
          const rows = list.map(({ c, i }) => { const an = (AI[c.name] || {}).analysis || c.analysis || null, act = (an ? an.steps[0].action : c.action || 'check in with the client this week.').replace(/\.$/, ''), title = act[0].toUpperCase() + act.slice(1), bad = c.signals.filter(s => !/normal|steady|on budget|\bup\b|growing|^views every|^reports viewed/i.test(s[0])), SAY = { 'Leads down 3 weeks': 'Leads have dropped three weeks in a row (−9%, −14%, then −6%).', 'Portal not visited': 'They haven\'t opened their client portal since Sep 12.', 'Last report not viewed': 'They haven\'t viewed the last report, sent Sep 26.', 'Cost per lead rising': 'Each lead costs 18% more than two weeks ago.', 'Budget pacing ahead': '82% of the monthly budget is spent, with 11 days still to go.' }, reasons = c.reasons || bad.map(s => SAY[s[0]] || s[0] + ': ' + s[1] + '.'), why = reasons.join(' ');
            return { c, an, reasons, name: c.name, initials: c.i, status: PILL[c.s][2], pillBg: PILL[c.s][0], pillC: PILL[c.s][1], dot: PILL[c.s][3], why, action: title + '.', dismissLabel: 'Dismiss alert for ' + c.name,
              create: () => { addTask(c, title, 'Flagged by Analyst: ' + why); app.setState(s => ({ rkGone: { ...(s.rkGone || {}), [c.name]: true } })); },
              ask: () => app.setState(s => ({ chatOpen: true, msgs: [...(s.msgs || []), { me: true, text: 'Why was ' + c.name + ' flagged?' }, { me: false, text: c.name + ' was flagged because:\n' + reasons.map(x => '· ' + x).join('\n') + (an ? '\n\n' + an.summary : '') + '\n\nI suggest you ' + act[0].toLowerCase() + act.slice(1) + '. Want me to create the task?' }] })),
              dismiss: () => hide(c), rowBg: S.rkOpen === c.name ? '#eef3fd' : '#ffffff', open: e => { if (e.target.closest('button')) return; app.setState({ rkOpen: c.name }); if (!an && !(AI[c.name] || {}).busy) analyse(c); } }; });
        const cur = rows.find(r => r.name === S.rkOpen), ci = cur ? C.findIndex(c => c.name === cur.name) : -1, cc = ci >= 0 ? C[ci] : null, mxb = cc ? Math.max(...cc.bars) : 1;
        const WK = ['Sep 7', 'Sep 14', 'Sep 21', 'Sep 28', 'Oct 5', 'Oct 12'];
        const ai = cur ? AI[cur.name] || {} : {}, an = cur && cur.an, added = (cur && (S.flagAdded || {})[cur.name]) || {};
        const rp = cur ? { rpOn: true, rpO: 1, rpPe: 'auto', rpX: '0', rpVis: 'visible', rpName: cur.name, rpInitials: cur.initials, rpStatus: cur.status, rpPBg: cur.pillBg, rpPC: cur.pillC, rpReasons: cur.reasons, rpAction: cur.action,
            rpBars: cc.bars.map((b, j) => ({ h: Math.max(6, Math.round(b / mxb * 96)) + 'px', c: j === 5 ? cur.dot : '#d6e4f8', v: String(Math.round(b)), wk: live ? (j === 5 ? 'This wk' : (5 - j) + ' wk ago') : WK[j] })),
            rpFacts: [{ k: 'Last report', v: cc.last }, { k: 'Report tone', v: cc.tone }, { k: 'Leads this week', v: cc.leads + ' (' + cc.delta + ')' }],
            rpAiBusy: !!ai.busy, rpAiErr: !ai.busy && !an ? ai.err || '' : '', rpAiHas: !ai.busy && !!an, rpAiNone: !ai.busy && !an && !ai.err,
            rpAiRetry: () => analyse(cur.c, true), rpAiRefresh: live ? () => analyse(cur.c, true) : null, rpAiRefreshErr: !ai.busy && an ? ai.err || '' : '',
            rpSummary: an ? an.summary : '', rpCauses: an ? an.causes : [], rpHasCauses: !!(an && an.causes.length),
            rpSteps: an ? an.steps.map((st, j) => ({ n: String(j + 1), action: st.action, why: st.why, added: !!added[j], addLabel: added[j] ? 'Added' : 'Add as task', addAria: 'Add "' + st.action + '" as a task',
              add: () => { if (added[j]) return; addTask(cur.c, st.action, st.why); app.setState(s => ({ flagAdded: { ...(s.flagAdded || {}), [cur.name]: { ...((s.flagAdded || {})[cur.name] || {}), [j]: true } } })); } })) : [],
            rpMsg: an ? an.message : '', rpMsgTo: cc.contact ? 'To ' + cc.contact + (cc.email ? ', ' + cc.email : '') : '',
            rpCopyLabel: S.flagCopied === cur.name ? 'Copied' : 'Copy message',
            rpCopy: () => { const done = () => { app.setState({ flagCopied: cur.name }); clearTimeout(app.fcT); app.fcT = setTimeout(() => app.setState({ flagCopied: null }), 2000); }; navigator.clipboard ? navigator.clipboard.writeText(an.message).then(done, () => {}) : done(); },
            rpMailHref: an && cc.email ? 'mailto:' + encodeURIComponent(cc.email) + '?subject=' + encodeURIComponent('Quick check-in') + '&body=' + encodeURIComponent(an.message) : '', rpHasMail: !!(an && cc.email),
            rpCreate: () => { cur.create(); app.setState({ rkOpen: null }); }, rpAsk: () => { cur.ask(); app.setState({ rkOpen: null }); }, rpDismiss: () => { cur.dismiss(); app.setState({ rkOpen: null }); },
            rpProfile: () => app.setState({ rkOpen: null, pfPanel: true, pfI: ci, cid: ci, pfDraft: null }) }
          : { rpOn: false, rpO: 0, rpPe: 'none', rpX: '100%', rpVis: 'hidden', rpReasons: [], rpBars: [], rpFacts: [], rpCauses: [], rpSteps: [] };
        return { ...rp, rpClose: () => app.setState({ rkOpen: null }), rkList: rows, rkHas: fl && list.length > 0, rkNone: fl && list.length === 0, rkMail: !live, rkTitle: clSplit('Analyst flagged ' + list.length + (list.length === 1 ? ' client' : ' clients')) }; })(),
      ...(() => { const W = S.tw; if (!W) return { twOpen: false, twStep: 1, twBars: [], twS1: false, twS2: false, twS3: false, twClients: [], twPeople: [], twItems: [] };
        const set = o => app.setState(s => ({ tw: { ...s.tw, ...o } })), E = S.twErr || {}, st = W.step;
        const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dueTxt = W.due ? MO[+W.due.slice(5, 7) - 1] + ' ' + (+W.due.slice(8, 10)) : '';
        const addItem = () => { const t = (W.itemVal || '').trim(); if (!t) return; set({ items: [...W.items, t], itemVal: '' }); };
        const close = () => app.setState({ tw: null, twErr: null });
        return { twOpen: true, twStep: String(st), twBars: [1, 2, 3].map(n => ({ c: n <= st ? '#1f6be2' : '#e6ebf2' })), twS1: st === 1, twS2: st === 2, twS3: st === 3,
          twClose: close, twBackdrop: e => { if (e.target === e.currentTarget) close(); },
          twBack: () => st > 1 ? set({ step: st - 1 }) : close(), twBackLabel: st > 1 ? 'Back' : 'Cancel',
          twTitle: W.title, twSetTitle: e => { const x = e.target.value; set({ title: x }); if (E.title) app.setState({ twErr: null }); }, twTitleErr: !!E.title, twTitleBd: E.title ? '#e0481a' : '#d3dbe6',
          twDesc: W.desc, twSetDesc: e => set({ desc: e.target.value }),
          twClients: [''].concat(C.map(c => c.name)).map(n => ({ label: n || 'No client', on: W.client === n, bg: W.client === n ? '#eef3fd' : '#ffffff', bd: W.client === n ? '#1f6be2' : '#d3dbe6', pick: () => set({ client: n }) })),
          twDue: W.due, twSetDue: e => set({ due: e.target.value }),
          twPeople: Object.entries(PEOPLE).map(([k, [n, av]]) => { const on = W.who.includes(k); return { i: k, label: n, av, on, bg: on ? '#eef3fd' : '#ffffff', bd: on ? '#1f6be2' : '#d3dbe6', pick: () => { set({ who: on ? W.who.filter(x => x !== k) : [...W.who, k] }); app.setState({ twErr: null }); } }; }), twWhoErr: !!E.who,
          twItems: W.items.map((label, j) => ({ label, removeLabel: 'Remove step ' + label, remove: () => set({ items: W.items.filter((_, k) => k !== j) }) })),
          twItemVal: W.itemVal, twSetItem: e => set({ itemVal: e.target.value }), twAddItem: addItem, twItemKey: e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } },
          twSummary: [W.client || 'No client', dueTxt ? 'Due ' + dueTxt : 'No due date', W.who.map(k => PEOPLE[k][0]).join(', ')].join(' · '),
          twNext: e => { e.preventDefault();
            if (st === 1) { if (!W.title.trim()) { app.setState({ twErr: { title: true } }); return; } set({ step: 2 }); return; }
            if (st === 2) { if (!W.who.length) { app.setState({ twErr: { who: true } }); return; } set({ step: 3 }); return; }
            const items = [...W.items, ...((W.itemVal || '').trim() ? [W.itemVal.trim()] : [])];
            app.setState(s => ({ tw: null, twErr: null, tkView: 'board', tasks: [{ title: W.title.trim(), desc: W.desc.trim(), client: W.client, status: 'todo', sub: [0, items.length], items: items.length ? items : undefined, due: dueTxt, who: W.who, cm: 0 }, ...(s.tasks || defTasks)] })); } };
      })(),
      ...(() => { const list = inDash && S.sel != null ? tasksAll.filter(t => t.client === clients[S.sel].name) : tasksAll; const board = (S.tkView || 'board') === 'board';
        const ti = S.tkOpen, tt = ti != null ? tkSrc[ti] : null;
        const CHK = { 'Refresh TikTok creative': ['Pick the two weakest videos', 'Write three new hooks', 'Film new openers', 'Upload and set budgets', 'Check results after 3 days'], 'Book check-in call with Dana': ['Pull the last 3 weeks of results', 'Send a calendar invite'], 'Fix mobile booking form step 2': ['Record a mobile session', 'Replace the date picker', 'Test on iPhone and Android', 'Ship and watch drop-off'], 'Raise Google Ads budget cap': ['Check when the cap is hit', 'Write the request to the client', 'Update the cap'], 'Set up GA4 conversion events': ['Booking confirmed event', 'Call click event', 'Mark both as key events', 'Check they show in reports'], 'Write November ad copy': ['Headlines for gift sets', 'Body copy', 'Send to client for approval'], 'Send October report': ['Fill in results', 'Add the new cost per lead goal', 'Review with Jordan', 'Send to client'] };
        const CMS = [['JS', '2 days ago', 'Started on this, will share a draft tomorrow.'], ['AR', 'Yesterday', 'Looks good. Keep the tone friendly.']];
        const names = tt ? (tt.items || CHK[tt.title] || Array.from({ length: (tt.sub || [0, 0])[1] }, (_, j) => 'Step ' + (j + 1))) : [];
        const chk = tt ? ((S.tkChk || {})[ti] || names.map((_, j) => j < (tt.sub || [0])[0])) : [];
        const cms = tt ? ((S.tkCms || {})[ti] || CMS.slice(0, tt.cm || 0)) : [];
        const setChk = arr => app.setState(s => { const tasks = (s.tasks || defTasks).map(x => ({ ...x })); tasks[ti].sub = [arr.filter(Boolean).length, arr.length]; return { tasks, tkChk: { ...(s.tkChk || {}), [ti]: arr } }; });
        const td = { tdO: tt ? 1 : 0, tdPe: tt ? 'auto' : 'none', tdX: tt ? '0' : '100%', tdVis: tt ? 'visible' : 'hidden', tdClose: () => app.setState({ tkOpen: null }),
          tdClient: tt ? (tt.client || 'No client') : '', tdTitle: tt ? tt.title : '', tdDesc: clSplit(tt ? (tt.desc || 'No description.') : ''),
          tdStatus: tt ? tt.status : 'todo', tdStatuses: TCOLS.map(([k, label]) => ({ k, label })), tdSetStatus: e => moveTask(ti, e.target.value),
          tdDue: tt ? (tt.due || 'No due date') : '', tdDueC: tt && tt.status !== 'done' && ['Oct 11', 'Oct 12'].includes(tt.due) ? '#a3330c' : '#0b1626',
          tdWho: tt ? (Array.isArray(tt.who) ? tt.who : [tt.who]).map(w => ({ i: w, name: (PEOPLE[w] || [w])[0], bg: (PEOPLE[w] || [w, '#e6ebf2'])[1] })) : [],
          tdChk: names.map((label, j) => ({ label, on: !!chk[j], bg: chk[j] ? '#1f6be2' : '#ffffff', bd: chk[j] ? '#1f6be2' : '#97a2b2', o: chk[j] ? 1 : 0, c: chk[j] ? '#5a6474' : '#0b1626', deco: chk[j] ? 'line-through' : 'none', toggle: () => setChk(names.map((_, k) => k === j ? !chk[k] : !!chk[k])) })),
          tdChkNone: names.length === 0, tdChkTxt: names.length ? chk.filter(Boolean).length + '/' + names.length : '', tdChkPct: (names.length ? Math.round(chk.filter(Boolean).length / names.length * 100) : 0) + '%',
          tdCms: cms.map(([w, when, text]) => ({ i: w, name: (PEOPLE[w] || [w])[0], bg: (PEOPLE[w] || [w, '#e6ebf2'])[1], when, text })), tdCmNone: cms.length === 0,
          tdCmVal: S.tkCmVal || '', tdSetCm: e => app.setState({ tkCmVal: e.target.value }),
          tdAddCm: e => { e.preventDefault(); const t2 = (S.tkCmVal || '').trim(); if (!t2) return; const next = [...cms, ['AR', 'Just now', t2]]; app.setState(s => { const tasks = (s.tasks || defTasks).map(x => ({ ...x })); tasks[ti].cm = next.length; return { tasks, tkCmVal: '', tkCms: { ...(s.tkCms || {}), [ti]: next } }; }); } };
        return { ...td, tasksEmpty: list.length === 0, tasks: list, tkIsBoard: board, tkIsList: (S.tkView || 'board') === 'list',
          tkViews: [['board', 'Board'], ['list', 'List'], ['flagged', 'Flags' + (rkCount ? ' (' + rkCount + ')' : '')]].map(([k, label]) => { const on = (S.tkView || 'board') === k; return { label, on: on ? 'true' : 'false', bd: on ? '#0b1626' : 'transparent', c: on ? '#0b1626' : '#5a6474', fw: on ? 700 : 500, pick: () => app.setState({ tkView: k }) }; }),
          tkAddVal: S.tkAddVal || '', tkAddErr: !!S.tkAddErr, tkSetAdd: e => app.setState({ tkAddVal: e.target.value, tkAddErr: false }), tkCancelAdd: () => app.setState({ tkAdd: null, tkAddVal: '', tkAddErr: false }), tkAddKey: e => { if (e.key === 'Escape') app.setState({ tkAdd: null, tkAddVal: '', tkAddErr: false }); },
          tkBoard: TCOLS.map(([k, label]) => { const items = list.filter(t => t.status === k); const over = S.tkOver === k;
            return { label, count: String(items.length), cBg: k === 'done' ? '#d4f0dd' : '#e6ebf2', cC: k === 'done' ? '#1d6b3a' : '#45505f', bg: over ? '#eaf1fc' : 'transparent', ring: over ? 'inset 0 0 0 2px #1f6be2' : 'none',
              adding: S.tkAdd === k, notAdding: S.tkAdd !== k, startAdd: () => app.setState({ tkAdd: k, tkAddVal: '', tkAddErr: false }),
              submitAdd: e => { e.preventDefault(); const tt = (S.tkAddVal || '').trim(); if (!tt) { app.setState({ tkAddErr: true }); return; } app.setState(s => ({ tkAdd: null, tkAddVal: '', tasks: [...(s.tasks || defTasks), { title: tt, desc: '', client: inDash && S.sel != null ? clients[S.sel].name : '', status: k, done: k === 'done', sub: [0, 0], due: '', who: ['AR'], cm: 0 }] })); },
              dragOver: e => { if (app._tkDrag == null) return; e.preventDefault(); if (S.tkOver !== k) app.setState({ tkOver: k }); },
              dragLeave: e => { if (!e.currentTarget.contains(e.relatedTarget) && S.tkOver === k) app.setState({ tkOver: null }); },
              drop: e => { e.preventDefault(); const i = app._tkDrag; app._tkDrag = null; app.setState({ tkOver: null, tkDragI: null }); if (i != null) moveTask(i, k); },
              items: items.map(t => { const [d, n] = t.sub; const done = t.status === 'done'; const soon = !done && ['Oct 11', 'Oct 12'].includes(t.due);
                return { title: t.title, desc: t.desc, hasDesc: !!t.desc, client: t.client, hasClient: !!t.client, deco: 'none',
                  hasSub: n > 0, subLabel: done ? 'Completed' : 'Checklist', subTxt: d + '/' + n, pct: (n ? Math.round(d / n * 100) : 0) + '%', barC: done ? '#1d6b3a' : '#1f6be2',
                  hasDue: !!t.due, due: soon ? 'Due ' + t.due : t.due, dueC: soon ? '#a3330c' : '#45505f', dueW: soon ? 600 : 400,
                  hasCm: t.cm > 0, cm: String(t.cm), cmLabel: t.cm + ' comments',
                  avatars: t.who.map(w => ({ i: w, name: (PEOPLE[w] || [w])[0], bg: (PEOPLE[w] || [w, '#e6ebf2'])[1] })),
                  op: S.tkDragI === t.i ? 0.4 : 1,
                  dragStart: e => { app._tkDrag = t.i; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', t.title); setTimeout(() => app.setState({ tkDragI: t.i, tkMenu: null }), 0); },
                  dragEnd: () => { app._tkDrag = null; app.setState({ tkDragI: null, tkOver: null }); },
                  open: e => { if (e.target.closest('button, [role=menu]')) return; app.setState({ tkOpen: t.i, tkMenu: null, tkCmVal: '' }); }, menuOn: S.tkMenu === t.i, toggleMenu: () => app.setState({ tkMenu: S.tkMenu === t.i ? null : t.i }),
                  moves: TCOLS.filter(c => c[0] !== k).map(([mk, ml]) => ({ label: ml, go: () => moveTask(t.i, mk) })),
                  remove: () => setTasks(arr => arr.splice(t.i, 1)) }; }) }; }) }; })(), newTask: S.newTask, setNewTask: e => app.setState({ newTask: e.target.value }),
  };
}
