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
          <div onClick={v.cBackdrop} style={{ position: "fixed", inset: "0", zIndex: "70", background: "rgba(11,22,38,.45)", display: "grid", placeItems: "center", padding: "24px" }}>
          <div role="dialog" aria-modal="true" aria-labelledby="cw-title" style={{ width: "min(640px,100%)", maxHeight: "calc(100vh - 48px)", overflowY: "auto", background: "#ffffff", padding: "28px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 30px 80px -30px rgba(11,22,38,.5)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#5a6474" }}>{"New client \u00b7 Step " + v.cStep + " of 3"}</span>
              <button type="button" onClick={v.cCancel} aria-label="Cancel" style={{ width: "44px", height: "44px", margin: "-10px -10px -10px 0", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcceddbc1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#45505f" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
            </div>
            <form onSubmit={v.cNext} noValidate={true} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {" "}
              <h2 id={"cw-title"} style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px", lineHeight: "1.2", textWrap: "balance" }}>
                {v.cHead}
              </h2>
              {" "}
              <div style={{ width: "100%", margin: "0 -10px" }}>
                {" "}
                
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
                            {"Their ad accounts and properties"}
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
                                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "1.3", padding: "6px 0" }}>
                                  <span>{p?.label}</span>
                                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#5a6474" }}>{p?.desc}</span>
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
                        {(v.cPlatsNone) ? (<>
                          <span style={{ color: "#45505f" }}>
                            {v.cPlatsNoneText}
                          </span>
                        </>) : null}
                        <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px 12px", fontSize: "14px", color: "#5a6474" }}>
                          {"Optional. Accounts already linked to another client are not shown."}
                          <button type={"button"} onClick={v.cConnectTool} style={{ minHeight: "44px", padding: "0", border: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#1f6be2", cursor: "pointer" }}>
                            {"Connect a new tool"}
                          </button>
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
              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <button type="button" onClick={v.cBackOrClose} style={{ visibility: v.cBackVis, height: "48px", padding: "0 18px", border: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">{"Back"}</button>
                <span style={{ display: "flex", gap: "8px" }}>
                  <button type="button" onClick={v.cCancel} style={{ height: "48px", padding: "0 18px", border: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">{"Cancel"}</button>
                  <button type="submit" style={{ height: "48px", padding: "0 22px", border: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">{v.cNextLabel}</button>
                </span>
              </div>
              {" "}
            </form>
            {" "}
          </div>
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
            {(v.cNoClients) ? (
              <div style={{ padding: "40px 22px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ fontWeight: "700", fontSize: "18px" }}>{"No clients yet"}</span>
                <span style={{ color: "#5a6474", maxWidth: "460px" }}>{"Add a client and link their Google Analytics property. Their results and reports then show up here."}</span>
                <button onClick={v.cAddOpen} style={{ marginTop: "8px", height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">{"Add client"}</button>
              </div>
            ) : null}
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
                      {(r?.nums) ? (
                        <span style={{ padding: "8px 0 4px", fontSize: "14px", color: "#0b1626", fontVariantNumeric: "tabular-nums" }}>
                          {r.nums}
                        </span>
                      ) : null}
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
                          {(fi?.isSelect) ? (
                            <select value={(fi?.v) ?? ""} onChange={fi?.set} style={{ height: "44px", padding: "0 10px", border: `1px solid ${fi?.bd ?? ""}`, borderRadius: "0", background: "#ffffff", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outline: "none" }} className="dc120a618">
                              {(fi?.opts || []).map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input value={(fi?.v) ?? ""} onChange={fi?.set} style={{ height: "44px", padding: "0 14px", border: `1px solid ${fi?.bd ?? ""}`, borderRadius: "0", font: "inherit", letterSpacing: "inherit", outline: "none" }} className="dc120a618" />
                          )}
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
                      {v.pfSaveLabel || "Save details"}
                    </button>
                    <button type={"button"} onClick={v.pfCancel} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcbbe0dc7">
                      {"Cancel"}
                    </button>
                    {(v.pfCanRemove) ? (
                      <button type={"button"} onClick={v.pfRemove} style={{ marginLeft: "auto", height: "44px", padding: "0 14px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#a3330c", cursor: "pointer" }} className="dcbbe0dc7">
                        {"Remove client"}
                      </button>
                    ) : null}
                  </div>
                  {" "}
                </form>
                {" "}
              </>) : null}
              {" "}
            </section>
            {" "}
            {(v.pfHasKpis) ? (
              <section aria-labelledby={"pk-h"} style={{ background: "#ffffff", borderRadius: "0", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <h2 id={"pk-h"} style={{ margin: "0", fontSize: "18px", fontWeight: "700" }}>{"Results"}</h2>
                  <span style={{ fontSize: "14px", color: "#5a6474", textWrap: "pretty" }}>{v.pfKpiNote}</span>
                </span>
                {((v.pfKpis) || []).length ? (
                  <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,120px),1fr))", gap: "18px 24px", margin: "0" }}>
                    {(v.pfKpis || []).map(k => (
                      <div key={k.label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <dt style={{ fontSize: "13px", color: "#5a6474" }}>{k.label}</dt>
                        <dd style={{ margin: "0", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.4px", fontVariantNumeric: "tabular-nums" }}>{k.value}</dd>
                        <dd style={{ margin: "0", fontSize: "13px", fontWeight: "600", color: k.c }}>{k.note}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </section>
            ) : null}
            <section aria-labelledby={"cg-h"} style={{ background: "#ffffff", borderRadius: "0", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 id={"cg-h"} style={{ margin: "0", fontSize: "18px", fontWeight: "700" }}>{"Budget and goals"}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#5a6474" }}>{"Monthly ad budget"}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}><strong style={{ fontSize: "20px", letterSpacing: "-0.4px", fontVariantNumeric: "tabular-nums", color: v.cgHasBudget ? "#0b1626" : "#5a6474" }}>{v.cgBudget}</strong>{v.cgBudgetStatus ? <span style={{ padding: "2px 10px", background: v.cgBPBg, color: v.cgBPC, fontSize: "13px", fontWeight: "600" }}>{v.cgBudgetStatus}</span> : null}</span>
                  </span>
                  {(!v.cgBudgetEditing) ? <button onClick={v.cgEditBudget} style={{ height: "40px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">{v.cgBudgetBtn}</button> : null}
                </div>
                {(v.cgShowBar && !v.cgBudgetEditing) ? (
                  <span aria-hidden={"true"} style={{ position: "relative", display: "block", height: "8px", background: "#eef1f6" }}><span style={{ display: "block", height: "100%", width: v.cgBW, background: v.cgBCol }}></span><span title={"Where spend should be today"} style={{ position: "absolute", top: "-3px", bottom: "-3px", left: v.cgBMk, width: "2px", background: "#0b1626" }}></span></span>
                ) : null}
                {(!v.cgBudgetEditing) ? <span style={{ fontSize: "14px", color: "#45505f", textWrap: "pretty" }}>{v.cgBudgetNote}</span> : null}
                {(v.cgBudgetEditing) ? (
                  <form onSubmit={v.cgSaveBudget} noValidate={true} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", width: "200px", height: "44px", padding: "0 12px", border: "1px solid " + (v.cgBudgetErr ? "#e0481a" : "#d3dbe6"), background: "#ffffff" }}>
                        <span style={{ color: "#5a6474", fontWeight: "600" }}>{v.cgSym}</span>
                        <input aria-label={"Monthly ad budget"} autoFocus={true} value={v.cgBudgetDraft} onChange={v.cgSetBudget} inputMode={"decimal"} placeholder={"No budget"} style={{ flex: "1", minWidth: "0", height: "40px", border: "0", outline: "none", font: "inherit", letterSpacing: "inherit", fontVariantNumeric: "tabular-nums" }} />
                        <span style={{ color: "#5a6474", fontSize: "14px" }}>{"a month"}</span>
                      </span>
                      <button type={"submit"} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">{"Save"}</button>
                      <button type={"button"} onClick={v.cgCancelBudget} style={{ height: "44px", padding: "0 14px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }}>{"Cancel"}</button>
                    </span>
                    {v.cgBudgetErr ? <span role={"alert"} style={{ fontSize: "13px", fontWeight: "600", color: "#a3330c" }}>{v.cgBudgetErr}</span> : <span style={{ fontSize: "13px", color: "#5a6474" }}>{"Leave it empty to remove the budget."}</span>}
                  </form>
                ) : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#5a6474" }}>{"Goals"}</span>
                  {(v.cgCanAdd) ? <button onClick={v.cgAdd} style={{ height: "40px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">{"Add goal"}</button> : null}
                </div>
                {(v.cgNoGoals) ? <span style={{ fontSize: "14px", color: "#5a6474", padding: "6px 0" }}>{"No goals yet. Set a cost per lead limit or a weekly leads target, and Analyst tells you when it drifts."}</span> : null}
                {((v.cgGoals) || []).map(g => (
                  <div key={g.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "6px 12px", alignItems: "center", padding: "12px 0", borderTop: "1px solid #eef1f6" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}><strong style={{ fontWeight: "600" }}>{g.label}</strong><span style={{ fontSize: "14px", color: "#45505f" }}>{g.target}</span></span>
                    <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                      <span style={{ padding: "2px 10px", background: g.pBg, color: g.pC, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", marginRight: "6px" }}>{g.status}</span>
                      <button onClick={g.edit} aria-label={g.editLabel} style={{ width: "44px", height: "44px", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcf0b705f"><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"}></path></svg></button>
                      <button onClick={g.remove} aria-label={g.removeLabel} style={{ width: "44px", height: "44px", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcf0b705f"><svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}><path d={"M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"}></path></svg></button>
                    </span>
                    <span style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "12px" }}>
                      <span aria-hidden={"true"} style={{ position: "relative", flex: "1", height: "6px", background: "#eef1f6" }}><span style={{ display: "block", height: "100%", width: g.w, background: g.col }}></span><span style={{ position: "absolute", top: "-3px", bottom: "-3px", left: g.mk, width: "2px", background: "#0b1626" }}></span></span>
                      <span style={{ flex: "none", fontSize: "13px", color: "#5a6474", fontVariantNumeric: "tabular-nums" }}>{g.now}</span>
                    </span>
                  </div>
                ))}
                {(v.cgFormOn) ? (
                  <form onSubmit={v.cgSave} noValidate={true} aria-label={v.cgFormTitle} style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "16px", marginTop: "6px", background: "#f4f7fb" }}>
                    <strong style={{ fontSize: "15px" }}>{v.cgFormTitle}</strong>
                    <div role={"radiogroup"} aria-label={"Goal type"} style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {((v.cgTypes) || []).map(t => <button key={t.label} type={"button"} role={"radio"} aria-checked={t.on} onClick={t.pick} style={{ height: "40px", padding: "0 14px", border: "1.5px solid " + (t.on ? "#1f6be2" : "#d3dbe6"), borderRadius: "0", background: t.on ? "#eef3fd" : "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }}>{t.label}</button>)}
                    </div>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600" }}>{v.cgTargetLabel}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", width: "220px", height: "44px", padding: "0 12px", border: "1px solid " + (v.cgTargetErr ? "#e0481a" : "#d3dbe6"), background: "#ffffff" }}>
                        <span style={{ color: "#5a6474", fontWeight: "600" }}>{v.cgPre}</span>
                        <input autoFocus={true} value={v.cgTarget} onChange={v.cgSetTarget} inputMode={"decimal"} placeholder={v.cgPh} aria-invalid={!!v.cgTargetErr} style={{ flex: "1", minWidth: "0", height: "40px", border: "0", outline: "none", font: "inherit", letterSpacing: "inherit", background: "transparent" }} />
                        <span style={{ color: "#5a6474", fontWeight: "600" }}>{v.cgSuf}</span>
                      </span>
                      {v.cgTargetErr ? <span role={"alert"} style={{ fontSize: "13px", fontWeight: "600", color: "#a3330c" }}>{v.cgTargetErr}</span> : <span style={{ fontSize: "13px", color: "#5a6474" }}>{v.cgHelp}</span>}
                    </label>
                    <span style={{ display: "flex", gap: "8px" }}>
                      <button type={"submit"} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">{v.cgFormSave}</button>
                      <button type={"button"} onClick={v.cgCancel} style={{ height: "44px", padding: "0 14px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }}>{"Cancel"}</button>
                    </span>
                  </form>
                ) : null}
              </div>
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
              {(v.pfAskShow) ? (
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", padding: "16px 0 12px", borderTop: "1px solid #eef1f6" }}>
                <span style={{ flex: "1 1 220px", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "1.3" }}>
                  <span style={{ fontWeight: "600" }}>
                    {v.pfAskTitle}
                  </span>
                  <span style={{ fontSize: "14px", color: "#5a6474", textWrap: "pretty" }}>
                    {v.pfAskText}
                  </span>
                </span>
                <span style={{ display: "flex", gap: "4px" }}>
                  {(v.pfAskAgain) ? (
                    <button onClick={v.pfAskAgainDo} style={{ height: "40px", padding: "0 12px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer", whiteSpace: "nowrap" }} className="dcbbe0dc7">
                      {"Send again"}
                    </button>
                  ) : null}
                  <button onClick={v.pfAsk} style={{ height: "40px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", whiteSpace: "nowrap" }}>
                    {v.pfAskCopied ? "Copied" : v.pfAskBtn}
                  </button>
                </span>
              </div>
              ) : null}
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
