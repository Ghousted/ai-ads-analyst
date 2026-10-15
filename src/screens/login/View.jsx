// Converted from design/Login.dc.html with scripts/dc-to-react.mjs, then edited by hand.
import React from 'react';

export const css = "html,body{margin:0;background:#ffffff;color:#0b1626;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#1f6be2;text-underline-offset:3px}\na:hover{color:#0b1626}\n@keyframes clario-spin{to{transform:rotate(360deg)}}\n@media (prefers-reduced-motion: reduce){*{transition:none !important;animation:none !important}}\n.dc41f4d87:hover{background:#1858b8 !important;color:#ffffff !important}\n.dcf0b705f:hover{background:#f4f7fb !important}\n.dc6106149:active{transform:scale(0.98) !important}\n.dc120a618:focus{border-color:#1f6be2 !important;box-shadow:0 0 0 4px #d6e4f8 !important}\n.dcceddbc1:hover{background:#f0f3f8 !important}\n.dc9482609:hover{background:#1858b8 !important}\n.dc179d51a:hover{background:rgba(255,255,255,.16) !important;color:#ffffff !important}\n.dcadff8cd:active{transform:scale(0.97) !important}";

export default function View({ v }) {
  return (
    <>
      <div style={{ fontFamily: "'DM Sans',ui-sans-serif,system-ui,sans-serif", fontSize: "16px", lineHeight: "1.5", letterSpacing: "-0.59px", minHeight: "100vh", display: "flex", flexWrap: "wrap-reverse" }}>
        {" "}
        <div style={{ order: "2", flex: "0 0 45%", minWidth: "min(100%,420px)", display: "flex", flexDirection: "column", padding: "28px 32px 40px", minHeight: "100vh" }}>
          {" "}
          <a href={"/"} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "#0b1626", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.8px" }}>
            {" "}
            <img src={"/assets/clario-mark-v2.png"} alt={""} width={"34"} height={"34"} style={{ width: "34px", height: "34px", display: "block" }} />
            {"AI Ads Analyst "}
          </a>
          {" "}
          <div style={{ flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
            {" "}
            <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {" "}
              {(v.done) ? (<>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px" }}>
                  {" "}
                  <span style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#e3f3e8", display: "grid", placeItems: "center" }}>
                    <svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1d6b3a"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                      <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                    </svg>
                  </span>
                  {" "}
                  <h1 style={{ margin: "0", fontSize: "36px", fontWeight: "700", lineHeight: "1.15", letterSpacing: "-1.3px" }}>
                    {v.doneTitle}
                  </h1>
                  {" "}
                  <p style={{ margin: "0", color: "#5a6474" }}>
                    {v.doneText}
                  </p>
                  {" "}
                  <a href={"/"} style={{ display: "inline-flex", alignItems: "center", height: "48px", padding: "0 20px", background: "#1f6be2", color: "#ffffff", borderRadius: "14px", fontWeight: "600", textDecoration: "none" }} className="dc41f4d87">
                    {"Back to the homepage"}
                  </a>
                  {" "}
                </div>
                {" "}
              </>) : null}
              {" "}
              {(v.notDone) ? (<>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {" "}
                  <img src={"/assets/clario-mark-v2.png"} alt={"AI Ads Analyst"} width={"56"} height={"56"} style={{ width: "56px", height: "56px", display: "block", marginBottom: "12px" }} />
                  {" "}
                  <h1 style={{ margin: "0", fontSize: "36px", fontWeight: "700", lineHeight: "1.15", letterSpacing: "-1.3px" }}>
                    {v.title}
                  </h1>
                  {" "}
                  <p style={{ margin: "0", color: "#5a6474" }}>
                    {v.subtitle}
                  </p>
                  {" "}
                </div>
                {" "}
                <button type={"button"} onClick={v.google} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", height: "48px", width: "100%", border: "1px solid #d3dbe6", borderRadius: "14px", background: "#ffffff", font: "inherit", letterSpacing: "inherit", fontWeight: "600", color: "#0b1626", cursor: "pointer", transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dcf0b705f dc6106149">
                  {" "}
                  <svg width={"18"} height={"18"} viewBox={"0 0 48 48"}>
                    <path fill={"#EA4335"} d={"M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"}></path>
                    <path fill={"#4285F4"} d={"M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"}></path>
                    <path fill={"#FBBC05"} d={"M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"}></path>
                    <path fill={"#34A853"} d={"M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"}></path>
                  </svg>
                  {" "}{v.googleLabel}{" "}
                </button>
                {" "}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#5a6474", fontSize: "14px", letterSpacing: "-0.52px" }}>
                  {" "}
                  <span style={{ flex: "1", height: "1px", background: "#e6ebf2" }}></span>
                  {"or with email"}
                  <span style={{ flex: "1", height: "1px", background: "#e6ebf2" }}></span>
                  {" "}
                </div>
                {" "}
                <form onSubmit={v.submit} noValidate={true} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {" "}
                  {(v.isSignup) ? (<>
                    {" "}
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {" "}
                      <span style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "-0.52px" }}>
                        {"Full name"}
                      </span>
                      {" "}
                      <input type={"text"} autoComplete={"name"} value={(v.name) ?? ""} onChange={v.setName} placeholder={"Alex Rivera"} style={{ height: "48px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "12px", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outline: "none", background: "#ffffff", transition: "border-color 160ms ease,box-shadow 160ms ease" }} className="dc120a618" />
                      {" "}
                    </label>
                    {" "}
                  </>) : null}
                  {" "}
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {" "}
                    <span style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "-0.52px" }}>
                      {"Work email"}
                    </span>
                    {" "}
                    <input type={"email"} autoComplete={"email"} value={(v.email) ?? ""} onChange={v.setEmail} placeholder={"you@agency.com"} aria-invalid={v.emailBad} style={{ height: "48px", padding: "0 14px", border: `1px solid ${v.emailBorder ?? ""}`, borderRadius: "12px", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outline: "none", background: "#ffffff", transition: "border-color 160ms ease,box-shadow 160ms ease" }} className="dc120a618" />
                    {" "}
                    {(v.emailBad) ? (<>
                      <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#b8380f" }}>
                        {v.emailErr}
                      </span>
                    </>) : null}
                    {" "}
                  </label>
                  {" "}
                  <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {" "}
                    <span style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px", fontWeight: "600", letterSpacing: "-0.52px" }}>
                      <span>
                        {"Password"}
                      </span>
                      {(v.isLogin) ? (<>
                        <a href={"#"} onClick={v.forgot} style={{ fontWeight: "500" }}>
                          {"Forgot password?"}
                        </a>
                      </>) : null}
                    </span>
                    {" "}
                    <span style={{ position: "relative", display: "block" }}>
                      {" "}
                      <input type={v.pwType} autoComplete={v.pwAuto} value={(v.password) ?? ""} onChange={v.setPassword} placeholder={v.pwPlaceholder} aria-invalid={v.pwBad} style={{ width: "100%", height: "48px", padding: "0 64px 0 14px", border: `1px solid ${v.pwBorder ?? ""}`, borderRadius: "12px", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outline: "none", background: "#ffffff", transition: "border-color 160ms ease,box-shadow 160ms ease" }} className="dc120a618" />
                      {" "}
                      <button type={"button"} onClick={v.togglePw} aria-label={v.pwToggleLabel} style={{ position: "absolute", right: "4px", top: "4px", height: "40px", padding: "0 12px", border: "0", borderRadius: "10px", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "-0.52px", color: "#1f6be2", cursor: "pointer" }} className="dcceddbc1">
                        {v.pwToggleText}
                      </button>
                      {" "}
                    </span>
                    {" "}
                    {(v.pwBad) ? (<>
                      <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#b8380f" }}>
                        {v.pwErr}
                      </span>
                    </>) : null}
                    {(v.forgotNote) ? (<span role="status" style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#1d6b3a" }}>{v.forgotNote}</span>) : null}
                    {" "}
                    {(v.showStrength) ? (<>
                      {" "}
                      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {" "}
                        <span style={{ flex: "1", display: "flex", gap: "4px" }}>
                          <span style={{ flex: "1", height: "4px", borderRadius: "9999px", background: v.s0, transition: "background-color 200ms ease" }}></span>
                          <span style={{ flex: "1", height: "4px", borderRadius: "9999px", background: v.s1, transition: "background-color 200ms ease" }}></span>
                          <span style={{ flex: "1", height: "4px", borderRadius: "9999px", background: v.s2, transition: "background-color 200ms ease" }}></span>
                        </span>
                        {" "}
                        <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474", whiteSpace: "nowrap" }}>
                          {v.strengthLabel}
                        </span>
                        {" "}
                      </span>
                      {" "}
                    </>) : null}
                    {" "}
                  </label>
                  {" "}
                  {(v.isLogin) ? (<>
                    {" "}
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "44px", cursor: "pointer" }}>
                      {" "}
                      <input type={"checkbox"} checked={!!(v.remember)} onChange={v.toggleRemember} style={{ width: "18px", height: "18px", margin: "0", accentColor: "#1f6be2", cursor: "pointer" }} />
                      {" "}
                      <span>
                        {"Keep me logged in"}
                      </span>
                      {" "}
                    </label>
                    {" "}
                  </>) : null}
                  {" "}
                  <button type={"submit"} disabled={v.loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", height: "48px", width: "100%", border: "0", borderRadius: "14px", background: "#1f6be2", color: "#ffffff", font: "inherit", letterSpacing: "inherit", fontWeight: "600", cursor: "pointer", opacity: v.btnOpacity, transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc9482609 dc6106149">
                    {" "}{v.spinner}{v.submitLabel}{" "}
                  </button>
                  {" "}
                  {(v.isSignup) ? (<>
                    {" "}
                    <p style={{ margin: "0", fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474", textWrap: "pretty" }}>
                      {"By creating an account you agree to the "}
                      <a href={"/terms"}>
                        {"Terms"}
                      </a>
                      {" and "}
                      <a href={"/privacy"}>
                        {"Privacy Policy"}
                      </a>
                      {"."}
                    </p>
                    {" "}
                  </>) : null}
                  {" "}
                </form>
                {" "}
                <p style={{ margin: "0", color: "#5a6474" }}>
                  {v.switchText}{" "}
                  <a href={"#"} onClick={v.switchMode} style={{ fontWeight: "600" }}>
                    {v.switchLink}
                  </a>
                </p>
                {" "}
              </>) : null}
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
            {" "}
            <span>
              {"© 2026 AI Ads Analyst"}
            </span>
            <a href={"/privacy"} style={{ color: "#5a6474", textDecoration: "none" }}>
              {"Privacy"}
            </a>
            <a href={"/terms"} style={{ color: "#5a6474", textDecoration: "none" }}>
              {"Terms"}
            </a>
            <a href={"/help"} style={{ color: "#5a6474", textDecoration: "none" }}>
              {"Help"}
            </a>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
        <div style={{ position: "relative", order: "1", flex: "1 1 0", minWidth: "min(100%,480px)", margin: "0", borderRadius: "0 40px 40px 0", background: "#0b1626", color: "#ffffff", padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "40px", overflow: "hidden" }}>
          {" "}
          <a href={"/"} style={{ position: "absolute", top: "24px", left: "24px", display: "inline-flex", alignItems: "center", gap: "8px", height: "44px", padding: "0 16px 0 12px", borderRadius: "9999px", background: "rgba(255,255,255,.08)", color: "#ffffff", fontSize: "15px", fontWeight: "600", textDecoration: "none", transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc179d51a dcadff8cd">
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"}>
              <path d={"M15 18l-6-6 6-6"}></path>
            </svg>
            {"Back"}
          </a>
          {" "}
          <div style={{ width: "100%", maxWidth: "520px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {" "}
            <h2 style={{ margin: "0", fontSize: "clamp(30px,3vw,40px)", fontWeight: "700", lineHeight: "1.15", letterSpacing: "-0.035em", textWrap: "balance" }}>
              {"Every client’s report, "}
              <span style={{ color: "#7fa6e6" }}>
                {"ready when you are."}
              </span>
            </h2>
            {" "}
            <p style={{ margin: "0", fontSize: "18px", color: "#b8c4d4" }}>
              {"Analyst has pulled this week’s numbers. Review, tweak and send in a few clicks."}
            </p>
            {" "}
          </div>
          {" "}
          <div onMouseEnter={v.pause} onMouseLeave={v.resume} style={{ position: "relative", width: "100%", maxWidth: "640px", height: "520px", display: "grid", placeItems: "center" }}>
            {" "}
            <button type={"button"} onClick={v.pick3} aria-label={v.lbl3} style={{ gridArea: "1/1", width: "min(500px,92%)", minHeight: "340px", border: "0", padding: "28px", boxShadow: "0 2px 4px rgba(0,0,0,.08),0 40px 80px -36px rgba(0,0,0,.55)", textAlign: "left", font: "inherit", letterSpacing: "inherit", color: "#ffffff", cursor: "pointer", background: "#000000", borderRadius: "28px", display: "flex", flexDirection: "column", gap: "20px", transform: v.tf3, zIndex: v.z3, transition: "transform 520ms cubic-bezier(0.32,0.72,0,1)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ flex: "none", width: "48px", height: "48px", borderRadius: "14px", background: "#ffffff", display: "grid", placeItems: "center" }}>
                  <img src={"/assets/logo-tiktok.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                </span>
                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"TikTok Ads"}
                  </span>
                  <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#a8a8a8" }}>
                    {"Last 7 days"}
                  </span>
                </span>
              </span>
              {" "}
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#a8a8a8" }}>
                  {"Video views"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "46px", fontWeight: "700", letterSpacing: "-1.8px", lineHeight: "1.05", fontVariantNumeric: "tabular-nums" }}>
                    {"48.2k"}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: "9999px", background: "rgba(37,244,238,.16)", color: "#25F4EE", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                    {"+18%"}
                  </span>
                </span>
              </span>
              {" "}
              <span style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "110px" }}>
                  <span style={{ flex: "1", height: "35%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                  <span style={{ flex: "1", height: "48%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                  <span style={{ flex: "1", height: "42%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                  <span style={{ flex: "1", height: "60%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                  <span style={{ flex: "1", height: "55%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                  <span style={{ flex: "1", height: "78%", borderRadius: "5px", background: "#25F4EE" }}></span>
                  <span style={{ flex: "1", height: "96%", borderRadius: "5px", background: "#FE2C55" }}></span>
                </span>
                <span style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#7a7a7a" }}>
                  <span style={{ flex: "1", textAlign: "center" }}>
                    {"M"}
                  </span>
                  <span style={{ flex: "1", textAlign: "center" }}>
                    {"T"}
                  </span>
                  <span style={{ flex: "1", textAlign: "center" }}>
                    {"W"}
                  </span>
                  <span style={{ flex: "1", textAlign: "center" }}>
                    {"T"}
                  </span>
                  <span style={{ flex: "1", textAlign: "center" }}>
                    {"F"}
                  </span>
                  <span style={{ flex: "1", textAlign: "center" }}>
                    {"S"}
                  </span>
                  <span style={{ flex: "1", textAlign: "center", color: "#ffffff", fontWeight: "600" }}>
                    {"S"}
                  </span>
                </span>
              </span>
              <span style={{ display: "flex", gap: "20px", paddingTop: "14px", borderTop: "1px solid #222", fontSize: "14px", letterSpacing: "-0.52px" }}>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#a8a8a8" }}>
                    {"Likes"}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"6.1k"}
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#a8a8a8" }}>
                    {"Shares"}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"812"}
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#a8a8a8" }}>
                    {"Avg. watch"}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"9.4s"}
                  </span>
                </span>
              </span>
            </button>
            {" "}
            <button type={"button"} onClick={v.pick2} aria-label={v.lbl2} style={{ gridArea: "1/1", width: "min(500px,92%)", minHeight: "340px", border: "0", padding: "28px", boxShadow: "0 2px 4px rgba(0,0,0,.08),0 40px 80px -36px rgba(0,0,0,.55)", textAlign: "left", font: "inherit", letterSpacing: "inherit", color: "#1c2b33", cursor: "pointer", background: "#F0F2F5", borderRadius: "28px", display: "flex", flexDirection: "column", gap: "20px", transform: v.tf2, zIndex: v.z2, transition: "transform 520ms cubic-bezier(0.32,0.72,0,1)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ flex: "none", width: "48px", height: "48px", borderRadius: "14px", background: "#ffffff", display: "grid", placeItems: "center" }}>
                  <img src={"/assets/logo-meta.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                </span>
                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"Meta Pixel"}
                  </span>
                  <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#65676b" }}>
                    {"Last 7 days"}
                  </span>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 10px", borderRadius: "9999px", background: "#ffffff", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#31a24c" }}></span>
                  {"Live"}
                </span>
              </span>
              {" "}
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#65676b" }}>
                  {"Events received"}
                </span>
                <span style={{ fontSize: "46px", fontWeight: "700", letterSpacing: "-1.8px", lineHeight: "1.05", fontVariantNumeric: "tabular-nums" }}>
                  {"4,697"}
                </span>
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", letterSpacing: "-0.52px" }}>
                    <span style={{ fontWeight: "600" }}>
                      {"PageView"}
                    </span>
                    <span style={{ fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                      {"3,120"}
                    </span>
                  </span>
                  <span style={{ height: "12px", borderRadius: "9999px", background: "#ffffff" }}>
                    <span style={{ display: "block", height: "100%", width: "100%", borderRadius: "9999px", background: "#0866FF" }}></span>
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", letterSpacing: "-0.52px" }}>
                    <span style={{ fontWeight: "600" }}>
                      {"ViewContent"}
                    </span>
                    <span style={{ fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                      {"1,480"}
                    </span>
                  </span>
                  <span style={{ height: "12px", borderRadius: "9999px", background: "#ffffff" }}>
                    <span style={{ display: "block", height: "100%", width: "47%", borderRadius: "9999px", background: "#0866FF" }}></span>
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", letterSpacing: "-0.52px" }}>
                    <span style={{ fontWeight: "600" }}>
                      {"Lead"}
                    </span>
                    <span style={{ fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                      {"97"}
                    </span>
                  </span>
                  <span style={{ height: "12px", borderRadius: "9999px", background: "#ffffff" }}>
                    <span style={{ display: "block", height: "100%", width: "8%", borderRadius: "9999px", background: "#0866FF" }}></span>
                  </span>
                </span>
              </span>
            </button>
            {" "}
            <button type={"button"} onClick={v.pick1} aria-label={v.lbl1} style={{ gridArea: "1/1", width: "min(500px,92%)", minHeight: "340px", border: "0", padding: "28px", boxShadow: "0 2px 4px rgba(0,0,0,.08),0 40px 80px -36px rgba(0,0,0,.55)", textAlign: "left", font: "inherit", letterSpacing: "inherit", color: "#202124", cursor: "pointer", background: "#ffffff", borderRadius: "28px", display: "flex", flexDirection: "column", gap: "20px", transform: v.tf1, zIndex: v.z1, transition: "transform 520ms cubic-bezier(0.32,0.72,0,1)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ flex: "none", width: "48px", height: "48px", borderRadius: "14px", background: "#f1f3f4", display: "grid", placeItems: "center" }}>
                  <img src={"/assets/logo-ga4.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                </span>
                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"Google Analytics 4"}
                  </span>
                  <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5f6368" }}>
                    {"Last 7 days"}
                  </span>
                </span>
              </span>
              {" "}
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5f6368" }}>
                  {"Sessions"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "46px", fontWeight: "700", letterSpacing: "-1.8px", lineHeight: "1.05", fontVariantNumeric: "tabular-nums" }}>
                    {"3,410"}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: "9999px", background: "#e6f4ea", color: "#137333", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                    {"+12%"}
                  </span>
                </span>
              </span>
              {" "}
              <svg viewBox={"0 0 292 110"} preserveAspectRatio={"none"} style={{ width: "100%", height: "110px", display: "block" }}>
                <path d={"M0 1 H292 M0 37 H292 M0 73 H292"} stroke={"#f1f3f4"} strokeWidth={"1"} vectorEffect={"non-scaling-stroke"}></path>
                <path d={"M0 86 C40 80 60 92 100 72 S170 54 210 52 S270 22 292 16"} stroke={"#9aa0a6"} strokeWidth={"2"} strokeDasharray={"4 4"} fill={"none"} vectorEffect={"non-scaling-stroke"}></path>
                <path d={"M0 80 C40 72 60 88 100 64 S170 38 210 44 S270 16 292 12 L292 110 L0 110 Z"} fill={"#e8f0fe"}></path>
                <path d={"M0 80 C40 72 60 88 100 64 S170 38 210 44 S270 16 292 12"} stroke={"#1A73E8"} strokeWidth={"3"} fill={"none"} vectorEffect={"non-scaling-stroke"}></path>
              </svg>
              <span style={{ display: "flex", gap: "20px", paddingTop: "14px", borderTop: "1px solid #f1f3f4", fontSize: "14px", letterSpacing: "-0.52px" }}>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#5f6368" }}>
                    {"Users"}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"2,684"}
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#5f6368" }}>
                    {"Engagement"}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"61%"}
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#5f6368" }}>
                    {"Conversions"}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"128"}
                  </span>
                </span>
              </span>
            </button>
            {" "}
            <button type={"button"} onClick={v.pick0} aria-label={v.lbl0} style={{ gridArea: "1/1", width: "min(500px,92%)", minHeight: "340px", border: "0", padding: "28px", boxShadow: "0 2px 4px rgba(0,0,0,.08),0 40px 80px -36px rgba(0,0,0,.55)", textAlign: "left", font: "inherit", letterSpacing: "inherit", color: "#ffffff", cursor: "pointer", background: "#1c2a3f", borderRadius: "28px", display: "flex", flexDirection: "column", gap: "20px", transform: v.tf0, zIndex: v.z0, transition: "transform 520ms cubic-bezier(0.32,0.72,0,1)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ flex: "none", width: "48px", height: "48px", borderRadius: "14px", background: "#ffffff", display: "grid", placeItems: "center" }}>
                  <img src={"/assets/clario-mark-v2.png"} alt={""} width={"28"} height={"28"} style={{ width: "28px", height: "28px", objectFit: "contain", display: "block" }} />
                </span>
                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: "700", fontSize: "18px" }}>
                    {"Harbor & Pine Dental"}
                  </span>
                  <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#b8c4d4" }}>
                    {"Ready to send"}
                  </span>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: "9999px", background: "#e3f3e8", color: "#1d6b3a", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                  {"Healthy"}
                </span>
              </span>
              {" "}
              <span style={{ fontSize: "26px", lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.9px", textWrap: "pretty" }}>
                {"Leads were flat this week, but each one cost 11% less."}
              </span>
              <span style={{ display: "flex", gap: "20px", padding: "14px 0", borderTop: "1px solid rgba(255,255,255,.12)", borderBottom: "1px solid rgba(255,255,255,.12)", fontSize: "14px", letterSpacing: "-0.52px" }}>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#b8c4d4" }}>
                    {"Leads"}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "20px" }}>
                    {"142"}
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#b8c4d4" }}>
                    {"Cost per lead"}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "20px" }}>
                    {"$8.73"}
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#b8c4d4" }}>
                    {"Spend"}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "20px" }}>
                    {"$1,240"}
                  </span>
                </span>
              </span>
              {" "}
              <span style={{ display: "flex", gap: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", height: "44px", padding: "0 18px", borderRadius: "12px", background: "#1f6be2", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                  {"Send report"}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", height: "44px", padding: "0 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.3)", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                  {"Edit"}
                </span>
              </span>
            </button>
            {" "}
          </div>
          {" "}
        </div>
      </div>
    </>
  );
}
