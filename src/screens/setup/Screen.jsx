'use client';
// Behaviour for SetupScreen, ported from design/Setup.dc.html.
import React from 'react';
import View, { css } from './View';

class Logic extends React.Component {
  static defaultProps = {};

  state = { step: 0, phase: 'in', workspace: '', team: null, platforms: [], conn: {}, client: '', freq: null, tone: null };
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
      { kind: 'multi', title: 'Which tools does your agency use?', help: 'Pick the ad and analytics tools you manage client accounts in. Meta covers both Facebook and Instagram ads.' },
      { kind: 'connect', title: 'Connect your agency accounts', help: 'Sign in once with your agency login. Clario finds every client account you manage. It only reads your data and never changes your ads.' },
      { kind: 'choice', title: 'How often should reports go out?', help: 'Clario writes them on schedule so they are ready to review.', field: 'freq', opts: [['Every Monday', 'Most popular'], ['Every two weeks', ''], ['Once a month', '']] },
      { kind: 'choice', title: 'How should reports sound?', help: 'You can change this for each client later.', field: 'tone', opts: [['Friendly', 'Warm and easy to read'], ['Professional', 'Clear and polished'], ['Short and direct', 'Just the key points']] }
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
    if (q.isConnect) {
      q.noneSelected = S.platforms.length === 0;
      q.options = P.filter(p => S.platforms.includes(p[0])).map(([id, label, logo]) => {
        const st = S.conn[id] || 'idle';
        const nAcc = { meta: 5, ga4: 4, 'google-ads': 3, tiktok: 1, linkedin: 2, gsc: 4, microsoft: 1, gbp: 4 }[id] || 2; return { label, logo, found: nAcc + (nAcc === 1 ? ' client account found' : ' client accounts found'), idle: st === 'idle', loading: st === 'loading', done: st === 'done', bd: st === 'done' ? '#bfe3cb' : '#e6ebf2', bg: st === 'done' ? '#f3faf5' : '#ffffff',
          connect: () => { this.setState(s => ({ conn: { ...s.conn, [id]: 'loading' } })); this.ct = this.ct || {}; this.ct[id] = setTimeout(() => this.setState(s => ({ conn: { ...s.conn, [id]: 'done' } })), 1200); } };
      });
    }
    const answered = q.isText ? !!(S[cur.field] || '').trim() : q.isChoice ? !!S[cur.field] : q.isMulti ? S.platforms.length > 0 : q.isConnect ? Object.values(S.conn).includes('done') : true;
    const required = S.step === 0;
    const errs = ['Enter your business name to continue.', 'Pick one option to continue, or set this up later.', 'Pick at least one tool, or set this up later.', 'Connect at least one account, or set this up later.', 'Pick how often reports should go out, or set this up later.', 'Pick a tone, or set this up later.'];
    const next = () => { if (!answered) { this.setState({ error: true }); return; } this.go(S.step + 1); };
    const TIP = [null, ['your team size', 'You can invite teammates anytime.', 'Settings', 'Team members'], ['picking your tools', 'Clario will use sample data until your tools are connected.', 'Settings', 'Integrations'], ['connecting your tools', 'Clario will use sample data until your tools are connected.', 'Settings', 'Integrations'], ['the report schedule', 'Reports will go out every Monday at 8:00am until you change it.', 'Settings', 'Agency and branding'], ['the report tone', 'Reports will use a friendly tone until you change it.', 'Settings', 'Agency and branding']];
    const skip = () => this.setState({ skipAsk: true });
    const tip = TIP[Math.min(S.step, total - 1)] || TIP[2];
    const stageOf = [0, 0, 1, 1, 2, 2];
    const curStage = done ? 3 : stageOf[S.step];
    const stageNames = ['About you', 'Your tools', 'Reports'];
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
    return {
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
      canBack: S.step > 0 && !done,
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
        this.dm1 = setTimeout(() => this.setState({ dashMsg: 1 }), 800);
        this.dm2 = setTimeout(() => this.setState({ dashMsg: 2 }), 1600);
        this.dm3 = setTimeout(() => this.setState({ dashOut: true }), 2450);
        this.dm4 = setTimeout(() => { try { sessionStorage.setItem('clario-fade-in', '1'); } catch (e) {} window.location.href = '/app'; }, 3300);
      },
      doneHasClient: !!cnRaw,
      doneLogos: P.filter(p => S.conn[p[0]] === 'done').map(p => p[2]).concat(Object.values(S.conn).includes('done') ? [] : []),
      pullText: connectedNames.length ? `Importing the last 90 days from ${connectedNames.join(', ')} in the background. Reports fill in as each account finishes.` : 'Using sample data until their accounts are connected.',
      reportText: `Ready for you to review ${({ 'Every Monday': 'on Monday', 'Every two weeks': 'in two weeks', 'Once a month': 'at the start of next month' })[S.freq || 'Every Monday']} at 8:00am, written in a ${(S.tone || 'Friendly').toLowerCase()} tone.`,
      riskText: `We'll email you if ${cnRaw} shows signs of leaving, with the reasons and a suggested message.`,
      addLabel: cnRaw ? 'Add another client' : 'Add a client',
      addAnother: () => this.setState({ client: '', platforms: [], conn: {} }, () => this.go(2)),
      doneName: firstName ? `, ${firstName}` : '',
      doneText: cnRaw ? `Here's what Clario is doing for ${cnRaw} now. You don't need to do anything else.` : 'Add your first client and Clario will start writing their reports.',
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
