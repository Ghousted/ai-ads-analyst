// Converts a Claude Design .dc.html file into a React view (JSX) + logic module.
// Usage: node scripts/dc-to-react.mjs "design/<Page>.dc.html" <outDir> <ComponentName>
// The screens in src/screens were converted with this once and then edited by hand. To pick up a design
// change, convert into a scratch folder and copy over the parts that changed. Do not overwrite src/screens.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [, , inFile, outDir, name] = process.argv;
const src = fs.readFileSync(inFile, 'utf8');

const ROUTES = { 'Landing Page.dc.html': '/', 'Login.dc.html': '/login', 'Setup.dc.html': '/setup', 'App.dc.html': '/app' };
const fixPaths = s => s
  .replace(/(['"(])assets\//g, '$1/assets/')
  .replace(/'(Landing Page|Login|Setup|App)\.dc\.html'/g, (m, n) => "'" + ROUTES[n + '.dc.html'] + "'");

// ---------- entity decoding ----------
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·', mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', times: '×', copy: '©', rarr: '→', larr: '←', minus: '−', bull: '•' };
const decode = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENT[e.toLowerCase()] ?? m;
});

// ---------- tokenizer ----------
const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'area', 'col', 'embed', 'wbr']);
function parse(html) {
  const root = { tag: '#root', attrs: [], kids: [] };
  const stack = [root];
  let i = 0;
  const top = () => stack[stack.length - 1];
  while (i < html.length) {
    if (html.startsWith('<!--', i)) { const e = html.indexOf('-->', i); i = e < 0 ? html.length : e + 3; continue; }
    if (html[i] === '<' && html[i + 1] === '/') {
      const e = html.indexOf('>', i); const tag = html.slice(i + 2, e).trim();
      // pop to matching
      for (let k = stack.length - 1; k > 0; k--) { if (stack[k].tag === tag) { stack.length = k; break; } }
      i = e + 1; continue;
    }
    if (html[i] === '<' && /[a-zA-Z]/.test(html[i + 1] || '')) {
      let j = i + 1; while (j < html.length && /[^\s/>]/.test(html[j])) j++;
      const tag = html.slice(i + 1, j);
      const attrs = [];
      let selfClose = false;
      while (j < html.length) {
        while (/\s/.test(html[j])) j++;
        if (html[j] === '>') { j++; break; }
        if (html[j] === '/' && html[j + 1] === '>') { selfClose = true; j += 2; break; }
        let k = j; while (k < html.length && /[^\s=>/]/.test(html[k])) k++;
        const an = html.slice(j, k); j = k;
        while (/\s/.test(html[j])) j++;
        let val = null;
        if (html[j] === '=') {
          j++; while (/\s/.test(html[j])) j++;
          const q = html[j];
          if (q === '"' || q === "'") { const e = html.indexOf(q, j + 1); val = html.slice(j + 1, e); j = e + 1; }
          else { let e = j; while (e < html.length && /[^\s>]/.test(html[e])) e++; val = html.slice(j, e); j = e; }
        }
        if (an) attrs.push([an, val == null ? '' : decode(val)]);
      }
      const node = { tag, attrs, kids: [] };
      top().kids.push(node);
      if (!selfClose && !VOID.has(tag.toLowerCase())) {
        if (tag === 'style' || tag === 'script') { const e = html.indexOf('</' + tag, j); node.raw = html.slice(j, e); j = html.indexOf('>', e) + 1; }
        else stack.push(node);
      }
      i = j; continue;
    }
    let e = html.indexOf('<', i + 1); if (e < 0) e = html.length;
    top().kids.push({ text: html.slice(i, e) });
    i = e;
  }
  return root;
}

