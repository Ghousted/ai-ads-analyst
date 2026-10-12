// Converted from design/Setup.dc.html with scripts/dc-to-react.mjs, then edited by hand.
import React from 'react';

export const css = "html,body{margin:0;background:#ffffff;color:#0b1626;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#1f6be2;text-underline-offset:3px}\na:hover{color:#0b1626}\n@keyframes clario-spin{to{transform:rotate(360deg)}}\n@keyframes clario-logo-out{0%{transform:scale(.6) rotate(-90deg);opacity:0}25%{transform:scale(1) rotate(0deg);opacity:1}70%{transform:scale(1) rotate(360deg);opacity:1}100%{transform:scale(.4) rotate(420deg);opacity:0}}\n@keyframes clario-circle-in{0%{transform:scale(0)}70%{transform:scale(1.08)}100%{transform:scale(1)}}\n@keyframes clario-check-draw{to{stroke-dashoffset:0}}\n@keyframes clario-fade-in{from{opacity:0}to{opacity:1}}\n@keyframes clario-breathe{0%,100%{transform:scale(1)}50%{transform:scale(.9)}}\n@keyframes clario-load{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n@keyframes clario-fill{from{transform:scaleX(.04)}to{transform:scaleX(.82)}}\n@keyframes clario-pop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}\n@media (prefers-reduced-motion: reduce){*{transition:none !important;animation:none !important}}\n.dceb8c957:hover{background:#f4f7fb !important;color:#0b1626 !important}\n.dc9482609:hover{background:#1858b8 !important}\n.dcb9db9e4:focus{border-color:#1f6be2 !important;box-shadow:0 0 0 5px #d6e4f8 !important}\n.dc047ba64:hover{border-color:#1f6be2 !important}\n.dcd1527aa:active{transform:scale(0.99) !important}\n.dc6106149:active{transform:scale(0.98) !important}\n.dcadff8cd:active{transform:scale(0.97) !important}";

