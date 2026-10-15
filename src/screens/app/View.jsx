// Converted from design/App.dc.html with scripts/dc-to-react.mjs, then edited by hand.
import React from 'react';
import { FEATURES } from './modules';

export const css = "html,body{margin:0;background:#f4f7fb;color:#0b1626;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#1f6be2;text-underline-offset:3px}\na:hover{color:#0b1626}\n@keyframes clario-spin{to{transform:rotate(360deg)}}\n@media (prefers-reduced-motion: reduce){*{transition:none !important;animation:none !important}}\n.dcf0b705f:hover{background:#f4f7fb !important}\n.dc20c6b10:hover{color:#0b1626 !important}\n.dcbbe0dc7:hover{background:#e6ebf2 !important}\n.dc9482609:hover{background:#1858b8 !important}\n.dcadff8cd:active{transform:scale(0.97) !important}\n.dc9335fa9:hover{background:#e1ebfc !important}\n.dc6106149:active{transform:scale(0.98) !important}\n.dce5ff64e:active{transform:scale(0.94) !important}\n.dce60d758:hover{border-color:#0b1626 !important}\n.dc120a618:focus{border-color:#1f6be2 !important;box-shadow:0 0 0 4px #d6e4f8 !important}\n.dc467ff26:hover{color:#1f6be2 !important}\n.dc63085fd:hover{text-decoration-color:currentColor !important}\n.dc228142d:hover{background:#e9eef5 !important}\n.dc6f15efc:hover{background:#f7f9fc !important}\n.dcf4597a3:hover{transform:translateY(-2px) !important}\n.dcdda73d1:hover{background:#e6ebf2 !important;color:#0b1626 !important}\n.dcf4e905a:hover{background:#fbefea !important}\n.dc9ba39f8:hover{background:#eef3fd !important}\n.dcceddbc1:hover{background:#f0f3f8 !important}\n.dce77e1f6:hover{background:#fde2d6 !important}\n.dcc3caca9:hover{background:#0b1626 !important;color:#ffffff !important}\n.dc6bffc71:hover{background:#f8fafc !important}\n.dcae383ef:hover{border-color:#c9d3e0 !important;box-shadow:0 10px 24px -18px rgba(11,22,38,.4) !important}\n.dceb8c957:hover{background:#f4f7fb !important;color:#0b1626 !important}\n.dc054f106:focus{border-color:#1f6be2 !important}\n.dc047ba64:hover{border-color:#1f6be2 !important}\n.dc83474c9:hover{border-color:#1f6be2 !important;color:#0b1626 !important}\n.dc7a04906:hover{background:#cfe8d8 !important}";

