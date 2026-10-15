import React from 'react';
import { WIDTHS } from '@/lib/report-blocks';

const btn = { height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", whiteSpace: "nowrap" };
const primary = { ...btn, border: "0", background: "#1f6be2", color: "#ffffff" };
const select = { height: "44px", padding: "0 36px 0 14px", border: "0", borderRadius: "0", background: "#eef1f6 url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235a6474%22 stroke-width=%222.6%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>') right 12px center no-repeat", appearance: "none", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" };
// Text the agency edits in place: looks like the report, not like a form.
const field = { width: "100%", padding: "4px 6px", margin: "0 -6px", border: "1px solid transparent", borderRadius: "0", background: "transparent", font: "inherit", letterSpacing: "inherit", color: "inherit", resize: "none", outline: "none", fieldSizing: "content" };

// One editable part of the report. Clicking into it shows the Analyst button at its right; pressing that opens a small
// box to ask Analyst to change just this part.
function Part({ p, children }) {
  return (
    <div onFocusCapture={p.focus} onMouseDown={p.focus} style={{ position: "relative" }}>
      {children}
      {p.active ? (
        <button type="button" onClick={p.openAsk} aria-label="Ask Analyst to change this part" aria-expanded={p.open} title="Ask Analyst to change this part" className="clario-noprint" style={{ position: "absolute", top: "0", right: "-56px", width: "44px", height: "44px", padding: "0", border: "0", borderRadius: "50%", background: p.open ? "#eef3fd" : "#ffffff", boxShadow: "0 4px 14px -6px rgba(11,22,38,.35)", display: "grid", placeItems: "center", cursor: "pointer" }}>
          <img src="/assets/clario-mark-v2.png" alt="" width="26" height="26" style={{ width: "26px", height: "26px", display: "block", animation: p.busy ? "clario-spin 900ms linear infinite" : "none" }} />
        </button>
      ) : null}
      {p.open ? (
        <form onSubmit={p.submit} className="clario-noprint" style={{ position: "absolute", zIndex: "20", top: "52px", right: "-56px", width: "min(360px,80vw)", background: "#ffffff", padding: "14px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 18px 40px -18px rgba(11,22,38,.45)", fontSize: "15px", lineHeight: "1.4" }}>
          <span style={{ fontWeight: "700" }}>{"Ask "}<span style={{ color: "#1f6be2" }}>{"Analyst"}</span>{" to change this part"}</span>
          <input autoFocus value={p.ask} onChange={p.setAsk} disabled={p.busy} placeholder="e.g. Mention the courses page" aria-label="What should Analyst change?" style={{ height: "44px", padding: "0 12px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", letterSpacing: "inherit", outline: "none" }} />
          <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {p.ideas.map(x => <button type="button" key={x.label} onClick={x.use} disabled={p.busy} style={{ height: "36px", padding: "0 10px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }}>{x.label}</button>)}
          </span>
          {p.err ? <span role="alert" style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>{p.err}</span> : null}
          {p.busy ? <span role="status" style={{ fontSize: "14px", color: "#5a6474" }}>{"Rewriting this part\u2026"}</span> : null}
          <span style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button type="button" onClick={p.close} disabled={p.busy} style={{ height: "40px", padding: "0 12px", border: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }}>{"Cancel"}</button>
            <button type="submit" disabled={p.busy} style={{ height: "40px", padding: "0 16px", border: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", opacity: p.busy ? 0.8 : 1 }} className="dc9482609">{"Rewrite"}</button>
          </span>
        </form>
      ) : null}
    </div>
  );
}

export function LiveReportsView({ v }) {
  if (v.lrList) return (
    <>
      <section aria-label="Reports" style={{ background: "#ffffff", display: "flex", flexDirection: "column" }}>
        {v.lrNoReports ? (
          <div style={{ padding: "32px 22px", color: "#5a6474" }}>{"No reports yet. Click Write report and Analyst drafts one from the client's real numbers for you to review."}</div>
        ) : v.lrRows.map((r, i) => (
          <button key={i} onClick={r.open} style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", minHeight: "64px", padding: "12px 22px", border: "0", borderTop: i ? "1px solid #eef1f6" : "0", borderRadius: "0", background: "#ffffff", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }} className="dcbbe0dc7">
            <span style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
              <span style={{ fontWeight: "600" }}>{r.title}</span>
              <span style={{ fontSize: "14px", color: "#5a6474" }}>{r.client}</span>
            </span>
            <span style={{ padding: "3px 10px", background: r.pBg, color: r.pC, fontSize: "13px", fontWeight: "600" }}>{r.status}</span>
            <span style={{ fontSize: "14px", color: "#5a6474" }}>{r.date}</span>
          </button>
        ))}
      </section>
    </>
  );
  if (!v.lrPage) return null;
  if (v.lrMissing) return (
    <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
      <span style={{ fontWeight: "700", fontSize: "18px" }}>{"This report was deleted"}</span>
      <button onClick={v.lrBack} style={btn}>{"Back to reports"}</button>
    </div>
  );
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={v.lrBack} style={{ display: "flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 12px 0 8px", marginLeft: "-8px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>{"Reports"}
        </button>
        <span style={{ padding: "3px 10px", background: "#eef1f6", color: "#45505f", fontSize: "13px", fontWeight: "600" }}>{v.lrStatus}</span>
        <span style={{ fontSize: "14px", color: "#5a6474" }}>{v.lrDate}</span>
        <span style={{ flex: "1" }}></span>
        {v.lrToast ? <span role="status" style={{ fontSize: "14px", fontWeight: "600", color: "#1d6b3a" }}>{v.lrToastText}</span> : null}
        <button onClick={v.lrDelete} style={{ ...btn, color: "#a3330c" }}>{v.lrDeleteLabel}</button>
        <button onClick={v.lrPdf} style={btn}>{"Download PDF"}</button>
        {v.lrDirty ? <button onClick={v.lrDiscard} style={btn}>{"Discard edits"}</button> : null}
        <button onClick={v.lrSave} disabled={!v.lrDirty || v.lrSaving} style={{ ...primary, opacity: v.lrDirty ? 1 : 0.5, cursor: v.lrDirty ? "pointer" : "default" }} className="dc9482609">{v.lrSaving ? "Saving…" : v.lrDirty ? "Save changes" : "Saved"}</button>
      </div>
      <div className="clario-noprint" style={{ position: "sticky", top: "0", zIndex: "15", background: "#ffffff", padding: "12px 22px", display: "flex", alignItems: "center", gap: "8px 18px", flexWrap: "wrap", boxShadow: "0 1px 0 #e6ebf2" }}>
        <span style={{ fontWeight: "700" }}>{"Insert"}</span>
        {v.lrInsert.map(g => (
          <span key={g.label} style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {g.hasLogo ? <img src={g.logo} alt="" width="18" height="18" style={{ width: "18px", height: "18px" }} /> : null}
            <span style={{ fontSize: "14px", color: "#5a6474", marginRight: "2px" }}>{g.label}</span>
            {g.items.map(it => <button key={it.label} type="button" onClick={it.add} style={{ height: "40px", padding: "0 12px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">{it.label}</button>)}
          </span>
        ))}
        <span style={{ fontSize: "13px", color: "#5a6474" }}>{v.lrInsertHint}</span>
      </div>
      <div style={{ padding: "8px 0 64px" }}>
        <article className="clario-print" style={{ width: "100%", maxWidth: "816px", margin: "0 auto", background: "#ffffff", boxShadow: "0 1px 2px rgba(11,22,38,.06)" }}>
          <div style={{ height: "8px", background: v.lrColor }}></div>
          <div onMouseDown={v.lrDeselect} style={{ padding: "48px clamp(24px,7vw,72px) 72px", display: "flex", flexDirection: "column", gap: "22px", fontSize: "17px", lineHeight: "1.65", color: "#0b1626" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", fontSize: "14px", color: "#5a6474" }}>
              <strong style={{ color: "#0b1626", fontSize: "16px" }}>{v.lrAgency}</strong><span>{v.lrPeriod}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <input aria-label="Report title" value={v.lrTitle} onChange={v.lrSetTitle} style={{ ...field, fontSize: "14px", fontWeight: "600", color: "#5a6474" }} />
              <span style={{ fontSize: "15px", color: "#5a6474" }}>{"Prepared for " + v.lrClientName}</span>
            </div>
            {v.lrNoBlocks ? <p className="clario-noprint" style={{ margin: "0", padding: "28px", background: "#f4f7fb", color: "#5a6474" }}>{"This report is empty. Use Insert above to add text, charts and tables."}</p> : null}
            <div onMouseDown={v.lrDeselect} style={{ display: "flex", flexWrap: "wrap", columnGap: GAP + "px", rowGap: "22px", alignItems: "flex-start" }}>
              {v.lrBlocks.map(b => <Block key={b.id} b={b} />)}
            </div>
            <span style={{ fontSize: "13px", color: "#5a6474" }}>{v.lrSource}</span>
          </div>
        </article>
      </div>
    </>
  );
}

const GAP = 16;
const small = { height: "40px", padding: "0 30px 0 10px", border: "0", borderRadius: "0", background: "#eef1f6 url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235a6474%22 stroke-width=%222.6%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>') right 10px center no-repeat", appearance: "none", font: "inherit", fontSize: "14px", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" };
const iconBtn = { width: "40px", height: "40px", padding: "0", border: "0", borderRadius: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer", color: "#45505f" };
const caption = { fontSize: "15px", fontWeight: "700", lineHeight: "1.3" };

// Drag the corner to resize: width snaps to a third, half, two thirds or full; charts also change height.
function startResize(e, b) {
  e.preventDefault(); e.stopPropagation();
  const el = e.currentTarget.closest('[data-block]'), row = el.parentElement.clientWidth, w0 = el.getBoundingClientRect().width, x0 = e.clientX, y0 = e.clientY, h0 = b.h;
  const move = ev => {
    const frac = (w0 + ev.clientX - x0 + GAP) / (row + GAP);
    const w = WIDTHS.reduce((a, x) => (Math.abs(x - frac) < Math.abs(a - frac) ? x : a), 1);
    b.resize(w, b.hasH ? Math.max(100, Math.min(560, Math.round(h0 + ev.clientY - y0))) : 0);
  };
  const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); document.body.style.cursor = ''; };
  document.body.style.cursor = 'nwse-resize';
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
}

function Block({ b }) {
  const width = b.visual ? `calc(${b.w * 100}% - ${GAP * (1 - b.w)}px)` : "100%";
  return (
    <div data-block onMouseDown={b.select} style={{ position: "relative", width, minWidth: "0", outline: b.sel ? "2px solid #1f6be2" : "none", outlineOffset: "6px" }}>
      {b.sel ? (
        <div className="clario-noprint" onMouseDown={e => e.stopPropagation()} style={{ position: "absolute", zIndex: "12", bottom: "calc(100% + 10px)", right: "-6px", display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end", padding: "4px", background: "#ffffff", boxShadow: "0 8px 24px -10px rgba(11,22,38,.4)", maxWidth: "min(640px,90vw)" }}>
          {b.opts.map(o => <select key={o.label} aria-label={o.label} value={o.value} onChange={o.set} style={small}>{o.opts.map(([val, label]) => <option key={val} value={val}>{label}</option>)}</select>)}
          <button type="button" onClick={b.up} disabled={!b.canUp} aria-label="Move up" style={{ ...iconBtn, opacity: b.canUp ? 1 : 0.35 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M6 11l6-6 6 6"></path></svg></button>
          <button type="button" onClick={b.down} disabled={!b.canDown} aria-label="Move down" style={{ ...iconBtn, opacity: b.canDown ? 1 : 0.35 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6"></path></svg></button>
          <button type="button" onClick={b.remove} aria-label="Remove block" style={{ ...iconBtn, color: "#a3330c" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"></path></svg></button>
        </div>
      ) : null}
      {b.isTitle ? <Part p={b.p}><textarea aria-label="Headline" rows={1} value={b.text} onChange={b.set} placeholder="Headline" style={{ ...field, fontSize: "34px", fontWeight: "700", letterSpacing: "-1px", lineHeight: "1.2" }} /></Part> : null}
      {b.isHeading ? <Part p={b.p}><input aria-label="Heading" value={b.text} onChange={b.set} placeholder="Heading" style={{ ...field, fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }} /></Part> : null}
      {b.isText ? <Part p={b.p}><textarea aria-label="Paragraph" value={b.text} onChange={b.set} placeholder="Write something" style={field} /></Part> : null}
      {b.isList ? (
        <ol style={{ margin: "0", paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {b.items.map((it, j) => (
            <li key={j}><Part p={it.p}><span style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <textarea aria-label={"List item " + (j + 1)} rows={1} value={it.text} onChange={it.set} placeholder="List item" style={field} />
              <button type="button" onClick={it.remove} aria-label={"Remove item " + (j + 1)} className="clario-noprint" style={{ flex: "none", width: "44px", height: "36px", border: "0", background: "transparent", color: "#97a2b2", cursor: "pointer" }}>{"×"}</button>
            </span></Part></li>
          ))}
          {b.sel ? <li className="clario-noprint" style={{ listStyle: "none" }}><button type="button" onClick={b.addItem} style={{ height: "40px", padding: "0", border: "0", background: "transparent", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#1f6be2", cursor: "pointer" }}>{"Add item"}</button></li> : null}
        </ol>
      ) : null}
      {b.isKpis ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "8px" }}>
          {b.tiles.map(k => (
            <div key={k.label} style={{ background: "#f4f7fb", padding: "12px 14px", display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
              <span style={{ fontSize: "13px", color: "#5a6474" }}>{k.label}</span>
              <span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: k.c }}>{k.note}</span>
            </div>
          ))}
        </div>
      ) : null}
      {b.isChart ? (
        <figure style={{ margin: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
          <figcaption style={caption}>{b.chart.caption}</figcaption>
          <svg viewBox={b.chart.vb} preserveAspectRatio="none" role="img" aria-label={b.chart.caption + ' this period, with the previous period dashed'} style={{ width: "100%", height: b.chart.H + "px", display: "block" }}>
            <path d={b.chart.area} fill="#1f6be21f"></path>
            <path d={b.chart.prevLine} fill="none" stroke="#97a2b2" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke"></path>
            <path d={b.chart.line} fill="none" stroke="#1f6be2" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></path>
          </svg>
          <span style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "13px", color: "#5a6474" }}><span>{b.chart.from}</span><span>{"Dashed: previous period"}</span><span>{b.chart.to}</span></span>
        </figure>
      ) : null}
      {b.isBreakdown ? (
        <figure style={{ margin: "0", display: "flex", flexDirection: "column", gap: "10px", minHeight: b.h + "px" }}>
          <figcaption style={caption}>{b.bd.caption}</figcaption>
          {b.bd.empty ? <span style={{ fontSize: "15px", color: "#5a6474" }}>{"No data for this period."}</span> : b.bd.isDonut ? (
            <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
              <svg viewBox="0 0 100 100" width={b.bd.size} height={b.bd.size} role="img" aria-label={b.bd.caption} style={{ flex: "none", transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#eef1f6" strokeWidth="16"></circle>
                {b.bd.rows.map(r => <circle key={r.label} cx="50" cy="50" r="40" fill="none" stroke={r.col} strokeWidth="16" strokeDasharray={r.dash} strokeDashoffset={r.off}></circle>)}
              </svg>
              <ul style={{ margin: "0", padding: "0", listStyle: "none", flex: "1 1 140px", fontSize: "15px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {b.bd.rows.map(r => <li key={r.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ flex: "none", width: "10px", height: "10px", background: r.col }}></span><span style={{ flex: "1", minWidth: "0" }}>{r.label}</span><span style={{ color: "#5a6474" }}>{r.pct}</span><strong style={{ fontVariantNumeric: "tabular-nums", minWidth: "40px", textAlign: "right" }}>{r.value}</strong></li>)}
              </ul>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {b.bd.rows.map(r => (
                <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "15px" }}>
                  <span style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}><span>{r.label}</span><strong style={{ fontVariantNumeric: "tabular-nums" }}>{r.value}</strong></span>
                  <span style={{ display: "block", height: "8px", background: "#eef1f6" }}><span style={{ display: "block", height: "100%", width: r.w, background: "#1f6be2" }}></span></span>
                </div>
              ))}
            </div>
          )}
        </figure>
      ) : null}
      {b.isTable ? (
        <section style={{ display: "flex", flexDirection: "column", gap: "8px", overflowX: "auto" }}>
          <span style={caption}>{b.tb.caption}</span>
          {b.tb.rows.length === 0 ? <span style={{ fontSize: "15px", color: "#5a6474" }}>{"No data for this period."}</span> : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px", fontVariantNumeric: "tabular-nums" }}>
              <thead><tr style={{ color: "#5a6474", fontSize: "13px" }}>{b.tb.cols.map((c, k) => <th key={c} style={{ textAlign: k ? "right" : "left", fontWeight: "600", padding: "6px 0" }}>{c}</th>)}</tr></thead>
              <tbody>{b.tb.rows.map((row, ri) => <tr key={ri} style={{ borderTop: "1px solid #eef1f6" }}>{row.map((cell, k) => <td key={k} style={{ padding: "8px 0", textAlign: k ? "right" : "left", fontWeight: k ? "500" : "600", overflowWrap: "anywhere", color: k === b.tb.changeCol ? (String(cell).startsWith('+') ? "#1d6b3a" : String(cell).startsWith('−') ? "#a3330c" : "#5a6474") : "inherit" }}>{cell}</td>)}</tr>)}</tbody>
            </table>
          )}
        </section>
      ) : null}
      {b.sel && b.visual ? (
        <span role="slider" aria-label="Resize block" aria-valuetext={Math.round(b.w * 100) + '% wide'} onPointerDown={e => startResize(e, b)} className="clario-noprint" style={{ position: "absolute", right: "-14px", bottom: "-14px", width: "22px", height: "22px", background: "#1f6be2", cursor: "nwse-resize", touchAction: "none", border: "3px solid #ffffff", boxShadow: "0 2px 6px rgba(11,22,38,.3)" }}></span>
      ) : null}
    </div>
  );
}

// The write-a-report dialog. Same layout as the settings dialogs.
// Same loading animation as the setup wizard: spinning ring around the breathing logo, a status line, a filling bar.
const WRITING_CSS = '@keyframes clario-spin{to{transform:rotate(360deg)}}@keyframes clario-breathe{0%,100%{transform:scale(1)}50%{transform:scale(.9)}}@keyframes clario-fade-in{from{opacity:0}to{opacity:1}}@keyframes clario-fill{from{transform:scaleX(.04)}to{transform:scaleX(.9)}}';

function Writing({ v }) {
  return (
    <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", padding: "24px 8px 8px", textAlign: "center", animation: "clario-fade-in 300ms ease both" }}>
      <style dangerouslySetInnerHTML={{ __html: WRITING_CSS }} />
      <span style={{ position: "relative", width: "72px", height: "72px", display: "block" }}>
        <span style={{ position: "absolute", inset: "-12px", borderRadius: "50%", border: "3px solid #eef1f6", borderTopColor: "#1f6be2", animation: "clario-spin 900ms linear infinite" }}></span>
        <img src="/assets/clario-mark-v2.png" alt="" width="72" height="72" style={{ position: "absolute", inset: "0", width: "72px", height: "72px", display: "block", animation: "clario-breathe 1600ms ease-in-out infinite" }} />
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minHeight: "56px" }}>
        <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.7px" }}>{v.lrWritingTitle}</span>
        <span key={v.lrWritingKey} style={{ fontSize: "16px", color: "#5a6474", animation: "clario-fade-in 300ms ease both" }}>{v.lrWritingMsg}</span>
      </div>
      <span style={{ display: "block", width: "200px", height: "4px", borderRadius: "9999px", background: "#eef1f6", overflow: "hidden" }}>
        <span style={{ display: "block", height: "100%", background: "#1f6be2", borderRadius: "9999px", transformOrigin: "left", animation: "clario-fill 12s cubic-bezier(0.2,0.6,0.35,1) both" }}></span>
      </span>
    </div>
  );
}

// A template card from the design's gallery: preview, name, description, tools, and the button that creates the report.
function TemplateCard({ t }) {
  return (
    <div role="radio" tabIndex="0" aria-checked="false" aria-label={t.label} onDoubleClick={t.create} style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: "#ffffff", boxShadow: "0 1px 2px rgba(11,22,38,.06),0 8px 24px -16px rgba(11,22,38,.25)" }}>
      {t.blank ? (
        <span aria-hidden="true" style={{ display: "grid", placeItems: "center", height: "150px", background: "#eef1fd" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#97a2b2" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"></path></svg>
        </span>
      ) : (<>
                    <span aria-hidden={"true"} style={{ display: "block", height: "150px", background: "#eef1fd", padding: "16px 18px 0", overflow: "hidden" }}>
                      {" "}
                      <span style={{ display: "flex", flexDirection: "column", gap: "6px", height: "100%", background: "#ffffff", borderRadius: "0 0 0", padding: "10px", boxShadow: "0 0 0 1px #e6e9f8" }}>
                        {" "}
                        {((t.prev) || []).map((p, $index) => (
                          <React.Fragment key={$index}>
                            {" "}
                            {(p?.kpis) ? (<>
                              <span style={{ display: "flex", gap: "4px", flex: "none" }}>
                                {((p?.tiles) || []).map((tl, $index) => (
                                  <React.Fragment key={$index}>
                                    <span style={{ flex: "1", minWidth: "0", border: "1px solid #eef1f6", borderRadius: "0", padding: "4px", display: "flex", flexDirection: "column", gap: "3px" }}>
                                      <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                        <span style={{ flex: "none", width: "7px", height: "7px", background: `url('${tl?.logo ?? ""}') center / contain no-repeat` }}></span>
                                        <span style={{ display: "block", height: "3px", width: "60%", borderRadius: "0", background: "#d3dbe6" }}></span>
                                      </span>
                                      <span style={{ display: "block", height: "4px", width: "70%", borderRadius: "0", background: "#e6ebf2" }}></span>
                                      <span style={{ display: "block", height: "3px", width: "35%", borderRadius: "0", background: tl?.c }}></span>
                                    </span>
                                  </React.Fragment>
                                ))}
                              </span>
                            </>) : null}
                            {" "}
                            {(p?.line) ? (<>
                              <span style={{ flex: "none", display: "block", height: "46px", border: "1px solid #eef1f6", borderRadius: "0", padding: "4px" }}>
                                <svg viewBox={"0 0 100 30"} preserveAspectRatio={"none"} style={{ width: "100%", height: "100%", display: "block" }}>
                                  <path d={"M0 16 C12 6 22 26 38 15 S68 4 100 18"} stroke={"#8f9cf5"} strokeWidth={"1"} fill={"none"} vectorEffect={"non-scaling-stroke"}></path>
                                  <path d={"M0 23 C18 30 30 12 50 23 S82 17 100 21"} stroke={"#9bd8a8"} strokeWidth={"1"} fill={"none"} vectorEffect={"non-scaling-stroke"}></path>
                                </svg>
                              </span>
                            </>) : null}
                            {" "}
                            {(p?.table) ? (<>
                              <span style={{ flex: "none", display: "flex", flexDirection: "column", gap: "4px", border: "1px solid #eef1f6", borderRadius: "0", padding: "6px" }}>
                                {((p?.rowsT) || []).map((rt, $index) => (
                                  <React.Fragment key={$index}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <span style={{ display: "block", height: "3px", width: rt?.w, borderRadius: "0", background: "#e1e5ec" }}></span>
                                      <span style={{ flex: "1" }}></span>
                                      <span style={{ display: "block", height: "3px", width: "10%", borderRadius: "0", background: "#e6ebf2" }}></span>
                                      <span style={{ display: "block", height: "3px", width: "10%", borderRadius: "0", background: "#e6ebf2" }}></span>
                                      <span style={{ display: "block", height: "3px", width: "10%", borderRadius: "0", background: "#e6ebf2" }}></span>
                                    </span>
                                  </React.Fragment>
                                ))}
                              </span>
                            </>) : null}
                            {" "}
                            {(p?.donut) ? (<>
                              <span style={{ flex: "none", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #eef1f6", borderRadius: "0", padding: "6px" }}>
                                <span style={{ flex: "none", width: "24px", height: "24px", borderRadius: "50%", border: "5px solid #8f9cf5", borderRightColor: "#9bd8a8" }}></span>
                                <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px" }}>
                                  <span style={{ display: "block", height: "3px", width: "70%", borderRadius: "0", background: "#e1e5ec" }}></span>
                                  <span style={{ display: "block", height: "3px", width: "50%", borderRadius: "0", background: "#e1e5ec" }}></span>
                                  <span style={{ display: "block", height: "3px", width: "35%", borderRadius: "0", background: "#e1e5ec" }}></span>
                                </span>
                              </span>
                            </>) : null}
                            {" "}
                            {(p?.text) ? (<>
                              <span style={{ flex: "none", display: "flex", flexDirection: "column", gap: "4px", padding: "2px 0" }}>
                                <span style={{ display: "block", height: "3px", width: "100%", borderRadius: "0", background: "#e1e5ec" }}></span>
                                <span style={{ display: "block", height: "3px", width: "75%", borderRadius: "0", background: "#e1e5ec" }}></span>
                              </span>
                            </>) : null}
                            {" "}
                            {(p?.heading) ? (<>
                              <span style={{ flex: "none", display: "block", height: "5px", width: "40%", borderRadius: "0", background: "#97a2b2", marginTop: "2px" }}></span>
                            </>) : null}
                            {" "}
                            {(p?.goals) ? (<>
                              <span style={{ flex: "none", display: "flex", flexDirection: "column", gap: "5px", border: "1px solid #eef1f6", borderRadius: "0", padding: "6px" }}>
                                <span style={{ display: "block", height: "4px", borderRadius: "0", background: "linear-gradient(90deg,#9bd8a8 60%,#eef1f6 60%)" }}></span>
                                <span style={{ display: "block", height: "4px", borderRadius: "0", background: "linear-gradient(90deg,#9bd8a8 40%,#eef1f6 40%)" }}></span>
                              </span>
                            </>) : null}
                            {" "}
                          </React.Fragment>
                        ))}
                        {" "}
                      </span>
                      {" "}
                    </span>
                    {" "}
      </>)}
      <span style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "16px 18px 18px", flex: "1" }}>
        <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "17px", fontWeight: "600", letterSpacing: "-0.3px", lineHeight: "1.3" }}>{t.label}</span>
          <span style={{ fontSize: "14px", color: "#5a6474", lineHeight: "1.4" }}>{t.desc}</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "20px", marginTop: "auto" }}>
          {t.logos.map(lg => <span key={lg} aria-hidden="true" style={{ display: "block", width: "20px", height: "20px", background: `url('${lg}') center / contain no-repeat` }}></span>)}
        </span>
        <button type="button" onClick={t.create} style={{ alignSelf: "flex-start", height: "40px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">{t.btn}</button>
      </span>
    </div>
  );
}

export function LiveReportsOverlay({ v }) {
  if (!v.lrModal) return null;
  const ghost = { height: "48px", padding: "0 18px", border: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" };
  const go = { height: "48px", padding: "0 22px", border: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" };
  return (
    <div onClick={v.lrBackdrop} style={{ position: "fixed", inset: "0", zIndex: "70", background: "rgba(11,22,38,.45)", display: "grid", placeItems: "center", padding: "24px" }}>
      <div role="dialog" aria-modal="true" aria-labelledby={v.lrWriting ? undefined : "lr-title"} aria-label={v.lrWriting ? v.lrWritingTitle : undefined} style={{ width: `min(${v.lrW},100%)`, height: v.lrH, maxHeight: "calc(100vh - 48px)", overflowX: "hidden", overflowY: v.lrStep2 && !v.lrWriting ? "hidden" : "auto", background: "#ffffff", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 30px 80px -30px rgba(11,22,38,.5)" }}>
        {v.lrWriting ? <Writing v={v} /> : (<>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#5a6474" }}>{v.lrCanWrite ? "New report \u00b7 " + v.lrStepLabel : "New report"}</span>
            <button type="button" onClick={v.lrClose} aria-label="Cancel and go back" style={{ width: "44px", height: "44px", margin: "-10px -10px -10px 0", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#45505f" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
          </div>
          {v.lrCanWrite ? (
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ flex: "1", height: "4px", background: "#1f6be2" }}></span>
              <span style={{ flex: "1", height: "4px", background: v.lrBar2, transition: "background-color 200ms ease" }}></span>
            </div>
          ) : null}
          {!v.lrCanWrite ? (<>
            <h2 id="lr-title" style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>{"No client has numbers yet"}</h2>
            <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>{v.lrNoDataText}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" onClick={v.lrClose} style={ghost}>{"Cancel"}</button>
              <button type="button" onClick={v.lrGoInt} style={go} className="dc9482609">{"Open integrations"}</button>
            </div>
          </>) : v.lrStep1 ? (
            <form onSubmit={v.lrNext} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 id="lr-title" style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>{"Which client is this report for?"}</h2>
              <div role="radiogroup" aria-label="Client" style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                {v.lrClients.map(c => (
                  <button key={c.id} type="button" role="radio" aria-checked={c.on} onClick={c.pick} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", padding: "8px 14px", border: `1.5px solid ${c.bd}`, borderRadius: "0", background: c.bg, font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ flex: "1", fontWeight: "600" }}>{c.name}</span>
                    {c.logos.map(lg => <span key={lg} aria-hidden="true" style={{ flex: "none", width: "20px", height: "20px", background: `url('${lg}') center / contain no-repeat` }}></span>)}
                  </button>
                ))}
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontWeight: "600" }}>{"Period"}</span>
                <select value={v.lrDays} onChange={v.lrSetDays} style={select}>{v.lrDaysOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button type="button" onClick={v.lrClose} style={ghost}>{"Cancel"}</button>
                <button type="submit" style={go} className="dc9482609">{"Next"}</button>
              </div>
            </form>
          ) : (<>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <h2 id="lr-title" style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>{"What kind of report for " + v.lrClientName + "?"}</h2>
              <span style={{ color: "#5a6474" }}>{"Pick a template and Analyst writes it from the numbers, or start blank. You can add, remove and resize everything after."}</span>
            </div>
            {v.lrHasErr ? <span role="alert" style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>{v.lrErr}</span> : null}
            <div style={{ flex: "1 1 auto", minHeight: "0", overflowY: "auto", margin: "0 -28px", padding: "2px 28px 8px", display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <nav aria-label="Template categories" style={{ flex: "0 0 180px", position: "sticky", top: "0", alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: "2px", background: "#ffffff" }}>
                <label style={{ position: "relative", display: "block", marginBottom: "8px" }}>
                  <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>{"Search templates"}</span>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a6474" strokeWidth="2.4" strokeLinecap="round" style={{ position: "absolute", left: "12px", top: "14px" }}><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>
                  <input type="search" value={v.lrQ} onChange={v.lrSetQ} placeholder="Search templates" style={{ width: "100%", height: "44px", padding: "0 12px 0 36px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", fontSize: "15px", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
                </label>
                {v.lrCats.map(c => (
                  <button key={c.label} type="button" onClick={c.pick} aria-current={c.aria} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", minHeight: "42px", padding: "0 12px", border: "0", borderRadius: "0", background: c.bg, font: "inherit", fontSize: "16px", fontWeight: c.fw, letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }}>
                    <span>{c.label}</span><span style={{ fontSize: "13px", fontWeight: "500", color: "#97a2b2" }}>{c.count}</span>
                  </button>
                ))}
                <button type="button" onClick={v.lrBackStep} style={{ marginTop: "12px", height: "44px", padding: "0 12px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer", textAlign: "left" }}>{"Back to client"}</button>
              </nav>
              <div role="radiogroup" aria-label="Report template" style={{ flex: "1", minWidth: "260px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: "16px", alignContent: "start" }}>
                {v.lrNoMatch ? (
                  <div style={{ gridColumn: "1 / -1", padding: "48px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" }}>
                    <span style={{ fontWeight: "700" }}>{"No templates match \"" + v.lrQ + "\""}</span>
                    <span style={{ color: "#5a6474" }}>{"Try another word, or start from Blank."}</span>
                    <button type="button" onClick={v.lrClearQ} style={{ marginTop: "6px", height: "40px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }}>{"Clear search"}</button>
                  </div>
                ) : null}
                {v.lrTpls.map(t => <TemplateCard key={t.id} t={t} />)}
              </div>
            </div>
          </>)}
        </>)}
      </div>
    </div>
  );
}