// ---------- css helpers ----------
function splitDecls(css) {
  const out = []; let depth = 0, q = null, cur = '';
  for (const ch of css) {
    if (q) { if (ch === q) q = null; cur += ch; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '(') depth++; if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map(d => { const i = d.indexOf(':'); return i < 0 ? null : [d.slice(0, i).trim(), d.slice(i + 1).trim()]; }).filter(Boolean);
}
const camel = s => s.startsWith('--') ? s : s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const importantify = css => splitDecls(css).map(([p, v]) => p + ':' + (v.includes('!important') ? v : v + ' !important')).join(';');

// ---------- expression handling ----------
let scope = [];
function expr(p) {
  p = p.trim();
  if (/^(true|false|null|undefined)$/.test(p) || /^-?\d+(\.\d+)?$/.test(p)) return p;
  const segs = p.split('.');
  const head = segs[0];
  if (scope.includes(head) || head === '$index') return [head, ...segs.slice(1)].join('?.');
  return 'v.' + segs.join('?.');
}
const interp = (s, fixFn = x => x) => {
  // returns JS expression string for an attribute value
  const whole = s.match(/^\s*\{\{((?:(?!\}\})[\s\S])+)\}\}\s*$/);
  if (whole) return { dyn: true, js: expr(whole[1]) };
  if (!s.includes('{{')) return { dyn: false, js: JSON.stringify(fixFn(s)) };
  const parts = s.split(/\{\{([\s\S]+?)\}\}/g);
  const js = '`' + parts.map((x, i) => i & 1 ? '${' + expr(x) + ' ?? ""}' : fixFn(x).replace(/[`\\$]/g, c => '\\' + c)).join('') + '`';
  return { dyn: true, js };
};

const pseudo = new Map();
function pseudoClass(kind, css) {
  const k = kind + '|' + css;
  if (!pseudo.has(k)) {
    const cls = 'dc' + crypto.createHash('md5').update(k).digest('hex').slice(0, 7);
    pseudo.set(k, { cls, rule: '.' + cls + ':' + kind + '{' + importantify(fixUrl(css)) + '}' });
  }
  return pseudo.get(k).cls;
}
const fixUrl = s => s.replace(/url\((['"]?)assets\//g, 'url($1/assets/');

const ATTR_MAP = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', crossorigin: 'crossOrigin', readonly: 'readOnly', maxlength: 'maxLength', autocomplete: 'autoComplete', autofocus: 'autoFocus', novalidate: 'noValidate', contenteditable: 'contentEditable', spellcheck: 'spellCheck', inputmode: 'inputMode', 'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', srcset: 'srcSet', colspan: 'colSpan', rowspan: 'rowSpan', enterkeyhint: 'enterKeyHint' };
function attrName(n) {
  if (ATTR_MAP[n]) return ATTR_MAP[n];
  if (n.startsWith('aria-') || n.startsWith('data-')) return n;
  if (n.includes('-')) return camel(n);
  return n;
}

function styleJs(css) {
  const decls = splitDecls(css);
  const parts = decls.map(([p, val]) => {
    const key = camel(p);
    const k = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
    const r = interp(val, fixUrl);
    return k + ': ' + r.js;
  });
  return '{ ' + parts.join(', ') + ' }';
}

function hrefFix(h) {
  if (ROUTES[h]) return ROUTES[h];
  return h;
}

function emitAttrs(node) {
  const out = []; const classes = [];
  for (const [rawN, val] of node.attrs) {
    if (rawN === 'data-comment-anchor' || rawN.startsWith('hint-')) continue;
    if (rawN.startsWith('style-')) { classes.push(pseudoClass(rawN.slice(6), val)); continue; }
    const n = attrName(rawN);
    if (n === 'style') { out.push('style={' + styleJs(val) + '}'); continue; }
    if (n === 'ref') { out.push('ref={' + interp(val).js + '}'); continue; }
    let r = interp(val, n === 'href' ? hrefFix : n === 'src' ? (x => x.replace(/^assets\//, '/assets/')) : x => x);
    if (r.dyn) {
      let js = r.js;
      if (n === 'value') js = '(' + js + ') ?? ""';
      if (n === 'checked') js = '!!(' + js + ')';
      out.push(n + '={' + js + '}');
    } else out.push(n + '={' + r.js + '}');
  }
  if (classes.length) {
    const ci = out.findIndex(a => a.startsWith('className='));
    if (ci >= 0) out[ci] = 'className={' + JSON.stringify(classes.join(' ') + ' ') + ' + ' + out[ci].slice(10).replace(/^\{|\}$/g, '') + '}';
    else out.push('className="' + classes.join(' ') + '"');
  }
  return out.length ? ' ' + out.join(' ') : '';
}

function emitText(t) {
  if (!t.includes('{{')) {
    if (!t.trim()) return t.includes(' ') ? '{" "}' : '';
    return '{' + JSON.stringify(decode(t).replace(/\s+/g, ' ')) + '}';
  }
  const parts = t.split(/\{\{([\s\S]+?)\}\}/g);
  return parts.map((p, i) => {
    if (i & 1) return '{' + expr(p) + '}';
    if (!p) return '';
    if (!p.trim()) return p.includes(' ') ? '{" "}' : '';
    return '{' + JSON.stringify(decode(p).replace(/\s+/g, ' ')) + '}';
  }).join('');
}

let helmet = { title: '', css: '' };
const NO_WS = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'select', 'svg', 'ul', 'ol', 'dl', 'colgroup', 'g']);
let parentTag = '';
function emit(node, ind) {
  const pad = '  '.repeat(ind);
  if ('text' in node) { if (NO_WS.has(parentTag) && !node.text.trim()) return ''; const t = emitText(node.text); return t ? pad + t : ''; }
  const tag = node.tag;
  if (tag === 'helmet') {
    for (const k of node.kids) {
      if (k.tag === 'title') helmet.title = k.kids.map(x => x.text || '').join('');
      if (k.tag === 'style') helmet.css += k.raw;
    }
    return '';
  }
  if (tag === 'sc-if') {
    const v = node.attrs.find(a => a[0] === 'value')[1];
    const kids = emitKids(node, ind + 1);
    return pad + '{(' + interp(v).js + ') ? (<>\n' + kids + '\n' + pad + '</>) : null}';
  }
  if (tag === 'sc-for') {
    const list = node.attrs.find(a => a[0] === 'list')[1];
    const as = (node.attrs.find(a => a[0] === 'as') || [0, 'item'])[1];
    const lj = interp(list).js;
    scope.push(as);
    const kids = emitKids(node, ind + 2);
    scope.pop();
    return pad + '{((' + lj + ') || []).map((' + as + ', $index) => (\n' + pad + '  <React.Fragment key={$index}>\n' + kids + '\n' + pad + '  </React.Fragment>\n' + pad + '))}';
  }
  if (tag === 'style' || tag === 'script') return '';
  const attrs = emitAttrs(node);
  if (tag === 'title' || tag === 'option' || tag === 'textarea') {
    const parts = node.kids.map(k => k.text || '').join('');
    if (parts.includes('{{')) { const r = interp(parts.replace(/\s+/g, ' ').trim()); return pad + '<' + tag + attrs + '>{' + r.js + '}</' + tag + '>'; }
  }
  if (VOID.has(tag.toLowerCase())) return pad + '<' + tag + attrs + ' />';
  const ce = node.attrs.some(a => a[0] === 'contentEditable');
  const kids = emitKids(node, ind + 1);
  if (!kids.trim()) return pad + '<' + tag + attrs + (ce ? ' suppressContentEditableWarning' : '') + '></' + tag + '>';
  return pad + '<' + tag + attrs + (ce ? ' suppressContentEditableWarning' : '') + '>\n' + kids + '\n' + pad + '</' + tag + '>';
}
function emitKids(node, ind) {
  const saved = parentTag;
  if (!node.tag.startsWith('sc-')) parentTag = node.tag;
  const out = node.kids.map(k => emit(k, ind)).filter(Boolean).join('\n');
  parentTag = saved;
  return out;
}

// ---------- main ----------
const open = /<x-dc(?:\s[^>]*)?>/.exec(src);
const close = src.lastIndexOf('</x-dc>');
const tpl = src.slice(open.index + open[0].length, close);
const tree = parse(tpl);
const body = emitKids(tree, 3);

// script + props
const sm = /<script type="text\/x-dc" data-dc-script([^>]*)>([\s\S]*?)<\/script>/.exec(src);
let props = {};
if (sm) {
  const dp = /data-props="([^"]*)"/.exec(sm[1]);
  if (dp) { const o = JSON.parse(decode(dp[1])); for (const k of Object.keys(o)) if (k[0] !== '$') props[k] = o[k].default; }
}
const logic = sm ? fixPaths(sm[2]) : 'class Component extends DCLogic { renderVals() { return {}; } }';

const css = fixUrl(helmet.css.trim()) + '\n' + [...pseudo.values()].map(p => p.rule).join('\n');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'View.jsx'),
`// Converted from design/${path.basename(inFile)} with scripts/dc-to-react.mjs, then edited by hand.
import React from 'react';

export const css = ${JSON.stringify(css)};

export default function View({ v }) {
  return (
    <>
${body}
    </>
  );
}
`);
fs.writeFileSync(path.join(outDir, 'Screen.jsx'),
`'use client';
// Behaviour for ${name}, ported from design/${path.basename(inFile)}.
import React from 'react';
import View, { css } from './View';

${logic.replace(/class Component extends DCLogic \{/, 'class Logic extends React.Component {\n  static defaultProps = ' + JSON.stringify(props) + ';\n').trim()}

export default function ${name}(props) {
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
`);
console.log(name, 'title=', helmet.title, 'pseudo=', pseudo.size, 'props=', JSON.stringify(props));
