import React from 'react';

export function ClientsView({ v }) {
  // Clients: list, add-client wizard and profile panel
  return (
    <>
      {(v.vClients) ? (<>
        {" "}
        {(v.cToast) ? (<>
          <span role={"status"} style={{ fontSize: "14px", fontWeight: "600", color: "#1d6b3a" }}>
            {v.cToastText}
          </span>
        </>) : null}
        {" "}
        {(v.cFormOpen) ? (<>
          {" "}
          <div style={{ position: "fixed", top: "0", right: "0", bottom: "0", left: "74px", zIndex: "60", background: "#f4f7fb", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {" "}
            <div style={{ flex: "none", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "12px", padding: "20px clamp(16px,4vw,48px)" }}>
              {" "}
              <span>
                <button type={"button"} onClick={v.cBackOrClose} style={{ display: "flex", alignItems: "center", gap: "8px", height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "12px", background: "#ffffff", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                    <path d={"M19 12H5M11 18l-6-6 6-6"}></path>
                  </svg>
                  {"Back"}
                </button>
              </span>
              {" "}
              <span style={{ fontSize: "15px", fontWeight: "600", color: "#5a6474" }}>
                {"New client"}
              </span>
              {" "}
              <span style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type={"button"} onClick={v.cCancel} style={{ display: "flex", alignItems: "center", gap: "8px", height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "12px", background: "#ffffff", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                  {"Cancel"}
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"}>
                    <path d={"M6 6l12 12M18 6L6 18"}></path>
                  </svg>
                </button>
              </span>
              {" "}
            </div>
            {" "}
            <form onSubmit={v.cNext} noValidate={true} aria-labelledby={"cw-title"} style={{ flex: "1", width: "min(640px,100%)", margin: "0 auto", padding: "clamp(24px,8vh,96px) 16px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
              {" "}
              <h1 id={"cw-title"} style={{ margin: "0", fontSize: "clamp(28px,4vw,40px)", fontWeight: "700", letterSpacing: "-1.4px", lineHeight: "1.15", textAlign: "center", textWrap: "balance" }}>
                {v.cHead}
              </h1>
              {" "}
              <div style={{ width: "100%", background: "#ffffff", borderRadius: "20px", boxShadow: "0 0 0 1px #e6ebf2,0 12px 32px -24px rgba(11,22,38,.3)" }}>
                {" "}
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #eef1f6", fontSize: "13px", fontWeight: "600", color: "#5a6474" }}>
                  {"New client"}
                </div>
                {" "}
                <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "2px" }}>
                  {" "}
                  {(v.cW1?.done) ? (<>
                    {" "}
                    <button type={"button"} onClick={v.cW1?.go} style={{ display: "flex", alignItems: "center", gap: "14px", minHeight: "56px", padding: "0 18px", border: "0", borderRadius: "14px", background: "transparent", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }} className="dcf0b705f">
                      {" "}
                      <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#1f6be2", display: "grid", placeItems: "center" }}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3.5"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={"M5 12l5 5L20 7"}></path>
                        </svg>
                      </span>
                      {" "}
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                        <span style={{ fontWeight: "600" }}>
                          {"Business"}
                        </span>
                        <span style={{ fontSize: "14px", color: "#5a6474", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {v.cW1?.sum}
                        </span>
                      </span>
                      {" "}
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f6be2" }}>
                        {"Edit"}
                      </span>
                      {" "}
                    </button>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.cW1?.cur) ? (<>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "16px 18px 18px", borderRadius: "14px", background: "#f4f7fb", boxShadow: "inset 0 0 0 1px #e6ebf2" }}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {" "}
                        <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#0b1626", display: "grid", placeItems: "center" }}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M9 6l6 6-6 6"}></path>
                          </svg>
                        </span>
                        {" "}
                        <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                          <span style={{ fontWeight: "700" }}>
                            {"Business"}
                          </span>
                          <span style={{ fontSize: "14px", color: "#5a6474" }}>
                            {"The name your client goes by"}
                          </span>
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{ paddingLeft: "36px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {" "}
                        <input value={(v.cfName) ?? ""} onChange={v.cSetName} aria-label={"Business name"} aria-invalid={v.cErrName} autoFocus={true} placeholder={"e.g. Brightside Dental"} style={{ width: "100%", height: "48px", padding: "0 14px", border: `1px solid ${v.cNameBd ?? ""}`, borderRadius: "12px", background: "#ffffff", font: "inherit", fontSize: "16px", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
                        {" "}
                        {(v.cErrName) ? (<>
                          <span role={"alert"} style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>
                            {"Enter the client's business name to continue."}
                          </span>
                        </>) : null}
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.cW1?.todo) ? (<>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", minHeight: "56px", padding: "0 18px", color: "#97a2b2" }}>
                      {" "}
                      <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#eef1f6" }}></span>
                      {" "}
                      <span style={{ fontWeight: "500" }}>
                        {"Business"}
                      </span>
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.cW2?.done) ? (<>
                    {" "}
                    <button type={"button"} onClick={v.cW2?.go} style={{ display: "flex", alignItems: "center", gap: "14px", minHeight: "56px", padding: "0 18px", border: "0", borderRadius: "14px", background: "transparent", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }} className="dcf0b705f">
                      {" "}
                      <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#1f6be2", display: "grid", placeItems: "center" }}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3.5"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={"M5 12l5 5L20 7"}></path>
                        </svg>
                      </span>
                      {" "}
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                        <span style={{ fontWeight: "600" }}>
                          {"Contact"}
                        </span>
                        <span style={{ fontSize: "14px", color: "#5a6474", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {v.cW2?.sum}
                        </span>
                      </span>
                      {" "}
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f6be2" }}>
                        {"Edit"}
                      </span>
                      {" "}
                    </button>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.cW2?.cur) ? (<>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "16px 18px 18px", borderRadius: "14px", background: "#f4f7fb", boxShadow: "inset 0 0 0 1px #e6ebf2" }}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {" "}
                        <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#0b1626", display: "grid", placeItems: "center" }}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M9 6l6 6-6 6"}></path>
                          </svg>
                        </span>
                        {" "}
                        <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                          <span style={{ fontWeight: "700" }}>
                            {"Contact"}
                          </span>
                          <span style={{ fontSize: "14px", color: "#5a6474" }}>
                            {"Where reports and portal invites are sent"}
                          </span>
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{ paddingLeft: "36px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {" "}
                        <input value={(v.cfEmail) ?? ""} onChange={v.cSetEmail} type={"email"} aria-label={"Contact email"} aria-invalid={v.cErrEmail} autoFocus={true} placeholder={"name@business.com"} style={{ width: "100%", height: "48px", padding: "0 14px", border: `1px solid ${v.cEmailBd ?? ""}`, borderRadius: "12px", background: "#ffffff", font: "inherit", fontSize: "16px", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
                        {" "}
                        {(v.cErrEmail) ? (<>
                          <span role={"alert"} style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>
                            {"That email doesn't look right. Check for typos, like name@business.com."}
                          </span>
                        </>) : null}
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.cW2?.todo) ? (<>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", minHeight: "56px", padding: "0 18px", color: "#97a2b2" }}>
                      {" "}
                      <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#eef1f6" }}></span>
                      {" "}
                      <span style={{ fontWeight: "500" }}>
                        {"Contact"}
                      </span>
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.cW3?.done) ? (<>
                    {" "}
                    <button type={"button"} onClick={v.cW3?.go} style={{ display: "flex", alignItems: "center", gap: "14px", minHeight: "56px", padding: "0 18px", border: "0", borderRadius: "14px", background: "transparent", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }} className="dcf0b705f">
                      {" "}
                      <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#1f6be2", display: "grid", placeItems: "center" }}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3.5"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={"M5 12l5 5L20 7"}></path>
                        </svg>
                      </span>
                      {" "}
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                        <span style={{ fontWeight: "600" }}>
                          {"Accounts"}
                        </span>
                        <span style={{ fontSize: "14px", color: "#5a6474", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {v.cW3?.sum}
                        </span>
                      </span>
                      {" "}
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f6be2" }}>
                        {"Edit"}
                      </span>
                      {" "}
                    </button>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.cW3?.cur) ? (<>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "16px 18px 18px", borderRadius: "14px", background: "#f4f7fb", boxShadow: "inset 0 0 0 1px #e6ebf2" }}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {" "}
                        <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#0b1626", display: "grid", placeItems: "center" }}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M9 6l6 6-6 6"}></path>
                          </svg>
                        </span>
                        {" "}
                        <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                          <span style={{ fontWeight: "700" }}>
                            {"Accounts"}
                          </span>
                          <span style={{ fontSize: "14px", color: "#5a6474" }}>
                            {"The tools this client already uses"}
                          </span>
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{ paddingLeft: "36px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        {" "}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,190px),1fr))", gap: "8px" }}>
                          {" "}
                          {((v.cPlats) || []).map((p, $index) => (
                            <React.Fragment key={$index}>
                              <button type={"button"} role={"checkbox"} aria-checked={p?.on} onClick={p?.toggle} style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "48px", padding: "0 12px", border: `1.5px solid ${p?.bd ?? ""}`, borderRadius: "12px", background: p?.bg, font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left", transition: "border-color 160ms ease,background-color 160ms ease" }}>
                                <span aria-hidden={"true"} style={{ flex: "none", display: "block", width: "20px", height: "20px", background: `url('${p?.logo ?? ""}') center / contain no-repeat` }}></span>
                                <span style={{ flex: "1" }}>
                                  {p?.label}
                                </span>
                                <span aria-hidden={"true"} style={{ flex: "none", width: "18px", height: "18px", borderRadius: "5px", border: `2px solid ${p?.bd ?? ""}`, background: p?.chk, display: "grid", placeItems: "center" }}>
                                  <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3.5"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                    <path d={"M5 12l5 5L20 7"}></path>
                                  </svg>
                                </span>
                              </button>
                            </React.Fragment>
                          ))}
                          {" "}
                        </div>
                        {" "}
                        <span style={{ fontSize: "14px", color: "#5a6474" }}>
                          {"Optional. You'll pick their ad accounts from your agency's integrations."}
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                  {(v.cW3?.todo) ? (<>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", minHeight: "56px", padding: "0 18px", color: "#97a2b2" }}>
                      {" "}
                      <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", background: "#eef1f6" }}></span>
                      {" "}
                      <span style={{ fontWeight: "500" }}>
                        {"Accounts"}
                      </span>
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <button type={"submit"} style={{ display: "flex", alignItems: "center", gap: "8px", height: "52px", padding: "0 28px", border: "0", borderRadius: "14px", background: "#1f6be2", color: "#ffffff", font: "inherit", fontSize: "16px", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", transition: "background-color 160ms ease,transform 120ms ease" }} className="dc9482609 dcadff8cd">
                {v.cNextLabel}
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                  <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                </svg>
              </button>
              {" "}
              <span aria-label={`Step ${v.cStep ?? ""} of 3`} style={{ marginTop: "auto", padding: "8px 18px", borderRadius: "9999px", background: "#e6ebf2", fontSize: "16px", fontWeight: "600", color: "#45505f", fontVariantNumeric: "tabular-nums" }}>
                {v.cStep}{" / 3"}
              </span>
              {" "}
            </form>
            {" "}
          </div>
          {" "}
        </>) : null}
        {" "}
        {(v.cEmptyOn) ? (<>
          {" "}
          <section aria-label={"All clients"} style={{ background: "#ffffff", display: "flex", flexDirection: "column" }}>
            {" "}
            <div role={"row"} style={{ display: "grid", gridTemplateColumns: v.cCols, gap: "16px", padding: "10px 22px", background: "#f4f7fb", fontSize: "13px", fontWeight: "600", color: "#5a6474" }}>
              {" "}
              <span>
                {"Client"}
              </span>
              <span>
                {"Status"}
              </span>
              <span style={{ display: v.cWide }}>
                {"Tools"}
              </span>
              <span style={{ textAlign: "right" }}>
                {"Leads"}
              </span>
              <span style={{ display: v.cWide }}>
                {"Last report"}
              </span>
              <span></span>
              {" "}
            </div>
            {" "}
            {((v.cRows) || []).map((r, $index) => (
              <React.Fragment key={$index}>
                {" "}
                <div onClick={r?.rowClick} style={{ display: "grid", gridTemplateColumns: v.cCols, gap: "16px", alignItems: "center", minHeight: "64px", padding: "10px 22px", border: "0", borderTop: "1px solid #eef1f6", background: r?.bg, font: "inherit", letterSpacing: "inherit", color: "#0b1626", textAlign: "left", cursor: "pointer", transition: "background-color 140ms ease" }} className="dcf0b705f">
                  {" "}
                  <button onClick={r?.open} aria-label={r?.openLabel} style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0", minHeight: "44px", padding: "0", border: "0", background: "transparent", font: "inherit", letterSpacing: "inherit", color: "#0b1626", textAlign: "left", cursor: "pointer" }} className="dc467ff26">
                    {" "}
                    <span style={{ flex: "none", width: "36px", height: "36px", borderRadius: "50%", background: "#d6e4f8", display: "grid", placeItems: "center", fontSize: "13px", fontWeight: "700", color: "#0b1626" }}>
                      {r?.initials}
                    </span>
                    {" "}
                    <span style={{ display: "flex", flexDirection: "column", minWidth: "0", lineHeight: "1.3" }}>
                      <span style={{ fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "underline", textDecorationColor: "transparent", textUnderlineOffset: "3px" }} className="dc63085fd">
                        {r?.name}
                      </span>
                      <span style={{ fontSize: "13px", color: "#5a6474", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r?.email}
                      </span>
                    </span>
                    {" "}
                  </button>
                  {" "}
                  <span style={{ fontSize: "14px", fontWeight: "600", color: r?.stC }}>
                    {r?.status}
                  </span>
                  {" "}
                  <span style={{ display: v.cWideFlex, gap: "6px", flexWrap: "wrap" }}>
                    {((r?.logos) || []).map((lg, $index) => (
                      <React.Fragment key={$index}>
                        <span aria-hidden={"true"} style={{ display: "block", width: "18px", height: "18px", background: `url('${lg ?? ""}') center / contain no-repeat` }}></span>
                      </React.Fragment>
                    ))}
                  </span>
                  {" "}
                  <span style={{ textAlign: "right", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                    {r?.leads}
                  </span>
                  {" "}
                  <span style={{ display: v.cWide, fontSize: "14px", color: "#5a6474" }}>
                    {r?.last}
                  </span>
                  {" "}
                  <button onClick={r?.toggle} aria-expanded={r?.exp} aria-label={r?.toggleLabel} style={{ justifySelf: "end", width: "32px", height: "44px", marginRight: "-6px", padding: "0", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}>
                    <svg aria-hidden={"true"} width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ transform: r?.chev, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                      <path d={"M6 9l6 6 6-6"}></path>
                    </svg>
                  </button>
                  {" "}
                </div>
                {" "}
                <div style={{ display: "grid", gridTemplateRows: r?.rows, transition: "grid-template-rows 240ms cubic-bezier(0.23,1,0.32,1)", background: "#f8fafc" }}>
                  {" "}
                  <div style={{ overflow: "hidden", minHeight: "0" }}>
                    {" "}
                    <div style={{ padding: "6px 22px 18px 70px", display: "flex", flexDirection: "column" }}>
                      {" "}
                      <span style={{ padding: "8px 0", fontSize: "13px", fontWeight: "600", color: "#5a6474" }}>
                        {"Tools in use"}
                      </span>
                      {" "}
                      {((r?.tools) || []).map((tl, $index) => (
                        <React.Fragment key={$index}>
                          {" "}
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "52px", padding: "6px 0", borderBottom: "1px solid #eef1f6" }}>
                            {" "}
                            <span aria-hidden={"true"} style={{ flex: "none", width: "22px", height: "22px", background: `url('${tl?.logo ?? ""}') center / contain no-repeat` }}></span>
                            {" "}
                            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                              <span style={{ fontWeight: "600" }}>
                                {tl?.name}
                              </span>
                              <span style={{ fontSize: "13px", color: "#5a6474", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {tl?.acct}
                              </span>
                            </span>
                            {" "}
                            <span style={{ flex: "none", fontSize: "13px", fontWeight: "600", color: "#1d6b3a" }}>
                              {tl?.sync}
                            </span>
                            {" "}
                          </div>
                          {" "}
                        </React.Fragment>
                      ))}
                      {" "}
                      {(r?.noTools) ? (<>
                        <span style={{ padding: "8px 0", color: "#5a6474" }}>
                          {"No accounts linked yet. Link them in Settings › Integrations."}
                        </span>
                      </>) : null}
                      {" "}
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                        {" "}
                        <button onClick={r?.manage} style={{ height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                          {"Manage integrations"}
                        </button>
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
          </section>
          {" "}
        </>) : null}
        {" "}
      </>) : null}
      <div onClick={v.pfClose} aria-hidden={"true"} style={{ position: "fixed", inset: "0", zIndex: "55", background: "rgba(11,22,38,.28)", opacity: v.pfO, pointerEvents: v.pfPe, transition: "opacity 200ms ease" }}></div>
      {" "}
      <aside role={"dialog"} aria-modal={"true"} aria-label={"Client profile"} style={{ position: "fixed", top: "0", bottom: "0", right: "0", zIndex: "60", width: "min(640px,100vw)", background: "#f4f7fb", boxShadow: "-24px 0 48px -24px rgba(11,22,38,.35)", display: "flex", flexDirection: "column", transform: `translateX(${v.pfX ?? ""})`, visibility: v.pfVis, transition: "transform 280ms cubic-bezier(0.23,1,0.32,1),visibility 280ms" }}>
        {" "}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 20px", background: "#ffffff", borderBottom: "1px solid #eef1f6" }}>
          {" "}
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#5a6474" }}>
            {"Client profile"}
          </span>
          {" "}
          <button onClick={v.pfClose} aria-label={"Close client profile"} style={{ width: "44px", height: "44px", marginRight: "-10px", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcf0b705f">
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.4"} strokeLinecap={"round"}>
              <path d={"M6 6l12 12M18 6L6 18"}></path>
            </svg>
          </button>
          {" "}
        </div>
        {" "}
        <div style={{ flex: "1", overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {" "}
          {(v.pfPanelOn) ? (<>
            {" "}
            <header style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {" "}
              <span style={{ flex: "none", width: "56px", height: "56px", borderRadius: "50%", background: "#d6e4f8", display: "grid", placeItems: "center", fontWeight: "700" }}>
                {v.cur?.initials}
              </span>
              {" "}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {" "}
                <h1 style={{ margin: "0", fontSize: "28px", fontWeight: "700", letterSpacing: "-0.9px", lineHeight: "1.2" }}>
                  {v.cur?.name}
                </h1>
                {" "}
                <span style={{ color: "#5a6474" }}>
                  {v.pfSub}
                </span>
                {" "}
              </div>
              {" "}
            </header>
            {" "}
            <section style={{ background: "#ffffff", borderRadius: "0", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {" "}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                {" "}
                <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "700" }}>
                  {"Details"}
                </h2>
                {" "}
                {(v.pfView) ? (<>
                  <button onClick={v.pfEdit} style={{ height: "40px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                    {"Edit"}
                  </button>
                </>) : null}
                {" "}
              </div>
              {" "}
              {(v.pfView) ? (<>
                {" "}
                <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: "18px 24px", margin: "0" }}>
                  {((v.pfFields) || []).map((fd, $index) => (
                    <React.Fragment key={$index}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <dt style={{ fontSize: "13px", color: "#5a6474" }}>
                          {fd?.k}
                        </dt>
                        <dd style={{ margin: "0", fontWeight: "600" }}>
                          {fd?.v}
                        </dd>
                      </div>
                    </React.Fragment>
                  ))}
                </dl>
                {" "}
              </>) : null}
              {" "}
              {(v.pfEditing) ? (<>
                {" "}
                <form onSubmit={v.pfSave} noValidate={true} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "14px" }}>
                    {" "}
                    {((v.pfInputs) || []).map((fi, $index) => (
                      <React.Fragment key={$index}>
                        {" "}
                        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>
                            {fi?.k}
                          </span>
                          <input value={(fi?.v) ?? ""} onChange={fi?.set} style={{ height: "44px", padding: "0 14px", border: `1px solid ${fi?.bd ?? ""}`, borderRadius: "0", font: "inherit", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
                          {(fi?.hasErr) ? (<>
                            <span style={{ fontSize: "13px", fontWeight: "600", color: "#a3330c" }}>
                              {fi?.err}
                            </span>
                          </>) : null}
                        </label>
                        {" "}
                      </React.Fragment>
                    ))}
                    {" "}
                  </div>
                  {" "}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button type={"submit"} style={{ height: "44px", padding: "0 20px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                      {"Save details"}
                    </button>
                    <button type={"button"} onClick={v.pfCancel} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcbbe0dc7">
                      {"Cancel"}
                    </button>
                  </div>
                  {" "}
                </form>
                {" "}
              </>) : null}
              {" "}
            </section>
            {" "}
            <section style={{ background: "#ffffff", borderRadius: "0", padding: "20px 22px 8px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {" "}
              <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "700" }}>
                {"Tools"}
              </h2>
              {" "}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {" "}
                {((v.pfInts) || []).map((it, $index) => (
                  <React.Fragment key={$index}>
                    {" "}
                    <div style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr) auto", alignItems: "center", gap: "14px", minHeight: "64px", borderTop: "1px solid #eef1f6" }}>
                      {" "}
                      <span aria-hidden={"true"} style={{ display: "block", width: "24px", height: "24px", background: `url('${it?.logo ?? ""}') center / contain no-repeat` }}></span>
                      {" "}
                      <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.3", minWidth: "0" }}>
                        <span style={{ fontWeight: "600" }}>
                          {it?.name}
                        </span>
                        <span style={{ fontSize: "14px", color: it?.sc }}>
                          {it?.status}
                        </span>
                      </span>
                      {" "}
                      <button onClick={it?.toggle} aria-label={it?.aria} style={{ height: "40px", padding: "0 14px", border: `1px solid ${it?.bd ?? ""}`, borderRadius: "0", background: it?.bg, font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: it?.c, cursor: "pointer", whiteSpace: "nowrap", transition: "background-color 160ms ease" }}>
                        {it?.btn}
                      </button>
                      {" "}
                    </div>
                    {" "}
                  </React.Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </section>
            {" "}
          </>) : null}
          {" "}
        </div>
        {" "}
      </aside>
    </>
  );
}
