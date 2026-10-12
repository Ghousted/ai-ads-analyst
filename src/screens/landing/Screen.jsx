'use client';
// Behaviour for LandingScreen, ported from design/Landing Page.dc.html.
import React from 'react';
import View, { css } from './View';

// Page-by-page scrolling: the sections are stacked in one pinned stage and scrolling switches between them,
// the same way How it works switches its steps. Scroll pages: hero, problem, the three how steps, features,
// small stuff, pricing. WRAP maps each page wrapper in the view (data-page) to the scroll pages it covers.
const PAGES = 8;
const WRAP = [[0, 0], [1, 1], [2, 4], [5, 5], [6, 6], [7, 7]];
const ANCHOR = { how: 2, pricing: 7 };
const wrapOf = page => WRAP.findIndex(([a, b]) => page >= a && page <= b);

class Logic extends React.Component {
  static defaultProps = {"startCard":"Client report","autoShuffle":true,"shuffleMs":3200,"scrollAnimations":true,"pageScroll":true,"showPreloader":true};

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
    this.rvT = setTimeout(() => this.setupReveal(), preOn ? holdMs + 150 : 50);
    this.onHow = () => {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const deck = this.props.pageScroll !== false && !reduce && window.innerWidth >= 960 && window.innerHeight >= 700;
      const sticky = !deck && this.props.stickyHow !== false && !reduce && window.innerWidth >= 960 && window.innerHeight >= 640;
      let step = this.state.howStep || 0, page = this.state.page || 0;
      const sec = document.getElementById('how');
      if (deck) {
        page = this.pageAt();
        step = Math.min(2, Math.max(0, page - 2));
        if (deck !== this.state.deck || page !== this.state.page) return this.setState({ deck, page, howSticky: false, howStep: step });
        return;
      }
      if (sticky && sec) {
        const r = sec.getBoundingClientRect();
        const total = sec.offsetHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
        step = Math.min(2, Math.floor(p * 3));
      }
      if (sticky !== this.state.howSticky || step !== this.state.howStep || this.state.deck) this.setState({ deck: false, howSticky: sticky, howStep: step });
    };
    // Anchor links (#how, #pricing) and keyboard focus scroll to the page that holds their target.
    this.onAnchor = e => {
      const a = e.target.closest && e.target.closest('a[href*="#"]');
      if (!a || !this.state.deck) return;
      const url = new URL(a.href, location.href), id = url.hash.slice(1);
      if (url.pathname !== location.pathname || !(id in ANCHOR)) return;
      e.preventDefault();
      history.pushState(null, '', '#' + id);
      this.scrollToPage(ANCHOR[id], 'smooth');
    };
    this.onFocus = e => {
      if (!this.state.deck) return;
      const w = e.target.closest && e.target.closest('[data-page]');
      if (!w) return;
      const k = +w.dataset.page;
      if (wrapOf(this.state.page) !== k) this.scrollToPage(WRAP[k][0]);
    };
    document.addEventListener('click', this.onAnchor);
    document.addEventListener('focusin', this.onFocus);
    window.addEventListener('resize', this.onFit = () => requestAnimationFrame(() => this.fitPages()));
    window.addEventListener('scroll', this.onHow, { passive: true });
    window.addEventListener('resize', this.onHow);
    this.onHow();
    const id = location.hash.slice(1);
    if (id in ANCHOR) requestAnimationFrame(() => this.state.deck && this.scrollToPage(ANCHOR[id]));
    this.t = setInterval(() => this.setState(s => ({ sync: s.sync >= 92 ? 18 : s.sync + 6 })), 900);
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && (this.props.autoShuffle ?? true)) this.sh = setInterval(() => { if (!this.state.paused) this.go(); }, this.props.shuffleMs ?? 3200);
  }
  // Scroll progress through the pinned stage, as a page index.
  pageAt() {
    const main = document.querySelector('main');
    if (!main) return 0;
    const total = main.offsetHeight - (window.innerHeight - 72);
    const p = Math.min(1, Math.max(0, (72 - main.getBoundingClientRect().top) / Math.max(1, total)));
    return Math.min(PAGES - 1, Math.floor(p * PAGES));
  }
  scrollToPage(i, behavior = 'auto') {
    const main = document.querySelector('main');
    if (!main) return;
    const total = main.offsetHeight - (window.innerHeight - 72);
    window.scrollTo({ top: main.getBoundingClientRect().top + window.scrollY - 72 + ((i + 0.5) / PAGES) * total, behavior });
  }
  // A page taller than the stage is scaled down to fit instead of being cut off.
  fitPages() {
    document.querySelectorAll('[data-page] > .clario-fit').forEach(f => {
      if (!this.state.deck) { f.style.scale = ''; return; }
      const room = f.parentElement.clientHeight - 16, h = f.offsetHeight;
      f.style.scale = h > room ? String(Math.max(0.6, room / h)) : '';
    });
  }
  componentDidUpdate(_, prev) {
    if (prev.deck !== this.state.deck) {
      this.fitPages();
      if (this.rvGroups) this.revealAll();
    }
    if (this.state.deck && this.rvGroups && wrapOf(prev.page || 0) !== wrapOf(this.state.page || 0)) this.revealWrap(wrapOf(this.state.page || 0));
  }
  // Fades each block up as it scrolls into view: headings, copy, buttons, cards and list items, across every
  // section and the footer. Uses the `translate` and `scale` properties so the design's own inline transforms,
  // transitions and opacity are never overwritten.
  setupReveal() {
    if (this.props.scrollAnimations === false) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    const roots = [...document.querySelectorAll('main .clario-fit > section'), document.querySelector('body footer')].filter(Boolean);
    if (!roots.length) return;
    const ease = 'cubic-bezier(0.23,1,0.32,1)';
    const LEAF = /^(H[1-6]|P|IMG|SVG|BUTTON|A|LI|LABEL|INPUT|FIGURE|BLOCKQUOTE|TABLE|FORM)$/;
    const isCard = (el, cs) => parseFloat(cs.borderTopLeftRadius) >= 12 && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0);
    // Children layered on top of each other (the hero card stack) move as one block.
    const stacked = kids => {
      if (kids.length < 2) return false;
      const [r1, r2] = [kids[0].getBoundingClientRect(), kids[1].getBoundingClientRect()];
      const w = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left), hh = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);
      return w > 0 && hh > 0 && w * hh > 0.5 * Math.min(r1.width * r1.height, r2.width * r2.height);
    };
    const targets = [];
    const walk = el => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.position === 'absolute' || cs.position === 'fixed') return;
      const kids = [...el.children].filter(k => { const p = getComputedStyle(k).position; return p !== 'absolute' && p !== 'fixed'; });
      const h = el.getBoundingClientRect().height;
      const card = isCard(el, cs);
      const leaf = LEAF.test(el.tagName.toUpperCase()) || !kids.length || h <= 200 || (card && h <= 560) || stacked(kids);
      // Sticky blocks and blocks driven by their own opacity keep their behaviour; only their contents reveal.
      if (leaf && !el.style.opacity && cs.position !== 'sticky') return targets.push([el, card]);
      if (!leaf || cs.position === 'sticky') [...el.children].forEach(walk);
    };
    roots.forEach(r => [...r.children].forEach(walk));
    const done = el => {
      const o = el._rv;
      el.style.transition = o.transition; el.style.willChange = o.willChange; el.style.translate = ''; el.style.scale = ''; el.style.opacity = '';
      delete el._rv;
    };
    const show = (el, delay) => {
      el.style.transition = `opacity 650ms ${ease} ${delay}ms, translate 800ms ${ease} ${delay}ms, scale 800ms ${ease} ${delay}ms`;
      el.style.opacity = ''; el.style.translate = '0 0'; el.style.scale = '1';
      setTimeout(() => el._rv && done(el), 900 + delay);
    };
    this.fitPages();
    // Page mode: each page's blocks stagger in the first time the page comes up. The footer still reveals on scroll.
    if (this.state.deck) {
      this.rvGroups = new Map();
      targets.forEach(([el]) => {
        const w = el.closest('[data-page]');
        if (!w) return;
        const k = +w.dataset.page;
        if (!this.rvGroups.has(k)) this.rvGroups.set(k, []);
        this.rvGroups.get(k).push(el);
      });
      const top = el => el.getBoundingClientRect().top;
      this.revealWrap = k => {
        const els = this.rvGroups && this.rvGroups.get(k);
        if (!els) return;
        this.rvGroups.delete(k);
        els.sort((a, b) => top(a) - top(b)).forEach((el, i) => show(el, 120 + Math.min(i, 8) * 70));
      };
      this.revealAll = () => { const g = this.rvGroups; this.rvGroups = null; g.forEach(els => els.forEach(el => show(el, 0))); };
    }
    // Everything that enters together shares one stagger, ordered top to bottom then left to right.
    this.io = new IntersectionObserver(entries => {
      entries.filter(en => en.isIntersecting)
        .sort((x, y) => (x.boundingClientRect.top - y.boundingClientRect.top) || (x.boundingClientRect.left - y.boundingClientRect.left))
        .forEach((en, i) => { this.io.unobserve(en.target); show(en.target, Math.min(i, 8) * 60); });
    }, { threshold: 0.15 });
    targets.forEach(([el, card]) => {
      el._rv = { transition: el.style.transition, willChange: el.style.willChange };
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.translate = card ? '0 32px' : '0 20px';
      if (card) el.style.scale = '0.97';
      el.style.willChange = 'opacity, translate';
    });
    void document.body.offsetHeight; // commit the hidden state before anything can start revealing
    targets.forEach(([el]) => { if (!this.rvGroups || !el.closest('[data-page]')) this.io.observe(el); });
    if (this.rvGroups) this.revealWrap(wrapOf(this.state.page || 0));
  }
  componentWillUnmount() { clearTimeout(this.rvT); clearTimeout(this.pt1); clearTimeout(this.pt2); window.removeEventListener('scroll', this.onHow); window.removeEventListener('resize', this.onHow); clearInterval(this.t); clearInterval(this.sh); clearTimeout(this.lt); if (this.io) this.io.disconnect(); document.removeEventListener('click', this.onAnchor); document.removeEventListener('focusin', this.onFocus); window.removeEventListener('resize', this.onFit); }
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
    const deck = !!this.state.deck, page = this.state.page || 0;
    v.deckCls = deck ? 'clario-deck' : undefined;
    v.deckH = deck ? PAGES * 90 + 'vh' : 'auto';
    v.dkPos = deck ? 'sticky' : 'static';
    v.dkH = deck ? 'calc(100vh - 72px)' : 'auto';
    v.dkD = deck ? 'grid' : 'block';
    v.dkO = deck ? 'hidden' : 'visible';
    v.dA = deck ? '1 / 1' : 'auto';
    v.dD = deck ? 'flex' : 'block';
    v.dH = deck ? '100%' : 'auto';
    v.dTr = deck ? 'opacity 500ms cubic-bezier(0.23,1,0.32,1),transform 650ms cubic-bezier(0.23,1,0.32,1)' : 'none';
    WRAP.forEach(([a, b], k) => {
      const on = !deck || (page >= a && page <= b);
      v['pgBg' + k] = deck ? '#ffffff' : undefined;
      v['pgO' + k] = on ? 1 : 0;
      v['pgT' + k] = on ? 'none' : (page > b ? 'translateY(-48px) scale(.97)' : 'translateY(48px) scale(.97)');
      v['pgPe' + k] = on ? 'auto' : 'none';
    });
    // In page mode How it works keeps its stacked steps, driven by the page index instead of its own scroll.
    const st = deck || !!this.state.howSticky, hs = this.state.howStep || 0;
    v.howH = deck ? 'auto' : st ? '330vh' : 'auto';
    v.stPos = deck ? 'static' : st ? 'sticky' : 'relative'; // static ignores the sticky top offset
    v.stH = deck ? 'auto' : st ? 'calc(100vh - 72px)' : 'auto';
    v.stPad = deck ? '0 24px' : st ? '0 24px 72px' : '100px 24px';
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
