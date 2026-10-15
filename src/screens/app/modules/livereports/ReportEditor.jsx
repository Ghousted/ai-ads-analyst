'use client';
// The report editor: a free-form Tiptap document with charts and tables embedded as objects, a Word-style ribbon,
// a right-click menu, and Ask Analyst on any piece of text.
import React, { useRef, useState } from 'react';
import { useEditor, EditorContent, useEditorState, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import * as DV from './dataviews';

const GAP = 12;
const WIDTHS = [[1 / 3, 'One third'], [1 / 2, 'Half'], [2 / 3, 'Two thirds'], [1, 'Full width']];
const caption = { fontSize: "15px", fontWeight: "700", lineHeight: "1.3" };

// Charts and tables sit in the text as objects. Width is a share of the page, so two halves sit side by side.
export const DataBlock = Node.create({
  name: 'dataBlock', group: 'block', atom: true, draggable: true, selectable: true,
  addOptions() { return { facts: null, color: '#1f6be2' }; },
  addAttributes() {
    return { kind: { default: 'kpis' }, w: { default: 1 }, h: { default: 180 }, metric: { default: 'sessions' }, dim: { default: 'channel' }, style: { default: 'donut' }, source: { default: 'channels' } };
  },
  parseHTML() { return [{ tag: 'div[data-report-block]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-report-block': '' })]; },
  addNodeView() {
    return ReactNodeViewRenderer(DataView, { attrs: ({ node }) => { const w = Number(node.attrs.w) || 1;
      return { style: `display:inline-block;vertical-align:top;width:calc(${w * 100}% - ${w < 1 ? GAP : 0}px);margin:0 ${w < 1 ? GAP / 2 : 0}px 22px;` }; } });
  },
});

function startResize(e, node, editor, updateAttributes) {
  e.preventDefault(); e.stopPropagation();
  const row = editor.view.dom.clientWidth, el = e.currentTarget.closest('[data-node-view-wrapper]'), w0 = el.getBoundingClientRect().width, x0 = e.clientX, y0 = e.clientY, h0 = Number(node.attrs.h) || 180;
  const hasH = node.attrs.kind === 'chart' || node.attrs.kind === 'breakdown';
  const move = ev => {
    const frac = (w0 + ev.clientX - x0 + GAP) / row;
    const w = WIDTHS.reduce((a, [x]) => (Math.abs(x - frac) < Math.abs(a - frac) ? x : a), 1);
    updateAttributes(hasH ? { w, h: Math.max(100, Math.min(560, Math.round(h0 + ev.clientY - y0))) } : { w });
  };
  const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); document.body.style.cursor = ''; };
  document.body.style.cursor = 'nwse-resize';
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
}