export default function View({ v }) {
  return (
    <>
      <div style={{ fontFamily: "'DM Sans',ui-sans-serif,system-ui,sans-serif", fontSize: "16px", lineHeight: "1.5", letterSpacing: "-0.4px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {" "}
        {(v.dashLoading) ? (<>
          {" "}
          <div role={"status"} aria-live={"polite"} style={{ position: "fixed", inset: "0", zIndex: "50", background: "#ffffff", display: "grid", placeItems: "center", overflow: "hidden", animation: "clario-fade-in 300ms ease both" }}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "28px", padding: "24px", textAlign: "center" }}>
              {" "}
              <span style={{ display: "block", transform: `scale(${v.dashZoom ?? ""})`, opacity: v.dashZoomO, transition: "transform 800ms cubic-bezier(0.7,0,0.84,0),opacity 500ms ease 300ms" }}>
                <span style={{ position: "relative", width: "88px", height: "88px", display: "block" }}>
                  {" "}
                  <span style={{ position: "absolute", inset: "-14px", borderRadius: "50%", border: "3px solid #eef1f6", borderTopColor: "#1f6be2", animation: "clario-spin 900ms linear infinite" }}></span>
                  {" "}
                  <img src={"/assets/clario-mark-v2.png"} alt={""} width={"88"} height={"88"} style={{ position: "absolute", inset: "0", width: "88px", height: "88px", display: "block", animation: "clario-breathe 1600ms ease-in-out infinite" }} />
                  {" "}
                </span>
              </span>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", minHeight: "60px", opacity: v.dashTextO, transition: "opacity 200ms ease" }}>
                {" "}
                <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.7px" }}>
                  {"Setting up your dashboard"}
                </span>
                {" "}
                <span style={{ fontSize: "16px", color: "#5a6474", animation: "clario-fade-in 300ms ease both" }} key={v.dashMsgKey}>
                  {v.dashMsg}
                </span>
                {" "}
              </div>
              {" "}
              <span style={{ display: "block", width: "200px", height: "4px", borderRadius: "9999px", background: "#eef1f6", overflow: "hidden", opacity: v.dashTextO, transition: "opacity 200ms ease" }}>
                <span style={{ display: "block", height: "100%", background: "#1f6be2", borderRadius: "9999px", transformOrigin: "left", animation: "clario-load 2400ms cubic-bezier(0.65,0,0.35,1) both" }}></span>
              </span>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </>) : null}
        {" "}
        {(v.skipOpen) ? (<>
          {" "}
          <div onClick={v.skipBackdrop} style={{ position: "fixed", inset: "0", zIndex: "40", background: "rgba(11,22,38,.45)", display: "grid", placeItems: "center", padding: "24px", animation: "clario-fade-in 160ms ease both" }}>
            {" "}
            <div role={"alertdialog"} aria-modal={"true"} aria-labelledby={"skip-t"} aria-describedby={"skip-d"} style={{ width: "min(460px,100%)", background: "#ffffff", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px", boxShadow: "0 30px 80px -30px rgba(11,22,38,.5)" }}>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {" "}
                <h2 id={"skip-t"} style={{ margin: "0", fontSize: "24px", fontWeight: "700", letterSpacing: "-0.7px" }}>
                  {"Set this up later?"}
                </h2>
                {" "}
                <p id={"skip-d"} style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>
                  {"You can skip "}{v.skipWhat}{" for now. "}{v.skipNote}
                </p>
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px 16px", borderRadius: "14px", background: "#f4f7fb" }}>
                {" "}
                <span style={{ fontSize: "14px", color: "#5a6474" }}>
                  {"Find it later in"}
                </span>
                {" "}
                <span style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", fontWeight: "600" }}>
                  {" "}
                  {((v.skipPath) || []).map((sp, $index) => (
                    <React.Fragment key={$index}>
                      {(sp?.sep) ? (<>
                        <svg aria-hidden={"true"} width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#5a6474"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={"M9 6l6 6-6 6"}></path>
                        </svg>
                      </>) : null}
                      <span>
                        {sp?.t}
                      </span>
                    </React.Fragment>
                  ))}
                  {" "}
                </span>
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
                {" "}
                <button onClick={v.skipCancel} style={{ height: "48px", padding: "0 18px", border: "0", borderRadius: "12px", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dceb8c957">
                  {"Go back"}
                </button>
                {" "}
                <button onClick={v.skipConfirm} style={{ height: "48px", padding: "0 22px", border: "0", borderRadius: "12px", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                  {"Skip for now"}
                </button>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </>) : null}
        {" "}
        <div style={{ height: "4px", background: "#eef1f6" }}>
          <div style={{ height: "100%", width: v.progress, background: "#1f6be2", borderRadius: "0 9999px 9999px 0", transition: "width 400ms cubic-bezier(0.23,1,0.32,1)" }}></div>
        </div>
        {" "}
        <header style={{ maxWidth: "1120px", width: "100%", margin: "0 auto", height: "72px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          {" "}
          <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.7px" }}>
            <img src={"/assets/clario-mark-v2.png"} alt={""} width={"30"} height={"30"} style={{ width: "30px", height: "30px", display: "block" }} />
            {"Clario"}
          </span>
          {" "}
          {(v.inQuestions) ? (<>
            {" "}
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#5a6474", fontVariantNumeric: "tabular-nums" }}>
              {"Question "}{v.counter}
            </span>
            {" "}
          </>) : null}
          {" "}
        </header>
        {" "}
        <main style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 24px 80px" }}>
          {" "}
          <div style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "28px", opacity: v.qO, transform: `translateY(${v.qY ?? ""}px)`, transition: "opacity 220ms ease,transform 320ms cubic-bezier(0.23,1,0.32,1)" }}>
            {" "}
            {(v.inQuestions) ? (<>
              {" "}
              <ol aria-label={"Setup progress"} style={{ listStyle: "none", margin: "0 0 8px", padding: "0", display: "flex", alignItems: "center", gap: "8px" }}>
                {((v.stages) || []).map((st, $index) => (
                  <React.Fragment key={$index}>
                    <li aria-current={st?.aria} style={{ display: "flex", alignItems: "center", gap: "8px", flex: st?.flex }}>
                      {" "}
                      <span style={{ flex: "none", width: "28px", height: "28px", borderRadius: "50%", display: "grid", placeItems: "center", fontSize: "13px", fontWeight: "700", background: st?.bg, color: st?.c, boxShadow: st?.ring, transition: "background-color 300ms ease,color 300ms ease,box-shadow 300ms ease" }}>
                        {" "}
                        {(st?.done) ? (<>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3.5"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                        </>) : null}
                        {" "}
                        {(st?.notDone) ? (<>
                          {st?.n}
                        </>) : null}
                        {" "}
                      </span>
                      {" "}
                      <span style={{ fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", color: st?.lc }}>
                        {st?.label}
                      </span>
                      {" "}
                      {(st?.hasLine) ? (<>
                        <span style={{ flex: "1", minWidth: "12px", height: "2px", borderRadius: "9999px", background: st?.line, transition: "background-color 300ms ease" }}></span>
                      </>) : null}
                      {" "}
                    </li>
                  </React.Fragment>
                ))}
              </ol>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {" "}
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f6be2" }}>
                  {v.stageLabel}
                </span>
                {" "}
                <h1 style={{ margin: "0", fontSize: "clamp(30px,4vw,40px)", fontWeight: "700", letterSpacing: "-1.3px", lineHeight: "1.15", textWrap: "balance" }}>
                  {v.q?.title}
                </h1>
                {" "}
                <p style={{ margin: "0", fontSize: "18px", color: "#5a6474", textWrap: "pretty" }}>
                  {v.q?.help}
                </p>
                {" "}
              </div>
              {" "}
              {(v.q?.isText) ? (<>
                {" "}
                <input type={"text"} autoFocus={true} value={(v.q?.value) ?? ""} onChange={v.q?.onText} onKeyDown={v.onEnter} placeholder={v.q?.placeholder} aria-invalid={v.hasError} style={{ height: "64px", padding: "0 20px", border: `2px solid ${v.inputBd ?? ""}`, borderRadius: "16px", font: "inherit", fontSize: "22px", letterSpacing: "-0.6px", color: "#0b1626", outline: "none", background: "#ffffff", transition: "border-color 160ms ease,box-shadow 160ms ease" }} className="dcb9db9e4" />
                {" "}
              </>) : null}
              {" "}
              {(v.q?.isChoice) ? (<>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {" "}
                  {((v.q?.options) || []).map((o, $index) => (
                    <React.Fragment key={$index}>
                      {" "}
                      <button onClick={o?.pick} aria-pressed={o?.on} style={{ display: "flex", alignItems: "center", gap: "14px", minHeight: "64px", padding: "12px 18px", border: `2px solid ${o?.bd ?? ""}`, borderRadius: "16px", background: o?.bg, font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left", transition: "border-color 160ms ease,background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc047ba64 dcd1527aa">
                        {" "}
                        <span style={{ flex: "none", width: "28px", height: "28px", borderRadius: "8px", border: `1.5px solid ${o?.kbd ?? ""}`, background: o?.kbg, color: o?.kc, display: "grid", placeItems: "center", fontSize: "13px", fontWeight: "700" }}>
                          {o?.key}
                        </span>
                        {" "}
                        <span style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "18px", fontWeight: "600" }}>
                            {o?.label}
                          </span>
                          {(o?.hasSub) ? (<>
                            <span style={{ fontSize: "15px", color: "#5a6474" }}>
                              {o?.sub}
                            </span>
                          </>) : null}
                        </span>
                        {" "}
                      </button>
                      {" "}
                    </React.Fragment>
                  ))}
                  {" "}
                </div>
                {" "}
              </>) : null}
              {" "}
              {(v.q?.isMulti) ? (<>
                {" "}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,180px),1fr))", gap: "10px" }}>
                  {" "}
                  {((v.q?.options) || []).map((o, $index) => (
                    <React.Fragment key={$index}>
                      {" "}
                      <button onClick={o?.pick} aria-pressed={o?.on} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px", padding: "16px", border: `2px solid ${o?.bd ?? ""}`, borderRadius: "16px", background: o?.bg, font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left", transition: "border-color 160ms ease,background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc047ba64 dc6106149">
                        {" "}
                        <span style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#f4f7fb", display: "grid", placeItems: "center" }}>
                          <img src={o?.logo} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                        </span>
                        {" "}
                        <span style={{ fontWeight: "600", lineHeight: "1.25" }}>
                          {o?.label}
                        </span>
                        {" "}
                        <span style={{ position: "absolute", top: "12px", right: "12px", width: "22px", height: "22px", borderRadius: "50%", border: `1.5px solid ${o?.kbd ?? ""}`, background: o?.kbg, display: "grid", placeItems: "center" }}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3.5"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                        </span>
                        {" "}
                      </button>
                      {" "}
                    </React.Fragment>
                  ))}
                  {" "}
                </div>
                {" "}
              </>) : null}
              {" "}
              {(v.q?.isConnect) ? (<>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {" "}
                  {((v.q?.options) || []).map((p, $index) => (
                    <React.Fragment key={$index}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", minHeight: "72px", padding: "12px 16px", borderRadius: "16px", border: `2px solid ${p?.bd ?? ""}`, background: p?.bg, transition: "border-color 200ms ease,background-color 200ms ease" }}>
                        {" "}
                        <span style={{ flex: "none", width: "44px", height: "44px", borderRadius: "12px", background: "#f4f7fb", display: "grid", placeItems: "center" }}>
                          <img src={p?.logo} alt={""} width={"26"} height={"26"} style={{ width: "26px", height: "26px", objectFit: "contain", display: "block" }} />
                        </span>
                        {" "}
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "18px", fontWeight: "600" }}>
                            {p?.label}
                          </span>
                          {(p?.done) ? (<>
                            <span style={{ fontSize: "14px", color: "#1d6b3a" }}>
                              {p?.found}
                            </span>
                          </>) : null}
                        </span>
                        {" "}
                        {(p?.idle) ? (<>
                          {" "}
                          <button onClick={p?.connect} style={{ flex: "none", height: "44px", padding: "0 18px", border: "0", borderRadius: "12px", background: "#1f6be2", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#ffffff", cursor: "pointer", transition: "background-color 160ms ease" }} className="dc9482609">
                            {"Connect"}
                          </button>
                          {" "}
                        </>) : null}
                        {" "}
                        {(p?.loading) ? (<>
                          {" "}
                          <span style={{ flex: "none", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", color: "#5a6474" }}>
                            <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #d6e4f8", borderTopColor: "#1f6be2", animation: "clario-spin 700ms linear infinite" }}></span>
                            {"Connecting"}
                          </span>
                          {" "}
                        </>) : null}
                        {" "}
                        {(p?.done) ? (<>
                          {" "}
                          <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "600", color: "#1d6b3a" }}>
                            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1d6b3a"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                            </svg>
                            {"Connected"}
                          </span>
                          {" "}
                        </>) : null}
                        {" "}
                      </div>
                      {" "}
                    </React.Fragment>
                  ))}
                  {" "}
                  {(v.q?.noneSelected) ? (<>
                    {" "}
                    <p style={{ margin: "0", padding: "16px", borderRadius: "16px", background: "#f4f7fb", color: "#45505f" }}>
                      {"No tools picked yet. Set this up later and Clario will use sample data until your accounts are connected."}
                    </p>
                    {" "}
                  </>) : null}
                  {" "}
                </div>
                {" "}
              </>) : null}
              {" "}
              {(v.hasError) ? (<>
                {" "}
                <div role={"alert"} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "14px", background: "#fdece6", color: "#8f2d0c", fontWeight: "500" }}>
                  {" "}
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#b8380f"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none" }}>
                    <circle cx={"12"} cy={"12"} r={"9"}></circle>
                    <path d={"M12 8v5M12 16h.01"}></path>
                  </svg>
                  {" "}
                  <span>
                    {v.errorText}
                  </span>
                  {" "}
                </div>
                {" "}
              </>) : null}
              {" "}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", paddingTop: "8px", borderTop: "1px solid #eef1f6" }}>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  {" "}
                  <button onClick={v.next} style={{ display: "flex", alignItems: "center", gap: "8px", height: "52px", padding: "0 24px", border: "0", borderRadius: "14px", background: "#1f6be2", color: "#ffffff", font: "inherit", fontSize: "17px", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", opacity: v.nextO, transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1),opacity 160ms ease" }} className="dc9482609 dcadff8cd">
                    {v.nextLabel}
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                    </svg>
                  </button>
                  {" "}
                </div>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {" "}
                  {(v.canBack) ? (<>
                    {" "}
                    <button onClick={v.back} style={{ height: "44px", padding: "0 14px", border: "0", borderRadius: "12px", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dceb8c957">
                      {"Back"}
                    </button>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.canSkip) ? (<>
                    <button onClick={v.skip} style={{ height: "44px", padding: "0 14px", border: "0", borderRadius: "12px", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dceb8c957">
                      {"Set up later"}
                    </button>
                  </>) : null}
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </>) : null}
            {" "}
            {(v.isDone) ? (<>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "28px" }}>
                {" "}
                <span aria-hidden={"true"} style={{ position: "relative", width: "96px", height: "96px", display: "block" }}>
                  {" "}
                  <img src={"/assets/clario-mark-v2.png"} alt={""} width={"96"} height={"96"} style={{ position: "absolute", inset: "0", width: "96px", height: "96px", display: "block", animation: "clario-logo-out 1300ms cubic-bezier(0.65,0,0.35,1) both" }} />
                  {" "}
                  <span style={{ position: "absolute", inset: "0", borderRadius: "50%", background: "#1f6be2", display: "grid", placeItems: "center", animation: "clario-circle-in 500ms cubic-bezier(0.23,1,0.32,1) 1000ms both" }}>
                    {" "}
                    <svg width={"46"} height={"46"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <path d={"M5 12.5l4.5 4.5L19 7.5"} strokeDasharray={"24"} strokeDashoffset={"24"} style={{ animation: "clario-check-draw 400ms cubic-bezier(0.65,0,0.35,1) 1350ms forwards" }}></path>
                    </svg>
                    {" "}
                  </span>
                  {" "}
                </span>
                {" "}
                <h1 style={{ margin: "0", fontSize: "clamp(32px,4.4vw,44px)", fontWeight: "700", letterSpacing: "-1.4px", lineHeight: "1.15" }}>
                  {"You're all set"}{v.doneName}
                </h1>
                {" "}
                <button onClick={v.goDash} style={{ display: "inline-flex", alignItems: "center", gap: "8px", height: "56px", padding: "0 28px", border: "0", borderRadius: "16px", background: "#1f6be2", color: "#ffffff", font: "inherit", fontSize: "18px", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc9482609 dcadff8cd">
                  {"Go to my dashboard"}
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                    <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                  </svg>
                </button>
                {" "}
              </div>
              {" "}
            </>) : null}
            {" "}
          </div>
          {" "}
        </main>
      </div>
    </>
  );
}
