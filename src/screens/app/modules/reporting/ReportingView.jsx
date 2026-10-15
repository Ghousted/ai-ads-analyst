import React from 'react';

export function ReportingView({ v }) {
  // Reporting: templates, report builder, report view and history
  return (
    <>
      {(v.vReports) ? (<>
        {" "}
        <button onClick={v.goTemplates} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px", height: "40px", marginTop: "-12px", padding: "0 10px 0 4px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#1f6be2", cursor: "pointer" }} className="dc228142d">
          <svg aria-hidden={"true"} width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"}>
            <path d={"M15 6l-6 6 6 6"}></path>
          </svg>
          {"Back to reports"}
        </button>
        {" "}
        {(v.rToast) ? (<>
          <span role={"status"} style={{ fontSize: "14px", fontWeight: "600", color: "#1d6b3a" }}>
            {v.rToastText}
          </span>
        </>) : null}
        {" "}
        <div style={{ background: "#ffffff", borderRadius: "0", padding: "6px 0", overflowX: "auto" }}>
          {" "}
          {(v.rEmpty) ? (<>
            <p style={{ margin: "0", padding: "32px 20px", textAlign: "center", color: "#5a6474" }}>
              {"No reports for this client yet. Build one in Report builder."}
            </p>
          </>) : null}
          {" "}
          <table style={{ width: "100%", minWidth: "680px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ fontSize: "13px", color: "#5a6474", textAlign: "left" }}>
                <th style={{ fontWeight: "600", padding: "12px 20px" }}>
                  {"Report"}
                </th>
                <th style={{ fontWeight: "600", padding: "12px 20px" }}>
                  {"Client"}
                </th>
                <th style={{ fontWeight: "600", padding: "12px 20px" }}>
                  {"Date"}
                </th>
                <th style={{ fontWeight: "600", padding: "12px 20px", textAlign: "right" }}>
                  {"Share"}
                </th>
              </tr>
            </thead>
            <tbody>
              {((v.rRows) || []).map((r, $index) => (
                <React.Fragment key={$index}>
                  <tr onClick={r?.open} tabIndex={"0"} onKeyDown={r?.key} style={{ borderTop: "1px solid #eef1f6", cursor: "pointer", transition: "background-color 120ms ease" }} className="dc6f15efc">
                    <td style={{ padding: "12px 20px" }}>
                      <span style={{ fontWeight: "600" }}>
                        {r?.name}
                      </span>
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      {r?.client}
                    </td>
                    <td style={{ padding: "12px 20px", color: "#45505f", whiteSpace: "nowrap" }}>
                      {r?.date}
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <span style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        {" "}
                        <button onClick={r?.link} style={{ display: "flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 12px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", whiteSpace: "nowrap" }} className="dce60d758">
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"}></path>
                          </svg>
                          {"Copy link"}
                        </button>
                        {" "}
                        <button onClick={r?.pdf} style={{ display: "flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 12px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", whiteSpace: "nowrap" }} className="dce60d758">
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M12 4v11M7 10l5 5 5-5M5 20h14"}></path>
                          </svg>
                          {"PDF"}
                        </button>
                        {" "}
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {" "}
        </div>
        {" "}
      </>) : null}
      {(v.vTplPage) ? (<>
        {" "}
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {" "}
          <nav aria-label={"Template categories"} style={{ marginLeft: "-12px", flex: "0 0 180px", position: "sticky", top: "24px", alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: "2px", background: "#f4f7fb" }}>
            {" "}
            <label style={{ position: "relative", display: "block", marginBottom: "8px" }}>
              <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                {"Search templates"}
              </span>
              <svg aria-hidden={"true"} width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#5a6474"} strokeWidth={"2.4"} strokeLinecap={"round"} style={{ position: "absolute", left: "12px", top: "14px" }}>
                <circle cx={"11"} cy={"11"} r={"7"}></circle>
                <path d={"M20 20l-3.5-3.5"}></path>
              </svg>
              <input type={"search"} value={(v.tpQ) ?? ""} onChange={v.tpSetQ} placeholder={"Search templates"} style={{ width: "100%", height: "44px", padding: "0 12px 0 36px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", fontSize: "15px", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
            </label>
            {" "}
            {((v.tpCats) || []).map((c, $index) => (
              <React.Fragment key={$index}>
                <button onClick={c?.pick} aria-current={c?.aria} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", minHeight: "42px", padding: "0 12px", border: "0", borderRadius: "0", background: c?.bg, font: "inherit", fontSize: "16px", fontWeight: c?.fw, letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left", transition: "background-color 120ms ease" }} className="dcf0b705f">
                  <span>
                    {c?.label}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#97a2b2" }}>
                    {c?.count}
                  </span>
                </button>
              </React.Fragment>
            ))}
            {" "}
            <button onClick={v.goHistory} style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "42px", marginTop: "10px", padding: "10px 12px 0", border: "0", borderTop: "1px solid #e6ebf2", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "16px", fontWeight: "500", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }} className="dc467ff26">
              <svg aria-hidden={"true"} width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#5a6474"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                <path d={"M3 12a9 9 0 1 0 3-6.7L3 8"}></path>
                <path d={"M3 3v5h5"}></path>
                <path d={"M12 7v5l3 2"}></path>
              </svg>
              <span style={{ flex: "1" }}>
                {"History"}
              </span>
              <span style={{ fontSize: "13px", fontWeight: "500", color: "#97a2b2" }}>
                {v.histCount}
              </span>
            </button>
            {" "}
          </nav>
          {" "}
          <div role={"radiogroup"} aria-label={"Report template"} style={{ flex: "1", minWidth: "260px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,240px),1fr))", gap: "20px", alignContent: "start" }}>
            {" "}
            {(v.tpNoMatch) ? (<>
              <div style={{ gridColumn: "1 / -1", padding: "48px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" }}>
                <span style={{ fontWeight: "700" }}>
                  {"No templates match \""}{v.tpQ}{"\""}
                </span>
                <span style={{ color: "#5a6474" }}>
                  {"Try another word, or start from Blank."}
                </span>
                <button onClick={v.tpClearQ} style={{ marginTop: "6px", height: "40px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }}>
                  {"Clear search"}
                </button>
              </div>
            </>) : null}
            {" "}
            {((v.tpTpls) || []).map((t, $index) => (
              <React.Fragment key={$index}>
                {" "}
                <div role={"radio"} tabIndex={"0"} aria-checked={t?.on} aria-label={t?.label} onClick={t?.pick} onDoubleClick={t?.create} style={{ display: "flex", flexDirection: "column", borderRadius: "0", overflow: "hidden", background: "#ffffff", outline: `2px solid ${t?.bd ?? ""}`, outlineOffset: "-2px", boxShadow: "0 1px 2px rgba(11,22,38,.06),0 8px 24px -16px rgba(11,22,38,.25)", cursor: "pointer", transition: "outline-color 160ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1)" }} className="dcf4597a3">
                  {" "}
                  <span aria-hidden={"true"} style={{ display: "block", height: "150px", background: "#eef1fd", padding: "16px 18px 0", overflow: "hidden" }}>
                    {" "}
                    <span style={{ display: "flex", flexDirection: "column", gap: "6px", height: "100%", background: "#ffffff", borderRadius: "0 0 0", padding: "10px", boxShadow: "0 0 0 1px #e6e9f8" }}>
                      {" "}
                      {((t?.prev) || []).map((p, $index) => (
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
                  <span style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "16px 18px 18px", flex: "1" }}>
                    {" "}
                    <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px", fontWeight: "600", letterSpacing: "-0.3px", lineHeight: "1.3" }}>
                        {t?.label}
                        {(t?.custom) ? (<>
                          <span style={{ padding: "1px 8px", borderRadius: "0", background: "#eef3fd", color: "#1f6be2", fontSize: "12px", fontWeight: "600" }}>
                            {"Custom"}
                          </span>
                        </>) : null}
                      </span>
                      {(t?.sug) ? (<>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "#1f6be2" }}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"#1f6be2"} aria-hidden={"true"}>
                            <path d={"M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5z"}></path>
                          </svg>
                          {t?.why}
                        </span>
                      </>) : null}
                      <span style={{ fontSize: "14px", color: "#5a6474", lineHeight: "1.4" }}>
                        {t?.desc}
                      </span>
                    </span>
                    {" "}
                    <span style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "20px", marginTop: "auto" }}>
                      {((t?.logos) || []).map((lg, $index) => (
                        <React.Fragment key={$index}>
                          <span aria-hidden={"true"} style={{ display: "block", width: "20px", height: "20px", background: `url('${lg ?? ""}') center / contain no-repeat` }}></span>
                        </React.Fragment>
                      ))}
                    </span>
                    {" "}
                    <button type={"button"} onClick={t?.create} style={{ alignSelf: "flex-start", height: "40px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", transition: "border-color 160ms ease,background-color 160ms ease" }} className="dce60d758">
                      {"Use template"}
                    </button>
                    {" "}
                  </span>
                  {" "}
                </div>
                {" "}
              </React.Fragment>
            ))}
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </>) : null}
      {(v.vRepView) ? (<>
        {" "}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {" "}
          <button onClick={v.goReports} style={{ display: "flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 12px 0 8px", marginLeft: "-8px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcdda73d1">
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"}>
              <path d={"M15 18l-6-6 6-6"}></path>
            </svg>
            {"Reports"}
          </button>
          {" "}
          <span style={{ padding: "3px 10px", borderRadius: "0", background: v.rvPBg, color: v.rvPC, fontSize: "13px", fontWeight: "600" }}>
            {v.rvStatus}
          </span>
          {" "}
          <span style={{ fontSize: "14px", color: "#5a6474" }}>
            {v.rvDate}
          </span>
          {" "}
          <span style={{ flex: "1" }}></span>
          {" "}
          {(v.rvToast) ? (<>
            <span role={"status"} style={{ fontSize: "14px", fontWeight: "600", color: "#1d6b3a" }}>
              {v.rvToastText}
            </span>
          </>) : null}
          {" "}
          <button onClick={v.rvLink} style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
            {"Copy link"}
          </button>
          {" "}
          <button onClick={v.rvPdf} style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
            {"Download PDF"}
          </button>
          {" "}
          <button onClick={v.rvEdit} style={{ display: "flex", alignItems: "center", gap: "8px", height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
              <path d={"M4 20h4L19 9l-4-4L4 16z"}></path>
            </svg>
            {"Edit report"}
          </button>
          {" "}
        </div>
        {" "}
        <div style={{ padding: "8px 0 64px" }}>
          {" "}
          <article className="clario-print" style={{ position: "relative", width: "100%", maxWidth: "816px", minHeight: "900px", margin: "0 auto", background: "#ffffff", borderRadius: "0", boxShadow: "0 1px 3px rgba(11,22,38,.12),0 24px 48px -28px rgba(11,22,38,.35)", overflow: "clip" }}>
            {" "}
            <div style={{ height: "8px", background: v.wlColor }}></div>
            {" "}
            <div ref={v.viewRef} style={{ padding: "56px clamp(24px,7vw,80px) 96px", fontSize: "17px", lineHeight: "1.65", color: "#0b1626" }}></div>
            {" "}
          </article>
          {" "}
        </div>
        {" "}
      </>) : null}
      {(v.vBuilder) ? (<>
        {" "}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {" "}
          <button onClick={v.goReports} style={{ display: "flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 12px 0 8px", marginLeft: "-8px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcdda73d1">
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"}>
              <path d={"M15 18l-6-6 6-6"}></path>
            </svg>
            {"Reports"}
          </button>
          {" "}
          <span style={{ flex: "1" }}></span>
          {" "}
          {(v.rbToast) ? (<>
            <span role={"status"} style={{ fontSize: "14px", fontWeight: "600", color: "#1d6b3a" }}>
              {v.rbToastText}
            </span>
          </>) : null}
          {" "}
          <button onClick={v.rbTplToggle} style={{ height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
            {"Save as template"}
          </button>
          {" "}
          <button onClick={v.rbSend} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
            {v.rbSendLabel}
          </button>
          {" "}
        </div>
        {" "}
        {(v.rbTplOpen) ? (<>
          {" "}
          <form onSubmit={v.tplSave} noValidate={true} style={{ display: "flex", alignItems: "flex-start", gap: "10px", flexWrap: "wrap", padding: "14px", borderRadius: "0", background: "#ffffff" }}>
            {" "}
            <label style={{ flex: "1", minWidth: "240px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {"Template name"}
              </span>
              <input value={(v.tplName) ?? ""} onChange={v.tplSetName} placeholder={"e.g. Monthly dental summary"} style={{ height: "44px", padding: "0 14px", border: `1px solid ${v.tplBd ?? ""}`, borderRadius: "0", font: "inherit", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
              {(v.tplErrOn) ? (<>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#a3330c" }}>
                  {"Give the template a name so you can find it later."}
                </span>
              </>) : null}
              {(v.tplOk) ? (<>
                <span role={"status"} style={{ fontSize: "13px", fontWeight: "600", color: "#1d6b3a" }}>
                  {v.tplOkText}
                </span>
              </>) : null}
            </label>
            {" "}
            <button type={"submit"} style={{ marginTop: "26px", height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "#0b1626", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }}>
              {"Save layout and branding"}
            </button>
            {" "}
          </form>
          {" "}
        </>) : null}
        {" "}
        <div style={{ position: "sticky", top: "0", zIndex: "20", margin: "-8px -8px 0", padding: "8px", background: "#f4f7fb" }}>
          {" "}
          <div style={{ background: "#ffffff", borderRadius: "0", boxShadow: "0 1px 2px rgba(11,22,38,.05),0 10px 24px -18px rgba(11,22,38,.25)" }}>
            {" "}
            <div role={"tablist"} aria-label={"Editor tabs"} style={{ display: "flex", gap: "2px", padding: "4px 10px 0", borderBottom: "1px solid #eef1f6", overflowX: "auto" }}>
              {" "}
              {((v.rbTabs) || []).map((t, $index) => (
                <React.Fragment key={$index}>
                  <button role={"tab"} aria-selected={t?.on} onClick={t?.pick} style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", padding: "0 14px", border: "0", borderBottom: `2px solid ${t?.line ?? ""}`, background: "transparent", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: t?.c, cursor: "pointer", whiteSpace: "nowrap", transition: "color 140ms ease" }}>
                    {(t?.ai) ? (<>
                      <img src={"/assets/clario-mark-v2.png"} alt={""} width={"16"} height={"16"} style={{ width: "16px", height: "16px" }} />
                    </>) : null}
                    {t?.label}
                  </button>
                </React.Fragment>
              ))}
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", minHeight: "68px", padding: "6px 10px" }}>
              {" "}
              {(v.rbTabHome) ? (<>
                {" "}
                {((v.docTools) || []).map((t, $index) => (
                  <React.Fragment key={$index}>
                    {" "}
                    {(t?.sep) ? (<>
                      <span aria-hidden={"true"} style={{ width: "1px", height: "28px", margin: "0 6px", background: "#e6ebf2" }}></span>
                    </>) : null}
                    {" "}
                    {(t?.btn) ? (<>
                      <button type={"button"} onMouseDown={t?.down} aria-label={t?.aria} title={t?.aria} style={{ minWidth: "40px", height: "40px", padding: "0 10px", border: "0", borderRadius: "0", background: "transparent", display: "grid", placeItems: "center", font: "inherit", fontSize: "15px", fontWeight: t?.fw, fontStyle: t?.fs, textDecoration: t?.td, letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dcceddbc1">
                        {t?.label}
                      </button>
                    </>) : null}
                    {" "}
                  </React.Fragment>
                ))}
                {" "}
              </>) : null}
              {" "}
              {(v.rbTabInsert) ? (<>
                {" "}
                {((v.rbCatalog) || []).map((w, $index) => (
                  <React.Fragment key={$index}>
                    <button type={"button"} onMouseDown={w?.keep} onClick={w?.add} title={w?.desc} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", minWidth: "64px", height: "56px", padding: "0 10px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "12px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dcceddbc1">
                      <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={w?.icon}></path>
                      </svg>
                      {w?.label}
                    </button>
                  </React.Fragment>
                ))}
                {" "}
              </>) : null}
              {" "}
              {(v.rbTabDesign) ? (<>
                {" "}
                <label style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px", height: "48px", padding: "0 12px", border: "1px dashed #b8c4d4", borderRadius: "0", cursor: "pointer" }} className="dc047ba64">
                  {(v.wlHasLogo) ? (<>
                    <span role={"img"} aria-label={"Your logo"} style={{ display: "block", height: "28px", width: "70px", background: `url('${v.wlLogo ?? ""}') left center / contain no-repeat` }}></span>
                  </>) : null}
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#45505f" }}>
                    {v.wlLogoLabel}
                  </span>
                  <input type={"file"} accept={"image/*"} onChange={v.wlPickLogo} style={{ position: "absolute", width: "1px", height: "1px", opacity: "0" }} />
                </label>
                {" "}
                <span aria-hidden={"true"} style={{ width: "1px", height: "28px", margin: "0 8px", background: "#e6ebf2" }}></span>
                {" "}
                <span style={{ fontSize: "14px", fontWeight: "600", marginRight: "4px" }}>
                  {"Colour"}
                </span>
                {" "}
                <span role={"radiogroup"} aria-label={"Brand colour"} style={{ display: "flex", gap: "6px" }}>
                  {((v.wlColors) || []).map((cl, $index) => (
                    <React.Fragment key={$index}>
                      <button type={"button"} role={"radio"} aria-checked={cl?.on} aria-label={cl?.hex} onClick={cl?.pick} style={{ width: "40px", height: "40px", borderRadius: "50%", border: `3px solid ${cl?.ring ?? ""}`, background: "#ffffff", padding: "3px", cursor: "pointer" }}>
                        <span style={{ display: "block", width: "100%", height: "100%", borderRadius: "50%", background: cl?.hex }}></span>
                      </button>
                    </React.Fragment>
                  ))}
                </span>
                {" "}
                <span aria-hidden={"true"} style={{ width: "1px", height: "28px", margin: "0 8px", background: "#e6ebf2" }}></span>
                {" "}
                <label style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1", minWidth: "240px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap" }}>
                    {"Send from"}
                  </span>
                  <input value={(v.wlDomain) ?? ""} onChange={v.wlSetDomain} style={{ flex: "1", minWidth: "0", height: "40px", padding: "0 12px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", fontSize: "15px", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
                </label>
                {" "}
                <button type={"button"} onClick={v.wlVerify} disabled={v.wlVerOk} style={{ height: "40px", padding: "0 14px", border: v.wlVerOk ? "0" : "1px solid #d3dbe6", borderRadius: "0", background: v.wlVerOk ? "#e3f3e8" : "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: v.wlVerOk ? "#1d6b3a" : "#0b1626", cursor: v.wlVerOk ? "default" : "pointer", whiteSpace: "nowrap" }}>
                  {v.wlVerLabel}
                </button>
                {(v.wlVerOk) ? null : (
                  <span style={{ flexBasis: "100%", fontSize: "14px", color: "#5a6474" }}>
                    {v.wlVerNote}
                  </span>
                )}
                {(v.wlVerRecs) ? (
                  <div style={{ flexBasis: "100%", display: "flex", flexDirection: "column", gap: "6px", padding: "12px 14px", background: "#f4f7fb", fontSize: "14px" }}>
                    <span style={{ fontWeight: "600" }}>
                      {"Add these DNS records for "}{v.wlVerDom}{", then check them."}
                    </span>
                    {((v.wlVerRows) || []).map((r, $index) => (
                      <span key={$index} style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr) minmax(0,1.3fr)", gap: "12px", fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}>
                        <span style={{ fontWeight: "600" }}>{r.type}</span>
                        <span>{r.host}</span>
                        <span style={{ color: "#45505f" }}>{r.value}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
                {" "}
              </>) : null}
              {" "}
              {(v.rbTabAi) ? (<>
                {" "}
                <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "8px", padding: "4px 0" }}>
                  {" "}
                  <form onSubmit={v.rbAsk} style={{ display: "flex", gap: "8px" }}>
                    {" "}
                    <input value={(v.rbInput) ?? ""} onChange={v.rbSetInput} aria-label={"Ask Clario to change the report"} placeholder={"Ask Clario to write, shorten or add something"} style={{ flex: "1", minWidth: "0", height: "44px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", fontSize: "15px", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
                    {" "}
                    <button type={"submit"} aria-label={"Send"} style={{ flex: "none", width: "44px", height: "44px", border: "0", borderRadius: "0", background: "#1f6be2", display: "grid", placeItems: "center", cursor: "pointer" }} className="dc9482609">
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                        <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                      </svg>
                    </button>
                    {" "}
                  </form>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    {" "}
                    {((v.rbIdeas) || []).map((ci, $index) => (
                      <React.Fragment key={$index}>
                        <button type={"button"} onMouseDown={ci?.keep} onClick={ci?.use} style={{ minHeight: "34px", padding: "0 12px", border: "1px solid #e6ebf2", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "13px", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dc83474c9">
                          {ci?.label}
                        </button>
                      </React.Fragment>
                    ))}
                    {" "}
                    {(v.rbTyping) ? (<>
                      <span style={{ fontSize: "14px", color: "#5a6474", marginLeft: "6px" }}>
                        <span style={{ color: "#1f6be2" }}>
                          {"Clario"}
                        </span>
                        {" is editing the report…"}
                      </span>
                    </>) : null}
                    {" "}
                    {(v.rbLastOn) ? (<>
                      <span role={"status"} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", color: "#1d6b3a", marginLeft: "6px" }}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        {v.rbLast}
                      </span>
                    </>) : null}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </>) : null}
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        <div style={{ padding: "8px 0 64px" }}>
          {" "}
          {(v.rbFilledOn) ? (<>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", maxWidth: "816px", margin: "0 auto 16px", padding: "8px 12px", borderRadius: "0", background: "#e3f3e8", fontSize: "14px", color: "#1d6b3a" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2f9e5b" }}></span>
              <span style={{ flex: "1", minWidth: "200px" }}>
                {"Filled with numbers from "}{v.rbFilledFor}{" · settled data up to Oct 5"}
              </span>
              <button onClick={v.rbRefresh} style={{ height: "32px", padding: "0 10px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: "700", letterSpacing: "inherit", color: "#1d6b3a", cursor: "pointer" }} className="dc7a04906">
                {"Refresh numbers"}
              </button>
            </div>
          </>) : null}
          {" "}
          <article className="clario-print" onMouseDown={v.pageDown} style={{ position: "relative", width: "100%", maxWidth: "816px", minHeight: "1056px", margin: "0 auto", background: "#ffffff", borderRadius: "0", boxShadow: "0 1px 3px rgba(11,22,38,.12),0 24px 48px -28px rgba(11,22,38,.35)", overflow: "clip", cursor: "text" }}>
            {" "}
            {(v.rbGen) ? (<>
              <div role={"status"} style={{ position: "absolute", inset: "0", zIndex: "5", background: "rgba(255,255,255,.94)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", textAlign: "center", padding: "24px" }}>
                <span style={{ position: "relative", width: "48px", height: "48px" }}>
                  <span style={{ position: "absolute", inset: "0", borderRadius: "50%", border: "3px solid #e6ebf2", borderTopColor: "#1f6be2", animation: "clario-spin 800ms linear infinite" }}></span>
                  <img src={"/assets/clario-mark-v2.png"} alt={""} width={"28"} height={"28"} style={{ position: "absolute", inset: "10px", width: "28px", height: "28px" }} />
                </span>
                <span style={{ fontWeight: "700" }}>
                  {"Filling in "}{v.rbFilledFor}{"'s numbers"}
                </span>
                <span style={{ fontSize: "15px", color: "#5a6474" }}>
                  {"Pulling the latest results from every connected account."}
                </span>
              </div>
            </>) : null}
            {" "}
            <div style={{ height: "8px", background: v.wlColor }}></div>
            {" "}
            <div style={{ padding: "56px clamp(24px,7vw,80px) 96px" }}>
              {" "}
              {(v.wlHasLogo) ? (<>
                <span role={"img"} aria-label={"Your logo"} style={{ display: "block", height: "32px", width: "120px", marginBottom: "20px", background: `url('${v.wlLogo ?? ""}') left center / contain no-repeat` }}></span>
              </>) : null}
              {" "}
              <div ref={v.docRef} contentEditable={"true"} spellCheck={"true"} role={"textbox"} aria-multiline={"true"} aria-label={"Report document"} onInput={v.docInput} onClick={v.docClick} onKeyDown={v.docKey} onDragStart={v.docDragStart} onDragOver={v.docDragOver} onDrop={v.docDrop} onDragEnd={v.docDragEnd} onContextMenu={v.docCtx} style={{ outline: "none", minHeight: "820px", display: "flow-root", fontSize: "17px", lineHeight: "1.65", color: "#0b1626", caretColor: "#1f6be2" }} suppressContentEditableWarning></div>
              {" "}
            </div>
            {" "}
            <div ref={v.selRef} aria-hidden={"true"} onPointerDown={v.selHandleDown} style={{ position: "absolute", display: "none", border: "2px solid #1f6be2", borderRadius: "0", pointerEvents: "none", zIndex: "6" }}>
              <span data-dir={"nw"} style={{ position: "absolute", top: "-7px", left: "-7px", width: "12px", height: "12px", borderRadius: "0", background: "#ffffff", border: "2px solid #1f6be2", pointerEvents: "auto", cursor: "nwse-resize" }}></span>
              <span data-dir={"ne"} style={{ position: "absolute", top: "-7px", right: "-7px", width: "12px", height: "12px", borderRadius: "0", background: "#ffffff", border: "2px solid #1f6be2", pointerEvents: "auto", cursor: "nesw-resize" }}></span>
              <span data-dir={"sw"} style={{ position: "absolute", bottom: "-7px", left: "-7px", width: "12px", height: "12px", borderRadius: "0", background: "#ffffff", border: "2px solid #1f6be2", pointerEvents: "auto", cursor: "nesw-resize" }}></span>
              <span data-dir={"se"} style={{ position: "absolute", bottom: "-7px", right: "-7px", width: "12px", height: "12px", borderRadius: "0", background: "#ffffff", border: "2px solid #1f6be2", pointerEvents: "auto", cursor: "nwse-resize" }}></span>
              <span data-dir={"w"} style={{ position: "absolute", top: "calc(50% - 6px)", left: "-7px", width: "12px", height: "12px", borderRadius: "0", background: "#ffffff", border: "2px solid #1f6be2", pointerEvents: "auto", cursor: "ew-resize" }}></span>
              <span data-dir={"e"} style={{ position: "absolute", top: "calc(50% - 6px)", right: "-7px", width: "12px", height: "12px", borderRadius: "0", background: "#ffffff", border: "2px solid #1f6be2", pointerEvents: "auto", cursor: "ew-resize" }}></span>
              <span data-size={"1"} style={{ position: "absolute", top: "-30px", left: "0", padding: "2px 8px", borderRadius: "0", background: "#1f6be2", color: "#ffffff", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}></span>
            </div>
            {" "}
            <div ref={v.dropRef} aria-hidden={"true"} style={{ position: "absolute", height: "3px", borderRadius: "0", background: "#1f6be2", display: "none", pointerEvents: "none", zIndex: "4" }}></div>
            {" "}
          </article>
          {" "}
        </div>
        {" "}
      </>) : null}
    </>
  );
}

export function ReportingOverlay({ v }) {
  // Dialogs and menus that sit above the page
  return (
    <>
  {(v.nrOpen) ? (<>
    {" "}
    <div onClick={v.nrBackdrop} style={{ position: "fixed", inset: "0", zIndex: "60", background: "rgba(11,22,38,.45)", display: "grid", placeItems: "center", padding: "24px" }}>
      {" "}
      <div role={"dialog"} aria-modal={"true"} aria-labelledby={"nr-title"} style={{ width: `min(${v.nrW ?? ""},100%)`, height: v.nrH, maxHeight: "calc(100vh - 48px)", overflowX: "hidden", overflowY: v.nrOverflow, background: "#ffffff", borderRadius: "0", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 30px 80px -30px rgba(11,22,38,.5)" }}>
        {" "}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          {" "}
          <span style={{ flex: "none", whiteSpace: "nowrap", fontSize: "14px", fontWeight: "600", color: "#5a6474" }}>
            {v.nrStepLabel}
          </span>
          {" "}
          <button onClick={v.nrClose} aria-label={"Cancel and go back"} style={{ width: "44px", height: "44px", margin: "-10px -10px -10px 0", border: "0", borderRadius: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcceddbc1">
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.4"} strokeLinecap={"round"}>
              <path d={"M6 6l12 12M18 6L6 18"}></path>
            </svg>
          </button>
          {" "}
        </div>
        {" "}
        {(v.nrShowBar) ? (<>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ flex: "1", height: "4px", borderRadius: "0", background: "#1f6be2" }}></span>
            <span style={{ flex: "1", height: "4px", borderRadius: "0", background: v.nrBar2, transition: "background-color 200ms ease" }}></span>
          </div>
        </>) : null}
        {" "}
        {(v.nrStep1) ? (<>
          {" "}
          <form onSubmit={v.nrNext} noValidate={true} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {" "}
            <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {" "}
              <h2 id={"nr-title"} style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>
                {"What do you want to name your report?"}
              </h2>
              {" "}
              <input autoFocus={true} value={(v.nrName) ?? ""} onChange={v.nrSetName} placeholder={"e.g. October report for Harbor & Pine"} style={{ height: "52px", padding: "0 16px", border: `1px solid ${v.nrBd ?? ""}`, borderRadius: "0", font: "inherit", fontSize: "17px", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
              {" "}
              {(v.nrErr) ? (<>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>
                  {"Give your report a name so you can find it later."}
                </span>
              </>) : null}
              {" "}
            </label>
            {" "}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              {" "}
              <button type={"button"} onClick={v.nrClose} style={{ height: "48px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">
                {"Cancel"}
              </button>
              {" "}
              <button type={"submit"} style={{ height: "48px", padding: "0 22px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                {v.nrNextLabel}
              </button>
              {" "}
            </div>
            {" "}
          </form>
          {" "}
        </>) : null}
        {" "}
        {(v.nrStep3) ? (<>
          {" "}
          <form onSubmit={v.nrBrandSave} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {" "}
              <h2 id={"nr-title"} style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>
                {"First, make your reports look like you"}
              </h2>
              {" "}
              <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>
                {"Every report you send will use this. You only do it once."}
              </p>
              {" "}
            </div>
            {" "}
            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "600" }}>
                {"Agency name"}
              </span>
              {" "}
              <input value={(v.nrBrandName) ?? ""} onChange={v.nrSetBrandName} style={{ height: "48px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outline: "none" }} className="dc120a618" />
              {" "}
            </label>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "600" }}>
                {"Logo"}
              </span>
              {" "}
              <label style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", padding: "10px 14px", border: "1.5px dashed #b8c4d4", borderRadius: "0", cursor: "pointer" }} className="dc047ba64">
                {" "}
                <input type={"file"} accept={"image/png,image/svg+xml,image/jpeg"} onChange={v.wlPickLogo} style={{ position: "absolute", inset: "0", opacity: "0", cursor: "pointer" }} />
                {" "}
                {(v.wlHasLogo) ? (<>
                  <span role={"img"} aria-label={"Your logo"} style={{ display: "block", width: "96px", height: "40px", background: `url('${v.wlLogo ?? ""}') left center / contain no-repeat` }}></span>
                </>) : null}
                {" "}
                <span style={{ fontWeight: "600", color: "#1f6be2" }}>
                  {v.wlLogoLabel}
                </span>
                {" "}
              </label>
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "600" }}>
                {"Brand colour"}
              </span>
              {" "}
              <div role={"radiogroup"} aria-label={"Brand colour"} style={{ display: "flex", gap: "10px" }}>
                {" "}
                {((v.wlColors) || []).map((cl, $index) => (
                  <React.Fragment key={$index}>
                    <button type={"button"} role={"radio"} aria-checked={cl?.on} aria-label={cl?.hex} onClick={cl?.pick} style={{ width: "44px", height: "44px", padding: "3px", border: `2px solid ${cl?.ring ?? ""}`, borderRadius: "0", background: "#ffffff", cursor: "pointer" }}>
                      <span style={{ display: "block", width: "100%", height: "100%", background: cl?.hex }}></span>
                    </button>
                  </React.Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div aria-hidden={"true"} style={{ background: "#f4f7fb", padding: "14px" }}>
              <div style={{ background: "#ffffff", boxShadow: "0 1px 3px rgba(11,22,38,.12)" }}>
                <div style={{ height: "6px", background: v.wlColor }}></div>
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(v.wlHasLogo) ? (<>
                    <span style={{ display: "block", width: "80px", height: "24px", background: `url('${v.wlLogo ?? ""}') left center / contain no-repeat` }}></span>
                  </>) : null}
                  <span style={{ fontSize: "13px", color: "#5a6474" }}>
                    {v.nrBrandName}
                  </span>
                  <span style={{ fontWeight: "700", color: v.wlColor }}>
                    {v.nrName}
                  </span>
                  <span style={{ display: "block", height: "6px", width: "70%", background: "#e6ebf2" }}></span>
                  <span style={{ display: "block", height: "6px", width: "50%", background: "#e6ebf2" }}></span>
                </div>
              </div>
            </div>
            {" "}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
              {" "}
              <button type={"button"} onClick={v.nrBrandBack} style={{ height: "48px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">
                {"Back"}
              </button>
              {" "}
              <div style={{ display: "flex", gap: "8px" }}>
                {" "}
                <button type={"button"} onClick={v.nrBrandSkip} style={{ height: "48px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">
                  {"Skip for now"}
                </button>
                {" "}
                <button type={"submit"} style={{ height: "48px", padding: "0 22px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                  {"Save and create report"}
                </button>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </form>
          {" "}
        </>) : null}
        {" "}
        {(v.nrStep2) ? (<>
          {" "}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {" "}
            <h2 style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>
              {"What kind of report is \""}{v.nrName}{"\"?"}
            </h2>
            {" "}
            <span style={{ color: "#5a6474" }}>
              {"Pick a starting layout. You can add, remove and edit everything after."}
            </span>
            {" "}
          </div>
          {" "}
          <div style={{ flex: "1 1 auto", minHeight: "0", overflowY: "auto", margin: "0 -28px", padding: "2px 28px 8px", display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            {" "}
            <nav aria-label={"Template categories"} style={{ flex: "0 0 180px", position: "sticky", top: "0", alignSelf: "flex-start", maxHeight: "100%", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px", background: "#ffffff" }}>
              {" "}
              <label style={{ position: "relative", display: "block", marginBottom: "8px" }}>
                <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                  {"Search templates"}
                </span>
                <svg aria-hidden={"true"} width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#5a6474"} strokeWidth={"2.4"} strokeLinecap={"round"} style={{ position: "absolute", left: "12px", top: "14px" }}>
                  <circle cx={"11"} cy={"11"} r={"7"}></circle>
                  <path d={"M20 20l-3.5-3.5"}></path>
                </svg>
                <input type={"search"} value={(v.nrQ) ?? ""} onChange={v.nrSetQ} placeholder={"Search templates"} style={{ width: "100%", height: "44px", padding: "0 12px 0 36px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", fontSize: "15px", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
              </label>
              {" "}
              {((v.nrCats) || []).map((c, $index) => (
                <React.Fragment key={$index}>
                  <button onClick={c?.pick} aria-current={c?.aria} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", minHeight: "42px", padding: "0 12px", border: "0", borderRadius: "0", background: c?.bg, font: "inherit", fontSize: "16px", fontWeight: c?.fw, letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left", transition: "background-color 120ms ease" }} className="dcf0b705f">
                    <span>
                      {c?.label}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "500", color: "#97a2b2" }}>
                      {c?.count}
                    </span>
                  </button>
                </React.Fragment>
              ))}
              {" "}
            </nav>
            {" "}
            <div role={"radiogroup"} aria-label={"Report template"} style={{ flex: "1", minWidth: "260px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: "16px", alignContent: "start" }}>
              {" "}
              {(v.nrNoMatch) ? (<>
                <div style={{ gridColumn: "1 / -1", padding: "48px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", textAlign: "center" }}>
                  <span style={{ fontWeight: "700" }}>
                    {"No templates match \""}{v.nrQ}{"\""}
                  </span>
                  <span style={{ color: "#5a6474" }}>
                    {"Try another word, or start from Blank."}
                  </span>
                  <button onClick={v.nrClearQ} style={{ marginTop: "6px", height: "40px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }}>
                    {"Clear search"}
                  </button>
                </div>
              </>) : null}
              {" "}
              {((v.nrTpls) || []).map((t, $index) => (
                <React.Fragment key={$index}>
                  {" "}
                  <div role={"radio"} tabIndex={"0"} aria-checked={t?.on} aria-label={t?.label} onClick={t?.pick} onDoubleClick={t?.create} style={{ display: "flex", flexDirection: "column", borderRadius: "0", overflow: "hidden", background: "#ffffff", outline: `2px solid ${t?.bd ?? ""}`, outlineOffset: "-2px", boxShadow: "0 1px 2px rgba(11,22,38,.06),0 8px 24px -16px rgba(11,22,38,.25)", cursor: "pointer", transition: "outline-color 160ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1)" }} className="dcf4597a3">
                    {" "}
                    <span aria-hidden={"true"} style={{ display: "block", height: "150px", background: "#eef1fd", padding: "16px 18px 0", overflow: "hidden" }}>
                      {" "}
                      <span style={{ display: "flex", flexDirection: "column", gap: "6px", height: "100%", background: "#ffffff", borderRadius: "0 0 0", padding: "10px", boxShadow: "0 0 0 1px #e6e9f8" }}>
                        {" "}
                        {((t?.prev) || []).map((p, $index) => (
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
                    <span style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "16px 18px 18px", flex: "1" }}>
                      {" "}
                      <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px", fontWeight: "600", letterSpacing: "-0.3px", lineHeight: "1.3" }}>
                          {t?.label}
                          {(t?.custom) ? (<>
                            <span style={{ padding: "1px 8px", borderRadius: "0", background: "#eef3fd", color: "#1f6be2", fontSize: "12px", fontWeight: "600" }}>
                              {"Custom"}
                            </span>
                          </>) : null}
                        </span>
                        <span style={{ fontSize: "14px", color: "#5a6474", lineHeight: "1.4" }}>
                          {t?.desc}
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "20px", marginTop: "auto" }}>
                        {((t?.logos) || []).map((lg, $index) => (
                          <React.Fragment key={$index}>
                            <span aria-hidden={"true"} style={{ display: "block", width: "20px", height: "20px", background: `url('${lg ?? ""}') center / contain no-repeat` }}></span>
                          </React.Fragment>
                        ))}
                      </span>
                      {" "}
                      <button type={"button"} onClick={t?.create} style={{ alignSelf: "flex-start", height: "40px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", transition: "border-color 160ms ease,background-color 160ms ease" }} className="dce60d758">
                        {"Use template"}
                      </button>
                      {" "}
                    </span>
                    {" "}
                  </div>
                  {" "}
                </React.Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div style={{ flex: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", margin: "-20px -28px -28px", padding: "14px 28px 20px", background: "#ffffff", boxShadow: "0 -1px 0 #e6ebf2,0 -12px 24px -12px rgba(11,22,38,.12)" }}>
            {" "}
            <button onClick={v.nrBack} style={{ height: "48px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">
              {"Back"}
            </button>
            {" "}
            <button onClick={v.nrCreate} style={{ height: "48px", padding: "0 22px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
              {"Create report"}
            </button>
            {" "}
          </div>
          {" "}
        </>) : null}
        {" "}
      </div>
      {" "}
    </div>
    {" "}
  </>) : null}
  {(v.ctxOpen) ? (<>
    {" "}
    <div role={"menu"} aria-label={"Widget options"} style={{ position: "fixed", left: v.ctxX, top: v.ctxY, zIndex: "70", minWidth: "220px", padding: "6px", borderRadius: "0", background: "#ffffff", boxShadow: "0 0 0 1px #e6ebf2,0 18px 40px -16px rgba(11,22,38,.35)" }}>
      {" "}
      {((v.ctxItems) || []).map((it, $index) => (
        <React.Fragment key={$index}>
          {" "}
          {(it?.sep) ? (<>
            <div style={{ height: "1px", margin: "4px 6px", background: "#eef1f6" }}></div>
          </>) : null}
          {" "}
          {(it?.head) ? (<>
            <div style={{ padding: "6px 10px 2px", fontSize: "12px", fontWeight: "600", color: "#5a6474" }}>
              {it?.label}
            </div>
          </>) : null}
          {" "}
          {(it?.btn) ? (<>
            <button role={"menuitem"} onMouseDown={it?.keep} onClick={it?.run} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", minHeight: "38px", padding: "0 10px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: "500", letterSpacing: "inherit", color: it?.c, cursor: "pointer", textAlign: "left" }} className="dcf0b705f">
              <span>
                {it?.label}
              </span>
              <span style={{ fontSize: "12px", color: "#97a2b2" }}>
                {it?.hint}
              </span>
            </button>
          </>) : null}
          {" "}
        </React.Fragment>
      ))}
      {" "}
    </div>
    {" "}
  </>) : null}
    </>
  );
}