function DataView({ node, selected, updateAttributes, extension, editor }) {
  const f = extension.options.facts, color = extension.options.color, a = node.attrs;
  if (!f) return <NodeViewWrapper />;
  let body = null;
  if (a.kind === 'kpis') body = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "8px" }}>
      {DV.kpis(f).map(k => (
        <div key={k.label} style={{ background: "#f4f7fb", padding: "12px 14px", display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
          <span style={{ fontSize: "13px", color: "#5a6474" }}>{k.label}</span>
          <span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
          <span style={{ fontSize: "12px", fontWeight: "600", color: k.c }}>{k.note}</span>
        </div>
      ))}
    </div>
  );
  if (a.kind === 'chart') { const c = DV.chart(f, a); body = (
    <figure style={{ margin: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
      <figcaption style={caption}>{c.caption}</figcaption>
      <svg viewBox={c.vb} preserveAspectRatio="none" role="img" aria-label={c.caption + ' this period, with the previous period dashed'} style={{ width: "100%", height: c.H + "px", display: "block" }}>
        <path d={c.area} fill={color + "1f"}></path>
        <path d={c.prevLine} fill="none" stroke="#97a2b2" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke"></path>
        <path d={c.line} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke"></path>
      </svg>
      <span style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "13px", color: "#5a6474" }}><span>{c.from}</span><span>{"Dashed: previous period"}</span><span>{c.to}</span></span>
    </figure>
  ); }
  if (a.kind === 'breakdown') { const b = DV.breakdown(f, a, color); body = (
    <figure style={{ margin: "0", display: "flex", flexDirection: "column", gap: "10px", minHeight: (a.h || 220) + "px" }}>
      <figcaption style={caption}>{b.caption}</figcaption>
      {b.empty ? <span style={{ fontSize: "15px", color: "#5a6474" }}>{"No data for this period."}</span> : b.isDonut ? (
        <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <svg viewBox="0 0 100 100" width={b.size} height={b.size} role="img" aria-label={b.caption} style={{ flex: "none", transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#eef1f6" strokeWidth="16"></circle>
            {b.rows.map(r => <circle key={r.label} cx="50" cy="50" r="40" fill="none" stroke={r.col} strokeWidth="16" strokeDasharray={r.dash} strokeDashoffset={r.off}></circle>)}
          </svg>
          <ul style={{ margin: "0", padding: "0", listStyle: "none", flex: "1 1 140px", fontSize: "15px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {b.rows.map(r => <li key={r.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ flex: "none", width: "10px", height: "10px", background: r.col }}></span><span style={{ flex: "1", minWidth: "0" }}>{r.label}</span><span style={{ color: "#5a6474" }}>{r.pct}</span><strong style={{ fontVariantNumeric: "tabular-nums", minWidth: "40px", textAlign: "right" }}>{r.value}</strong></li>)}
          </ul>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {b.rows.map(r => (
            <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "15px" }}>
              <span style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}><span>{r.label}</span><strong style={{ fontVariantNumeric: "tabular-nums" }}>{r.value}</strong></span>
              <span style={{ display: "block", height: "8px", background: "#eef1f6" }}><span style={{ display: "block", height: "100%", width: r.w, background: color }}></span></span>
            </div>
          ))}
        </div>
      )}
    </figure>
  ); }
  if (a.kind === 'table') { const t = DV.table(f, a); body = (
    <section style={{ display: "flex", flexDirection: "column", gap: "8px", overflowX: "auto" }}>
      <span style={caption}>{t.caption}</span>
      {t.rows.length === 0 ? <span style={{ fontSize: "15px", color: "#5a6474" }}>{"No data for this period."}</span> : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px", fontVariantNumeric: "tabular-nums" }}>
          <thead><tr style={{ color: "#5a6474", fontSize: "13px" }}>{t.cols.map((c, k) => <th key={c} style={{ textAlign: k ? "right" : "left", fontWeight: "600", padding: "6px 0" }}>{c}</th>)}</tr></thead>
          <tbody>{t.rows.map((row, ri) => <tr key={ri} style={{ borderTop: "1px solid #eef1f6" }}>{row.map((cell, k) => <td key={k} style={{ padding: "8px 0", textAlign: k ? "right" : "left", fontWeight: k ? "500" : "600", overflowWrap: "anywhere", color: k === t.changeCol ? DV.tint(cell) : "inherit" }}>{cell}</td>)}</tr>)}</tbody>
        </table>
      )}
    </section>
  ); }
  return (
    <NodeViewWrapper data-drag-handle style={{ position: "relative", outline: selected ? "2px solid #1f6be2" : "none", outlineOffset: "6px", cursor: "default" }}>
      <div contentEditable={false} style={{ userSelect: "none" }}>{body}</div>
      {selected && editor.isEditable ? (
        <span role="slider" aria-label="Resize" aria-valuetext={Math.round((a.w || 1) * 100) + '% wide'} onPointerDown={e => startResize(e, node, editor, updateAttributes)} className="clario-noprint" style={{ position: "absolute", right: "-14px", bottom: "-14px", width: "22px", height: "22px", background: "#1f6be2", cursor: "nwse-resize", touchAction: "none", border: "3px solid #ffffff", boxShadow: "0 2px 6px rgba(11,22,38,.3)" }}></span>
      ) : null}
    </NodeViewWrapper>
  );
}

