// Converted from design/Landing Page.dc.html with scripts/dc-to-react.mjs, then edited by hand.
import React from 'react';

export const css = "html,body{margin:0;background:#ffffff;color:#0b1626;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#1f6be2;text-underline-offset:3px}\na:hover{color:#0b1626}\n@keyframes clario-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@keyframes clario-pre-in{0%{opacity:0;transform:scale(.6) rotate(-120deg)}60%{opacity:1}100%{opacity:1;transform:scale(1) rotate(0deg)}}\n@keyframes clario-pre-spin{to{transform:rotate(360deg)}}\n@keyframes clario-pre-word{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}\n@keyframes clario-pre-bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}\n.clario-deck [data-page=\"3\"] section,.clario-deck [data-page=\"4\"] section,.clario-deck [data-page=\"5\"] section{padding-top:24px !important;padding-bottom:24px !important}\n.clario-burger{display:none}\n#how,#pricing{scroll-margin-top:72px}\n@media (max-width:959px){.clario-dnav,.clario-dlogin{display:none !important}.clario-burger{display:grid}}\n@media (min-width:960px){.clario-mnav{display:none !important}}\n@media (prefers-reduced-motion: reduce){*{transition:none !important;animation:none !important}}\n.dc0d2bdff:hover{background:#f0f3f8 !important;color:#0b1626 !important}\n.dcc638d12:hover{background:#f0f3f8 !important;color:#1f6be2 !important}\n.dc41f4d87:hover{background:#1858b8 !important;color:#ffffff !important}\n.dcadff8cd:active{transform:scale(0.97) !important}\n.dc93c1ac2:hover{text-decoration:underline !important}\n.dcc0dc266:hover{animation-play-state:paused !important}\n.dc056570b:hover{transform:rotate(0deg) translateY(-4px) !important}\n.dc2f752bd:hover{transform:rotate(0deg) translateY(-6px) !important}\n.dc91e4695:hover{transform:rotate(0deg) translateY(10px) !important}\n.dcc3caca9:hover{background:#0b1626 !important;color:#ffffff !important}";

