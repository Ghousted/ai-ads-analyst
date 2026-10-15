import React from 'react';
import { DataBody } from './DataBody';

// A saved report, read-only: the same text, charts and tables as the editor, for the client's private link.
const S = {
  h1: { margin: "0 0 12px", fontSize: "34px", fontWeight: "700", letterSpacing: "-1px", lineHeight: "1.2" },
  h2: { margin: "22px 0 6px", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px", lineHeight: "1.3" },
  h3: { margin: "18px 0 4px", fontSize: "18px", fontWeight: "700", lineHeight: "1.35" },
  p: { margin: "0 0 14px", textWrap: "pretty" },
};

function inline(nodes = []) {
  return nodes.map((n, i) => {
    if (n.type === 'hardBreak') return <br key={i} />;
    let el = n.text || '';
    for (const m of n.marks || []) {
      if (m.type === 'bold') el = <strong>{el}</strong>;
      else if (m.type === 'italic') el = <em>{el}</em>;
      else if (m.type === 'underline') el = <u>{el}</u>;
      else if (m.type === 'strike') el = <s>{el}</s>;
      else if (m.type === 'link' && /^https?:\/\//.test(m.attrs?.href || '')) el = <a href={m.attrs.href} rel="noopener noreferrer nofollow" target="_blank" style={{ color: "#1f6be2" }}>{el}</a>;
    }
    return <React.Fragment key={i}>{el}</React.Fragment>;
  });
}

function block(n, i, ctx) {
  const align = n.attrs?.textAlign && n.attrs.textAlign !== 'left' ? { textAlign: n.attrs.textAlign } : {};
  if (n.type === 'heading') { const L = Math.min(3, Math.max(1, n.attrs?.level || 2)), T = 'h' + L; return <T key={i} style={{ ...S[T], ...align }}>{inline(n.content)}</T>; }
  if (n.type === 'paragraph') return n.content?.length ? <p key={i} style={{ ...S.p, ...align }}>{inline(n.content)}</p> : null;
  if (n.type === 'bulletList' || n.type === 'orderedList') { const T = n.type === 'bulletList' ? 'ul' : 'ol'; return <T key={i} style={{ margin: "0 0 14px", paddingLeft: "24px" }}>{(n.content || []).map((li, j) => <li key={j} style={{ marginBottom: "4px" }}>{(li.content || []).map((c, k) => c.type === 'paragraph' ? <React.Fragment key={k}>{inline(c.content)}</React.Fragment> : block(c, k, ctx))}</li>)}</T>; }
  if (n.type === 'blockquote') return <blockquote key={i} style={{ margin: "0 0 14px", padding: "2px 0 2px 16px", borderLeft: "3px solid #d3dbe6", color: "#45505f" }}>{(n.content || []).map((c, k) => block(c, k, ctx))}</blockquote>;
  if (n.type === 'horizontalRule') return <hr key={i} style={{ border: "0", borderTop: "1px solid #e6ebf2", margin: "22px 0" }} />;
  if (n.type === 'image' && /^(https:|data:image\/)/.test(n.attrs?.src || '')) return <img key={i} src={n.attrs.src} alt={n.attrs.alt || ''} style={{ display: "block", maxWidth: "100%", width: n.attrs.width ? n.attrs.width + "px" : "auto", height: "auto", margin: "0 0 14px" }} />;
  return null;
}

export default function ReportReader({ doc, facts, color }) {
  // Charts and tables sit side by side when their widths add up to a row, as in the editor.
  const rows = [];
  for (const n of doc.content || []) {
    const last = rows[rows.length - 1], w = Number(n.attrs?.w) || 1;
    if (n.type === 'dataBlock' && last && last.data && last.w + w <= 1.001) { last.items.push(n); last.w += w; }
    else rows.push({ data: n.type === 'dataBlock', w, items: [n] });
  }
  return (
    <div style={{ fontSize: "17px", lineHeight: "1.65", color: "#0b1626" }}>
      {rows.map((r, i) => r.data ? (
        <div key={i} style={{ display: "flex", gap: "24px", flexWrap: "wrap", margin: "8px 0 22px", breakInside: "avoid" }}>
          {r.items.map((n, j) => <div key={j} style={{ flex: "1 1 " + Math.round((Number(n.attrs?.w) || 1) * 100 - 4) + "%", minWidth: "240px" }}>{facts ? <DataBody a={n.attrs || {}} f={facts} color={color} /> : null}</div>)}
        </div>
      ) : block(r.items[0], i))}
    </div>
  );
}
