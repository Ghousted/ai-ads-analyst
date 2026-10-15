import React from 'react';

export function GoalsView({ v }) {
  // KPIs and goals
  return (
    <>
      {(v.vKpi) ? (<>
        {" "}
        <div onClick={v.gpClose} aria-hidden={"true"} style={{ position: "fixed", inset: "0", zIndex: "55", background: "rgba(11,22,38,.28)", opacity: v.gpO, pointerEvents: v.gpPe, transition: "opacity 200ms ease" }}></div>
        {" "}
        <aside role={"dialog"} aria-modal={"true"} aria-label={"Goal details"} style={{ position: "fixed", top: "0", bottom: "0", right: "0", zIndex: "60", width: "min(480px,100vw)", background: "#ffffff", boxShadow: "-24px 0 48px -24px rgba(11,22,38,.35)", display: "flex", flexDirection: "column", transform: `translateX(${v.gpX ?? ""})`, visibility: v.gpVis, transition: "transform 260ms cubic-bezier(0.23,1,0.32,1),visibility 260ms" }}>
          {" "}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "16px 20px", borderBottom: "1px solid #eef1f6" }}>
            {" "}
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f6be2" }}>
              {v.gpClient}
            </span>
            {" "}
            <button onClick={v.gpClose} aria-label={"Close goal details"} style={{ width: "44px", height: "44px", marginRight: "-10px", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcf0b705f">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.4"} strokeLinecap={"round"}>
                <path d={"M6 6l12 12M18 6L6 18"}></path>
              </svg>
            </button>
            {" "}
          </div>
          {" "}
          <div style={{ flex: "1", overflowY: "auto", padding: "20px 24px 32px", display: "flex", flexDirection: "column", gap: "28px" }}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h2 style={{ margin: "0", fontSize: "24px", fontWeight: "700", letterSpacing: "-0.6px" }}>
                  {v.gpLabel}
                </h2>
                <span style={{ padding: "3px 10px", borderRadius: "999px", background: v.gpPBg, color: v.gpPC, fontSize: "13px", fontWeight: "600" }}>
                  {v.gpStatus}
                </span>
              </div>
              {" "}
              <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "14px", color: "#5a6474" }}>
                    {v.gpNowLabel}
                  </span>
                  <span style={{ fontSize: "32px", fontWeight: "700", letterSpacing: "-1px", fontVariantNumeric: "tabular-nums", color: v.gpPC }}>
                    {v.gpNow}
                  </span>
                </div>
                {" "}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "14px", color: "#5a6474" }}>
                    {"Goal"}
                  </span>
                  <span style={{ fontSize: "32px", fontWeight: "700", letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>
                    {v.gpTarget}
                  </span>
                </div>
                {" "}
              </div>
              {" "}
              <span style={{ position: "relative", height: "10px", background: "#eef1f6", marginTop: "4px" }}>
                <span style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: v.gpW, background: v.gpCol }}></span>
                <span style={{ position: "absolute", top: "-4px", bottom: "-4px", left: v.gpMk, width: "2px", background: "#0b1626" }}></span>
              </span>
              {" "}
              <span style={{ fontSize: "15px", fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>
                {v.gpCaption}
              </span>
              {" "}
            </div>
            {" "}
            <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {" "}
              <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>
                {v.gpTrendLabel}
              </h3>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: "8px", alignItems: "end", height: "140px" }}>
                {" "}
                {((v.gpTrend) || []).map((b, $index) => (
                  <React.Fragment key={$index}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: "4px", height: "100%" }}>
                      <span style={{ fontSize: "12px", fontWeight: "600", fontVariantNumeric: "tabular-nums", color: "#45505f" }}>
                        {b?.v}
                      </span>
                      <span style={{ width: "100%", height: b?.h, background: b?.c }}></span>
                      <span style={{ fontSize: "12px", color: "#5a6474" }}>
                        {b?.wk}
                      </span>
                    </div>
                    {" "}
                  </React.Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </section>
            {" "}
            <section style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {" "}
              <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>
                {"What's driving it"}
              </h3>
              {" "}
              <p style={{ margin: "0", color: "#45505f", lineHeight: "1.55", textWrap: "pretty" }}>
                {v.gpWhy}
              </p>
              {" "}
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#5a6474" }}>
                {v.gpAlert?.a}
                <span style={{ color: "#1f6be2" }}>
                  {v.gpAlert?.b}
                </span>
                {v.gpAlert?.c}
              </p>
              {" "}
            </section>
            {" "}
          </div>
          {" "}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "16px 24px", borderTop: "1px solid #eef1f6" }}>
            {" "}
            {(v.gpNeedsTask) ? (<>
              <button onClick={v.gpTask} style={{ height: "44px", padding: "0 16px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                {"Create task"}
              </button>
            </>) : null}
            {" "}
            <button onClick={v.gpEdit} style={{ height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
              {"Edit goal"}
            </button>
            {" "}
            <button onClick={v.gpRemove} style={{ height: "44px", padding: "0 12px", marginLeft: "auto", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#a3330c", cursor: "pointer" }} className="dcf4e905a">
              {"Remove goal"}
            </button>
            {" "}
          </div>
          {" "}
        </aside>
        {" "}
        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {" "}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
            {" "}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {" "}
              {(v.gToast) ? (<>
                <span role={"status"} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", color: "#1d6b3a" }}>
                  {v.gToastText}
                  {(v.gCanUndo) ? (<>
                    <button onClick={v.gUndo} style={{ minHeight: "36px", padding: "0 10px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: "700", letterSpacing: "inherit", color: "#1f6be2", cursor: "pointer" }} className="dc9ba39f8">
                      {"Undo"}
                    </button>
                  </>) : null}
                </span>
              </>) : null}
              {" "}
              <button onClick={v.gAdd} style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", padding: "0 16px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", transition: "background-color 160ms ease,transform 160ms cubic-bezier(0.23,1,0.32,1)" }} className="dc9482609 dcadff8cd">
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"2.6"} strokeLinecap={"round"}>
                  <path d={"M12 5v14M5 12h14"}></path>
                </svg>
                {"Add goal"}
              </button>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div>
            {" "}
            {(v.gFormOpen) ? (<>
              {" "}
              <form onSubmit={v.gSave} noValidate={true} style={{ display: "flex", flexDirection: "column", gap: "18px", margin: "0 0 14px", padding: "20px", borderRadius: "0", background: "#ffffff" }}>
                {" "}
                <span style={{ fontWeight: "700", fontSize: "17px" }}>
                  {v.gFormTitle}
                </span>
                {" "}
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "360px" }}>
                  {" "}
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    {"Client"}
                  </span>
                  {" "}
                  <select value={(v.gfClient) ?? ""} onChange={v.gSetClient} aria-invalid={v.gErrClient} style={{ height: "44px", padding: "0 12px", border: `1px solid ${v.gfClientBd ?? ""}`, borderRadius: "0", background: "#ffffff", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outline: "none" }} className="dc120a618">
                    <option value={""}>
                      {"Choose a client"}
                    </option>
                    {((v.gClientOpts) || []).map((o, $index) => (
                      <React.Fragment key={$index}>
                        <option value={(o?.v) ?? ""}>{o?.t}</option>
                      </React.Fragment>
                    ))}
                  </select>
                  {" "}
                  {(v.gErrClient) ? (<>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#a3330c" }}>
                      {"Choose which client this goal is for."}
                    </span>
                  </>) : null}
                  {" "}
                </label>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {" "}
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    {"What do you want to track?"}
                  </span>
                  {" "}
                  <div role={"radiogroup"} aria-label={"Goal type"} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,170px),1fr))", gap: "8px" }}>
                    {" "}
                    {((v.gTypes) || []).map((t, $index) => (
                      <React.Fragment key={$index}>
                        {" "}
                        <button type={"button"} role={"radio"} aria-checked={t?.on} onClick={t?.pick} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", minHeight: "64px", padding: "10px 14px", border: `2px solid ${t?.bd ?? ""}`, borderRadius: "0", background: "#ffffff", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left", transition: "border-color 160ms ease" }}>
                          <span style={{ fontWeight: "600" }}>
                            {t?.label}
                          </span>
                          <span style={{ fontSize: "13px", color: "#5a6474" }}>
                            {t?.desc}
                          </span>
                        </button>
                        {" "}
                      </React.Fragment>
                    ))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "360px" }}>
                  {" "}
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    {v.gTargetLabel}
                  </span>
                  {" "}
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px", padding: "0 12px", border: `1px solid ${v.gfTargetBd ?? ""}`, borderRadius: "0", background: "#ffffff" }}>
                    {" "}
                    <span style={{ color: "#5a6474", fontWeight: "600" }}>
                      {v.gPrefix}
                    </span>
                    {" "}
                    <input value={(v.gfTarget) ?? ""} onChange={v.gSetTarget} inputMode={"decimal"} aria-invalid={v.gErrTargetOn} placeholder={v.gPlaceholder} style={{ flex: "1", minWidth: "0", height: "40px", border: "0", outline: "none", font: "inherit", letterSpacing: "inherit", background: "transparent", fontVariantNumeric: "tabular-nums" }} />
                    {" "}
                    <span style={{ color: "#5a6474", fontWeight: "600" }}>
                      {v.gSuffix}
                    </span>
                    {" "}
                  </span>
                  {" "}
                  {(v.gErrTargetOn) ? (<>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#a3330c" }}>
                      {v.gErrTarget}
                    </span>
                  </>) : null}
                  {" "}
                  {(v.gHelperOn) ? (<>
                    <span style={{ fontSize: "13px", color: "#5a6474" }}>
                      {v.gHelper}
                    </span>
                  </>) : null}
                  {" "}
                </label>
                {" "}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {" "}
                  <button type={"submit"} style={{ height: "44px", padding: "0 20px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                    {v.gSaveLabel}
                  </button>
                  {" "}
                  <button type={"button"} onClick={v.gCancel} style={{ height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcdda73d1">
                    {"Cancel"}
                  </button>
                  {" "}
                </div>
                {" "}
              </form>
              {" "}
            </>) : null}
            {" "}
            {(v.gEmpty) ? (<>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "36px 12px", textAlign: "center" }}>
                <span style={{ fontWeight: "700" }}>
                  {v.gEmptyTitle}
                </span>
                <span style={{ color: "#5a6474", maxWidth: "380px" }}>
                  {"Set a target, like a cost per lead limit or a monthly budget, and "}
                  <span style={{ color: "#1f6be2" }}>
                    {"Analyst"}
                  </span>
                  {" will tell you when it drifts."}
                </span>
              </div>
              {" "}
            </>) : null}
            {" "}
            <div style={{ overflowX: "auto", margin: "0 -12px", padding: "0 12px" }}>
              {" "}
              {(v.gHasRows) ? (<>
                <div role={"row"} style={{ display: "grid", gridTemplateColumns: "minmax(150px,1fr) minmax(150px,1fr) minmax(220px,1.5fr) 120px 96px", gap: "16px", minWidth: "780px", padding: "10px 12px", margin: "0 -12px", fontSize: "13px", fontWeight: "600", color: "#5a6474" }}>
                  <span role={"columnheader"}>
                    {"Client"}
                  </span>
                  <span role={"columnheader"}>
                    {"Goal"}
                  </span>
                  <span role={"columnheader"}>
                    {"Progress"}
                  </span>
                  <span role={"columnheader"}>
                    {"Status"}
                  </span>
                  <span role={"columnheader"} style={{ textAlign: "right" }}>
                    {"Actions"}
                  </span>
                </div>
              </>) : null}
              {" "}
              {((v.gRows) || []).map((g, $index) => (
                <React.Fragment key={$index}>
                  {" "}
                  <div onClick={g?.open} style={{ display: "grid", gridTemplateColumns: "minmax(150px,1fr) minmax(150px,1fr) minmax(220px,1.5fr) 120px 96px", alignItems: "center", gap: "16px", minWidth: "780px", minHeight: "72px", padding: "10px 12px", margin: "0 -12px", borderTop: `1px solid ${g?.bd ?? ""}`, background: g?.rowBg, cursor: "pointer", transition: "background-color 140ms ease" }} className="dc228142d">
                    {" "}
                    <span style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "0" }}>
                      {(g?.first) ? (<>
                        <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "#d6e4f8", display: "grid", placeItems: "center", fontSize: "12px", fontWeight: "700" }}>
                          {g?.initials}
                        </span>
                        <span style={{ fontWeight: "600", lineHeight: "1.3" }}>
                          {g?.client}
                        </span>
                      </>) : null}
                    </span>
                    {" "}
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: "1.35" }}>
                      <span style={{ fontWeight: "600" }}>
                        {g?.label}
                      </span>
                    </span>
                    {" "}
                    <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {" "}
                      <span style={{ position: "relative", height: "10px", borderRadius: "0", background: "#eef1f6" }}>
                        <span style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: g?.w, borderRadius: "0", background: g?.col, transition: "width 400ms cubic-bezier(0.23,1,0.32,1)" }}></span>
                        <span title={g?.mkTitle} style={{ position: "absolute", top: "-4px", bottom: "-4px", left: g?.mk, width: "2px", borderRadius: "0", background: "#0b1626" }}></span>
                      </span>
                      {" "}
                      <span style={{ fontSize: "15px", fontWeight: "600", color: "#0b1626", fontVariantNumeric: "tabular-nums" }}>
                        {g?.caption}
                      </span>
                      {" "}
                    </span>
                    {" "}
                    <span style={{ justifySelf: "start", padding: "3px 10px", borderRadius: "0", background: g?.pBg, color: g?.pC, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>
                      {g?.status}
                    </span>
                    {" "}
                    <span style={{ display: "flex", justifyContent: "flex-end", gap: "2px" }}>
                      {" "}
                      <button onClick={g?.edit} aria-label={g?.editLabel} style={{ width: "44px", height: "44px", border: "0", borderRadius: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcceddbc1">
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={"M4 20h4L19 9l-4-4L4 16z"}></path>
                        </svg>
                      </button>
                      {" "}
                      <button onClick={g?.remove} aria-label={g?.removeLabel} style={{ width: "44px", height: "44px", border: "0", borderRadius: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dce77e1f6">
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={"M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"}></path>
                        </svg>
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
        </section>
        {" "}
      </>) : null}
    </>
  );
}
