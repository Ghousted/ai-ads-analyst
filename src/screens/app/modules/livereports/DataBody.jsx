import React from 'react';
import * as DV from './dataviews';

const caption = { fontSize: "15px", fontWeight: "700", lineHeight: "1.3" };

// A chart, table or key numbers drawn from a report's numbers. Also used by the template preview.
export function DataBody({ a, f, color }) {
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
  return body;
}
