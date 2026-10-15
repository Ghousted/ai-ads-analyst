import React from 'react';
import ReportEditor from './ReportEditor';

const btn = { height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", whiteSpace: "nowrap" };
const primary = { ...btn, border: "0", background: "#1f6be2", color: "#ffffff" };
const select = { height: "44px", padding: "0 36px 0 14px", border: "0", borderRadius: "0", background: "#eef1f6 url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235a6474%22 stroke-width=%222.6%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>') right 12px center no-repeat", appearance: "none", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" };
// Text the agency edits in place: looks like the report, not like a form.
const field = { width: "100%", padding: "4px 6px", margin: "0 -6px", border: "1px solid transparent", borderRadius: "0", background: "transparent", font: "inherit", letterSpacing: "inherit", color: "inherit", resize: "none", outline: "none", fieldSizing: "content" };

const COLS = 'minmax(0,1.6fr) minmax(0,1.2fr) minmax(0,1fr) 90px 110px';

export function LiveReportsView({ v }) {
  if (v.lrList) return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <section aria-labelledby="lr-tpl-h" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h2 id="lr-tpl-h" style={{ margin: "0", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.4px" }}>{"Write a report"}</h2>
          <span style={{ color: "#5a6474", textWrap: "pretty" }}>{"Pick a template and Analyst writes it from the client’s numbers, or start blank. You can change everything after."}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div role="tablist" aria-label="Template categories" style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {(v.lrCats || []).map(c => (
              <button key={c.label} type="button" role="tab" aria-selected={c.aria ? "true" : "false"} onClick={c.pick} style={{ display: "flex", alignItems: "center", gap: "8px", height: "44px", padding: "0 14px", border: "0", borderRadius: "0", background: c.bg, font: "inherit", fontSize: "15px", fontWeight: c.fw, letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dc20c6b10">
                <span>{c.label}</span><span style={{ fontSize: "13px", fontWeight: "500", color: "#97a2b2" }}>{c.count}</span>
              </button>
            ))}
          </div>
          <label style={{ position: "relative", display: "block", flex: "0 1 260px" }}>
            <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>{"Search templates"}</span>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a6474" strokeWidth="2.4" strokeLinecap="round" style={{ position: "absolute", left: "12px", top: "14px" }}><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>
            <input type="search" value={v.lrQ} onChange={v.lrSetQ} placeholder="Search templates" style={{ width: "100%", height: "44px", padding: "0 12px 0 36px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "15px", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
          </label>
        </div>
        {v.lrNoMatch ? (
          <div style={{ padding: "32px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" }}>
            <span style={{ fontWeight: "700" }}>{"No templates match \"" + v.lrQ + "\""}</span>
            <span style={{ color: "#5a6474" }}>{"Try another word, or start from Blank."}</span>
            <button type="button" onClick={v.lrClearQ} style={{ ...btn, marginTop: "6px", height: "40px", padding: "0 14px", fontSize: "14px" }} className="dce60d758">{"Clear search"}</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,240px),1fr))", gap: "16px" }}>
            {(v.lrTpls || []).map(t => <TemplateCard key={t.id} t={t} />)}
          </div>
        )}
      </section>
      <section aria-labelledby="lr-recent-h" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 id="lr-recent-h" style={{ margin: "0", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.4px" }}>{"Recent reports"}</h2>
        <div style={{ background: "#ffffff", display: "flex", flexDirection: "column" }}>
          {v.lrNoReports ? (
            <div style={{ padding: "32px 22px", color: "#5a6474" }}>{"No reports yet. Pick a template above and Analyst drafts one from the client’s real numbers for you to review."}</div>
          ) : (<>
            <div role="row" style={{ display: "grid", gridTemplateColumns: COLS, gap: "16px", padding: "10px 22px", background: "#f4f7fb", fontSize: "13px", fontWeight: "600", color: "#5a6474" }}>
              <span role="columnheader">{"Report"}</span><span role="columnheader">{"Period"}</span><span role="columnheader">{"Client"}</span><span role="columnheader">{"Status"}</span><span role="columnheader" style={{ textAlign: "right" }}>{"Written"}</span>
            </div>
          {v.lrRows.map((r, i) => (
            <button key={i} role="row" onClick={r.open} style={{ display: "grid", gridTemplateColumns: COLS, gap: "16px", alignItems: "center", minHeight: "60px", padding: "10px 22px", border: "0", borderTop: i ? "1px solid #eef1f6" : "0", borderRadius: "0", background: "#ffffff", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }} className="dcbbe0dc7">
              <span style={{ fontWeight: "600", minWidth: "0", overflowWrap: "anywhere" }}>{r.title}</span>
              <span style={{ fontSize: "15px", color: "#45505f", minWidth: "0", fontVariantNumeric: "tabular-nums" }}>{r.period}</span>
              <span style={{ fontSize: "15px", color: "#45505f", minWidth: "0", overflowWrap: "anywhere" }}>{r.client}</span>
              <span><span style={{ padding: "3px 10px", background: r.pBg, color: r.pC, fontSize: "13px", fontWeight: "600" }}>{r.status}</span></span>
              <span style={{ fontSize: "14px", color: "#5a6474", textAlign: "right" }}>{r.date}</span>
            </button>
          ))}
          </>)}
        </div>
      </section>
    </div>
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
      <ReportEditor key={v.lrEditor.docKey} {...v.lrEditor}
        lead={(<>
          <button onClick={v.lrBack} style={{ display: "flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 10px 0 4px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"></path></svg>{"Reports"}
          </button>
          <span style={{ padding: "3px 10px", background: "#eef1f6", color: "#45505f", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>{v.lrStatus}</span>
          <span aria-hidden="true" style={{ width: "1px", height: "24px", margin: "0 6px", background: "#e6ebf2" }}></span>
        </>)}
        actions={(<>
          {v.lrToast ? <span role="status" style={{ fontSize: "14px", fontWeight: "600", color: "#1d6b3a", whiteSpace: "nowrap" }}>{v.lrToastText}</span> : null}
          <button onClick={v.lrDelete} style={{ ...btn, height: "40px", padding: "0 14px", fontSize: "14px", color: "#a3330c" }} className="dce60d758">{v.lrDeleteLabel}</button>
          <button onClick={v.lrPdf} style={{ ...btn, height: "40px", padding: "0 14px", fontSize: "14px" }} className="dce60d758">{"Download PDF"}</button>
          {v.lrDirty ? <button onClick={v.lrDiscard} style={{ ...btn, height: "40px", padding: "0 14px", fontSize: "14px" }} className="dce60d758">{"Discard edits"}</button> : null}
          <button onClick={v.lrSave} disabled={!v.lrDirty || v.lrSaving} style={{ ...primary, height: "40px", padding: "0 16px", fontSize: "14px", opacity: v.lrDirty ? 1 : 0.5, cursor: v.lrDirty ? "pointer" : "default" }} className="dc9482609">{v.lrSaving ? "Saving\u2026" : v.lrDirty ? "Save changes" : "Saved"}</button>
        </>)}
        header={(<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", fontSize: "14px", color: "#5a6474" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>{v.lrLogo ? <img src={v.lrLogo} alt={v.lrAgency + " logo"} style={{ height: "36px", maxWidth: "180px", objectFit: "contain", display: "block" }} /> : null}<strong style={{ color: "#0b1626", fontSize: "16px" }}>{v.lrAgency}</strong></span><span>{v.lrPeriod}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <input aria-label="Report title" value={v.lrTitle} onChange={v.lrSetTitle} style={{ ...field, fontSize: "14px", fontWeight: "600", color: "#5a6474" }} />
            <span style={{ fontSize: "15px", color: "#5a6474" }}>{"Prepared for " + v.lrClientName}</span>
          </div>
        </>)}
        footer={<span style={{ fontSize: "13px", color: "#5a6474" }}>{v.lrSource}</span>} />
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
          {(t.logos || []).map(lg => <span key={lg} aria-hidden="true" style={{ display: "block", width: "20px", height: "20px", background: `url('${lg}') center / contain no-repeat` }}></span>)}
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
      <div role="dialog" aria-modal="true" aria-labelledby={v.lrWriting ? undefined : "lr-title"} aria-label={v.lrWriting ? v.lrWritingTitle : undefined} style={{ width: "min(560px,100%)", maxHeight: "calc(100vh - 48px)", overflowX: "hidden", overflowY: "auto", background: "#ffffff", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 30px 80px -30px rgba(11,22,38,.5)" }}>
        {v.lrWriting ? <Writing v={v} /> : (<>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#5a6474" }}>{v.lrCanWrite ? "New report \u00b7 " + v.lrTplLabel : "New report"}</span>
            <button type="button" onClick={v.lrClose} aria-label="Cancel and go back" style={{ width: "44px", height: "44px", margin: "-10px -10px -10px 0", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#45505f" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
          </div>
          {!v.lrCanWrite ? (<>
            <h2 id="lr-title" style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>{"No client has numbers yet"}</h2>
            <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>{v.lrNoDataText}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" onClick={v.lrClose} style={ghost}>{"Cancel"}</button>
              <button type="button" onClick={v.lrGoInt} style={go} className="dc9482609">{"Open integrations"}</button>
            </div>
          </>) : (
            <form onSubmit={v.lrSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 id="lr-title" style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>{"Which client is this report for?"}</h2>
              {v.lrNoBrand ? (
                <div role="note" style={{ display: "flex", alignItems: "center", gap: "8px 16px", flexWrap: "wrap", padding: "12px 14px", background: "#fff6c2", color: "#5c4400" }}>
                  <span style={{ flex: "1 1 240px", fontSize: "15px", textWrap: "pretty" }}><strong>{"Your reports don’t have your branding yet."}</strong>{" Add your logo and colour once, and every report uses them."}</span>
                  <span style={{ display: "flex", gap: "4px" }}>
                    <button type="button" onClick={v.lrSkipBrand} style={{ height: "40px", padding: "0 10px", border: "0", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#5c4400", cursor: "pointer" }}>{"Not now"}</button>
                    <button type="button" onClick={v.lrSetBrand} style={{ height: "40px", padding: "0 14px", border: "1px solid #5c4400", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#5c4400", cursor: "pointer" }}>{"Set up branding"}</button>
                  </span>
                </div>
              ) : null}
              <div role="radiogroup" aria-label="Client" style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                {(v.lrClients || []).map(c => (
                  <button key={c.id} type="button" role="radio" aria-checked={c.on} onClick={c.pick} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", padding: "8px 14px", border: `1.5px solid ${c.bd}`, borderRadius: "0", background: c.bg, font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ flex: "1", fontWeight: "600" }}>{c.name}</span>
                    {(c.logos || []).map(lg => <span key={lg} aria-hidden="true" style={{ flex: "none", width: "20px", height: "20px", background: `url('${lg}') center / contain no-repeat` }}></span>)}
                  </button>
                ))}
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontWeight: "600" }}>{"Period"}</span>
                <select value={v.lrDays} onChange={v.lrSetDays} style={select}>{(v.lrDaysOpts || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontWeight: "600" }}>{"Report name "}<span style={{ fontWeight: "500", color: "#5a6474" }}>{"(optional)"}</span></span>
                <input type="text" value={v.lrName} onChange={v.lrSetName} maxLength={160} placeholder={v.lrNamePh} style={{ height: "44px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outline: "none" }} className="dc120a618" />
                <span style={{ fontSize: "13px", color: "#5a6474" }}>{"Leave it empty to name it after the period. You can rename it later in the report."}</span>
              </label>
              {v.lrHasErr ? <span role="alert" style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>{v.lrErr}</span> : null}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button type="button" onClick={v.lrClose} style={ghost}>{"Cancel"}</button>
                <button type="submit" disabled={v.lrBusy} style={{ ...go, opacity: v.lrBusy ? 0.6 : 1 }} className="dc9482609">{v.lrGoLabel}</button>
              </div>
            </form>
          )}
        </>)}
      </div>
    </div>
  );
}