const ICON = { undo: 'M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3', redo: 'M15 14l5-5-5-5M20 9H9a5 5 0 0 0 0 10h3', bullet: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01', ordered: 'M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1',
  left: 'M4 6h16M4 12h10M4 18h14', center: 'M4 6h16M7 12h10M5 18h14', right: 'M4 6h16M10 12h10M6 18h14', rule: 'M3 12h18', del: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  kpis: 'M4 20V10M10 20V4M16 20v-7M22 20H2', chart: 'M3 17l5-5 4 3 8-8', channels: 'M12 3a9 9 0 1 0 9 9h-9z', devices: 'M7 2h10v20H7zM11 18h2', tchannels: 'M3 5h18v14H3zM3 10h18M9 10v9', tpages: 'M3 5h18v14H3zM3 10h18M3 15h18', tcamps: 'M3 5h18v14H3zM3 10h18M15 10v9' };
const Icon = ({ d }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d}></path></svg>;
const sep = k => <span key={'s' + k} aria-hidden="true" style={{ width: "1px", height: "28px", margin: "0 6px", background: "#e6ebf2" }}></span>;
const small = { height: "40px", padding: "0 30px 0 10px", border: "0", borderRadius: "0", background: "#eef1f6 url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235a6474%22 stroke-width=%222.6%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>') right 10px center no-repeat", appearance: "none", font: "inherit", fontSize: "14px", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" };

// The text block the cursor is in, for Ask Analyst: its position, kind and text.
function currentText(editor) {
  const sel = editor.state.selection;
  if (sel instanceof NodeSelection) return null;
  const { $from } = sel;
  for (let d = $from.depth; d > 0; d--) {
    const n = $from.node(d);
    if (n.isTextblock) {
      const inList = d > 1 && $from.node(d - 1).type.name === 'listItem';
      return { pos: $from.before(d), text: n.textContent, kind: inList ? 'list item' : n.type.name === 'heading' ? (n.attrs.level === 1 ? 'headline' : 'heading') : 'paragraph' };
    }
  }
  return null;
}

const DOC_CSS = `.clario-doc{outline:none;font-size:17px;line-height:1.65;color:#0b1626;min-height:240px}
.clario-doc>*{margin:0 0 14px}
.clario-doc h1{font-size:34px;font-weight:700;letter-spacing:-1px;line-height:1.2;margin:0 0 12px}
.clario-doc h2{font-size:22px;font-weight:700;letter-spacing:-0.5px;line-height:1.3;margin:22px 0 6px}
.clario-doc h3{font-size:18px;font-weight:700;line-height:1.35;margin:18px 0 4px}
.clario-doc ol,.clario-doc ul{padding-left:24px}
.clario-doc li>p{margin:0 0 4px}
.clario-doc hr{border:0;border-top:1px solid #e6ebf2;margin:22px 0}
.clario-doc p.is-editor-empty:first-child::before,.clario-doc .is-empty::before{content:attr(data-placeholder);color:#97a2b2;float:left;height:0;pointer-events:none}
.clario-doc .ProseMirror-selectednode{outline:none}
@media print{.clario-doc .is-empty::before{content:none}}`;

export default function ReportEditor({ docKey, initialDoc, facts, color, onChange, onRewrite, toast, header, footer }) {
  const wrap = useRef(null);
  const [menu, setMenu] = useState(null);
  const [tab, setTab] = useState('home');
  const [ask, setAsk] = useState(null); // { pos, kind, text } while the Ask box is open
  const [askText, setAskText] = useState('');
  const [askBusy, setAskBusy] = useState(false);
  const [askErr, setAskErr] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: false, code: false, codeBlock: false, blockquote: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: ({ node }) => node.type.name === 'heading' ? 'Heading' : 'Write here, or right-click to insert a chart' }),
      DataBlock.configure({ facts, color }),
    ],
    content: initialDoc,
    editorProps: { attributes: { class: 'clario-doc', 'aria-label': 'Report' } },
    onUpdate: ({ editor: e }) => onChange(e.getJSON()),
  }, [docKey]);

  const st = useEditorState({ editor, selector: ({ editor: e }) => {
    if (!e) return null;
    const sel = e.state.selection, data = sel instanceof NodeSelection && sel.node.type.name === 'dataBlock' ? { ...sel.node.attrs } : null;
    return { bold: e.isActive('bold'), italic: e.isActive('italic'), underline: e.isActive('underline'), strike: e.isActive('strike'), bullet: e.isActive('bulletList'), ordered: e.isActive('orderedList'),
      align: e.isActive({ textAlign: 'center' }) ? 'center' : e.isActive({ textAlign: 'right' }) ? 'right' : 'left',
      style: e.isActive('heading', { level: 1 }) ? 'h1' : e.isActive('heading', { level: 2 }) ? 'h2' : e.isActive('heading', { level: 3 }) ? 'h3' : 'p',
      canUndo: e.can().undo(), canRedo: e.can().redo(), data, focused: e.isFocused, text: currentText(e) };
  } });
  if (!editor || !st) return <div style={{ minHeight: "400px" }} />;

  const chain = () => editor.chain().focus();
  const insertData = attrs => chain().insertContent({ type: 'dataBlock', attrs }).run();
  const setData = o => chain().updateAttributes('dataBlock', o).run();
  const setStyle = v => v === 'p' ? chain().setParagraph().run() : chain().setHeading({ level: Number(v[1]) }).run();
  const cat = DV.catalog(facts);
  const hasH = st.data && (st.data.kind === 'chart' || st.data.kind === 'breakdown');
  const tb = (aria, icon, run, on, off, danger) => (
    <button key={aria} type="button" onMouseDown={e => e.preventDefault()} onClick={run} disabled={off} aria-label={aria} aria-pressed={on} title={aria} style={{ minWidth: "40px", height: "40px", padding: "0 10px", border: "0", borderRadius: "0", background: on ? "#eef3fd" : "transparent", display: "grid", placeItems: "center", font: "inherit", fontSize: "15px", color: danger ? "#a3330c" : on ? "#1f6be2" : "#0b1626", cursor: off ? "default" : "pointer", opacity: off ? 0.35 : 1 }} className="dcceddbc1">{icon}</button>
  );
  const pill = (label, on, run, k) => <button key={k} type="button" onMouseDown={e => e.preventDefault()} onClick={run} aria-pressed={on} style={{ height: "40px", padding: "0 12px", border: "0", borderRadius: "0", background: on ? "#eef3fd" : "transparent", font: "inherit", fontSize: "14px", fontWeight: on ? 700 : 500, letterSpacing: "inherit", color: on ? "#1f6be2" : "#0b1626", cursor: "pointer" }} className="dcceddbc1">{label}</button>;

  // Right-click: select the chart under the pointer (or put the cursor there), then open the menu.
  const openMenu = e => {
    e.preventDefault();
    const at = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
    if (at) {
      const n = at.inside >= 0 ? editor.state.doc.nodeAt(at.inside) : null;
      if (n && n.type.name === 'dataBlock') editor.chain().setNodeSelection(at.inside).run();
      else if (editor.state.selection.empty) editor.chain().focus().setTextSelection(at.pos).run();
    }
    setMenu({ x: Math.min(e.clientX, window.innerWidth - 260) + 'px', y: Math.min(e.clientY, window.innerHeight - 440) + 'px' });
  };
  const run = fn => () => { fn(); setMenu(null); };
  const paste = () => navigator.clipboard?.readText ? navigator.clipboard.readText().then(t => chain().insertContent(t).run(), () => toast('Press ⌘V to paste.')) : toast('Press ⌘V to paste.');
  const menuItems = [
    { label: 'Cut', hint: '⌘X', run: run(() => { editor.view.focus(); document.execCommand('cut'); }), off: editor.state.selection.empty },
    { label: 'Copy', hint: '⌘C', run: run(() => { editor.view.focus(); document.execCommand('copy'); }), off: editor.state.selection.empty },
    { label: 'Paste', hint: '⌘V', run: run(paste) }, { sep: true },
    ...(st.data ? [] : [{ label: 'Bold', hint: '⌘B', run: run(() => chain().toggleBold().run()) }, { label: 'Italic', hint: '⌘I', run: run(() => chain().toggleItalic().run()) }, { sep: true }]),
    { head: 'Insert' }, ...cat.map(([, label, attrs]) => ({ label, hint: 'GA4', run: run(() => insertData(attrs)) })),
    { label: 'Divider', run: run(() => chain().setHorizontalRule().run()) },
    ...(st.data ? [{ sep: true }, { head: 'Width' }, ...WIDTHS.map(([w, label]) => ({ label, check: Math.abs((st.data.w || 1) - w) < 0.02, run: run(() => setData({ w })) })), { sep: true }, { label: 'Delete', run: run(() => chain().deleteSelection().run()), danger: true }] : []),
  ];

  // Ask Analyst: the logo sits beside the text block the cursor is in; pressing it opens the ask box.
  const shown = ask || (st.focused && st.text && st.text.text.trim() ? st.text : null);
  let askTop = null;
  if (shown && wrap.current) { try { askTop = editor.view.coordsAtPos(shown.pos + 1).top - wrap.current.getBoundingClientRect().top; } catch { askTop = null; } }
  const sendAsk = q => {
    q = (q || '').trim(); if (!q || askBusy || !ask) return;
    setAskBusy(true); setAskErr('');
    onRewrite({ kind: ask.kind, text: ask.text, doc: editor.getJSON(), instruction: q }).then(r => {
      setAskBusy(false);
      if (r.error) return setAskErr(r.error);
      const n = editor.state.doc.nodeAt(ask.pos);
      if (n && n.isTextblock) chain().insertContentAt({ from: ask.pos + 1, to: ask.pos + 1 + n.content.size }, r.text).run();
      setAsk(null); setAskText(''); toast('Analyst rewrote this part. Save to keep it.');
    }, () => { setAskBusy(false); setAskErr('Rewriting failed. Try again.'); });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DOC_CSS }} />
      <div className="clario-noprint" style={{ position: "sticky", top: "0", zIndex: "20", margin: "-8px -8px 0", padding: "8px", background: "#f4f7fb" }}>
        <div style={{ background: "#ffffff", boxShadow: "0 1px 2px rgba(11,22,38,.05),0 10px 24px -18px rgba(11,22,38,.25)" }}>
          <div role="tablist" aria-label="Editor tabs" style={{ display: "flex", gap: "2px", padding: "4px 10px 0", borderBottom: "1px solid #eef1f6", overflowX: "auto" }}>
            {[['home', 'Home'], ['insert', 'Insert'], ['layout', 'Layout']].map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} style={{ height: "44px", padding: "0 14px", border: "0", borderBottom: `2px solid ${tab === k ? '#1f6be2' : 'transparent'}`, background: "transparent", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: tab === k ? '#1f6be2' : '#45505f', cursor: "pointer", whiteSpace: "nowrap" }}>{label}</button>)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", minHeight: "68px", padding: "6px 10px" }}>
            {tab === 'home' ? [
              tb('Undo', <Icon d={ICON.undo} />, () => chain().undo().run(), false, !st.canUndo), tb('Redo', <Icon d={ICON.redo} />, () => chain().redo().run(), false, !st.canRedo), sep(1),
              <select key="style" aria-label="Text style" value={st.style} onChange={e => setStyle(e.target.value)} disabled={!!st.data} style={{ ...small, minWidth: "150px", opacity: st.data ? 0.5 : 1 }}><option value="h1">{"Headline"}</option><option value="h2">{"Heading"}</option><option value="h3">{"Subheading"}</option><option value="p">{"Paragraph"}</option></select>, sep(2),
              tb('Bold', <strong>{"B"}</strong>, () => chain().toggleBold().run(), st.bold), tb('Italic', <em style={{ fontFamily: "Georgia,serif" }}>{"I"}</em>, () => chain().toggleItalic().run(), st.italic),
              tb('Underline', <span style={{ textDecoration: "underline" }}>{"U"}</span>, () => chain().toggleUnderline().run(), st.underline), tb('Strikethrough', <span style={{ textDecoration: "line-through" }}>{"S"}</span>, () => chain().toggleStrike().run(), st.strike), sep(3),
              tb('Bulleted list', <Icon d={ICON.bullet} />, () => chain().toggleBulletList().run(), st.bullet), tb('Numbered list', <Icon d={ICON.ordered} />, () => chain().toggleOrderedList().run(), st.ordered), sep(4),
              tb('Align left', <Icon d={ICON.left} />, () => chain().setTextAlign('left').run(), st.align === 'left'), tb('Align centre', <Icon d={ICON.center} />, () => chain().setTextAlign('center').run(), st.align === 'center'), tb('Align right', <Icon d={ICON.right} />, () => chain().setTextAlign('right').run(), st.align === 'right'),
            ] : null}
            {tab === 'insert' ? (<>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#5a6474", padding: "0 6px" }}><img src="/assets/logo-ga4.png" alt="" width="16" height="16" />{"Google Analytics 4"}</span>
              {cat.map(([k, label, attrs]) => <button key={k} type="button" onMouseDown={e => e.preventDefault()} onClick={() => insertData(attrs)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", minWidth: "64px", height: "56px", padding: "0 10px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "12px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dcceddbc1"><span style={{ color: "#1f6be2", display: "grid" }}><Icon d={ICON[k]} /></span>{label}</button>)}
              {sep(5)}
              <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => chain().setHorizontalRule().run()} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", minWidth: "64px", height: "56px", padding: "0 10px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "12px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dcceddbc1"><span style={{ color: "#1f6be2", display: "grid" }}><Icon d={ICON.rule} /></span>{"Divider"}</button>
            </>) : null}
            {tab === 'layout' ? (st.data ? (<>
              <span style={{ fontSize: "14px", fontWeight: "600", marginRight: "4px" }}>{"Width"}</span>
              {WIDTHS.map(([w, label], k) => pill(label, Math.abs((st.data.w || 1) - w) < 0.02, () => setData({ w }), k))}
              {hasH ? (<>{sep(6)}<span style={{ fontSize: "14px", fontWeight: "600", marginRight: "4px" }}>{"Height"}</span>{pill('Shorter', false, () => setData({ h: Math.max(100, (st.data.h || 180) - 40) }), 'a')}<span style={{ fontSize: "14px", color: "#5a6474", padding: "0 4px", fontVariantNumeric: "tabular-nums" }}>{(st.data.h || 180) + ' px'}</span>{pill('Taller', false, () => setData({ h: Math.min(560, (st.data.h || 180) + 40) }), 'b')}</>) : null}
              {DV.options(facts, st.data).map(([key, label, opts]) => <select key={key} aria-label={label} value={st.data[key]} onChange={e => setData({ [key]: e.target.value })} style={{ ...small, marginLeft: "6px" }}>{opts.map(([val, l]) => <option key={val} value={val}>{l}</option>)}</select>)}
              {sep(7)}{tb('Delete', <Icon d={ICON.del} />, () => chain().deleteSelection().run(), false, false, true)}
            </>) : <span style={{ fontSize: "14px", color: "#5a6474", padding: "0 6px" }}>{"Click a chart or table to change its width, height and what it shows."}</span>) : null}
          </div>
        </div>
      </div>
      <div style={{ padding: "8px 0 64px" }}>
      <article className="clario-print" style={{ width: "100%", maxWidth: "816px", margin: "0 auto", background: "#ffffff", boxShadow: "0 1px 2px rgba(11,22,38,.06)" }}>
      <div style={{ height: "8px", background: color }}></div>
      <div style={{ padding: "40px clamp(24px,7vw,72px) 72px", display: "flex", flexDirection: "column", gap: "18px" }}>
      {header}
      <div ref={wrap} onContextMenu={openMenu} style={{ position: "relative" }}>
        <EditorContent editor={editor} />
        {shown && askTop != null ? (
          <button type="button" className="clario-noprint" onMouseDown={e => e.preventDefault()} onClick={() => { if (ask) { setAsk(null); return; } setAsk(st.text); setAskText(''); setAskErr(''); }} aria-label="Ask Analyst to change this part" aria-expanded={!!ask} title="Ask Analyst to change this part" style={{ position: "absolute", top: Math.max(0, askTop - 8) + "px", right: "-64px", width: "44px", height: "44px", padding: "0", border: "0", borderRadius: "50%", background: ask ? "#eef3fd" : "#ffffff", boxShadow: "0 4px 14px -6px rgba(11,22,38,.35)", display: "grid", placeItems: "center", cursor: "pointer" }}>
            <img src="/assets/clario-mark-v2.png" alt="" width="26" height="26" style={{ width: "26px", height: "26px", display: "block", animation: askBusy ? "clario-spin 900ms linear infinite" : "none" }} />
          </button>
        ) : null}
        {ask && askTop != null ? (
          <form onSubmit={e => { e.preventDefault(); sendAsk(askText); }} className="clario-noprint" style={{ position: "absolute", zIndex: "20", top: (askTop + 44) + "px", right: "-64px", width: "min(360px,80vw)", background: "#ffffff", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 18px 40px -18px rgba(11,22,38,.45)", fontSize: "15px", lineHeight: "1.4" }}>
            <span style={{ fontWeight: "700" }}>{"Ask "}<span style={{ color: "#1f6be2" }}>{"Analyst"}</span>{" to change this " + ask.kind}</span>
            <input autoFocus value={askText} onChange={e => { setAskText(e.target.value); setAskErr(''); }} disabled={askBusy} placeholder="e.g. Mention the courses page" aria-label="What should Analyst change?" style={{ height: "44px", padding: "0 12px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", letterSpacing: "inherit", outline: "none" }} />
            <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {['Make it shorter', 'Use simpler words', 'Sound more reassuring'].map(x => <button type="button" key={x} onClick={() => sendAsk(x)} disabled={askBusy} style={{ height: "36px", padding: "0 10px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }}>{x}</button>)}
            </span>
            {askErr ? <span role="alert" style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>{askErr}</span> : null}
            {askBusy ? <span role="status" style={{ fontSize: "14px", color: "#5a6474" }}>{"Rewriting…"}</span> : null}
            <span style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" onClick={() => setAsk(null)} disabled={askBusy} style={{ height: "40px", padding: "0 12px", border: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }}>{"Cancel"}</button>
              <button type="submit" disabled={askBusy} style={{ height: "40px", padding: "0 16px", border: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", opacity: askBusy ? 0.8 : 1 }} className="dc9482609">{"Rewrite"}</button>
            </span>
          </form>
        ) : null}
      </div>
      {footer}
      </div>
      </article>
      </div>
      {menu ? (<>
        <div onMouseDown={() => setMenu(null)} onContextMenu={e => { e.preventDefault(); setMenu(null); }} className="clario-noprint" style={{ position: "fixed", inset: "0", zIndex: "69" }}></div>
        <div role="menu" aria-label="Report options" className="clario-noprint" onKeyDown={e => { if (e.key === 'Escape') setMenu(null); }} style={{ position: "fixed", left: menu.x, top: menu.y, zIndex: "70", minWidth: "240px", maxHeight: "calc(100vh - 24px)", overflowY: "auto", padding: "6px", background: "#ffffff", boxShadow: "0 0 0 1px #e6ebf2,0 18px 40px -16px rgba(11,22,38,.35)" }}>
          {menuItems.map((it, k) => it.sep ? <div key={k} style={{ height: "1px", margin: "4px 6px", background: "#eef1f6" }}></div>
            : it.head ? <div key={k} style={{ padding: "6px 10px 2px", fontSize: "12px", fontWeight: "600", color: "#5a6474" }}>{it.head}</div>
            : <button key={k} role={it.check != null ? "menuitemradio" : "menuitem"} aria-checked={it.check} onMouseDown={e => e.preventDefault()} onClick={it.run} disabled={it.off} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", minHeight: "38px", padding: "0 10px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: it.check ? 700 : 500, letterSpacing: "inherit", color: it.danger ? "#a3330c" : it.check ? "#1f6be2" : "#0b1626", cursor: it.off ? "default" : "pointer", opacity: it.off ? 0.4 : 1, textAlign: "left" }} className="dcf0b705f"><span>{it.label}</span><span style={{ fontSize: "12px", color: "#97a2b2" }}>{it.hint}</span></button>)}
        </div>
      </>) : null}
    </>
  );
}
