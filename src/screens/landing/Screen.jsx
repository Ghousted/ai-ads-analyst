'use client';
// Behaviour for LandingScreen, ported from design/Landing Page.dc.html.
import React from 'react';
import View, { css } from './View';

class Logic extends React.Component {
  static defaultProps = {"startCard":"Client report","autoShuffle":true,"shuffleMs":3200,"scrollAnimations":true,"showPreloader":true};

  state = { top: null, leaving: null, paused: false, view: 'client', draft: null, sync: 18 };
  componentDidMount() {
    const reducePre = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const preOn = this.props.showPreloader !== false;
    const holdMs = !preOn ? 0 : reducePre ? 300 : 1400;
    if (!preOn) this.setState({ pre: 'done' });
    else {
      this.pt1 = setTimeout(() => this.setState({ pre: 'out' }), holdMs);
      this.pt2 = setTimeout(() => this.setState({ pre: 'done' }), holdMs + 1000);
    }
    setTimeout(() => this.setupReveal(), preOn ? holdMs + 150 : 50);
    this.onHow = () => {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const sticky = this.props.stickyHow !== false && !reduce && window.innerWidth >= 960 && window.innerHeight >= 640;
      let step = this.state.howStep || 0;
      const sec = document.getElementById('how');
      if (sticky && sec) {
        const r = sec.getBoundingClientRect();
        const total = sec.offsetHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
        step = Math.min(2, Math.floor(p * 3));
      }
      if (sticky !== this.state.howSticky || step !== this.state.howStep) this.setState({ howSticky: sticky, howStep: step });
    };
    window.addEventListener('scroll', this.onHow, { passive: true });
    window.addEventListener('resize', this.onHow);
    this.onHow();
    this.t = setInterval(() => this.setState(s => ({ sync: s.sync >= 92 ? 18 : s.sync + 6 })), 900);
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && (this.props.autoShuffle ?? true)) this.sh = setInterval(() => { if (!this.state.paused) this.go(); }, this.props.shuffleMs ?? 3200);
  }
  setupReveal() {
    if (this.props.scrollAnimations === false) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    const main = document.querySelector('main');
    if (!main) return;
    const ease = 'cubic-bezier(0.23,1,0.32,1)';
    const prep = (el, i, dist) => {
      el.style.opacity = '0';
      el.style.transform = `translateY(${dist}px)`;
      el.style.transition = `opacity 700ms ${ease} ${i * 90}ms, transform 800ms ${ease} ${i * 90}ms`;
      el.style.willChange = 'opacity, transform';
    };
    const show = el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      setTimeout(() => { el.style.transition = ''; el.style.willChange = ''; el.style.transform = ''; }, 1400);
    };
    const sections = Array.from(main.children).filter(n => n.tagName === 'SECTION');
    const hero = sections[0];
    if (hero && hero.firstElementChild) {
      Array.from(hero.firstElementChild.children).forEach((el, i) => { prep(el, i, 20); requestAnimationFrame(() => requestAnimationFrame(() => show(el))); });
      if (hero.children[1]) { prep(hero.children[1], 3, 32); requestAnimationFrame(() => requestAnimationFrame(() => show(hero.children[1]))); }
    }
    const targets = [];
    const collect = (container) => {
      Array.from(container.children).forEach(child => {
        const cs = getComputedStyle(child);
        const kids = Array.from(child.children);
        if (cs.display === 'grid' && kids.length >= 2 && kids.every(k => k.tagName === 'DIV')) {
          kids.forEach((k, i) => targets.push([k, i]));
        } else targets.push([child, 0]);
      });
    };
    sections.slice(1).forEach(sec => {
      const only = sec.children.length === 1 && sec.firstElementChild.tagName === 'DIV' ? sec.firstElementChild : sec;
      if (sec.id !== 'how') collect(only);
    });
    this.io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { show(en.target); this.io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(([el, i]) => { prep(el, i, 28); this.io.observe(el); });
  }
  componentWillUnmount() { clearTimeout(this.pt1); clearTimeout(this.pt2); window.removeEventListener('scroll', this.onHow); window.removeEventListener('resize', this.onHow); clearInterval(this.t); clearInterval(this.sh); clearTimeout(this.lt); if (this.io) this.io.disconnect(); }
  curTop() {
    const names = ['Client report', 'Google Analytics', 'Meta Pixel', 'TikTok Ads'];
    return this.state.top ?? Math.max(0, names.indexOf(this.props.startCard ?? 'Client report'));
  }
  go(target) {
    if (this.state.leaving !== null) return;
    const top = this.curTop();
    const next = target ?? (top + 1) % 4;
    if (next === top) return;
    this.setState({ leaving: top });
    clearTimeout(this.lt);
    this.lt = setTimeout(() => this.setState({ top: next, leaving: null }), 260);
  }
  renderVals() {
    const names = ['Client report', 'Google Analytics', 'Meta Pixel', 'TikTok Ads'];
    const top = this.curTop();
    const leaving = this.state.leaving;
    const slots = ['translate(0,0) rotate(-2deg)', 'translate(9%,-7%) rotate(5deg) scale(.95)', 'translate(-9%,-11%) rotate(-8deg) scale(.9)', 'translate(4%,-16%) rotate(10deg) scale(.85)'];
    const v = {};
    [0, 1, 2, 3].forEach(i => {
      const s = (i - top + 4) % 4;
      if (i === leaving) { v['tf' + i] = 'translate(85%,6%) rotate(14deg)'; v['z' + i] = 5; }
      else { v['tf' + i] = slots[s]; v['z' + i] = 4 - s; }
      v['d' + i] = s === 0 ? '#0b1626' : 'rgba(90,100,116,.4)';
      v['lbl' + i] = 'Show ' + names[i];
      v['pick' + i] = () => this.go(i === top ? undefined : i);
    });
    const n = this.state.nClients ?? 6;
    const pi = n <= 2 ? 0 : n <= 5 ? 1 : n <= 20 ? 2 : 3;
    const plans = [['Free', '$0', 'Weekly reports and risk alerts.'], ['Solo', '$19', 'Adds your logo and a daily risk email.'], ['Studio', '$49', 'Adds drafted check-ins and tone settings per client.'], ['Agency', '$99', 'Unlimited clients and teammates.']];
    v.nClients = n;
    v.clientsLabel = n >= 40 ? '40+ clients' : n === 1 ? '1 client' : n + ' clients';
    v.planName = plans[pi][0]; v.planPrice = plans[pi][1]; v.planNote = plans[pi][2];
    [0, 1, 2, 3].forEach(i => { v['tb' + i] = i === pi ? '#1f6be2' : '#b8c4d4'; });
    v.setClients = e => this.setState({ nClients: +e.target.value });
    ['F', 'I', 'S', 'R'].forEach(k => {
      const on = this.state.menu === k;
      v['m' + k + 'o'] = on ? 1 : 0; v['m' + k + 'y'] = on ? 0 : -6;
      v['m' + k + 'pe'] = on ? 'auto' : 'none'; v['m' + k + 'v'] = on ? 'visible' : 'hidden';
      v['m' + k + 'r'] = on ? 'rotate(180deg)' : 'rotate(0deg)'; v['m' + k + 'x'] = on;
      v['open' + k] = () => this.setState({ menu: k });
      v['toggle' + k] = () => this.setState(s => ({ menu: s.menu === k ? null : k }));
    });
    v.closeMenu = () => this.setState({ menu: null });
    const pre = this.state.pre || 'in';
    v.preVisible = pre !== 'done';
    v.preO = pre === 'in' ? 1 : 0;
    v.preS = pre === 'in' ? 1 : 45;
    v.preInO = pre === 'in' ? 1 : 0;
    v.prePe = pre === 'in' ? 'auto' : 'none';
    const st = !!this.state.howSticky, hs = this.state.howStep || 0;
    v.howH = st ? '330vh' : 'auto';
    v.stPos = st ? 'sticky' : 'relative';
    v.stH = st ? 'calc(100vh - 72px)' : 'auto';
    v.stPad = st ? '0 24px 72px' : '100px 24px';
    v.stGap = st ? '0' : '100px';
    v.stIndD = st ? 'flex' : 'none';
    [0, 1, 2].forEach(k => {
      const on = !st || k === hs;
      v['rA' + k] = st ? '1 / 1' : 'auto';
      v['rO' + k] = on ? 1 : 0;
      v['rT' + k] = on ? 'none' : (k < hs ? 'translateY(-48px) scale(.97)' : 'translateY(48px) scale(.97)');
      v['rPe' + k] = on ? 'auto' : 'none';
      v['ip' + k + 'bg'] = k === hs ? '#0b1626' : 'transparent';
      v['ip' + k + 'c'] = k === hs ? '#ffffff' : '#5a6474';
    });
    v.pause = () => this.setState({ paused: true });
    v.resume = () => this.setState({ paused: false });
    const draft = this.state.draft ?? (this.props.draftOpen ?? false);
    const c = this.state.view === 'client';
    const bg = { 'At risk': '#fa5f2e', 'Needs attention': '#fffd92', 'Healthy': '#e6ebf2' };
    const row = (name, status, leads, delta, last) => ({ name, status, bg: bg[status], leads, delta, last });
    return {
      ...v,
      vClient: c, vYou: !c,
      vcBg: c ? '#0b1626' : '#ffffff', vcC: c ? '#ffffff' : '#0b1626',
      vyBg: c ? '#ffffff' : '#0b1626', vyC: c ? '#0b1626' : '#ffffff',
      vcO: c ? 1 : 0, vcY: c ? 0 : 6, vyO: c ? 0 : 1, vyY: c ? 6 : 0,
      showClient: () => this.setState({ view: 'client' }),
      showYou: () => this.setState({ view: 'you' }),
      syncPct: this.state.sync, syncW: this.state.sync + '%',
      draftOpen: draft,
      draftLabel: draft ? 'Hide draft' : 'Show drafted check-in',
      draftRows: draft ? '1fr' : '0fr',
      draftO: draft ? 1 : 0,
      toggleDraft: () => this.setState({ draft: !draft }),
      clients: [
        row('Northside Physio', 'At risk', '44', '−6%', 'Sep 26, not opened'),
        row('Kalye Streetwear', 'Needs attention', '188', '−7%', 'Oct 6, opened'),
        row('Harbor & Pine Dental', 'Healthy', '142', '−3%', 'Oct 6, opened'),
        row('Mara Skincare', 'Healthy', '119', '+14%', 'Oct 6, opened'),
        row('Coastline Realty', 'Healthy', '40', '+8%', 'Oct 5, opened')
      ]
    };
  }
}

export default function LandingScreen(props) {
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
