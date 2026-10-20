'use client';
// Behaviour for SetupScreen, ported from design/Setup.dc.html.
import React from 'react';
import View, { css } from './View';
import { createAgencyAction } from '@/app/actions/agency';
import { connectMetaAction } from '@/app/actions/integrations';
import { googleAction } from '@/app/actions/auth';

const CONNECT_STEP = 5;
const GOOGLE_RESULT = { cancelled: 'Google sign-in was cancelled. Nothing changed.', noscope: 'Google didn\u2019t share Analytics access. Connect again and tick the Google Analytics box.', expired: 'That sign-in took too long. Try again.', forbidden: 'Only the owner and admins can connect tools.', unconfigured: 'Google sign-in isn\u2019t set up on this server yet.', apidisabled: 'The Google Analytics Admin API is turned off in the Google Cloud project. Turn it on and connect again.', failed: 'Google didn\u2019t finish connecting. Try again.' };

class Logic extends React.Component {
  static defaultProps = {};

  // resume: back from Google sign-in at the connect step. The agency is already saved, so its answers come from the server.
  state = (() => { const r = this.props.resume; if (!r) return { step: 0, phase: 'in', workspace: '', team: null, platforms: [], conn: {}, found: {}, client: '', freq: null, tone: null };
    const g = r.conns.filter(c => c.provider === 'google'), m = r.conns.filter(c => c.provider === 'meta'), conn = {}, found = {};
    if (g.length) { conn.ga4 = 'done'; found.ga4 = g.reduce((t, c) => t + c.found, 0); }
    if (m.length) { conn.meta = 'done'; found.meta = m.reduce((t, c) => t + c.found, 0); }
    return { step: CONNECT_STEP, phase: 'in', workspace: r.workspace, team: r.team, platforms: ['ga4', 'meta'], conn, found, client: r.client, freq: r.freq, tone: r.tone, saved: true,
      connErr: r.result && r.result !== 'connected' ? { ga4: GOOGLE_RESULT[r.result] || GOOGLE_RESULT.failed } : {} }; })();
  componentDidMount() { try { if (this.props.resume) window.history.replaceState(null, '', '/setup'); } catch (e) {} }
  // The agency is created before anything is connected, because a connection belongs to an agency. Once per setup.
  save() { if (!this._saved) { const S = this.state; this._saved = this.state.saved ? Promise.resolve({ ok: true }) : createAgencyAction({ workspace: S.workspace, team: S.team, freq: S.freq, tone: S.tone, client: (S.client || '').trim() || null }); } return this._saved; }
  componentWillUnmount() { clearTimeout(this.dm1); clearTimeout(this.dm2); clearTimeout(this.dm3); clearTimeout(this.dm4); clearTimeout(this.t1); clearTimeout(this.t2); Object.values(this.ct || {}).forEach(clearTimeout); }
  go(n) {
    if (this.state.phase !== 'in') return;
    this.setState({ phase: 'out', dir: n > this.state.step ? 1 : -1, error: false });
    this.t1 = setTimeout(() => {
      this.setState({ step: n, phase: 'enter' });
      this.t2 = setTimeout(() => this.setState({ phase: 'in' }), 30);
    }, 200);
  }
  renderVals() {
    const S = this.state;
    const P = [
      ['meta', 'Meta', '/assets/logo-meta.png'], ['ga4', 'Google Analytics 4', '/assets/logo-ga4.png'], ['google-ads', 'Google Ads', '/assets/logo-google-ads.png'],
      ['tiktok', 'TikTok Ads', '/assets/logo-tiktok.png'], ['linkedin', 'LinkedIn Ads', '/assets/logo-linkedin.png'], ['gsc', 'Search Console', '/assets/logo-search-console.png'],
      ['microsoft', 'Microsoft Ads', '/assets/logo-microsoft.png'], ['gbp', 'Google Business Profile', '/assets/logo-google-business.png']
    ];
    const keys = ['A', 'B', 'C', 'D'];
    const choice = (field, opts) => opts.map(([label, sub], i) => {
      const on = S[field] === label;
      return { label, sub, hasSub: !!sub, key: keys[i], on, bd: on ? '#1f6be2' : '#e6ebf2', bg: on ? '#f5f9ff' : '#ffffff', kbd: on ? '#1f6be2' : '#d3dbe6', kbg: on ? '#1f6be2' : '#ffffff', kc: on ? '#ffffff' : '#5a6474',
        pick: () => { this.setState({ [field]: label }); clearTimeout(this.auto); this.auto = setTimeout(() => this.go(S.step + 1), 280); } };
    });
    const firstName = (S.workspace || '').trim();
    const cnRaw = (S.client || '').trim();
    const cn = cnRaw || 'this client';
    const cnPoss = cnRaw ? (cnRaw.endsWith('s') ? cnRaw + '\u2019' : cnRaw + '\u2019s') : 'your client\u2019s';
    const Q = [
      { kind: 'text', title: "What's your business called?", help: 'Your clients will see this name on their reports.', placeholder: 'e.g. Rivera Digital', field: 'workspace' },
      { kind: 'choice', title: 'How many people work with you?', help: 'This helps us set up your workspace.', field: 'team', opts: [['Just me', 'Freelancer'], ['2 to 5 people', 'Small team'], ['6 or more', 'Agency']] },
      { kind: 'choice', title: 'How often should reports go out?', help: 'Analyst writes them on schedule so they are ready to review.', field: 'freq', opts: [['Every Monday', 'Most popular'], ['Every two weeks', ''], ['Once a month', '']] },
      { kind: 'choice', title: 'How should reports sound?', help: 'You can change this for each client later.', field: 'tone', opts: [['Friendly', 'Warm and easy to read'], ['Professional', 'Clear and polished'], ['Short and direct', 'Just the key points']] },
      { kind: 'multi', title: 'Which tools does your agency use?', help: 'Pick the ad and analytics tools you manage client accounts in. Meta covers both Facebook and Instagram ads.' },
      { kind: 'connect', title: 'Connect your tools', help: 'Sign in once with your agency login. Analyst finds the client accounts you manage. It only reads your data and never changes your ads.' }
    ];
    const total = Q.length, done = S.step >= total;
    const cur = Q[Math.min(S.step, total - 1)];
    const q = { title: cur.title, help: cur.help, placeholder: cur.placeholder || '', isText: cur.kind === 'text', isChoice: cur.kind === 'choice', isMulti: cur.kind === 'multi', isConnect: cur.kind === 'connect', noneSelected: false, options: [] };
    if (q.isText) { q.value = S[cur.field]; q.onText = e => this.setState({ [cur.field]: e.target.value }); }
    if (q.isChoice) q.options = choice(cur.field, cur.opts);
    if (q.isMulti) q.options = P.map(([id, label, logo]) => {
      const on = S.platforms.includes(id);
      return { label, logo, on, bd: on ? '#1f6be2' : '#e6ebf2', bg: on ? '#f5f9ff' : '#ffffff', kbd: on ? '#1f6be2' : '#d3dbe6', kbg: on ? '#1f6be2' : '#ffffff',
        pick: () => this.setState(s => ({ platforms: on ? s.platforms.filter(x => x !== id) : [...s.platforms, id] })) };
    });
    // Google Analytics and Meta connect for real; the other tools picked show as coming soon.
    if (q.isConnect) {
      const errs = S.connErr || {}, setErr = (id, e) => this.setState(s => ({ connErr: { ...(s.connErr || {}), [id]: e } }));
      const failSave = r => { this.setState(s => ({ conn: {}, tokenOpen: false })); setErr('ga4', null); this.setState({ saveErr: (r && r.error) || 'Your workspace couldn\u2019t be saved. Try again.' }); };
      q.note = S.saveErr || (S.platforms.some(id => id !== 'ga4' && id !== 'meta') ? '' : (Object.values(S.conn).includes('done') ? 'You can connect more later in Settings \u203a Integrations.' : 'You can also connect later in Settings \u203a Integrations. Until then, Analyst shows sample data.'));
      q.noneSelected = !!q.note;
      q.options = P.filter(p => p[0] === 'ga4' || p[0] === 'meta' || S.platforms.includes(p[0])).sort((a, b) => +(b[0] === 'ga4' || b[0] === 'meta') - +(a[0] === 'ga4' || a[0] === 'meta')).map(([id, label, logo]) => {
        const real = id === 'ga4' || id === 'meta', st = S.conn[id] || 'idle', n = (S.found || {})[id] || 0, open = id === 'meta' && S.tokenOpen && st !== 'done';
        return { label, logo, soon: !real, found: n + (id === 'ga4' ? (n === 1 ? ' property found' : ' properties found') : (n === 1 ? ' ad account found' : ' ad accounts found')) + '. Link each one to a client in the app.',
          idle: real && st === 'idle' && !open, loading: st === 'loading', done: st === 'done', err: errs[id] || '', bd: st === 'done' ? '#bfe3cb' : '#e6ebf2', bg: st === 'done' ? '#f3faf5' : real ? '#ffffff' : '#f8fafc',
          connect: () => { if (id === 'meta') { this.setState({ tokenOpen: true }); setErr('meta', null); return; }
            this.setState(s => ({ conn: { ...s.conn, ga4: 'loading' }, saveErr: null })); setErr('ga4', null);
            this.save().then(r => { if (r && r.error) return failSave(r); window.location.href = '/api/integrations/google/start?from=setup'; }, failSave); },
          tokenOpen: open, tokenVal: S.metaToken || '', tokenSet: e => { this.setState({ metaToken: e.target.value }); setErr('meta', null); }, tokenBusy: !!S.tokenBusy, tokenErr: open ? errs.meta || '' : '',
          tokenSave: e => { e.preventDefault(); const t = (S.metaToken || '').trim(); if (S.tokenBusy) return; if (!t) return setErr('meta', 'Paste the system user token.');
            this.setState({ tokenBusy: true, saveErr: null });
            this.save().then(r => { if (r && r.error) { this.setState({ tokenBusy: false }); return failSave(r); }
              return connectMetaAction(t).then(x => { this.setState({ tokenBusy: false }); if (x.error) return setErr('meta', x.error);
                this.setState(s => ({ conn: { ...s.conn, meta: 'done' }, found: { ...(s.found || {}), meta: x.found }, tokenOpen: false, metaToken: '' })); }); },
              () => { this.setState({ tokenBusy: false }); setErr('meta', 'Couldn\u2019t reach the server. Try again.'); }); } };
      });
    }
    const answered = q.isText ? !!(S[cur.field] || '').trim() : q.isChoice ? !!S[cur.field] : q.isMulti ? S.platforms.length > 0 : true;
    const required = S.step === 0;
    const errs = ['Enter your business name to continue.', 'Pick one option to continue, or set this up later.', 'Pick how often reports should go out, or set this up later.', 'Pick a tone, or set this up later.', 'Pick at least one tool, or set this up later.', ''];
    const next = () => { if (!answered) { this.setState({ error: true }); return; } this.go(S.step + 1); };
    const TIP = [null, ['your team size', 'You can invite teammates anytime.', 'Settings', 'Team members'], ['the report schedule', 'Reports will go out every Monday at 8:00am until you change it.', 'Settings', 'Agency and branding'], ['the report tone', 'Reports will use a friendly tone until you change it.', 'Settings', 'Agency and branding'], ['picking your tools', 'Analyst will use sample data until your tools are connected.', 'Settings', 'Integrations'], ['connecting your tools', 'Analyst will use sample data until your tools are connected.', 'Settings', 'Integrations']];
    const skip = () => this.setState({ skipAsk: true });
    const tip = TIP[Math.min(S.step, total - 1)] || TIP[2];
    const stageOf = [0, 0, 1, 1, 2, 2];
    const curStage = done ? 3 : stageOf[S.step];
    const stageNames = ['About you', 'Reports', 'Your tools'];
    const stages = stageNames.map((label, i) => {
      const isDone = i < curStage, isCur = i === curStage;
      return { n: i + 1, label, done: isDone, notDone: !isDone, aria: isCur ? 'step' : undefined, flex: i < 2 ? '1' : 'none', hasLine: i < 2,
        bg: isDone || isCur ? '#1f6be2' : '#eef1f6', c: isDone || isCur ? '#ffffff' : '#5a6474', ring: isCur ? '0 0 0 4px #d6e4f8' : 'none',
        lc: isCur ? '#0b1626' : isDone ? '#45505f' : '#97a2b2', line: isDone ? '#1f6be2' : '#e6ebf2' };
    });
    const showErr = !!S.error && !answered;
    const phaseO = S.phase === 'in' ? 1 : 0;
    const phaseY = S.phase === 'in' ? 0 : S.phase === 'out' ? -16 * (S.dir || 1) : 16 * (S.dir || 1);
    const connectedNames = P.filter(p => S.conn[p[0]] === 'done').map(p => p[1]);
    // Invited, but the email isn't verified yet: signing in with Google proves it and joins that agency.
    const inv = this.props.invite;
    return {
      inviteOn: !!inv && S.step === 0 && !done, inviteText: inv ? inv.agency + ' invited ' + inv.email + ' to their team.' : '', inviteBusy: !!S.inviteBusy, inviteErr: S.inviteErr || '',
      inviteJoin: () => { this.setState({ inviteBusy: true, inviteErr: null }); googleAction().then(r => { if (r.url) window.location.href = r.url; else this.setState({ inviteBusy: false, inviteErr: r.error }); }, () => this.setState({ inviteBusy: false, inviteErr: 'Something went wrong. Try again.' })); },
      q, inQuestions: !done, isDone: done,
      counter: `${Math.min(S.step + 1, total)} of ${total}`,
      progress: (done ? 100 : (S.step / total) * 100) + '%',
      qO: phaseO, qY: phaseY,
      next, skip, stages,
      skipOpen: !!S.skipAsk, skipWhat: tip[0], skipNote: tip[1], skipPath: tip.slice(2).map((t, i) => ({ t, sep: i > 0 })),
      skipCancel: () => this.setState({ skipAsk: false }), skipConfirm: () => { this.setState({ skipAsk: false }); this.go(S.step + 1); },
      skipBackdrop: e => { if (e.target === e.currentTarget) this.setState({ skipAsk: false }); },
      stageLabel: `Step ${curStage + 1} of 3 · ${stageNames[Math.min(curStage, 2)]}`,
      canSkip: !required,
      hasError: showErr,
      errorText: errs[Math.min(S.step, total - 1)],
      inputBd: showErr ? '#e0481a' : '#d3dbe6',
      nextLabel: S.step === total - 1 ? 'Finish' : 'Next',
      nextO: 1,
      onEnter: e => { if (e.key === 'Enter') { e.preventDefault(); next(); } },
      // Once the agency is saved for connecting, earlier answers can't change here (they can in Settings).
      canBack: S.step > 0 && !done && !(S.step === CONNECT_STEP && (S.saved || this._saved)),
      back: () => this.go(S.step - 1),
      restart: () => this.go(0),
      dashLoading: !!S.dash,
      dashZoom: S.dashOut ? 40 : 1,
      dashZoomO: S.dashOut ? 0 : 1,
      dashTextO: S.dashOut ? 0 : 1,
      dashMsg: ['Creating your workspace\u2026', connectedNames.length ? 'Importing your client accounts\u2026' : 'Getting things ready\u2026', 'Preparing your first report\u2026'][S.dashMsg || 0],
      dashMsgKey: String(S.dashMsg || 0),
      goDash: () => {
        this.setState({ dash: true, dashMsg: 0 });
        // Save the agency while the transition plays; only leave once it is stored.
        const saved = this.save();
        this.dm1 = setTimeout(() => this.setState({ dashMsg: 1 }), 800);
        this.dm2 = setTimeout(() => this.setState({ dashMsg: 2 }), 1600);
        this.dm3 = setTimeout(() => this.setState({ dashOut: true }), 2450);
        this.dm4 = setTimeout(() => saved.then(r => { if (r && r.error) { clearTimeout(this.dm3); this.setState({ dash: false, dashOut: false, step: 0, error: true }); return; } try { sessionStorage.setItem('clario-fade-in', '1'); } catch (e) {} window.location.href = '/app'; }, () => this.setState({ dash: false, dashOut: false })), 3300);
      },
      doneHasClient: !!cnRaw,
      doneLogos: P.filter(p => S.conn[p[0]] === 'done').map(p => p[2]).concat(Object.values(S.conn).includes('done') ? [] : []),
      pullText: connectedNames.length ? `${connectedNames.join(' and ')} ${connectedNames.length === 1 ? 'is' : 'are'} connected. Link each account to a client in the app, and the last 90 days import in the background.` : 'Using sample data until your accounts are connected.',
      reportText: `Ready for you to review ${({ 'Every Monday': 'on Monday', 'Every two weeks': 'in two weeks', 'Once a month': 'at the start of next month' })[S.freq || 'Every Monday']} at 8:00am, written in a ${(S.tone || 'Friendly').toLowerCase()} tone.`,
      riskText: `We'll email you if ${cnRaw} shows signs of leaving, with the reasons and a suggested message.`,
      addLabel: cnRaw ? 'Add another client' : 'Add a client',
      addAnother: () => this.setState({ client: '', platforms: [], conn: {} }, () => this.go(4)),
      doneName: firstName ? `, ${firstName}` : '',
      doneText: cnRaw ? `Here's what Analyst is doing for ${cnRaw} now. You don't need to do anything else.` : 'Add your first client and Analyst will start writing their reports.',
      summary: [
        { k: 'Business', v: firstName || 'Not set' },
        { k: 'First client', v: (S.client || '').trim() || 'Not added yet' },
        { k: 'Their accounts', v: connectedNames.length ? connectedNames.join(', ') : 'Sample data for now' },
        { k: 'Reports', v: [S.freq || 'Every Monday', (S.tone || 'Friendly').toLowerCase()].join(', ') }
      ]
    };
  }
}

export default function SetupScreen(props) {
  return <Logic {...props} />;
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <View v={v} />
    </>
  );
};