export default function View({ v }) {
  return (
    <>
      <div style={{ fontFamily: "'DM Sans',ui-sans-serif,system-ui,sans-serif", fontSize: "16px", lineHeight: "1.5", letterSpacing: "-0.4px", minHeight: "100vh", display: "flex", opacity: v.pageO, transition: "opacity 700ms ease" }}>
        {" "}
        <aside onClick={v.asideClick} style={{ cursor: v.navCursor, flex: "none", width: v.navW, transition: "width 240ms cubic-bezier(0.23,1,0.32,1)", background: "#ffffff", borderRight: "1px solid #e6ebf2", padding: "20px 12px", display: "flex", flexDirection: "column", gap: "12px", position: "sticky", top: "0", height: "100vh", zIndex: "30" }}>
          {" "}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", minHeight: "44px" }}>
            {" "}
            <a href={"/"} onClick={v.logoClick} aria-label={v.logoLabel} title={v.logoLabel} style={{ display: "flex", alignItems: "center", gap: "8px", padding: `0 ${v.navPad ?? ""}`, textDecoration: "none", color: "#0b1626", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.7px" }}>
              {" "}
              <img src={"/assets/clario-mark-v2.png"} alt={""} width={"30"} height={"30"} style={{ width: "30px", height: "30px", display: "block" }} />
              <span style={{ display: v.navTxt, whiteSpace: "nowrap" }}>
                {"AI Ads Analyst"}
              </span>
              {" "}
            </a>
            {" "}
            <button onClick={v.toggleNav} aria-label={v.navToggleLabel} aria-expanded={v.navOpen} title={v.navToggleLabel} style={{ flex: "none", width: "44px", height: "44px", border: "0", borderRadius: "0", background: "transparent", display: v.navTxtGrid, placeItems: "center", cursor: "pointer", transition: "background-color 160ms ease" }} className="dcf0b705f">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                <path d={v.navArrow}></path>
              </svg>
            </button>
            {" "}
          </div>
          {" "}
          <nav aria-label={"Main"} style={{ flex: "1", minHeight: "0", overflowY: "auto", overflowX: "hidden", marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {" "}
            {((v.modules) || []).map((m, $index) => (
              <React.Fragment key={$index}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {" "}
                  <button onClick={m?.toggle} aria-expanded={m?.open} aria-current={m?.aria} title={m?.title} style={{ display: "flex", alignItems: "center", justifyContent: v.navJust, gap: "10px", height: "44px", padding: "0 10px", border: "0", borderRadius: "0", background: m?.bg, font: "inherit", letterSpacing: "inherit", fontWeight: "600", color: "#0b1626", cursor: "pointer", textAlign: "left", transition: "background-color 160ms ease" }} className="dcf0b705f">
                    {" "}
                    <span style={{ position: "relative", flex: "none", width: "30px", display: "grid", placeItems: "center" }}>
                      {" "}
                      {(m?.badgeDot) ? (<>
                        <span aria-hidden={"true"} style={{ position: "absolute", top: "-5px", right: "0", width: "10px", height: "10px", borderRadius: "50%", background: "#fa5f2e", border: "2px solid #ffffff" }}></span>
                      </>) : null}
                      {" "}
                      <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={m?.iconC} aria-hidden={"true"}>
                        <path d={m?.icon}></path>
                      </svg>
                      {" "}
                    </span>
                    {" "}
                    <span style={{ flex: "1", display: v.navTxt, whiteSpace: "nowrap" }}>
                      {m?.label}
                    </span>
                    {" "}
                    {(m?.badgePill) ? (<>
                      <span style={{ minWidth: "22px", height: "22px", padding: "0 6px", borderRadius: "7px", background: "#fa5f2e", color: "#0b1626", fontSize: "12px", fontWeight: "700", display: "grid", placeItems: "center" }}>
                        {m?.badge}
                      </span>
                    </>) : null}
                    {" "}
                    {(m?.multi) ? (<>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#5a6474"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ transform: m?.chev, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                        <path d={"M6 9l6 6 6-6"}></path>
                      </svg>
                    </>) : null}
                    {" "}
                  </button>
                  {" "}
                  <div style={{ display: "grid", gridTemplateRows: m?.rowsN, transition: "grid-template-rows 260ms cubic-bezier(0.23,1,0.32,1)" }}>
                    {" "}
                    <div style={{ overflow: "hidden" }}>
                      {" "}
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "4px 0 8px 50px" }}>
                        {" "}
                        {((m?.items) || []).map((it, $index) => (
                          <React.Fragment key={$index}>
                            {" "}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              {" "}
                              <button onClick={it?.go} aria-current={it?.aria} aria-expanded={it?.kidsOpen} style={{ display: "flex", alignItems: "center", gap: "8px", minHeight: "38px", padding: "0 10px", border: "0", borderRadius: "0", background: it?.bg, color: it?.c, font: "inherit", fontSize: "15px", fontWeight: it?.fw, letterSpacing: "inherit", cursor: "pointer", textAlign: "left", transition: "background-color 160ms ease,color 160ms ease" }} className="dc20c6b10">
                                <span style={{ flex: "1" }}>
                                  {it?.label}
                                </span>
                                {(it?.hasKids) ? (<>
                                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ transform: it?.chev, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                                    <path d={"M6 9l6 6 6-6"}></path>
                                  </svg>
                                </>) : null}
                              </button>
                              {" "}
                              {(it?.hasKids) ? (<>
                                {" "}
                                <div style={{ display: "grid", gridTemplateRows: it?.rows, transition: "grid-template-rows 240ms cubic-bezier(0.23,1,0.32,1)" }}>
                                  {" "}
                                  <div style={{ overflow: "hidden" }}>
                                    {" "}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", margin: "2px 0 4px 12px", paddingLeft: "10px", borderLeft: "2px solid #eef1f6" }}>
                                      {" "}
                                      {((it?.kids) || []).map((k, $index) => (
                                        <React.Fragment key={$index}>
                                          {" "}
                                          <button onClick={k?.go} aria-current={k?.aria} style={{ display: "flex", alignItems: "center", minHeight: "34px", padding: "0 10px", border: "0", borderRadius: "0", background: k?.bg, color: k?.c, font: "inherit", fontSize: "14px", fontWeight: k?.fw, letterSpacing: "inherit", cursor: "pointer", textAlign: "left", transition: "background-color 160ms ease,color 160ms ease" }} className="dc20c6b10">
                                            {k?.label}
                                          </button>
                                          {" "}
                                        </React.Fragment>
                                      ))}
                                      {" "}
                                    </div>
                                    {" "}
                                  </div>
                                  {" "}
                                </div>
                                {" "}
                              </>) : null}
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
                  </div>
                  {" "}
                </div>
                {" "}
              </React.Fragment>
            ))}
            {" "}
          </nav>
          {" "}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: v.navTopDir, alignItems: v.navAlign, gap: "10px", padding: "4px 4px 4px 7px", borderRadius: "0", background: "#f4f7fb" }}>
            {" "}
            <span title={v.meName} style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#d6e4f8", display: "grid", placeItems: "center", fontSize: "14px", fontWeight: "700" }}>
              {v.meInitials}
            </span>
            {" "}
            <span style={{ flex: "1", display: v.navTxtFlex, flexDirection: "column", minWidth: "0" }}>
              <span style={{ fontWeight: "600", fontSize: "15px" }}>
                {v.meName}
              </span>
              <span style={{ fontSize: "13px", color: "#5a6474", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {`${v.agencyName} · ${v.meRole}`}
              </span>
            </span>
            {" "}
            <button onClick={v.goSettings} aria-label={"Settings"} aria-current={v.setAria} style={{ flex: "none", width: v.navSetW, height: "44px", border: "0", borderRadius: "0", background: v.setBg, display: "grid", placeItems: "center", cursor: "pointer", transition: "background-color 160ms ease" }} className="dcbbe0dc7">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={v.setC} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                <circle cx={"12"} cy={"12"} r={"3"}></circle>
                <path d={"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"}></path>
              </svg>
            </button>
            {" "}
          </div>
          {" "}
        </aside>
        {" "}
        <main style={{ flex: "1", minWidth: "0", padding: v.mainPad }}>
          {" "}
          <div style={{ maxWidth: v.mainMax, margin: "0 auto", display: "flex", flexDirection: "column", gap: v.mainGap }}>
            {" "}
            {(v.sampleMode) ? (
              <p role={"note"} style={{ margin: "0", padding: "12px 16px", background: "#fff6c2", color: "#5c4400", fontSize: "15px", textWrap: "pretty" }}>
                <strong style={{ fontWeight: "700" }}>{"Sample data. "}</strong>
                {"These clients and numbers are examples so you can look around. Your own clients replace them once you connect Google Analytics or Meta."}
                {(v.canConnect) ? (<>{" "}<a href={"/api/integrations/google/start"} style={{ fontWeight: "700", color: "#5c4400" }}>{"Connect Google Analytics"}</a>{" · "}<button type={"button"} onClick={v.connectMeta} style={{ padding: "0", border: "0", background: "none", font: "inherit", fontWeight: "700", color: "#5c4400", textDecoration: "underline", cursor: "pointer" }}>{"Connect Meta"}</button></>) : null}
              </p>
            ) : null}
            {(v.showHeader) ? (<>
              {" "}
              <header style={{ position: "sticky", top: "0", zIndex: "30", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", margin: "-32px calc(-1 * clamp(20px,4vw,48px)) 0", padding: "20px clamp(20px,4vw,48px) 16px", background: "#f4f7fb", boxShadow: v.hdrShadow, transition: "box-shadow 200ms ease" }}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  {" "}
                  <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "700", letterSpacing: "-1px", lineHeight: "1.2" }}>
                    {v.pageTitle}
                  </h1>
                  {" "}
                  {(v.vAn) ? (<>
                    {" "}
                    <div role={"tablist"} aria-label={"Tool"} style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "14px", background: "#e6ebf2", flexWrap: "wrap" }}>
                      {" "}
                      {((v.anTools) || []).map((t, $index) => (
                        <React.Fragment key={$index}>
                          {" "}
                          <button role={"tab"} aria-selected={t?.on} aria-label={t?.label} onClick={t?.pick} onMouseEnter={t?.tipOn} onMouseLeave={t?.tipOff} onFocus={t?.tipOn} onBlur={t?.tipOff} style={{ position: "relative", display: "grid", placeItems: "center", width: "52px", height: "44px", padding: "0", border: "0", borderRadius: "10px", background: t?.bg, font: "inherit", letterSpacing: "inherit", cursor: "pointer", transition: "background-color 160ms ease" }}>
                            <span aria-hidden={"true"} style={{ display: "block", width: "22px", height: "22px", background: `url('${t?.logo ?? ""}') center / contain no-repeat` }}></span>
                            <span role={"tooltip"} style={{ position: "absolute", top: "calc(100% + 8px)", left: "50%", zIndex: "20", padding: "6px 10px", borderRadius: "8px", background: "#0b1626", color: "#ffffff", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", pointerEvents: "none", opacity: t?.tipO, transform: `translate(-50%,${t?.tipY ?? ""})`, transition: "opacity 140ms ease,transform 140ms cubic-bezier(0.23,1,0.32,1)" }}>
                              {t?.label}
                            </span>
                          </button>
                          {" "}
                        </React.Fragment>
                      ))}
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                </div>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginLeft: "auto" }}>
                  {" "}
                  {(v.hasAction) ? (<>
                    {" "}
                    <button onClick={v.action} style={{ display: "flex", alignItems: "center", gap: "8px", height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc9482609 dcadff8cd">
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.6"} strokeLinecap={"round"}>
                        <path d={"M12 5v14M5 12h14"}></path>
                      </svg>
                      {v.actionLabel}
                    </button>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.showSw) ? (<>
                    {" "}
                    <div style={{ position: "relative" }}>
                      {" "}
                      <button onClick={v.toggleSw} aria-haspopup={"listbox"} aria-expanded={v.swOpen} title={v.swName} style={{ display: "flex", alignItems: "center", gap: "10px", height: "48px", maxWidth: "280px", padding: "0 14px 0 6px", border: "1.5px solid #1f6be2", borderRadius: "999px", background: "#eef3fd", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", transition: "background-color 160ms ease,transform 120ms ease" }} className="dc9335fa9 dc6106149">
                        {" "}
                        <span style={{ flex: "none", width: "34px", height: "34px", borderRadius: "50%", background: v.swAvBg, color: v.swAvC, display: "grid", placeItems: "center", fontSize: "14px", fontWeight: "700", boxShadow: "0 0 0 2px #ffffff" }}>
                          {v.swInitials}
                        </span>
                        {" "}
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2", textAlign: "left" }}>
                          <span style={{ fontSize: "12px", color: "#1f6be2", fontWeight: "700" }}>
                            {"Viewing client"}
                          </span>
                          <span style={{ fontSize: "15px", fontWeight: "700", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {v.swName}
                          </span>
                        </span>
                        {" "}
                        {(v.swHasStatus) ? (<>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: v.swDot }}></span>
                        </>) : null}
                        {" "}
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#5a6474"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ display: "block", marginLeft: "2px", transform: v.swChev, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                          <path d={"M6 9l6 6 6-6"}></path>
                        </svg>
                        {" "}
                      </button>
                      {" "}
                      <div role={"listbox"} style={{ position: "absolute", top: "calc(100% + 8px)", right: "0", zIndex: "40", width: "300px", background: "#ffffff", borderRadius: "0", padding: "8px", boxShadow: "0 18px 40px -18px rgba(11,22,38,.3)", opacity: v.swO, transform: `translateY(${v.swYUp ?? ""}px)`, pointerEvents: v.swPe, visibility: v.swVis, transition: "opacity 160ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1),visibility 160ms" }}>
                        {" "}
                        {(v.swProfile) ? (<>
                          <button onClick={v.goProfile} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", minHeight: "48px", marginBottom: "4px", padding: "6px 10px", border: "0", borderBottom: "1px solid #eef1f6", borderRadius: "0 0 0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#1f6be2", cursor: "pointer", textAlign: "left" }} className="dcf0b705f">
                            <span style={{ flex: "none", width: "32px", height: "32px", display: "grid", placeItems: "center" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                <path d={"M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0"}></path>
                              </svg>
                            </span>
                            {v.swProfileLabel}
                          </button>
                        </>) : null}
                        {" "}
                        {((v.swList) || []).map((o, $index) => (
                          <React.Fragment key={$index}>
                            {" "}
                            <button role={"option"} aria-selected={o?.on} onClick={o?.pick} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", minHeight: "48px", padding: "6px 10px", border: "0", borderRadius: "0", background: o?.bg, font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left", transition: "background-color 120ms ease" }} className="dcf0b705f">
                              {" "}
                              <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "0", background: o?.avBg, color: o?.avC, display: "grid", placeItems: "center", fontSize: "12px", fontWeight: "700" }}>
                                {o?.initials}
                              </span>
                              {" "}
                              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "1.25" }}>
                                <span style={{ fontWeight: "600" }}>
                                  {o?.name}
                                </span>
                                <span style={{ fontSize: "13px", color: "#5a6474" }}>
                                  {o?.sub}
                                </span>
                              </span>
                              {" "}
                              {(o?.on) ? (<>
                                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                                </svg>
                              </>) : null}
                              {" "}
                            </button>
                            {" "}
                          </React.Fragment>
                        ))}
                        {" "}
                        <button onClick={v.cAddOpen} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", minHeight: "48px", marginTop: "4px", padding: "6px 10px", border: "0", borderTop: "1px solid #eef1f6", borderRadius: "0 0 12px 12px", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#1f6be2", cursor: "pointer", textAlign: "left" }} className="dcf0b705f">
                          <span style={{ flex: "none", width: "32px", height: "32px", display: "grid", placeItems: "center" }}>
                            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"}>
                              <path d={"M12 5v14M5 12h14"}></path>
                            </svg>
                          </span>
                          {"Add client"}
                        </button>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                </div>
                {" "}
              </header>
              {" "}
            </>) : null}
            {" "}
            {FEATURES.map(f => <f.View key={f.id} v={v} />)}
            {" "}
          </div>
          {" "}
        </main>
        {" "}
        {FEATURES.map(f => f.Overlay && <f.Overlay key={f.id} v={v} />)}
        {" "}
        <div style={{ position: "fixed", right: "24px", bottom: "24px", zIndex: "40", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", pointerEvents: "none" }}>
          {" "}
          <div role={"dialog"} aria-label={"Ask Analyst"} style={{ width: "min(380px,calc(100vw - 48px))", height: "min(560px,calc(100vh - 120px))", background: "#ffffff", borderRadius: "0", boxShadow: "0 24px 60px -20px rgba(11,22,38,.35)", display: "flex", flexDirection: "column", overflow: "hidden", transformOrigin: "bottom right", opacity: v.chatO, transform: v.chatT, pointerEvents: v.chatPe, visibility: v.chatVis, transition: "opacity 180ms ease,transform 240ms cubic-bezier(0.23,1,0.32,1),visibility 180ms" }}>
            {" "}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 12px 14px 18px", background: "#f4f7fb" }}>
              {" "}
              <img src={"/assets/clario-mark-v2.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px" }} />
              {" "}
              <span style={{ flex: "1", display: "flex", flexDirection: "column", lineHeight: "1.25" }}>
                <span style={{ fontWeight: "700" }}>
                  {"Ask "}
                  <span style={{ color: "#1f6be2" }}>
                    {"Analyst"}
                  </span>
                </span>
                <span style={{ fontSize: "13px", color: "#5a6474" }}>
                  {v.chatScope}
                </span>
              </span>
              {" "}
              {(v.chatCanClear) ? <button type={"button"} onClick={v.chatClear} style={{ height: "44px", padding: "0 10px", marginLeft: "auto", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer", whiteSpace: "nowrap" }} className="dc20c6b10">{"New chat"}</button> : null}
              <button onClick={v.toggleChat} aria-label={"Close chat"} style={{ width: "44px", height: "44px", border: "0", borderRadius: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcbbe0dc7">
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.4"} strokeLinecap={"round"}>
                  <path d={"M6 6l12 12M18 6L6 18"}></path>
                </svg>
              </button>
              {" "}
            </div>
            {" "}
            <div ref={v.chatRef} style={{ flex: "1", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {" "}
              {((v.chatMsgs) || []).map((cm, $index) => (
                <React.Fragment key={$index}>
                  {" "}
                  <div style={{ alignSelf: cm?.align, maxWidth: "85%", padding: "10px 14px", borderRadius: "0", background: cm?.bg, color: cm?.c, lineHeight: "1.45", fontSize: "15px", whiteSpace: "pre-line", textWrap: "pretty" }}>
                    {cm?.text}
                  </div>
                  {(cm?.acts?.length) ? (
                    <div style={{ alignSelf: "flex-start", width: "85%", display: "flex", flexDirection: "column", gap: "6px", marginTop: "-4px" }}>
                      {cm.acts.map((x, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 8px 8px 12px", background: "#ffffff", boxShadow: "inset 0 0 0 1px #e6ebf2" }}>
                          <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "1px" }}>
                            <span style={{ fontSize: "14px", fontWeight: "600", lineHeight: "1.35" }}>{x.title}</span>
                            <span style={{ fontSize: "13px", color: "#5a6474", lineHeight: "1.35" }}>{x.why}</span>
                          </span>
                          <button type={"button"} onClick={x.go} aria-label={x.label} aria-disabled={x.done ? "true" : "false"} style={{ flex: "none", height: "40px", padding: "0 12px", border: x.done ? "0" : "1px solid #d3dbe6", borderRadius: "0", background: x.done ? "transparent" : "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: x.done ? "#1d6b3a" : "#0b1626", cursor: x.done ? "default" : "pointer", whiteSpace: "nowrap" }} className="dce60d758">{x.btn}</button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {" "}
                </React.Fragment>
              ))}
              {" "}
              {(v.chatTyping) ? (<>
                <span style={{ alignSelf: "flex-start", fontSize: "14px", color: "#5a6474", padding: "4px 2px" }}>
                  <span style={{ color: "#1f6be2" }}>
                    {"Analyst"}
                  </span>
                  {" is working on it…"}
                </span>
              </>) : null}
              {" "}
              {(v.chatFresh) ? (<>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                  {" "}
                  {((v.chatIdeas) || []).map((ci, $index) => (
                    <React.Fragment key={$index}>
                      <button onClick={ci?.use} style={{ textAlign: "left", minHeight: "44px", padding: "8px 14px", border: "1px solid #e6ebf2", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "15px", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", transition: "border-color 160ms ease" }} className="dc047ba64">
                        {ci?.label}
                      </button>
                    </React.Fragment>
                  ))}
                  {" "}
                </div>
                {" "}
              </>) : null}
              {" "}
            </div>
            {" "}
            <form onSubmit={v.sendChat} style={{ display: "flex", gap: "8px", padding: "12px", background: "#f4f7fb" }}>
              {" "}
              <input value={(v.chatInput) ?? ""} onChange={v.setChatInput} aria-label={"Message Analyst"} placeholder={"Tell Analyst what to do"} style={{ flex: "1", minWidth: "0", height: "44px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", letterSpacing: "inherit", outline: "none", background: "#ffffff" }} className="dc120a618" />
              {" "}
              <button type={"submit"} aria-label={"Send"} style={{ flex: "none", width: "44px", height: "44px", border: "0", borderRadius: "0", background: "#1f6be2", display: "grid", placeItems: "center", cursor: "pointer" }} className="dc9482609">
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                  <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                </svg>
              </button>
              {" "}
            </form>
            {" "}
          </div>
          {" "}
          <button onClick={v.toggleChat} aria-expanded={v.chatOpen} style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: "10px", height: "52px", padding: "0 20px 0 14px", border: "0", borderRadius: "16px", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", boxShadow: "0 12px 30px -10px rgba(31,107,226,.6)", transition: "transform 160ms cubic-bezier(0.23,1,0.32,1),background-color 160ms ease" }} className="dc9482609 dcadff8cd">
            <span style={{ flex: "none", width: "30px", height: "30px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
              <img src={"/assets/clario-mark-v2.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px" }} />
            </span>
            {v.chatBtn}
          </button>
          {" "}
        </div>
      </div>
    </>
  );
}