export default function View({ v }) {
  return (
    <>
      <div style={{ fontFamily: "'DM Sans',ui-sans-serif,system-ui,sans-serif", fontSize: "16px", lineHeight: "1.5", letterSpacing: "-0.59px", minHeight: "100vh", overflowX: "clip" }}>
        {(v.preVisible) ? (<>
          <div aria-hidden={"true"} style={{ position: "fixed", inset: "0", zIndex: "100", background: "#ffffff", display: "grid", placeItems: "center", opacity: v.preO, transition: "opacity 400ms ease 550ms", pointerEvents: v.prePe }}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {" "}
                <span style={{ display: "block", width: "72px", height: "72px", transform: `scale(${v.preS ?? ""})`, transition: "transform 800ms cubic-bezier(0.7,0,0.84,0)" }}>
                  <span style={{ display: "block", width: "72px", height: "72px", animation: "clario-pre-in 700ms cubic-bezier(0.23,1,0.32,1) both" }}>
                    {" "}
                    <img src={"/assets/clario-mark-v2.png"} alt={""} width={"72"} height={"72"} style={{ width: "72px", height: "72px", display: "block", animation: "clario-pre-spin 1.6s cubic-bezier(0.65,0,0.35,1) 700ms infinite" }} />
                    {" "}
                  </span>
                </span>
                {" "}
                <span style={{ display: "block", opacity: v.preInO, transition: "opacity 200ms ease" }}>
                  <span style={{ display: "block", fontSize: "40px", fontWeight: "700", letterSpacing: "-1.4px", color: "#0b1626", animation: "clario-pre-word 500ms cubic-bezier(0.23,1,0.32,1) 350ms both" }}>
                    {"AI Ads Analyst"}
                  </span>
                </span>
                {" "}
              </div>
              {" "}
              <span style={{ display: "block", width: "160px", height: "4px", borderRadius: "9999px", background: "#e6ebf2", overflow: "hidden", opacity: v.preInO, transition: "opacity 200ms ease" }}>
                <span style={{ display: "block", height: "100%", background: "#1f6be2", borderRadius: "9999px", transformOrigin: "left", animation: "clario-pre-bar 1300ms cubic-bezier(0.65,0,0.35,1) both" }}></span>
              </span>
              {" "}
            </div>
          </div>
        </>) : null}
        <header style={{ position: "sticky", top: "0", zIndex: "20", background: "#ffffff", borderBottom: "1px solid #eef1f6" }}>
          {" "}
          <div style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "72px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
            {" "}
            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              {" "}
              <a href={"/"} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "#0b1626", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.8px" }}>
                {" "}
                <img src={"/assets/clario-mark-v2.png"} alt={""} width={"34"} height={"34"} style={{ width: "34px", height: "34px", display: "block" }} />
                {"AI Ads Analyst "}
              </a>
              {" "}
              <nav className="clario-dnav" style={{ display: "flex", alignItems: "center", gap: "2px", flexWrap: "wrap" }}>
                {" "}
                <div style={{ position: "relative" }} onMouseEnter={v.openF} onMouseLeave={v.closeMenu}>
                  {" "}
                  <button onClick={v.toggleF} aria-expanded={v.mFx} style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", padding: "0 12px", border: "0", background: "transparent", font: "inherit", letterSpacing: "inherit", fontWeight: "500", color: "#0b1626", cursor: "pointer", borderRadius: "12px" }}>
                    {"Features"}
                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0b1626"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ transform: v.mFr, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                      <path d={"M6 9l6 6 6-6"}></path>
                    </svg>
                  </button>
                  {" "}
                  <div style={{ position: "absolute", top: "100%", left: "0", paddingTop: "8px", opacity: v.mFo, transform: `translateY(${v.mFy ?? ""}px)`, pointerEvents: v.mFpe, visibility: v.mFv, transition: "opacity 160ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1),visibility 160ms" }}>
                    {" "}
                    <div style={{ background: "#ffffff", border: "1px solid #e6ebf2", borderRadius: "20px", padding: "16px", display: "flex", gap: "16px", boxShadow: "0 16px 40px -16px rgba(11,22,38,.25)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "220px" }}>
                        <span style={{ padding: "4px 12px 8px", fontSize: "14px", fontWeight: "700", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          <span style={{ color: "#1f6be2" }}>
                            {"AI Ads Analyst"}
                          </span>
                          {" platform"}
                        </span>
                        <a href={"/#how"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <rect x={"5"} y={"3"} width={"14"} height={"18"} rx={"2"}></rect>
                              <path d={"M9 8h6M9 12h6M9 16h3"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Reporting"}
                          </span>
                        </a>
                        <a href={"/#how"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"}></path>
                              <path d={"M10 20.5a2 2 0 0 0 4 0"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Risk alerts"}
                          </span>
                        </a>
                        <a href={"/#how"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M4 5h16v11H9l-5 4z"}></path>
                              <path d={"M8 9h8M8 12h5"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Drafted check-ins"}
                          </span>
                        </a>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <circle cx={"12"} cy={"12"} r={"3"}></circle>
                              <circle cx={"4.5"} cy={"5"} r={"2"}></circle>
                              <circle cx={"19.5"} cy={"5"} r={"2"}></circle>
                              <circle cx={"4.5"} cy={"19"} r={"2"}></circle>
                              <circle cx={"19.5"} cy={"19"} r={"2"}></circle>
                              <path d={"M6 6.5l4 3.5M18 6.5l-4 3.5M6 17.5l4-3.5M18 17.5l-4-3.5"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Integrations"}
                          </span>
                        </a>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "220px" }}>
                        <span style={{ padding: "4px 12px 8px", fontSize: "14px", fontWeight: "700", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          {" "}
                        </span>
                        <a href={"/#how"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <rect x={"3"} y={"5"} width={"18"} height={"16"} rx={"2"}></rect>
                              <path d={"M3 10h18M8 3v4M16 3v4"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Scheduled delivery"}
                          </span>
                        </a>
                        <a href={"/#pricing"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M3 12V4h8l10 10-8 8z"}></path>
                              <circle cx={"7.5"} cy={"8.5"} r={"1.5"}></circle>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"White label"}
                          </span>
                        </a>
                        <a href={"/#how"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <rect x={"3"} y={"3"} width={"7"} height={"7"} rx={"1.5"}></rect>
                              <rect x={"14"} y={"3"} width={"7"} height={"7"} rx={"1.5"}></rect>
                              <rect x={"3"} y={"14"} width={"7"} height={"7"} rx={"1.5"}></rect>
                              <rect x={"14"} y={"14"} width={"7"} height={"7"} rx={"1.5"}></rect>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Client dashboard"}
                          </span>
                        </a>
                        <a href={"/#how"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"}></path>
                              <path d={"M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Feature overview"}
                          </span>
                        </a>
                      </div>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{ position: "relative" }} onMouseEnter={v.openI} onMouseLeave={v.closeMenu}>
                  {" "}
                  <button onClick={v.toggleI} aria-expanded={v.mIx} style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", padding: "0 12px", border: "0", background: "transparent", font: "inherit", letterSpacing: "inherit", fontWeight: "500", color: "#0b1626", cursor: "pointer", borderRadius: "12px" }}>
                    {"Integrations"}
                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0b1626"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ transform: v.mIr, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                      <path d={"M6 9l6 6 6-6"}></path>
                    </svg>
                  </button>
                  {" "}
                  <div style={{ position: "absolute", top: "100%", left: "0", paddingTop: "8px", opacity: v.mIo, transform: `translateY(${v.mIy ?? ""}px)`, pointerEvents: v.mIpe, visibility: v.mIv, transition: "opacity 160ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1),visibility 160ms" }}>
                    {" "}
                    <div style={{ background: "#ffffff", border: "1px solid #e6ebf2", borderRadius: "20px", padding: "16px", display: "flex", gap: "16px", boxShadow: "0 16px 40px -16px rgba(11,22,38,.25)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "230px" }}>
                        <span style={{ padding: "4px 12px 8px", fontSize: "14px", fontWeight: "700", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          {"Ads"}
                        </span>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-meta.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Meta"}
                          </span>
                        </a>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-google-ads.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Ads"}
                          </span>
                        </a>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-linkedin.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"LinkedIn Ads"}
                          </span>
                        </a>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-microsoft.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Microsoft Ads"}
                          </span>
                        </a>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "230px" }}>
                        <span style={{ padding: "4px 12px 8px", fontSize: "14px", fontWeight: "700", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          {"Analytics and more"}
                        </span>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-ga4.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Analytics 4"}
                          </span>
                        </a>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-search-console.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Search Console"}
                          </span>
                        </a>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-tiktok.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"TikTok Ads"}
                          </span>
                        </a>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-google-business.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Business Profile"}
                          </span>
                        </a>
                        <a href={"/integrations"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#1f6be2", transition: "background-color 120ms ease" }} className="dcc638d12">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <circle cx={"12"} cy={"12"} r={"3"}></circle>
                              <circle cx={"4.5"} cy={"5"} r={"2"}></circle>
                              <circle cx={"19.5"} cy={"5"} r={"2"}></circle>
                              <circle cx={"4.5"} cy={"19"} r={"2"}></circle>
                              <circle cx={"19.5"} cy={"19"} r={"2"}></circle>
                              <path d={"M6 6.5l4 3.5M18 6.5l-4 3.5M6 17.5l4-3.5M18 17.5l-4-3.5"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "600" }}>
                            {"See all integrations"}
                          </span>
                        </a>
                      </div>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{ position: "relative" }} onMouseEnter={v.openS} onMouseLeave={v.closeMenu}>
                  {" "}
                  <button onClick={v.toggleS} aria-expanded={v.mSx} style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", padding: "0 12px", border: "0", background: "transparent", font: "inherit", letterSpacing: "inherit", fontWeight: "500", color: "#0b1626", cursor: "pointer", borderRadius: "12px" }}>
                    {"Solutions"}
                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0b1626"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ transform: v.mSr, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                      <path d={"M6 9l6 6 6-6"}></path>
                    </svg>
                  </button>
                  {" "}
                  <div style={{ position: "absolute", top: "100%", left: "0", paddingTop: "8px", opacity: v.mSo, transform: `translateY(${v.mSy ?? ""}px)`, pointerEvents: v.mSpe, visibility: v.mSv, transition: "opacity 160ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1),visibility 160ms" }}>
                    {" "}
                    <div style={{ background: "#ffffff", border: "1px solid #e6ebf2", borderRadius: "20px", padding: "16px", display: "flex", gap: "16px", boxShadow: "0 16px 40px -16px rgba(11,22,38,.25)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "220px" }}>
                        <span style={{ padding: "4px 12px 8px", fontSize: "14px", fontWeight: "700", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          {"By report"}
                        </span>
                        <a href={"/report-examples"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M4 20V10M10 20V4M16 20v-7M22 20H2"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Paid ads reports"}
                          </span>
                        </a>
                        <a href={"/report-examples"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M7 11v9H4v-9zM7 11l4-7a2 2 0 0 1 3 2l-1 4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Social ads reports"}
                          </span>
                        </a>
                        <a href={"/report-examples"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <circle cx={"12"} cy={"12"} r={"9"}></circle>
                              <path d={"M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Website analytics reports"}
                          </span>
                        </a>
                        <a href={"/report-examples"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <rect x={"5"} y={"3"} width={"14"} height={"18"} rx={"2"}></rect>
                              <path d={"M9 8h6M9 12h6M9 16h3"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"See report examples"}
                          </span>
                        </a>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "220px" }}>
                        <span style={{ padding: "4px 12px 8px", fontSize: "14px", fontWeight: "700", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          {"By team"}
                        </span>
                        <a href={"/freelancers"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <circle cx={"12"} cy={"8"} r={"4"}></circle>
                              <path d={"M4 21a8 8 0 0 1 16 0"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Freelancers"}
                          </span>
                        </a>
                        <a href={"/agencies"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <circle cx={"9"} cy={"8"} r={"3.5"}></circle>
                              <circle cx={"17"} cy={"9"} r={"2.5"}></circle>
                              <path d={"M2.5 20a6.5 6.5 0 0 1 13 0M15 14.5a5 5 0 0 1 6.5 5.5"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Small agencies"}
                          </span>
                        </a>
                        <a href={"/in-house"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <rect x={"3"} y={"7"} width={"18"} height={"13"} rx={"2"}></rect>
                              <path d={"M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"In-house marketers"}
                          </span>
                        </a>
                      </div>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{ position: "relative" }} onMouseEnter={v.openR} onMouseLeave={v.closeMenu}>
                  {" "}
                  <button onClick={v.toggleR} aria-expanded={v.mRx} style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", padding: "0 12px", border: "0", background: "transparent", font: "inherit", letterSpacing: "inherit", fontWeight: "500", color: "#0b1626", cursor: "pointer", borderRadius: "12px" }}>
                    {"Resources"}
                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0b1626"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ transform: v.mRr, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                      <path d={"M6 9l6 6 6-6"}></path>
                    </svg>
                  </button>
                  {" "}
                  <div style={{ position: "absolute", top: "100%", left: "0", paddingTop: "8px", opacity: v.mRo, transform: `translateY(${v.mRy ?? ""}px)`, pointerEvents: v.mRpe, visibility: v.mRv, transition: "opacity 160ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1),visibility 160ms" }}>
                    {" "}
                    <div style={{ background: "#ffffff", border: "1px solid #e6ebf2", borderRadius: "20px", padding: "16px", display: "flex", gap: "16px", boxShadow: "0 16px 40px -16px rgba(11,22,38,.25)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "220px" }}>
                        <span style={{ padding: "4px 12px 8px", fontSize: "14px", fontWeight: "700", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          {"Learn"}
                        </span>
                        <a href={"/help"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <circle cx={"12"} cy={"12"} r={"9"}></circle>
                              <path d={"M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Help center"}
                          </span>
                        </a>
                        <a href={"/blog"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"}></path>
                              <path d={"M4 19V5"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Blog"}
                          </span>
                        </a>
                        <a href={"/report-examples"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <rect x={"5"} y={"3"} width={"14"} height={"18"} rx={"2"}></rect>
                              <path d={"M9 8h6M9 12h6M9 16h3"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"Report examples"}
                          </span>
                        </a>
                        <a href={"/changelog"} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "8px 12px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", transition: "background-color 120ms ease" }} className="dc0d2bdff">
                          <span style={{ flex: "none", width: "24px", display: "grid", placeItems: "center" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"}></path>
                              <path d={"M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"}></path>
                            </svg>
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {"What's new"}
                          </span>
                        </a>
                      </div>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <a href={"#pricing"} style={{ display: "flex", alignItems: "center", height: "44px", padding: "0 12px", textDecoration: "none", color: "#0b1626", fontWeight: "500" }}>
                  {"Pricing"}
                </a>
                {" "}
              </nav>
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {" "}
              <a href={"/login"} className="clario-dlogin" style={{ display: "flex", alignItems: "center", height: "44px", padding: "0 12px", textDecoration: "none", color: "#0b1626", fontWeight: "500" }}>
                {"Log in"}
              </a>
              {" "}
              <a href={"#pricing"} style={{ display: "flex", alignItems: "center", height: "44px", padding: "0 18px", background: "#1f6be2", color: "#ffffff", borderRadius: "14px", textDecoration: "none", fontWeight: "600", transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc41f4d87 dcadff8cd">
                {"Start free"}
              </a>
              <button type="button" ref={v.mnavBtnRef} className="clario-burger dc0d2bdff" onClick={v.mnavToggle} aria-expanded={v.mnavOpen} aria-controls="mobile-nav" aria-label={v.mnavOpen ? "Close menu" : "Open menu"} style={{ width: "44px", height: "44px", placeItems: "center", border: "0", borderRadius: "12px", background: "transparent", color: "#0b1626", cursor: "pointer", padding: "0" }}>
                <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                  {v.mnavOpen ? <path d={"M6 6l12 12M18 6L6 18"}></path> : <path d={"M4 7h16M4 12h16M4 17h16"}></path>}
                </svg>
              </button>
            </div>
            {" "}
          </div>
          {v.mnavOpen && (
            <nav id="mobile-nav" aria-label={"Menu"} className="clario-mnav" style={{ position: "fixed", top: "73px", left: "0", right: "0", bottom: "0", background: "#ffffff", overflowY: "auto", padding: "8px 16px 24px", display: "flex", flexDirection: "column" }}>
              {v.mnavGroups.map(g => (
                <div key={g.label} style={{ borderBottom: "1px solid #eef1f6" }}>
                  <button type="button" onClick={g.toggle} aria-expanded={g.open} className="dc0d2bdff" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "52px", padding: "0 8px", border: "0", borderRadius: "12px", background: "transparent", font: "inherit", fontSize: "17px", fontWeight: "500", color: "#0b1626", cursor: "pointer" }}>
                    {g.label}
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0b1626"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} style={{ transform: g.open ? "rotate(180deg)" : "none", transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                      <path d={"M6 9l6 6 6-6"}></path>
                    </svg>
                  </button>
                  {g.open && (
                    <div style={{ display: "flex", flexDirection: "column", padding: "0 0 8px" }}>
                      {g.links.map(l => (
                        <a key={l[1]} href={l[0]} onClick={v.mnavClose} className="dc0d2bdff" style={{ display: "flex", alignItems: "center", minHeight: "44px", padding: "0 8px 0 20px", borderRadius: "12px", textDecoration: "none", color: "#45505f", fontSize: "16px" }}>
                          {l[1]}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href={"#pricing"} onClick={v.mnavClose} className="dc0d2bdff" style={{ display: "flex", alignItems: "center", minHeight: "52px", padding: "0 8px", borderRadius: "12px", textDecoration: "none", color: "#0b1626", fontSize: "17px", fontWeight: "500" }}>
                {"Pricing"}
              </a>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto", paddingTop: "24px" }}>
                <a href={"/login"} className="dc0d2bdff" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "48px", borderRadius: "14px", border: "1px solid #d5dce6", textDecoration: "none", color: "#0b1626", fontWeight: "600" }}>
                  {"Log in"}
                </a>
                <a href={"#pricing"} onClick={v.mnavClose} className="dc41f4d87" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "48px", borderRadius: "14px", background: "#1f6be2", textDecoration: "none", color: "#ffffff", fontWeight: "600" }}>
                  {"Start free"}
                </a>
              </div>
            </nav>
          )}
        </header>
        <main className={v.deckCls} style={{ position: "relative", height: v.deckH }}>
          <div style={{ position: v.dkPos, top: "72px", height: v.dkH, display: v.dkD, gridTemplateRows: "minmax(0,1fr)", gridTemplateColumns: "minmax(0,1fr)", overflow: v.dkO }}>
            <div data-page={"0"} style={{ gridArea: v.dA, display: v.dD, flexDirection: "column", justifyContent: "center", height: v.dH, background: v.pgBg0, opacity: v.pgO0, transform: v.pgT0, pointerEvents: v.pgPe0, transition: v.dTr }}>
              <div className="clario-fit">
              <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "48px", alignItems: "center" }}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "560px" }}>
                  {" "}
                  <h1 style={{ margin: "0", fontSize: "clamp(44px,6vw,70px)", fontWeight: "900", lineHeight: "1", letterSpacing: "-0.037em", textWrap: "balance" }}>
                    {"Digital marketing reporting made easy with "}
                    <span style={{ color: "#1f6be2" }}>
                      {"AI Ads Analyst"}
                    </span>
                  </h1>
                  {" "}
                  <p style={{ margin: "0", fontSize: "20px", lineHeight: "1.4", letterSpacing: "-0.74px", color: "#5a6474", textWrap: "pretty" }}>
                    <span style={{ color: "#1f6be2" }}>
                      {"Analyst"}
                    </span>
                    {" connects to your ad and analytics accounts, writes each client's weekly report in plain language, and warns you when a client starts drifting away."}
                  </p>
                  {" "}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
                    {" "}
                    <a href={"#pricing"} style={{ display: "inline-flex", alignItems: "center", height: "48px", padding: "0 20px", whiteSpace: "nowrap", flex: "none", background: "#1f6be2", color: "#ffffff", borderRadius: "16px", fontWeight: "600", textDecoration: "none", transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc41f4d87 dcadff8cd">
                      {"Start free with 2 clients"}
                    </a>
                    {" "}
                    <a href={"#how"} style={{ display: "inline-flex", alignItems: "center", height: "48px", padding: "0 8px", color: "#0b1626", fontWeight: "500", textDecoration: "none" }} className="dc93c1ac2">
                      {"See how it works"}
                    </a>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }} onMouseEnter={v.pause} onMouseLeave={v.resume}>
                  {" "}
                  <div style={{ position: "relative", width: "100%", maxWidth: "620px", height: "620px", display: "grid", placeItems: "center" }}>
                    {" "}
                    <button onClick={v.pick3} aria-label={v.lbl3} style={{ gridArea: "1/1", width: "min(430px,86%)", border: "0", padding: "24px", textAlign: "left", font: "inherit", letterSpacing: "inherit", color: "#ffffff", cursor: "pointer", background: "#000000", borderRadius: "32px", display: "flex", flexDirection: "column", gap: "18px", transform: v.tf3, zIndex: v.z3, transition: "transform 520ms cubic-bezier(0.32,0.72,0,1)" }}>
                      {" "}
                      <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ flex: "none", width: "44px", height: "44px", borderRadius: "12px", background: "#ffffff", display: "grid", placeItems: "center" }}>
                          <img src={"/assets/logo-tiktok.png"} alt={""} width={"26"} height={"26"} style={{ width: "26px", height: "26px", objectFit: "contain", display: "block" }} />
                        </span>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "600" }}>
                            {"TikTok Ads"}
                          </span>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#a8a8a8" }}>
                            {"Spring campaign · Last 7 days"}
                          </span>
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#a8a8a8" }}>
                          {"Video views"}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "40px", fontWeight: "700", letterSpacing: "-1.5px", lineHeight: "1.05", fontVariantNumeric: "tabular-nums" }}>
                            {"48.2k"}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: "9999px", background: "rgba(37,244,238,.16)", color: "#25F4EE", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                            {"+18%"}
                          </span>
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "96px" }}>
                        <span style={{ flex: "1", height: "35%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                        <span style={{ flex: "1", height: "48%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                        <span style={{ flex: "1", height: "42%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                        <span style={{ flex: "1", height: "60%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                        <span style={{ flex: "1", height: "55%", borderRadius: "6px", background: "#2f2f2f" }}></span>
                        <span style={{ flex: "1", height: "78%", borderRadius: "6px", background: "#25F4EE" }}></span>
                        <span style={{ flex: "1", height: "96%", borderRadius: "6px", background: "#FE2C55" }}></span>
                      </span>
                      {" "}
                      <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", letterSpacing: "-0.52px", color: "#a8a8a8", marginTop: "-8px" }}>
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
                        <span style={{ flex: "1", textAlign: "center" }}>
                          {"S"}
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "0", borderTop: "1px solid #262626", paddingTop: "14px" }}>
                        <span style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#a8a8a8" }}>
                            {"Avg. watch"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>
                            {"6.1s"}
                          </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", paddingLeft: "14px", borderLeft: "1px solid #262626" }}>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#a8a8a8" }}>
                            {"Clicks"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>
                            {"1,204"}
                          </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", paddingLeft: "14px", borderLeft: "1px solid #262626" }}>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#a8a8a8" }}>
                            {"CTR"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>
                            {"2.5%"}
                          </span>
                        </span>
                      </span>
                      {" "}
                    </button>
                    {" "}
                    <button onClick={v.pick2} aria-label={v.lbl2} style={{ gridArea: "1/1", width: "min(430px,86%)", border: "0", padding: "24px", textAlign: "left", font: "inherit", letterSpacing: "inherit", color: "#1c2b33", cursor: "pointer", background: "#F0F2F5", borderRadius: "32px", display: "flex", flexDirection: "column", gap: "18px", transform: v.tf2, zIndex: v.z2, transition: "transform 520ms cubic-bezier(0.32,0.72,0,1)" }}>
                      {" "}
                      <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ flex: "none", width: "44px", height: "44px", borderRadius: "12px", background: "#ffffff", display: "grid", placeItems: "center" }}>
                          <img src={"/assets/logo-meta.png"} alt={""} width={"26"} height={"26"} style={{ width: "26px", height: "26px", objectFit: "contain", display: "block" }} />
                        </span>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "600" }}>
                            {"Meta Pixel"}
                          </span>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#65676b" }}>
                            {"Events Manager · Last 7 days"}
                          </span>
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "9999px", background: "#ffffff", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#31a24c" }}></span>
                          {"Live"}
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#65676b" }}>
                          {"Leads tracked"}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "40px", fontWeight: "700", letterSpacing: "-1.5px", lineHeight: "1.05", fontVariantNumeric: "tabular-nums" }}>
                            {"97"}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: "9999px", background: "#e3f1e5", color: "#1e7a34", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                            {"+9%"}
                          </span>
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px", letterSpacing: "-0.52px" }}>
                            <span style={{ fontWeight: "600" }}>
                              {"PageView"}
                            </span>
                            <span style={{ fontVariantNumeric: "tabular-nums" }}>
                              <span style={{ fontWeight: "700" }}>
                                {"3,120"}
                              </span>
                            </span>
                          </span>
                          <span style={{ height: "14px", borderRadius: "9999px", background: "#ffffff" }}>
                            <span style={{ display: "block", height: "100%", width: "100%", borderRadius: "9999px", background: "#0866FF" }}></span>
                          </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px", letterSpacing: "-0.52px" }}>
                            <span style={{ fontWeight: "600" }}>
                              {"ViewContent"}
                            </span>
                            <span style={{ fontVariantNumeric: "tabular-nums" }}>
                              <span style={{ fontWeight: "700" }}>
                                {"1,480"}
                              </span>
                              <span style={{ color: "#65676b" }}>
                                {" · 47%"}
                              </span>
                            </span>
                          </span>
                          <span style={{ height: "14px", borderRadius: "9999px", background: "#ffffff" }}>
                            <span style={{ display: "block", height: "100%", width: "47%", borderRadius: "9999px", background: "#0866FF" }}></span>
                          </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px", letterSpacing: "-0.52px" }}>
                            <span style={{ fontWeight: "600" }}>
                              {"Lead"}
                            </span>
                            <span style={{ fontVariantNumeric: "tabular-nums" }}>
                              <span style={{ fontWeight: "700" }}>
                                {"97"}
                              </span>
                              <span style={{ color: "#65676b" }}>
                                {" · 6.6%"}
                              </span>
                            </span>
                          </span>
                          <span style={{ height: "14px", borderRadius: "9999px", background: "#ffffff" }}>
                            <span style={{ display: "block", height: "100%", width: "8%", borderRadius: "9999px", background: "#0866FF" }}></span>
                          </span>
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", letterSpacing: "-0.52px", color: "#65676b", borderTop: "1px solid #dadde1", paddingTop: "14px" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#31a24c"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        {"Pixel healthy · last event 2 min ago"}
                      </span>
                      {" "}
                    </button>
                    {" "}
                    <button onClick={v.pick1} aria-label={v.lbl1} style={{ gridArea: "1/1", width: "min(430px,86%)", border: "0", padding: "24px", textAlign: "left", font: "inherit", letterSpacing: "inherit", color: "#202124", cursor: "pointer", background: "#ffffff", borderRadius: "32px", display: "flex", flexDirection: "column", gap: "18px", border: "1px solid #dadce0", transform: v.tf1, zIndex: v.z1, transition: "transform 520ms cubic-bezier(0.32,0.72,0,1)" }}>
                      {" "}
                      <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ flex: "none", width: "44px", height: "44px", borderRadius: "12px", background: "#f1f3f4", display: "grid", placeItems: "center" }}>
                          <img src={"/assets/logo-ga4.png"} alt={""} width={"26"} height={"26"} style={{ width: "26px", height: "26px", objectFit: "contain", display: "block" }} />
                        </span>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "600" }}>
                            {"Google Analytics 4"}
                          </span>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5f6368" }}>
                            {"harborpinedental.com · Last 7 days"}
                          </span>
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5f6368" }}>
                          {"Sessions"}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "40px", fontWeight: "700", letterSpacing: "-1.5px", lineHeight: "1.05", fontVariantNumeric: "tabular-nums" }}>
                            {"3,410"}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: "9999px", background: "#e6f4ea", color: "#137333", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                            {"+12%"}
                          </span>
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "block" }}>
                        <svg viewBox={"0 0 292 110"} preserveAspectRatio={"none"} style={{ width: "100%", height: "110px", display: "block" }}>
                          <path d={"M0 27.5H292M0 55H292M0 82.5H292"} stroke={"#f1f3f4"} strokeWidth={"1"} vectorEffect={"non-scaling-stroke"}></path>
                          <path d={"M0 80 C30 74 50 86 80 70 S130 50 160 58 S220 30 250 24 S280 16 292 14 L292 110 L0 110 Z"} fill={"#e8f0fe"}></path>
                          <path d={"M0 80 C30 74 50 86 80 70 S130 50 160 58 S220 30 250 24 S280 16 292 14"} stroke={"#1A73E8"} strokeWidth={"3"} fill={"none"} strokeLinecap={"round"} vectorEffect={"non-scaling-stroke"}></path>
                          <path d={"M0 96 C40 94 80 92 120 88 S200 84 292 76"} stroke={"#9aa0a6"} strokeWidth={"2"} fill={"none"} strokeDasharray={"4 5"} vectorEffect={"non-scaling-stroke"}></path>
                        </svg>
                      </span>
                      {" "}
                      <span style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", letterSpacing: "-0.52px", color: "#5f6368", marginTop: "-8px" }}>
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
                        <span style={{ flex: "1", textAlign: "center" }}>
                          {"S"}
                        </span>
                      </span>
                      {" "}
                      <span style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "0", borderTop: "1px solid #e8eaed", paddingTop: "14px" }}>
                        <span style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5f6368" }}>
                            {"Users"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>
                            {"2,180"}
                          </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", paddingLeft: "14px", borderLeft: "1px solid #e8eaed" }}>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5f6368" }}>
                            {"Conversions"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>
                            {"143"}
                          </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", paddingLeft: "14px", borderLeft: "1px solid #e8eaed" }}>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5f6368" }}>
                            {"Conv. rate"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>
                            {"4.2%"}
                          </span>
                        </span>
                      </span>
                      {" "}
                    </button>
                    {" "}
                    <button onClick={v.pick0} aria-label={v.lbl0} style={{ gridArea: "1/1", width: "min(430px,86%)", border: "0", padding: "24px", textAlign: "left", font: "inherit", letterSpacing: "inherit", color: "#ffffff", cursor: "pointer", background: "#0b1626", borderRadius: "32px", display: "flex", flexDirection: "column", gap: "18px", transform: v.tf0, zIndex: v.z0, transition: "transform 520ms cubic-bezier(0.32,0.72,0,1)" }}>
                      {" "}
                      <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ flex: "none", width: "44px", height: "44px", borderRadius: "12px", background: "#ffffff", display: "grid", placeItems: "center" }}>
                          <img src={"/assets/clario-mark-v2.png"} alt={""} width={"30"} height={"30"} style={{ width: "30px", height: "30px", objectFit: "contain", display: "block" }} />
                        </span>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "600" }}>
                            {"Harbor & Pine Dental"}
                          </span>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#b8c4d4" }}>
                            {"Weekly report · Sep 29 – Oct 5"}
                          </span>
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 8px", borderRadius: "9999px", background: "#e3f3e8", color: "#1d6b3a", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                          {"Healthy"}
                        </span>
                      </span>
                      {" "}
                      <span style={{ fontSize: "22px", lineHeight: "1.35", fontWeight: "500", letterSpacing: "-0.74px", textWrap: "pretty" }}>
                        {"Leads were flat this week, but each one cost 11% less. Fewer people saw the ads because we narrowed the audience on Oct 3."}
                      </span>
                      {" "}
                      <span style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "0", borderTop: "1px solid rgba(255,255,255,.14)", paddingTop: "14px" }}>
                        <span style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#b8c4d4" }}>
                            {"Leads"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>
                            {"142"}
                          </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", paddingLeft: "14px", borderLeft: "1px solid rgba(255,255,255,.14)" }}>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#b8c4d4" }}>
                            {"Cost per lead"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>
                            {"$8.73"}
                          </span>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", paddingLeft: "14px", borderLeft: "1px solid rgba(255,255,255,.14)" }}>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#b8c4d4" }}>
                            {"Spend"}
                          </span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.6px", fontVariantNumeric: "tabular-nums" }}>
                            {"$1,240"}
                          </span>
                        </span>
                      </span>
                      {" "}
                    </button>
                    {" "}
                  </div>
                  {" "}
                </div>
              </section>
              <section style={{ position: "relative", zIndex: "1", maxWidth: "1200px", margin: "-56px auto 0", padding: "0 24px 80px" }}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "20px" }}>
                  {" "}
                  <span style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-0.74px" }}>
                    {"Works with the platforms you already use"}
                  </span>
                  {" "}
                  <div style={{ width: "100%", overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)" }}>
                    {" "}
                    <div style={{ display: "flex", width: "max-content", animation: "clario-marquee 40s linear infinite" }} className="dcc0dc266">
                      {" "}
                      <div style={{ display: "flex", gap: "12px", paddingRight: "12px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-meta.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Meta"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-ga4.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Analytics 4"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-search-console.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Search Console"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-tiktok.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"TikTok Ads"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-google-ads.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Ads"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-linkedin.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"LinkedIn Ads"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-google-business.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Business Profile"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-microsoft.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Microsoft Ads"}
                          </span>
                        </span>
                      </div>
                      {" "}
                      <div aria-hidden={"true"} style={{ display: "flex", gap: "12px", paddingRight: "12px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-meta.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Meta"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-ga4.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Analytics 4"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-search-console.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Search Console"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-tiktok.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"TikTok Ads"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-google-ads.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Ads"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-linkedin.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"LinkedIn Ads"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-google-business.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Google Business Profile"}
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px 8px 8px", borderRadius: "9999px", background: "#f0f3f8" }}>
                          <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", display: "grid", placeItems: "center" }}>
                            <img src={"/assets/logo-microsoft.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                          </span>
                          <span style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                            {"Microsoft Ads"}
                          </span>
                        </span>
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
              </section>
              </div>
            </div>
            <div data-page={"1"} style={{ gridArea: v.dA, display: v.dD, flexDirection: "column", justifyContent: "center", height: v.dH, background: v.pgBg1, opacity: v.pgO1, transform: v.pgT1, pointerEvents: v.pgPe1, transition: v.dTr }}>
              <div className="clario-fit">
              <section style={{ background: "#ffffff", color: "#0b1626", overflow: "hidden" }}>
                {" "}
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "110px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "56px 80px", alignItems: "center" }}>
                  {" "}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "500px" }}>
                    {" "}
                    <h2 style={{ margin: "0", fontSize: "clamp(36px,4vw,48px)", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-0.035em", textWrap: "balance" }}>
                      {"Many clients who cancel weren't getting bad results. "}
                      <span style={{ color: "#1f6be2" }}>
                        {"They just couldn't tell what was going on."}
                      </span>
                    </h2>
                    {" "}
                    <p style={{ margin: "0", fontSize: "18px", color: "#5a6474", textWrap: "pretty" }}>
                      {"Writing a clear report for every client, every week, takes hours. "}
                      <span style={{ color: "#1f6be2" }}>
                        {"Analyst"}
                      </span>
                      {" will write it for you, so all you do is review and send."}
                    </p>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "8px 0" }}>
                    {" "}
                    <div style={{ alignSelf: "flex-start", maxWidth: "340px", display: "flex", alignItems: "flex-end", gap: "10px", transform: "rotate(-1deg)", transition: "transform 320ms cubic-bezier(0.23,1,0.32,1)" }} className="dc056570b">
                      {" "}
                      <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#e6ebf2", color: "#0b1626", display: "grid", placeItems: "center", fontWeight: "700" }}>
                        {"D"}
                      </span>
                      {" "}
                      <span style={{ background: "#f0f3f8", borderRadius: "20px 20px 20px 6px", padding: "14px 18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          {"Your client, Friday 4:12pm"}
                        </span>
                        <span style={{ fontSize: "18px", lineHeight: "1.35" }}>
                          {"Are the ads actually doing anything? I'm not really seeing it."}
                        </span>
                      </span>
                      {" "}
                    </div>
                    {" "}
                    <figure style={{ margin: "0", alignSelf: "flex-end", maxWidth: "440px", background: "#f0f3f8", color: "#0b1626", borderRadius: "28px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(2deg)", transition: "transform 320ms cubic-bezier(0.23,1,0.32,1)" }} className="dc056570b">
                      {" "}
                      <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "9999px", background: "#ffffff", color: "#0b1626", fontSize: "14px", fontWeight: "500", letterSpacing: "-0.52px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff4500" }}></span>
                        {"r/digital_marketing"}
                      </span>
                      {" "}
                      <blockquote style={{ margin: "0", fontSize: "24px", fontWeight: "600", lineHeight: "1.25", letterSpacing: "-0.88px" }}>
                        {"“They see the overhaul, but don't see overnight results, so they're convinced it didn't work… "}
                        <span style={{ background: "#fffd92", padding: "0 4px" }}>
                          {"then they cancel."}
                        </span>
                        {"”"}
                      </blockquote>
                      {" "}
                      <figcaption style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                        {"Agency owner"}
                      </figcaption>
                      {" "}
                    </figure>
                    {" "}
                    <figure style={{ margin: "0", alignSelf: "flex-start", maxWidth: "380px", background: "#1f6be2", color: "#ffffff", borderRadius: "28px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(-2.5deg)", transition: "transform 320ms cubic-bezier(0.23,1,0.32,1)" }} className="dc056570b">
                      {" "}
                      <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "9999px", background: "rgba(255,255,255,.15)", color: "#ffffff", fontSize: "14px", fontWeight: "500", letterSpacing: "-0.52px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff4500" }}></span>
                        {"r/digital_marketing"}
                      </span>
                      {" "}
                      <blockquote style={{ margin: "0", fontSize: "28px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-1.03px" }}>
                        {"“Half my Friday cleaning up charts.”"}
                      </blockquote>
                      {" "}
                      <figcaption style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#d6e4f8" }}>
                        {"Freelance marketer"}
                      </figcaption>
                      {" "}
                    </figure>
                    {" "}
                  </div>
                  {" "}
                </div>
              </section>
              </div>
            </div>
            <div data-page={"2"} style={{ gridArea: v.dA, display: v.dD, flexDirection: "column", justifyContent: "center", height: v.dH, background: v.pgBg2, opacity: v.pgO2, transform: v.pgT2, pointerEvents: v.pgPe2, transition: v.dTr }}>
              <div className="clario-fit">
              <section id={"how"} style={{ position: "relative", height: v.howH }}>
                {" "}
                <div style={{ position: v.stPos, top: "72px", height: v.stH, maxWidth: "1200px", margin: "0 auto", padding: v.stPad, display: "grid", alignContent: "center", gap: v.stGap }}>
                  {" "}
                  <div style={{ gridArea: v.rA0, width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "48px", alignItems: "center", opacity: v.rO0, transform: v.rT0, pointerEvents: v.rPe0, transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1),transform 650ms cubic-bezier(0.23,1,0.32,1)" }}>
                    {" "}
                    <div aria-hidden={"true"} style={{ background: "#e6ebf2", borderRadius: "40px", padding: "36px" }}>
                      {" "}
                      <div style={{ background: "#ffffff", borderRadius: "24px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                        {" "}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                          {" "}
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.74px" }}>
                            {"Connect your data"}
                          </span>
                          {" "}
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", height: "36px", padding: "0 12px", borderRadius: "12px", background: "#f0f3f8", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                            <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#d6e4f8", display: "grid", placeItems: "center", fontSize: "10px", letterSpacing: "0" }}>
                              {"HP"}
                            </span>
                            {"Harbor & Pine Dental"}
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0b1626"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                              <path d={"M6 9l6 6 6-6"}></path>
                            </svg>
                          </span>
                          {" "}
                        </div>
                        {" "}
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", height: "44px", padding: "0 14px", borderRadius: "12px", border: "1px solid #e6ebf2", color: "#5a6474" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#5a6474"} strokeWidth={"2.2"} strokeLinecap={"round"}>
                            <circle cx={"11"} cy={"11"} r={"7"}></circle>
                            <path d={"M20 20l-4-4"}></path>
                          </svg>
                          {"Search integrations"}
                        </span>
                        {" "}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "10px" }}>
                          {" "}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px", borderRadius: "16px", border: "1px solid #eef1f6", background: "#ffffff" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ flex: "none", width: "40px", height: "40px", borderRadius: "12px", background: "#f0f3f8", display: "grid", placeItems: "center" }}>
                                <img src={"/assets/logo-meta.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                              </span>
                              <span style={{ minWidth: "0", fontWeight: "600", lineHeight: "1.25" }}>
                                {"Meta"}
                              </span>
                            </span>
                            <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "500", color: "#1d6b3a" }}>
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1d6b3a"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                              </svg>
                              {"Connected"}
                            </span>
                          </div>
                          {" "}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px", borderRadius: "16px", border: "1px solid #eef1f6", background: "#ffffff" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ flex: "none", width: "40px", height: "40px", borderRadius: "12px", background: "#f0f3f8", display: "grid", placeItems: "center" }}>
                                <img src={"/assets/logo-ga4.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                              </span>
                              <span style={{ minWidth: "0", fontWeight: "600", lineHeight: "1.25" }}>
                                {"Google Analytics 4"}
                              </span>
                            </span>
                            <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "500", color: "#1d6b3a" }}>
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1d6b3a"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                              </svg>
                              {"Connected"}
                            </span>
                          </div>
                          {" "}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px", borderRadius: "16px", border: "1px solid #cfe0fa", background: "#f5f9ff" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ flex: "none", width: "40px", height: "40px", borderRadius: "12px", background: "#f0f3f8", display: "grid", placeItems: "center" }}>
                                <img src={"/assets/logo-tiktok.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                              </span>
                              <span style={{ minWidth: "0", fontWeight: "600", lineHeight: "1.25" }}>
                                {"TikTok Ads"}
                              </span>
                            </span>
                            <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                                {"Importing "}{v.syncPct}{"%"}
                              </span>
                              <span style={{ height: "6px", borderRadius: "9999px", background: "#e6ebf2", overflow: "hidden" }}>
                                <span style={{ display: "block", height: "100%", width: v.syncW, background: "#1f6be2", borderRadius: "9999px", transition: "width 600ms cubic-bezier(0.23,1,0.32,1)" }}></span>
                              </span>
                            </span>
                          </div>
                          {" "}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px", borderRadius: "16px", border: "1px solid #eef1f6", background: "#ffffff" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ flex: "none", width: "40px", height: "40px", borderRadius: "12px", background: "#f0f3f8", display: "grid", placeItems: "center" }}>
                                <img src={"/assets/logo-google-ads.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                              </span>
                              <span style={{ minWidth: "0", fontWeight: "600", lineHeight: "1.25" }}>
                                {"Google Ads"}
                              </span>
                            </span>
                            <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", height: "30px", padding: "0 12px", borderRadius: "10px", border: "1px solid #0b1626", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                              {"Connect"}
                            </span>
                          </div>
                          {" "}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px", borderRadius: "16px", border: "1px solid #eef1f6", background: "#ffffff" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ flex: "none", width: "40px", height: "40px", borderRadius: "12px", background: "#f0f3f8", display: "grid", placeItems: "center" }}>
                                <img src={"/assets/logo-linkedin.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                              </span>
                              <span style={{ minWidth: "0", fontWeight: "600", lineHeight: "1.25" }}>
                                {"LinkedIn Ads"}
                              </span>
                            </span>
                            <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", height: "30px", padding: "0 12px", borderRadius: "10px", border: "1px solid #0b1626", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                              {"Connect"}
                            </span>
                          </div>
                          {" "}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px", borderRadius: "16px", border: "1px solid #eef1f6", background: "#ffffff" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ flex: "none", width: "40px", height: "40px", borderRadius: "12px", background: "#f0f3f8", display: "grid", placeItems: "center" }}>
                                <img src={"/assets/logo-search-console.png"} alt={""} width={"24"} height={"24"} style={{ width: "24px", height: "24px", objectFit: "contain", display: "block" }} />
                              </span>
                              <span style={{ minWidth: "0", fontWeight: "600", lineHeight: "1.25" }}>
                                {"Search Console"}
                              </span>
                            </span>
                            <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", height: "30px", padding: "0 12px", borderRadius: "10px", border: "1px solid #0b1626", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                              {"Connect"}
                            </span>
                          </div>
                          {" "}
                        </div>
                        {" "}
                        <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2f9e5b" }}></span>
                          {"2 of 3 sources ready. First report Monday, 8:00am."}
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
                      {" "}
                      <h2 style={{ margin: "0", fontSize: "38px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-1.41px" }}>
                        {"Connect your ad accounts"}
                      </h2>
                      {" "}
                      <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>
                        {"Log in to Meta Ads, GA4 and TikTok, and "}
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will match each account to the right client. If a login expires, "}
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will let you know before a report goes out with missing numbers."}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ gridArea: v.rA1, width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "48px", alignItems: "center", opacity: v.rO1, transform: v.rT1, pointerEvents: v.rPe1, transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1),transform 650ms cubic-bezier(0.23,1,0.32,1)" }}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
                      {" "}
                      <h2 style={{ margin: "0", fontSize: "38px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-1.41px" }}>
                        {"Automate weekly reports with "}
                        <span style={{ color: "#1f6be2" }}>
                          {"AI Ads Analyst"}
                        </span>
                      </h2>
                      {" "}
                      <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will write two versions every week: a short summary for your client, and a breakdown by platform for you, with anything worth fixing. Both are ready every Monday morning."}
                      </p>
                      {" "}
                    </div>
                    {" "}
                    <div aria-hidden={"true"} style={{ background: "#e6ebf2", borderRadius: "40px", padding: "36px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#ffffff", borderRadius: "9999px", padding: "8px 16px 8px 8px" }}>
                        {" "}
                        <img src={"/assets/clario-mark-v2.png"} alt={""} width={"32"} height={"32"} style={{ width: "32px", height: "32px", display: "block" }} />
                        {" "}
                        <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                          {"Writing reports"}
                        </span>
                        <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          {"Every Monday, 8:00am"}
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <svg viewBox={"0 0 200 48"} preserveAspectRatio={"none"} style={{ width: "56%", height: "48px", display: "block" }}>
                        <path d={"M100 0 C100 26 30 22 30 48"} stroke={"#0b1626"} strokeWidth={"2"} fill={"none"} strokeDasharray={"6 6"} vectorEffect={"non-scaling-stroke"}>
                          <animate attributeName={"stroke-dashoffset"} from={"24"} to={"0"} dur={"1s"} repeatCount={"indefinite"}></animate>
                        </path>
                        <path d={"M100 0 C100 26 170 22 170 48"} stroke={"#0b1626"} strokeWidth={"2"} fill={"none"} strokeDasharray={"6 6"} vectorEffect={"non-scaling-stroke"}>
                          <animate attributeName={"stroke-dashoffset"} from={"24"} to={"0"} dur={"1s"} repeatCount={"indefinite"}></animate>
                        </path>
                      </svg>
                      {" "}
                      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "16px", alignItems: "start" }}>
                        {" "}
                        <div style={{ background: "#ffffff", borderRadius: "20px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(-2deg)", transition: "transform 320ms cubic-bezier(0.23,1,0.32,1)" }} className="dc2f752bd">
                          {" "}
                          <span style={{ alignSelf: "flex-start", padding: "4px 10px", borderRadius: "9999px", background: "#0b1626", color: "#ffffff", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "500" }}>
                            {"For the client"}
                          </span>
                          {" "}
                          <span style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                              {"Leads this week"}
                            </span>
                            <span style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "32px", fontWeight: "700", letterSpacing: "-1.18px", lineHeight: "1.1" }}>
                                {"142"}
                              </span>
                              <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600", color: "#1d6b3a" }}>
                                {"11% cheaper"}
                              </span>
                            </span>
                          </span>
                          {" "}
                          <span style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "52px" }}>
                            <span style={{ flex: "1", height: "52%", borderRadius: "4px", background: "#d6e4f8" }}></span>
                            <span style={{ flex: "1", height: "60%", borderRadius: "4px", background: "#d6e4f8" }}></span>
                            <span style={{ flex: "1", height: "55%", borderRadius: "4px", background: "#d6e4f8" }}></span>
                            <span style={{ flex: "1", height: "70%", borderRadius: "4px", background: "#d6e4f8" }}></span>
                            <span style={{ flex: "1", height: "68%", borderRadius: "4px", background: "#d6e4f8" }}></span>
                            <span style={{ flex: "1", height: "92%", borderRadius: "4px", background: "#1f6be2" }}></span>
                          </span>
                          {" "}
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", lineHeight: "1.45", color: "#45505f", textWrap: "pretty" }}>
                            {"Leads held steady and each one cost less. More of your budget now reaches past visitors."}
                          </span>
                          {" "}
                        </div>
                        {" "}
                        <div style={{ background: "#ffffff", borderRadius: "20px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(2deg) translateY(16px)", transition: "transform 320ms cubic-bezier(0.23,1,0.32,1)" }} className="dc91e4695">
                          {" "}
                          <span style={{ alignSelf: "flex-start", padding: "4px 10px", borderRadius: "9999px", background: "#e6ebf2", color: "#0b1626", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "500" }}>
                            {"For you"}
                          </span>
                          {" "}
                          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "10px", background: "#f0f3f8", display: "grid", placeItems: "center" }}>
                              <img src={"/assets/logo-meta.png"} alt={""} width={"22"} height={"22"} style={{ width: "22px", height: "22px", objectFit: "contain", display: "block" }} />
                            </span>
                            <span style={{ minWidth: "0", display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                                {"Meta Ads"}
                              </span>
                              <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                                {"$6.10 per lead"}
                              </span>
                            </span>
                          </span>
                          {" "}
                          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "10px", background: "#f0f3f8", display: "grid", placeItems: "center" }}>
                              <img src={"/assets/logo-ga4.png"} alt={""} width={"20"} height={"20"} style={{ width: "20px", height: "20px", objectFit: "contain", display: "block" }} />
                            </span>
                            <span style={{ minWidth: "0", display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                                {"GA4"}
                              </span>
                              <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                                {"41% mobile drop-off"}
                              </span>
                            </span>
                          </span>
                          {" "}
                          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "10px", background: "#f0f3f8", display: "grid", placeItems: "center" }}>
                              <img src={"/assets/logo-tiktok.png"} alt={""} width={"20"} height={"20"} style={{ width: "20px", height: "20px", objectFit: "contain", display: "block" }} />
                            </span>
                            <span style={{ minWidth: "0", display: "flex", flexDirection: "column" }}>
                              <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                                {"TikTok Ads"}
                              </span>
                              <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                                {"Views up 18%"}
                              </span>
                            </span>
                          </span>
                          {" "}
                          <span style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "12px", background: "#fffd92", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "500" }}>
                            <span style={{ width: "7px", height: "7px", flex: "none", borderRadius: "50%", background: "#0b1626" }}></span>
                            {"Refresh the whitening ad"}
                          </span>
                          {" "}
                        </div>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ gridArea: v.rA2, width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "48px", alignItems: "center", opacity: v.rO2, transform: v.rT2, pointerEvents: v.rPe2, transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1),transform 650ms cubic-bezier(0.23,1,0.32,1)" }}>
                    {" "}
                    <div aria-hidden={"true"} style={{ background: "#e6ebf2", borderRadius: "40px", padding: "36px", display: "flex", flexDirection: "column", gap: "20px" }}>
                      {" "}
                      <div style={{ background: "#ffffff", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", transform: "rotate(-1.5deg)", transition: "transform 320ms cubic-bezier(0.23,1,0.32,1)" }} className="dc056570b">
                        {" "}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {" "}
                          <span style={{ flex: "none", width: "40px", height: "40px", borderRadius: "50%", background: "#d6e4f8", color: "#0b1626", display: "grid", placeItems: "center", fontWeight: "700" }}>
                            {"NP"}
                          </span>
                          {" "}
                          <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: "600" }}>
                              {"Northside Physio"}
                            </span>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                              {"Risk alert, Oct 8"}
                            </span>
                          </span>
                          {" "}
                          <span style={{ padding: "6px 12px", borderRadius: "9999px", background: "#fa5f2e", color: "#0b1626", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                            {"At risk"}
                          </span>
                          {" "}
                        </div>
                        {" "}
                        <span style={{ position: "relative", display: "block" }}>
                          {" "}
                          <svg viewBox={"0 0 300 70"} preserveAspectRatio={"none"} style={{ width: "100%", height: "70px", display: "block" }}>
                            <path d={"M0 14 C40 12 70 18 100 24 S170 38 200 46 S260 58 296 60 L296 70 L0 70 Z"} fill={"#fde6dc"}></path>
                            <path d={"M0 14 C40 12 70 18 100 24 S170 38 200 46 S260 58 296 60"} stroke={"#e0481a"} strokeWidth={"3"} fill={"none"} strokeLinecap={"round"} vectorEffect={"non-scaling-stroke"}></path>
                          </svg>
                          {" "}
                          <span style={{ position: "absolute", right: "0", top: "0", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600", color: "#b8380f" }}>
                            {"Leads −28% in 3 weeks"}
                          </span>
                          {" "}
                        </span>
                        {" "}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          {" "}
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderTop: "1px solid #eef1f6" }}>
                            <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "10px", background: "#fde6dc", display: "grid", placeItems: "center" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0b1626"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                <path d={"M3 6l6 6 4-4 8 8"}></path>
                                <path d={"M15 16h6v-6"}></path>
                              </svg>
                            </span>
                            <span style={{ flex: "1", minWidth: "0", fontWeight: "500" }}>
                              {"Fewer leads"}
                            </span>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474", textAlign: "right" }}>
                              {"3 weeks in a row"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderTop: "1px solid #eef1f6" }}>
                            <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "10px", background: "#fde6dc", display: "grid", placeItems: "center" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0b1626"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                <circle cx={"12"} cy={"12"} r={"9"}></circle>
                                <path d={"M12 7v5l3 2"}></path>
                              </svg>
                            </span>
                            <span style={{ flex: "1", minWidth: "0", fontWeight: "500" }}>
                              {"Portal not visited"}
                            </span>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474", textAlign: "right" }}>
                              {"Last visit Sep 12"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderTop: "1px solid #eef1f6" }}>
                            <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "10px", background: "#fde6dc", display: "grid", placeItems: "center" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0b1626"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                <rect x={"3"} y={"5"} width={"18"} height={"14"} rx={"3"}></rect>
                                <path d={"M3 8l9 6 9-6"}></path>
                              </svg>
                            </span>
                            <span style={{ flex: "1", minWidth: "0", fontWeight: "500" }}>
                              {"Report not viewed"}
                            </span>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474", textAlign: "right" }}>
                              {"Sent Sep 26"}
                            </span>
                          </div>
                          {" "}
                        </div>
                        {" "}
                      </div>
                      {" "}
                      <div style={{ alignSelf: "flex-end", width: "86%", background: "#fffd92", borderRadius: "20px 20px 6px 20px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(1.5deg)", transition: "transform 320ms cubic-bezier(0.23,1,0.32,1)" }} className="dc056570b">
                        {" "}
                        <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                          <img src={"/assets/clario-mark-v2.png"} alt={""} width={"20"} height={"20"} style={{ width: "20px", height: "20px", display: "block" }} />
                          {"Drafted for you"}
                        </span>
                        {" "}
                        <span style={{ lineHeight: "1.45", textWrap: "pretty" }}>
                          {"Hi Dana, leads have dipped the last few weeks. I have an idea for fixing it. Do you have 15 minutes on Thursday?"}
                        </span>
                        {" "}
                        <span style={{ display: "flex", gap: "8px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", height: "36px", padding: "0 14px", borderRadius: "12px", background: "#0b1626", color: "#ffffff", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                            {"Send"}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", height: "36px", padding: "0 14px", borderRadius: "12px", border: "1px solid #0b1626", fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                            {"Edit"}
                          </span>
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
                      {" "}
                      <h2 style={{ margin: "0", fontSize: "38px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-1.41px" }}>
                        {"Spot at-risk clients early with "}
                        <span style={{ color: "#1f6be2" }}>
                          {"AI Ads Analyst"}
                        </span>
                      </h2>
                      {" "}
                      <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will track each client's results and whether they look at their reports. When a client looks likely to cancel, "}
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will send you a risk alert with the reasons, a suggested next step and a draft message you can edit."}
                      </p>
                      {" "}
                      <p style={{ margin: "0", fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474", textWrap: "pretty" }}>
                        {"Reading client messages for tone is off unless you turn it on for a client."}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
              </section>
              </div>
            </div>
            <div data-page={"3"} style={{ gridArea: v.dA, display: v.dD, flexDirection: "column", justifyContent: "center", height: v.dH, background: v.pgBg3, opacity: v.pgO3, transform: v.pgT3, pointerEvents: v.pgPe3, transition: v.dTr }}>
              <div className="clario-fit">
              <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" }}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", maxWidth: "720px" }}>
                  {" "}
                  <h2 style={{ margin: "0", fontSize: "clamp(34px,4vw,44px)", fontWeight: "700", lineHeight: "1.15", letterSpacing: "-0.035em", textWrap: "balance" }}>
                    {"Run your client reporting on autopilot with "}
                    <span style={{ color: "#1f6be2" }}>
                      {"AI Ads Analyst"}
                    </span>
                  </h2>
                  {" "}
                  <p style={{ margin: "0", fontSize: "18px", color: "#5a6474" }}>
                    {"Reporting, risk alerts and integrations, all in one place."}
                  </p>
                  {" "}
                </div>
                {" "}
                <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "20px" }}>
                  {" "}
                  <div style={{ background: "#f0f3f8", borderRadius: "32px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {" "}
                      <h3 style={{ margin: "0", fontSize: "32px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-1.18px" }}>
                        {"Reporting"}
                      </h3>
                      {" "}
                      <p style={{ margin: "0", color: "#45505f", textWrap: "pretty" }}>
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will turn your ad data into reports"}
                        <br />
                        <br />
                      </p>
                      {" "}
                    </div>
                    {" "}
                    <div style={{ height: "1px", background: "#d3dbe6" }}></div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: "1" }}>
                      {" "}
                      <span style={{ fontWeight: "600" }}>
                        {"Reporting features"}
                      </span>
                      {" "}
                      <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Plain-language summaries"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Client and team versions"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Your logo and colours"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Scheduled delivery"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Combined data sources"}
                          </span>
                        </li>
                      </ul>
                      {" "}
                    </div>
                    {" "}
                    <a href={"#how"} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 20px", border: "1px solid #0b1626", color: "#0b1626", borderRadius: "16px", fontWeight: "600", textDecoration: "none", transition: "background-color 160ms ease,color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dcc3caca9 dcadff8cd">
                      {"Learn more"}
                    </a>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ background: "#f0f3f8", borderRadius: "32px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {" "}
                      <h3 style={{ margin: "0", fontSize: "32px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-1.18px" }}>
                        {"Risk alerts"}
                      </h3>
                      {" "}
                      <p style={{ margin: "0", color: "#45505f", textWrap: "pretty" }}>
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will flags churn risks"}
                        <br />
                        <br />
                      </p>
                      {" "}
                    </div>
                    {" "}
                    <div style={{ height: "1px", background: "#d3dbe6" }}></div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: "1" }}>
                      {" "}
                      <span style={{ fontWeight: "600" }}>
                        {"Risk alert features"}
                      </span>
                      {" "}
                      <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Health status for every client"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Clear reasons for each alert"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Suggested next steps"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Drafted check-in messages"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                            <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                          </svg>
                          <span>
                            {"Report open tracking"}
                          </span>
                        </li>
                      </ul>
                      {" "}
                    </div>
                    {" "}
                    <a href={"#how"} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 20px", border: "1px solid #0b1626", color: "#0b1626", borderRadius: "16px", fontWeight: "600", textDecoration: "none", transition: "background-color 160ms ease,color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dcc3caca9 dcadff8cd">
                      {"Learn more"}
                    </a>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ background: "#f0f3f8", borderRadius: "32px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {" "}
                      <h3 style={{ margin: "0", fontSize: "32px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-1.18px" }}>
                        {"Integrations"}
                      </h3>
                      {" "}
                      <p style={{ margin: "0", color: "#45505f", textWrap: "pretty" }}>
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will pull data from the platforms you already use."}
                      </p>
                      {" "}
                    </div>
                    {" "}
                    <div style={{ height: "1px", background: "#d3dbe6" }}></div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: "1" }}>
                      {" "}
                      <span style={{ fontWeight: "600" }}>
                        {"Integrations"}
                      </span>
                      {" "}
                      <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <img src={"/assets/logo-meta.png"} alt={""} width={"20"} height={"20"} style={{ flex: "none", width: "20px", height: "20px", marginTop: "2px", objectFit: "contain" }} />
                          <span>
                            {"Meta"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <img src={"/assets/logo-google-ads.png"} alt={""} width={"20"} height={"20"} style={{ flex: "none", width: "20px", height: "20px", marginTop: "2px", objectFit: "contain" }} />
                          <span>
                            {"Google Ads"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <img src={"/assets/logo-ga4.png"} alt={""} width={"20"} height={"20"} style={{ flex: "none", width: "20px", height: "20px", marginTop: "2px", objectFit: "contain" }} />
                          <span>
                            {"Google Analytics 4"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <img src={"/assets/logo-tiktok.png"} alt={""} width={"20"} height={"20"} style={{ flex: "none", width: "20px", height: "20px", marginTop: "2px", objectFit: "contain" }} />
                          <span>
                            {"TikTok Ads"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <img src={"/assets/logo-linkedin.png"} alt={""} width={"20"} height={"20"} style={{ flex: "none", width: "20px", height: "20px", marginTop: "2px", objectFit: "contain" }} />
                          <span>
                            {"LinkedIn Ads"}
                          </span>
                        </li>
                        <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "#5a6474" }}>
                          <span style={{ flex: "none", width: "20px", textAlign: "center", fontWeight: "700" }}>
                            {"+"}
                          </span>
                          <span>
                            {"3 more: Microsoft Ads, Search Console and Business Profile"}
                          </span>
                        </li>
                      </ul>
                      {" "}
                    </div>
                    {" "}
                    <a href={"#how"} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 20px", border: "1px solid #0b1626", color: "#0b1626", borderRadius: "16px", fontWeight: "600", textDecoration: "none", transition: "background-color 160ms ease,color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dcc3caca9 dcadff8cd">
                      {"See all integrations"}
                    </a>
                    {" "}
                  </div>
                  {" "}
                </div>
              </section>
              </div>
            </div>
            <div data-page={"4"} style={{ gridArea: v.dA, display: v.dD, flexDirection: "column", justifyContent: "center", height: v.dH, background: v.pgBg4, opacity: v.pgO4, transform: v.pgT4, pointerEvents: v.pgPe4, transition: v.dTr }}>
              <div className="clario-fit">
              <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 24px 0", display: "flex", flexDirection: "column", gap: "48px" }}>
                {" "}
                <h2 style={{ margin: "0", alignSelf: "center", textAlign: "center", fontSize: "clamp(34px,4vw,44px)", fontWeight: "700", lineHeight: "1.15", letterSpacing: "-0.035em", textWrap: "balance" }}>
                  <span style={{ color: "#1f6be2" }}>
                    {"Analyst"}
                  </span>
                  {" handles the small stuff"}
                </h2>
                {" "}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                  {" "}
                  <div style={{ flex: "1 1 300px", minWidth: "0", background: "#f0f3f8", borderRadius: "32px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", overflow: "hidden" }}>
                    {" "}
                    <div aria-hidden={"true"} style={{ flex: "1", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {" "}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <span style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 0", borderRadius: "14px", background: "#1f6be2", color: "#ffffff" }}>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                              {"Mon"}
                            </span>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ffffff" }}></span>
                          </span>
                          <span style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 0", borderRadius: "14px", background: "#ffffff", color: "#5a6474" }}>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                              {"Tue"}
                            </span>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "transparent" }}></span>
                          </span>
                          <span style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 0", borderRadius: "14px", background: "#ffffff", color: "#5a6474" }}>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                              {"Wed"}
                            </span>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "transparent" }}></span>
                          </span>
                          <span style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 0", borderRadius: "14px", background: "#ffffff", color: "#5a6474" }}>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                              {"Thu"}
                            </span>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "transparent" }}></span>
                          </span>
                          <span style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 0", borderRadius: "14px", background: "#ffffff", color: "#5a6474" }}>
                            <span style={{ fontSize: "14px", letterSpacing: "-0.52px", fontWeight: "600" }}>
                              {"Fri"}
                            </span>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "transparent" }}></span>
                          </span>
                        </div>
                        {" "}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#ffffff", borderRadius: "14px", padding: "10px 14px" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M22 2L11 13M22 2l-7 20-4-9-9-4z"}></path>
                          </svg>
                          <span style={{ flex: "1", fontWeight: "600" }}>
                            {"5 reports sent"}
                          </span>
                          <span style={{ fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                            {"Monday, 8:00am"}
                          </span>
                        </div>
                        {" "}
                      </div>
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <h3 style={{ margin: "0", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.8px" }}>
                        {"Sent on a schedule"}
                      </h3>
                      <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will send reports every Monday, or on whatever day each client prefers."}
                      </p>
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ flex: "1 1 280px", minWidth: "0", background: "#f0f3f8", borderRadius: "32px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", overflow: "hidden" }}>
                    {" "}
                    <div aria-hidden={"true"} style={{ flex: "1", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "100%", maxWidth: "260px", background: "#ffffff", borderRadius: "18px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(-2deg)" }}>
                        {" "}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#fa5f2e" }}></span>
                          <span style={{ fontWeight: "700" }}>
                            {"Your Agency"}
                          </span>
                        </div>
                        {" "}
                        <span style={{ height: "8px", width: "90%", borderRadius: "9999px", background: "#e6ebf2" }}></span>
                        <span style={{ height: "8px", width: "65%", borderRadius: "9999px", background: "#e6ebf2" }}></span>
                        {" "}
                        <div style={{ display: "flex", gap: "6px" }}>
                          <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#fa5f2e", boxShadow: "0 0 0 2px #ffffff,0 0 0 4px #0b1626" }}></span>
                          <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#1f6be2" }}></span>
                          <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#2f9e5b" }}></span>
                          <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#0b1626" }}></span>
                        </div>
                        {" "}
                      </div>
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <h3 style={{ margin: "0", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.8px" }}>
                        {"Your branding"}
                      </h3>
                      <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>
                        {"Your logo and colours on every report. Clients never see ours."}
                      </p>
                    </div>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ flex: "1 1 280px", minWidth: "0", background: "#f0f3f8", borderRadius: "32px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", overflow: "hidden" }}>
                    {" "}
                    <div aria-hidden={"true"} style={{ flex: "1", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: "100%", maxWidth: "300px", background: "#ffffff", borderRadius: "18px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px", lineHeight: "1.45" }}>
                        {" "}
                        <span>
                          {"Cost per lead "}
                          <span style={{ textDecoration: "line-through", color: "#97a2b2" }}>
                            {"decreased significantly"}
                          </span>
                          {" "}
                          <span style={{ background: "#d6e4f8", borderRadius: "4px", padding: "0 3px" }}>
                            {"dropped 11%"}
                          </span>
                          <span style={{ display: "inline-block", width: "2px", height: "18px", background: "#1f6be2", verticalAlign: "-3px", marginLeft: "1px" }}></span>
                        </span>
                        {" "}
                        <span style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "6px", fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
                          <img src={"/assets/clario-mark-v2.png"} alt={""} width={"16"} height={"16"} style={{ width: "16px", height: "16px" }} />
                          <span style={{ color: "#1f6be2" }}>
                            {"Analyst"}
                          </span>
                          {" will remember this"}
                        </span>
                        {" "}
                      </div>
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <h3 style={{ margin: "0", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.8px" }}>
                        {"Edit before it goes out"}
                      </h3>
                      <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>
                        {"Change any sentence. "}
                        <span style={{ color: "#1f6be2" }}>
                          {"Analyst"}
                        </span>
                        {" will learn from your edits and write closer to your style."}
                      </p>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
              </section>
              </div>
            </div>
            <div data-page={"5"} style={{ gridArea: v.dA, display: v.dD, flexDirection: "column", justifyContent: "center", height: v.dH, background: v.pgBg5, opacity: v.pgO5, transform: v.pgT5, pointerEvents: v.pgPe5, transition: v.dTr }}>
              <div className="clario-fit">
              <section id={"pricing"} style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 24px", display: "flex", flexDirection: "column", gap: "48px" }}>
                {" "}
                <h2 style={{ margin: "0", alignSelf: "center", textAlign: "center", fontSize: "clamp(34px,4vw,44px)", fontWeight: "700", lineHeight: "1.15", letterSpacing: "-0.035em", textWrap: "balance" }}>
                  {"Simple pricing that grows with you"}
                </h2>
                {" "}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))", gap: "20px", alignItems: "stretch" }}>
                  {" "}
                  <div style={{ background: "#f0f3f8", color: "#0b1626", borderRadius: "32px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {" "}
                      <span style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-0.74px" }}>
                        {"Free"}
                      </span>
                      {" "}
                      <span style={{ fontSize: "50px", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-1.85px", fontVariantNumeric: "tabular-nums" }}>
                        {"$0"}
                        <span style={{ fontSize: "16px", fontWeight: "400", letterSpacing: "-0.59px", color: "#5a6474" }}></span>
                      </span>
                      {" "}
                    </div>
                    {" "}
                    <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px", flex: "1" }}>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Up to 2 clients"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Weekly reports"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Risk alerts"}
                        </span>
                      </li>
                    </ul>
                    {" "}
                    <a href={"/login?mode=signup"} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 20px", border: "1px solid #0b1626", color: "#0b1626", borderRadius: "16px", fontWeight: "600", textDecoration: "none", transition: "background-color 160ms ease,color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dcc3caca9 dcadff8cd">
                      {"Start free"}
                    </a>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ background: "#f0f3f8", color: "#0b1626", borderRadius: "32px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {" "}
                      <span style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-0.74px" }}>
                        {"Solo"}
                      </span>
                      {" "}
                      <span style={{ fontSize: "50px", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-1.85px", fontVariantNumeric: "tabular-nums" }}>
                        {"$19"}
                        <span style={{ fontSize: "16px", fontWeight: "400", letterSpacing: "-0.59px", color: "#5a6474" }}>
                          {" a month"}
                        </span>
                      </span>
                      {" "}
                    </div>
                    {" "}
                    <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px", flex: "1" }}>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Up to 5 clients"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Everything in Free"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Your logo on reports"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Daily risk email"}
                        </span>
                      </li>
                    </ul>
                    {" "}
                    <a href={"/login?mode=signup&plan=solo"} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 20px", border: "1px solid #0b1626", color: "#0b1626", borderRadius: "16px", fontWeight: "600", textDecoration: "none", transition: "background-color 160ms ease,color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dcc3caca9 dcadff8cd">
                      {"Choose Solo"}
                    </a>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ background: "#0b1626", color: "#ffffff", borderRadius: "32px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {" "}
                      <span style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-0.74px" }}>
                        {"Studio"}
                      </span>
                      {" "}
                      <span style={{ fontSize: "50px", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-1.85px", fontVariantNumeric: "tabular-nums" }}>
                        {"$49"}
                        <span style={{ fontSize: "16px", fontWeight: "400", letterSpacing: "-0.59px", color: "#b8c4d4" }}>
                          {" a month"}
                        </span>
                      </span>
                      {" "}
                    </div>
                    {" "}
                    <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px", flex: "1" }}>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#7fa6e6"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Up to 20 clients"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#7fa6e6"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Everything in Solo"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#7fa6e6"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Drafted check-in messages"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#7fa6e6"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Tone settings per client"}
                        </span>
                      </li>
                    </ul>
                    {" "}
                    <a href={"/login?mode=signup&plan=studio"} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 20px", background: "#1f6be2", color: "#ffffff", borderRadius: "16px", fontWeight: "600", textDecoration: "none", transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc41f4d87 dcadff8cd">
                      {"Choose Studio"}
                    </a>
                    {" "}
                  </div>
                  {" "}
                  <div style={{ background: "#f0f3f8", color: "#0b1626", borderRadius: "32px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {" "}
                      <span style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-0.74px" }}>
                        {"Agency"}
                      </span>
                      {" "}
                      <span style={{ fontSize: "50px", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-1.85px", fontVariantNumeric: "tabular-nums" }}>
                        {"$99"}
                        <span style={{ fontSize: "16px", fontWeight: "400", letterSpacing: "-0.59px", color: "#5a6474" }}>
                          {" a month"}
                        </span>
                      </span>
                      {" "}
                    </div>
                    {" "}
                    <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px", flex: "1" }}>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Unlimited clients"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Everything in Studio"}
                        </span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ flex: "none", marginTop: "3px" }}>
                          <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                        </svg>
                        <span>
                          {"Unlimited teammates"}
                        </span>
                      </li>
                    </ul>
                    {" "}
                    <a href={"/login?mode=signup&plan=agency"} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "48px", padding: "0 20px", border: "1px solid #0b1626", color: "#0b1626", borderRadius: "16px", fontWeight: "600", textDecoration: "none", transition: "background-color 160ms ease,color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dcc3caca9 dcadff8cd">
                      {"Choose Agency"}
                    </a>
                    {" "}
                  </div>
                  {" "}
                </div>
              </section>
              </div>
            </div>
          </div>
        </main>
        <footer style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 48px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", fontSize: "14px", letterSpacing: "-0.52px", color: "#5a6474" }}>
          {" "}
          <span>
            {"© 2026 "}
            <span style={{ color: "#1f6be2" }}>
              {"AI Ads Analyst"}
            </span>
          </span>
          {" "}
          <nav style={{ display: "flex", gap: "8px" }}>
            {" "}
            <a href={"/privacy"} style={{ display: "flex", alignItems: "center", height: "44px", padding: "0 8px", color: "#5a6474", textDecoration: "none" }}>
              {"Privacy"}
            </a>
            {" "}
            <a href={"/terms"} style={{ display: "flex", alignItems: "center", height: "44px", padding: "0 8px", color: "#5a6474", textDecoration: "none" }}>
              {"Terms"}
            </a>
            {" "}
            <a href={"/contact"} style={{ display: "flex", alignItems: "center", height: "44px", padding: "0 8px", color: "#5a6474", textDecoration: "none" }}>
              {"Contact"}
            </a>
            {" "}
          </nav>
        </footer>
      </div>
    </>
  );
}
