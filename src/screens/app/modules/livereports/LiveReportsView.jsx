import React from 'react';

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
      <div style={{ padding: "8px 0 64px" }}>
        <article className="clario-print" style={{ width: "100%", maxWidth: "816px", margin: "0 auto", background: "#ffffff", boxShadow: "0 1px 2px rgba(11,22,38,.06)" }}>
          <div style={{ height: "8px", background: v.lrColor }}></div>
          <div style={{ padding: "48px clamp(24px,7vw,72px) 72px", display: "flex", flexDirection: "column", gap: "22px", fontSize: "17px", lineHeight: "1.65", color: "#0b1626" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", fontSize: "14px", color: "#5a6474" }}>
              <strong style={{ color: "#0b1626", fontSize: "16px" }}>{v.lrAgency}</strong><span>{v.lrPeriod}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <input aria-label="Report title" value={v.lrTitle} onChange={v.lrSetTitle} style={{ ...field, fontSize: "14px", fontWeight: "600", color: "#5a6474" }} />
              <Part p={v.lrHeadlineP}><textarea aria-label="Headline" rows={1} value={v.lrHeadline} onChange={v.lrSetHeadline} style={{ ...field, fontSize: "34px", fontWeight: "700", letterSpacing: "-1px", lineHeight: "1.2" }} /></Part>
              <span style={{ fontSize: "15px", color: "#5a6474" }}>{"Prepared for " + v.lrClientName}</span>
            </div>
            <Part p={v.lrSummaryP}><textarea aria-label="Summary" value={v.lrSummary} onChange={v.lrSetSummary} style={{ ...field, fontSize: "18px" }} /></Part>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "8px" }}>
              {v.lrKpis.map(k => (
                <div key={k.label} style={{ background: "#f4f7fb", padding: "12px 14px", display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                  <span style={{ fontSize: "13px", color: "#5a6474" }}>{k.label}</span>
                  <span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: k.c }}>{k.note}</span>
                </div>
              ))}
            </div>
            <figure style={{ margin: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
              <figcaption style={{ fontSize: "15px", fontWeight: "700" }}>{"Sessions per day"}</figcaption>
              <svg viewBox="0 0 600 160" preserveAspectRatio="none" role="img" aria-label="Sessions per day this period, with the previous period dashed" style={{ width: "100%", height: "160px", display: "block" }}>
                <path d={v.lrArea} fill={v.lrColor + "1f"}></path>
                <path d={v.lrPrevLine} fill="none" stroke="#97a2b2" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke"></path>
                <path d={v.lrLine} fill="none" stroke={v.lrColor} strokeWidth="2.5" vectorEffect="non-scaling-stroke"></path>
              </svg>
              <span style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5a6474" }}><span>{v.lrFrom}</span><span>{"Dashed: previous period"}</span><span>{v.lrTo}</span></span>
            </figure>
            {v.lrSections.map((s, i) => (
              <section key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Part p={s.headingP}><span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input aria-label="Section heading" value={s.heading} onChange={s.setHeading} style={{ ...field, fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }} />
                  <button type="button" onClick={s.remove} aria-label={"Remove section " + s.heading} style={{ flex: "none", width: "44px", height: "44px", border: "0", background: "transparent", color: "#97a2b2", cursor: "pointer" }}>{"×"}</button>
                </span></Part>
                <Part p={s.bodyP}><textarea aria-label={s.heading} value={s.body} onChange={s.setBody} style={field} /></Part>
              </section>
            ))}
            {v.lrHasChannels ? (
              <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h2 style={{ margin: "0", fontSize: "22px", letterSpacing: "-0.5px" }}>{"Where visitors came from"}</h2>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px", fontVariantNumeric: "tabular-nums" }}>
                  <thead><tr style={{ color: "#5a6474", fontSize: "13px" }}><th style={{ textAlign: "left", fontWeight: "600", padding: "6px 0" }}>{"Channel"}</th><th style={{ textAlign: "right", fontWeight: "600" }}>{"Sessions"}</th><th style={{ textAlign: "right", fontWeight: "600" }}>{"Change"}</th><th style={{ textAlign: "right", fontWeight: "600" }}>{"Leads"}</th></tr></thead>
                  <tbody>{v.lrChannels.map(c => <tr key={c.name} style={{ borderTop: "1px solid #eef1f6" }}><td style={{ padding: "8px 0", fontWeight: "600" }}>{c.name}</td><td style={{ textAlign: "right" }}>{c.sessions}</td><td style={{ textAlign: "right", color: c.c, fontWeight: "600" }}>{c.change}</td><td style={{ textAlign: "right" }}>{c.leads}</td></tr>)}</tbody>
                </table>
              </section>
            ) : null}
            <section style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <h2 style={{ margin: "0", fontSize: "22px", letterSpacing: "-0.5px" }}>{"Next steps"}</h2>
              <ol style={{ margin: "0", paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {v.lrSteps.map((s, i) => (
                  <li key={i}><Part p={s.p}><span style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <textarea aria-label={"Next step " + (i + 1)} rows={1} value={s.text} onChange={s.set} style={field} />
                    <button type="button" onClick={s.remove} aria-label={"Remove step " + (i + 1)} style={{ flex: "none", width: "44px", height: "36px", border: "0", background: "transparent", color: "#97a2b2", cursor: "pointer" }}>{"×"}</button>
                  </span></Part></li>
                ))}
              </ol>
            </section>
            <div className="clario-noprint" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button type="button" onClick={v.lrAddSection} style={btn}>{"Add section"}</button>
              <button type="button" onClick={v.lrAddStep} style={btn}>{"Add next step"}</button>
            </div>
            <span style={{ fontSize: "13px", color: "#5a6474" }}>{v.lrSource}</span>
          </div>
        </article>
      </div>
    </>
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

export function LiveReportsOverlay({ v }) {
  if (!v.lrModal) return null;
  return (
    <div onClick={v.lrBackdrop} style={{ position: "fixed", inset: "0", zIndex: "70", background: "rgba(11,22,38,.45)", display: "grid", placeItems: "center", padding: "24px" }}>
      <form role="dialog" aria-modal="true" aria-labelledby={v.lrWriting ? undefined : "lr-title"} aria-label={v.lrWriting ? v.lrWritingTitle : undefined} onSubmit={v.lrWrite} noValidate style={{ width: "min(520px,100%)", maxHeight: "calc(100vh - 48px)", overflowY: "auto", background: "#ffffff", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 30px 80px -30px rgba(11,22,38,.5)" }}>
        {v.lrWriting ? <Writing v={v} /> : (<>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h2 id="lr-title" style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>{"Write a report"}</h2>
            <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>{v.lrCanWrite ? "Analyst reads the client's Google Analytics numbers and writes a draft for you to review before it goes anywhere." : v.lrNoDataText}</p>
          </div>
          <button type="button" onClick={v.lrClose} aria-label="Close" style={{ flex: "none", width: "44px", height: "44px", margin: "-10px -10px 0 0", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#45505f" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
        </div>
        {v.lrCanWrite ? (<>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "600" }}>{"Client"}</span>
            <select autoFocus value={v.lrClient} onChange={v.lrSetClient} disabled={v.lrBusy} style={select}>{v.lrClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: "600" }}>{"Period"}</span>
            <select value={v.lrDays} onChange={v.lrSetDays} disabled={v.lrBusy} style={select}>{v.lrDaysOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
          </label>
        </>) : null}
        {v.lrHasErr ? <span role="alert" style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>{v.lrErr}</span> : null}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button type="button" onClick={v.lrClose} disabled={v.lrBusy} style={{ height: "48px", padding: "0 18px", border: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }}>{"Cancel"}</button>
          {v.lrCanWrite
            ? <button type="submit" disabled={v.lrBusy} style={{ height: "48px", padding: "0 22px", border: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", opacity: v.lrBusy ? 0.8 : 1 }} className="dc9482609">{v.lrWriteLabel}</button>
            : <button type="button" onClick={v.lrGoInt} style={{ height: "48px", padding: "0 22px", border: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">{"Open integrations"}</button>}
        </div>
        </>)}
      </form>
    </div>
  );
}
