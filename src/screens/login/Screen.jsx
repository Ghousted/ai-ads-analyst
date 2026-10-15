'use client';
// Behaviour for LoginScreen, ported from design/Login.dc.html.
import React from 'react';
import View, { css } from './View';
import { signInAction, signUpAction, googleAction, forgotAction, resetAction } from '@/app/actions/auth';

class Logic extends React.Component {
  static defaultProps = {"startMode":"Log in"};

  state = { mode: null, name: '', email: '', password: '', showPw: false, remember: true, touched: false, loading: false, done: false };
  componentDidMount() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) this.sh = setInterval(() => { if (!this.state.paused) this.go(); }, 3200);
  }
  componentWillUnmount() { clearTimeout(this.t); clearInterval(this.sh); clearTimeout(this.lt); }
  go(target) {
    if (this.state.leaving != null) return;
    const top = this.state.top || 0;
    const next = target ?? (top + 1) % 4;
    if (next === top) return;
    this.setState({ leaving: top });
    clearTimeout(this.lt);
    this.lt = setTimeout(() => this.setState({ top: next, leaving: null }), 260);
  }
  renderVals() {
    const top = this.state.top || 0, leaving = this.state.leaving;
    const slots = ['translate(0,0) rotate(-2deg)', 'translate(8%,-7%) rotate(5deg) scale(.95)', 'translate(-8%,-11%) rotate(-7deg) scale(.9)', 'translate(4%,-15%) rotate(9deg) scale(.85)'];
    const names = ['Client report', 'Google Analytics', 'Meta Pixel', 'TikTok Ads'];
    const deck = {};
    [0, 1, 2, 3].forEach(i => {
      const s = (i - top + 4) % 4;
      if (i === leaving) { deck['tf' + i] = 'translate(80%,6%) rotate(14deg)'; deck['z' + i] = 5; }
      else { deck['tf' + i] = slots[s]; deck['z' + i] = 4 - s; }
      deck['lbl' + i] = 'Show ' + names[i];
      deck['pick' + i] = () => this.go(i === top ? undefined : i);
    });
    deck.pause = () => this.setState({ paused: true });
    deck.resume = () => this.setState({ paused: false });
    const mode = this.state.mode ?? (this.props.resetToken ? 'reset' : this.props.startMode === 'Sign up' ? 'signup' : 'login');
    const signup = mode === 'signup', reset = mode === 'reset';
    // Server actions redirect on success. On failure they return { error } and the form shows it.
    const fail = r => { if (r && r.error) this.setState({ loading: false, formErr: r.error }); };
    const { email, password, touched } = this.state;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const emailErr = !email ? 'Enter your email.' : 'That email doesn\u2019t look right.';
    const pwErr = !password ? 'Enter your password.' : 'Use at least 8 characters.';
    const pwOk = password.length >= 8;
    const emailBad = touched && !emailOk, pwBad = touched && !pwOk;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d|[^A-Za-z0-9]/.test(password) && password.length >= 10) score++;
    const sc = ['#e6ebf2', '#fa5f2e', '#e8a33a', '#2f9e5b'][score];
    const spinner = this.state.loading ? React.createElement('span', { key: 'sp', style: { width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', animation: 'clario-spin 700ms linear infinite', display: 'inline-block' } }) : null;
    return {
      ...deck,
      isSignup: signup, isLogin: mode === 'login', showGoogle: !reset, showEmail: !reset,
      formErr: this.state.formErr || '', hasFormErr: !!this.state.formErr,
      done: this.state.done, notDone: !this.state.done,
      doneTitle: 'Your new password is set',
      doneText: 'Log in with it to get back to your clients.',
      title: reset ? 'Choose a new password' : signup ? 'Create your account' : 'Log in to AI Ads Analyst',
      subtitle: reset ? 'Use at least 8 characters.' : signup ? 'Free for your first two clients. No card needed.' : 'Welcome back. Your reports are waiting.',
      googleLabel: signup ? 'Sign up with Google' : 'Continue with Google',
      name: this.state.name, email, password,
      setName: e => this.setState({ name: e.target.value }),
      setEmail: e => this.setState({ email: e.target.value, formErr: null }),
      setPassword: e => this.setState({ password: e.target.value, formErr: null }),
      emailBad: emailBad && !reset, pwBad, emailErr, pwErr,
      emailBorder: emailBad ? '#e0481a' : '#d3dbe6',
      pwBorder: pwBad ? '#e0481a' : '#d3dbe6',
      pwType: this.state.showPw ? 'text' : 'password',
      pwAuto: signup || reset ? 'new-password' : 'current-password',
      pwPlaceholder: signup || reset ? 'At least 8 characters' : 'Your password',
      pwToggleText: this.state.showPw ? 'Hide' : 'Show',
      pwToggleLabel: this.state.showPw ? 'Hide password' : 'Show password',
      togglePw: () => this.setState(s => ({ showPw: !s.showPw })),
      showStrength: (signup || reset) && password.length > 0,
      s0: score >= 1 ? sc : '#e6ebf2', s1: score >= 2 ? sc : '#e6ebf2', s2: score >= 3 ? sc : '#e6ebf2',
      strengthLabel: ['Too short', 'Okay', 'Good', 'Strong'][score],
      remember: this.state.remember,
      toggleRemember: () => this.setState(s => ({ remember: !s.remember })),
      loading: this.state.loading,
      btnOpacity: this.state.loading ? 0.8 : 1,
      spinner,
      submitLabel: this.state.loading ? (reset ? 'Saving\u2026' : signup ? 'Creating account\u2026' : 'Logging in\u2026') : (reset ? 'Save new password' : signup ? 'Create account' : 'Log in'),
      submit: e => {
        e.preventDefault();
        if ((!emailOk && !reset) || !pwOk) { this.setState({ touched: true }); return; }
        this.setState({ loading: true, formErr: null });
        if (reset) return resetAction({ token: this.props.resetToken, password }).then(r => { if (r && r.error) fail(r); else this.setState({ loading: false, done: true }); }, () => fail({ error: 'Something went wrong. Try again.' }));
        const act = signup ? signUpAction({ name: this.state.name, email, password }) : signInAction({ email, password });
        act.then(fail, e => { if (!String(e && e.digest).startsWith('NEXT_REDIRECT')) fail({ error: 'Something went wrong. Try again.' }); });
      },
      google: () => { this.setState({ loading: true, formErr: null }); googleAction(signup).then(r => { if (r.url) window.location.href = r.url; else fail(r); }, () => fail({ error: 'Something went wrong. Try again.' })); },
      forgot: e => { e.preventDefault(); if (!emailOk) { this.setState({ touched: true, forgotNote: null }); return; } forgotAction(email).then(() => this.setState({ touched: false, forgotNote: 'If there is an account for ' + email.trim() + ', we emailed it a reset link.' })); },
      forgotNote: this.state.forgotNote,
      switchText: reset ? 'Remembered it?' : signup ? 'Already have an account?' : 'New to AI Ads Analyst?',
      switchLink: reset || signup ? 'Log in' : 'Start free',
      switchMode: e => { e.preventDefault(); this.setState({ mode: reset || signup ? 'login' : 'signup', touched: false, password: '', formErr: null }); }
    };
  }
}

export default function LoginScreen(props) {
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
