import React from 'react';

export function TasksView({ v }) {
  // Tasks: board, list, flagged clients and the new-task wizard
  return (
    <>
      {(v.vTasks) ? (<>
        {" "}
        <div onClick={v.tdClose} aria-hidden={"true"} style={{ position: "fixed", inset: "0", zIndex: "55", background: "rgba(11,22,38,.28)", opacity: v.tdO, pointerEvents: v.tdPe, transition: "opacity 200ms ease" }}></div>
        {" "}
        <aside role={"dialog"} aria-modal={"true"} aria-label={"Task details"} style={{ position: "fixed", top: "0", bottom: "0", right: "0", zIndex: "60", width: "min(480px,100vw)", background: "#ffffff", boxShadow: "-24px 0 48px -24px rgba(11,22,38,.35)", display: "flex", flexDirection: "column", transform: `translateX(${v.tdX ?? ""})`, visibility: v.tdVis, transition: "transform 260ms cubic-bezier(0.23,1,0.32,1),visibility 260ms" }}>
          {" "}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "16px 20px", borderBottom: "1px solid #eef1f6" }}>
            {" "}
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#1f6be2" }}>
              {v.tdClient}
            </span>
            {" "}
            <button onClick={v.tdClose} aria-label={"Close task details"} style={{ width: "44px", height: "44px", marginRight: "-10px", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcf0b705f">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.4"} strokeLinecap={"round"}>
                <path d={"M6 6l12 12M18 6L6 18"}></path>
              </svg>
            </button>
            {" "}
          </div>
          {" "}
          <div style={{ flex: "1", overflowY: "auto", padding: "20px 24px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {" "}
              <h2 style={{ margin: "0", fontSize: "24px", fontWeight: "700", letterSpacing: "-0.6px", lineHeight: "1.25", textWrap: "pretty" }}>
                {v.tdTitle}
              </h2>
              {" "}
              <p style={{ margin: "0", color: "#45505f", lineHeight: "1.55", textWrap: "pretty" }}>
                {v.tdDesc?.a}
                <span style={{ color: "#1f6be2" }}>
                  {v.tdDesc?.b}
                </span>
                {v.tdDesc?.c}
              </p>
              {" "}
            </div>
            {" "}
            <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "110px minmax(0,1fr)", gap: "14px 16px", alignItems: "center" }}>
              <dt style={{ color: "#5a6474", fontSize: "14px" }}>
                {"Status"}
              </dt>
              <dd style={{ margin: "0" }}>
                <select aria-label={"Status"} value={(v.tdStatus) ?? ""} onChange={v.tdSetStatus} style={{ height: "40px", padding: "0 32px 0 12px", border: "0", borderRadius: "0", background: "#eef1f6", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }}>
                  {((v.tdStatuses) || []).map((so, $index) => (
                    <React.Fragment key={$index}>
                      <option value={(so?.k) ?? ""}>{so?.label}</option>
                    </React.Fragment>
                  ))}
                </select>
              </dd>
              <dt style={{ color: "#5a6474", fontSize: "14px" }}>
                {"Due"}
              </dt>
              <dd style={{ margin: "0", fontWeight: "600", color: v.tdDueC }}>
                {v.tdDue}
              </dd>
              <dt style={{ color: "#5a6474", fontSize: "14px" }}>
                {"Assigned to"}
              </dt>
              <dd style={{ margin: "0", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {((v.tdWho) || []).map((w, $index) => (
                  <React.Fragment key={$index}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: w?.bg, display: "grid", placeItems: "center", fontSize: "11px", fontWeight: "700" }}>
                        {w?.i}
                      </span>
                      {w?.name}
                    </span>
                  </React.Fragment>
                ))}
              </dd>
            </dl>
            {" "}
            <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {" "}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>
                  {"Checklist"}
                </h3>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#45505f", fontVariantNumeric: "tabular-nums" }}>
                  {v.tdChkTxt}
                </span>
              </div>
              {" "}
              <div style={{ height: "5px", background: "#eef1f6", borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: v.tdChkPct, background: "#1f6be2", borderRadius: "9999px", transition: "width 300ms cubic-bezier(0.23,1,0.32,1)" }}></div>
              </div>
              {" "}
              {((v.tdChk) || []).map((ci, $index) => (
                <React.Fragment key={$index}>
                  {" "}
                  <button role={"checkbox"} aria-checked={ci?.on} onClick={ci?.toggle} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", padding: "0", border: "0", background: "transparent", font: "inherit", letterSpacing: "inherit", color: ci?.c, textDecoration: ci?.deco, cursor: "pointer", textAlign: "left" }}>
                    <span style={{ flex: "none", width: "20px", height: "20px", border: `1.5px solid ${ci?.bd ?? ""}`, background: ci?.bg, display: "grid", placeItems: "center" }}>
                      <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3.4"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ opacity: ci?.o }}>
                        <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                      </svg>
                    </span>
                    {ci?.label}
                  </button>
                  {" "}
                </React.Fragment>
              ))}
              {" "}
              {(v.tdChkNone) ? (<>
                <span style={{ color: "#5a6474" }}>
                  {"No checklist for this task."}
                </span>
              </>) : null}
              {" "}
            </section>
            {" "}
            <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {" "}
              <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>
                {"Comments"}
              </h3>
              {" "}
              {((v.tdCms) || []).map((cm, $index) => (
                <React.Fragment key={$index}>
                  {" "}
                  <div style={{ display: "flex", gap: "10px" }}>
                    {" "}
                    <span style={{ flex: "none", width: "28px", height: "28px", borderRadius: "50%", background: cm?.bg, display: "grid", placeItems: "center", fontSize: "11px", fontWeight: "700" }}>
                      {cm?.i}
                    </span>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                      <span style={{ fontSize: "14px" }}>
                        <strong style={{ fontWeight: "600" }}>
                          {cm?.name}
                        </strong>
                        {" "}
                        <span style={{ color: "#5a6474" }}>
                          {cm?.when}
                        </span>
                      </span>
                      <span style={{ lineHeight: "1.5", textWrap: "pretty" }}>
                        {cm?.text}
                      </span>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </React.Fragment>
              ))}
              {" "}
              {(v.tdCmNone) ? (<>
                <span style={{ color: "#5a6474" }}>
                  {"No comments yet."}
                </span>
              </>) : null}
              {" "}
              <form onSubmit={v.tdAddCm} style={{ display: "flex", gap: "8px" }}>
                {" "}
                <input value={(v.tdCmVal) ?? ""} onChange={v.tdSetCm} aria-label={"Write a comment"} placeholder={"Write a comment"} style={{ flex: "1", minWidth: "0", height: "44px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outlineColor: "#1f6be2" }} />
                {" "}
                <button type={"submit"} style={{ height: "44px", padding: "0 16px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                  {"Post"}
                </button>
                {" "}
              </form>
              {" "}
            </section>
            {" "}
          </div>
          {" "}
        </aside>
        {" "}
        <div role={"tablist"} aria-label={"Task view"} style={{ display: "flex", gap: "24px", borderBottom: "1px solid #e6ebf2", marginTop: "-8px" }}>
          {" "}
          {((v.tkViews) || []).map((tv, $index) => (
            <React.Fragment key={$index}>
              <button role={"tab"} aria-selected={tv?.on} onClick={tv?.pick} style={{ display: "flex", alignItems: "center", gap: "8px", height: "48px", padding: "0 2px", marginBottom: "-1px", border: "0", borderBottom: `2px solid ${tv?.bd ?? ""}`, background: "transparent", font: "inherit", fontSize: "16px", fontWeight: tv?.fw, letterSpacing: "inherit", color: tv?.c, cursor: "pointer", transition: "color 150ms ease,border-color 150ms ease" }} className="dc20c6b10">
                {tv?.label}
              </button>
            </React.Fragment>
          ))}
          {" "}
        </div>
        {" "}
        {" "}
        {" "}
        {(v.tkIsBoard) ? (<>
          {" "}
          <div style={{ overflowX: "auto", margin: "0 -8px", padding: "0 8px 8px" }}>
            {" "}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(260px,1fr))", gap: "16px", alignItems: "start", minWidth: "1088px" }}>
              {" "}
              {((v.tkBoard) || []).map((col, $index) => (
                <React.Fragment key={$index}>
                  {" "}
                  <section aria-label={col?.label} onDragOver={col?.dragOver} onDrop={col?.drop} onDragLeave={col?.dragLeave} style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "240px", padding: "8px", margin: "-8px", background: col?.bg, boxShadow: col?.ring, transition: "background-color 150ms ease" }}>
                    {" "}
                    <h2 style={{ margin: "0", display: "flex", alignItems: "center", gap: "10px", height: "36px", fontSize: "16px", fontWeight: "700", letterSpacing: "-0.3px" }}>
                      {col?.label}
                      <span style={{ minWidth: "24px", height: "24px", padding: "0 7px", borderRadius: "9999px", background: col?.cBg, color: col?.cC, display: "grid", placeItems: "center", fontSize: "13px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                        {col?.count}
                      </span>
                    </h2>
                    {" "}
                    {((col?.items) || []).map((t, $index) => (
                      <React.Fragment key={$index}>
                        {" "}
                        <article draggable={"true"} onClick={t?.open} onDragStart={t?.dragStart} onDragEnd={t?.dragEnd} style={{ position: "relative", boxSizing: "border-box", height: "276px", display: "flex", flexDirection: "column", gap: "14px", padding: "18px", background: "#ffffff", border: "1px solid #e6ebf2", opacity: t?.op, cursor: "grab", transition: "box-shadow 160ms ease,border-color 160ms ease" }} className="dcae383ef">
                          {" "}
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                            {" "}
                            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
                              {" "}
                              {(t?.hasClient) ? (<>
                                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1f6be2" }}>
                                  {t?.client}
                                </span>
                              </>) : null}
                              {" "}
                              <h3 style={{ margin: "0", minHeight: "2.6em", fontSize: "17px", fontWeight: "700", letterSpacing: "-0.4px", lineHeight: "1.3", textDecoration: t?.deco, display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {t?.title}
                              </h3>
                              {" "}
                            </div>
                            {" "}
                            <button aria-label={"Task options"} aria-expanded={t?.menuOn} onClick={t?.toggleMenu} style={{ flex: "none", width: "32px", height: "32px", margin: "-6px -8px 0 0", border: "0", background: "transparent", display: "grid", placeItems: "center", color: "#5a6474", cursor: "pointer" }} className="dceb8c957">
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"currentColor"}>
                                <circle cx={"5"} cy={"12"} r={"1.8"}></circle>
                                <circle cx={"12"} cy={"12"} r={"1.8"}></circle>
                                <circle cx={"19"} cy={"12"} r={"1.8"}></circle>
                              </svg>
                            </button>
                            {" "}
                          </div>
                          {" "}
                          {(t?.menuOn) ? (<>
                            {" "}
                            <div role={"menu"} style={{ position: "absolute", top: "44px", right: "10px", zIndex: "5", minWidth: "180px", padding: "6px", background: "#ffffff", border: "1px solid #e6ebf2", boxShadow: "0 16px 32px -16px rgba(11,22,38,.35)", display: "flex", flexDirection: "column" }}>
                              {" "}
                              <span style={{ padding: "6px 10px", fontSize: "13px", color: "#5a6474" }}>
                                {"Move to"}
                              </span>
                              {" "}
                              {((t?.moves) || []).map((m, $index) => (
                                <React.Fragment key={$index}>
                                  <button role={"menuitem"} onClick={m?.go} style={{ height: "40px", padding: "0 10px", border: "0", background: "transparent", font: "inherit", fontSize: "15px", letterSpacing: "inherit", color: "#0b1626", textAlign: "left", cursor: "pointer" }} className="dcf0b705f">
                                    {m?.label}
                                  </button>
                                </React.Fragment>
                              ))}
                              {" "}
                              <button role={"menuitem"} onClick={t?.remove} style={{ height: "40px", padding: "0 10px", marginTop: "4px", border: "0", borderTop: "1px solid #eef1f6", background: "transparent", font: "inherit", fontSize: "15px", letterSpacing: "inherit", color: "#a3330c", textAlign: "left", cursor: "pointer" }} className="dcf4e905a">
                                {"Delete task"}
                              </button>
                              {" "}
                            </div>
                            {" "}
                          </>) : null}
                          {" "}
                          {(t?.hasDesc) ? (<>
                            <p style={{ margin: "-6px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#5a6474", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {t?.desc}
                            </p>
                          </>) : null}
                          {" "}
                          {(t?.hasSub) ? (<>
                            {" "}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              {" "}
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#45505f" }}>
                                <svg aria-hidden={"true"} width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <path d={"M10 6h10M10 12h10M10 18h10M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17"}></path>
                                </svg>
                                <span style={{ flex: "1" }}>
                                  {t?.subLabel}
                                </span>
                                <span style={{ fontWeight: "600", fontVariantNumeric: "tabular-nums", color: "#0b1626" }}>
                                  {t?.subTxt}
                                </span>
                              </div>
                              {" "}
                              <div style={{ height: "5px", background: "#eef1f6", borderRadius: "9999px", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: t?.pct, background: t?.barC, borderRadius: "9999px", transition: "width 300ms cubic-bezier(0.23,1,0.32,1)" }}></div>
                              </div>
                              {" "}
                            </div>
                            {" "}
                          </>) : null}
                          {" "}
                          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #eef1f6", fontSize: "14px", color: "#45505f" }}>
                            {" "}
                            {(t?.hasDue) ? (<>
                              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: t?.dueC, fontWeight: t?.dueW }}>
                                <svg aria-hidden={"true"} width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <rect x={"4"} y={"5"} width={"16"} height={"15"} rx={"2"}></rect>
                                  <path d={"M8 3v4M16 3v4M4 10h16"}></path>
                                </svg>
                                {t?.due}
                              </span>
                            </>) : null}
                            {" "}
                            {(t?.hasCm) ? (<>
                              <span aria-label={t?.cmLabel} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <svg aria-hidden={"true"} width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                                  <path d={"M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"}></path>
                                </svg>
                                {t?.cm}
                              </span>
                            </>) : null}
                            {" "}
                            <span style={{ flex: "1" }}></span>
                            {" "}
                            <span style={{ display: "flex" }}>
                              {" "}
                              {((t?.avatars) || []).map((av, $index) => (
                                <React.Fragment key={$index}>
                                  <span title={av?.name} style={{ width: "28px", height: "28px", marginLeft: "-6px", borderRadius: "50%", background: av?.bg, boxShadow: "0 0 0 2px #ffffff", display: "grid", placeItems: "center", fontSize: "11px", fontWeight: "700", color: "#0b1626" }}>
                                    {av?.i}
                                  </span>
                                </React.Fragment>
                              ))}
                              {" "}
                            </span>
                            {" "}
                          </div>
                          {" "}
                        </article>
                        {" "}
                      </React.Fragment>
                    ))}
                    {" "}
                    {(col?.adding) ? (<>
                      {" "}
                      <form onSubmit={col?.submitAdd} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", background: "#ffffff", border: "1px solid #1f6be2", boxShadow: "0 0 0 3px #d6e4f8" }}>
                        {" "}
                        <input value={(v.tkAddVal) ?? ""} onChange={v.tkSetAdd} onKeyDown={v.tkAddKey} autoFocus={true} aria-label={"Task name"} aria-invalid={v.tkAddErr} placeholder={"What needs doing?"} style={{ height: "44px", padding: "0 12px", border: "1px solid #d3dbe6", font: "inherit", fontSize: "15px", letterSpacing: "inherit", outline: "none" }} className="dc054f106" />
                        {" "}
                        {(v.tkAddErr) ? (<>
                          <span role={"alert"} style={{ fontSize: "13px", fontWeight: "600", color: "#a3330c" }}>
                            {"Give the task a name first."}
                          </span>
                        </>) : null}
                        {" "}
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          {" "}
                          <button type={"button"} onClick={v.tkCancelAdd} style={{ height: "40px", padding: "0 14px", border: "0", background: "transparent", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcf0b705f">
                            {"Cancel"}
                          </button>
                          {" "}
                          <button type={"submit"} style={{ height: "40px", padding: "0 16px", border: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                            {"Add task"}
                          </button>
                          {" "}
                        </div>
                        {" "}
                      </form>
                      {" "}
                    </>) : null}
                    {" "}
                  </section>
                  {" "}
                </React.Fragment>
              ))}
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </>) : null}
        {" "}
        {(v.tkIsList) ? (<>
          {" "}
          <div style={{ background: "#ffffff", borderRadius: "0", padding: "6px 18px" }}>
            {" "}
            {(v.tasksEmpty) ? (<>
              <p style={{ margin: "0", padding: "24px 0", color: "#5a6474" }}>
                {"No tasks for this client yet. Add one above."}
              </p>
            </>) : null}
            {" "}
            {((v.tasks) || []).map((tk, $index) => (
              <React.Fragment key={$index}>
                {" "}
                <label style={{ display: "flex", alignItems: "center", gap: "14px", minHeight: "60px", borderBottom: "1px solid #eef1f6", cursor: "pointer" }}>
                  {" "}
                  <input type={"checkbox"} checked={!!(tk?.done)} onChange={tk?.toggle} style={{ width: "20px", height: "20px", margin: "0", accentColor: "#1f6be2", cursor: "pointer" }} />
                  {" "}
                  <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "500", textDecoration: tk?.deco, color: tk?.c }}>
                      {tk?.title}
                    </span>
                    <span style={{ fontSize: "14px", color: "#5a6474" }}>
                      {tk?.meta}
                    </span>
                  </span>
                  {" "}
                  <span style={{ flex: "none", fontSize: "14px", color: "#5a6474" }}>
                    {tk?.statusLabel}
                  </span>
                  {" "}
                </label>
                {" "}
              </React.Fragment>
            ))}
            {" "}
          </div>
          {" "}
        </>) : null}
        {" "}
      </>) : null}
    </>
  );
}

export function TasksOverlay({ v }) {
  // Dialogs and menus that sit above the page
  return (
    <>
  {(v.twOpen) ? (<>
    {" "}
    <div onClick={v.twBackdrop} style={{ position: "fixed", inset: "0", zIndex: "60", background: "rgba(11,22,38,.45)", display: "grid", placeItems: "center", padding: "24px" }}>
      {" "}
      <div role={"dialog"} aria-modal={"true"} aria-labelledby={"tw-title"} style={{ width: "min(600px,100%)", minHeight: "min(500px,calc(100vh - 48px))", maxHeight: "calc(100vh - 48px)", overflowY: "auto", background: "#ffffff", borderRadius: "0", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 30px 80px -30px rgba(11,22,38,.5)" }}>
        {" "}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          {" "}
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#5a6474" }}>
            {"Step "}{v.twStep}{" of 3"}
          </span>
          {" "}
          <button onClick={v.twClose} aria-label={"Cancel new task"} style={{ width: "44px", height: "44px", margin: "-10px -10px -10px 0", border: "0", borderRadius: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcceddbc1">
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.4"} strokeLinecap={"round"}>
              <path d={"M6 6l12 12M18 6L6 18"}></path>
            </svg>
          </button>
          {" "}
        </div>
        {" "}
        <div style={{ display: "flex", gap: "6px" }}>
          {((v.twBars) || []).map((b, $index) => (
            <React.Fragment key={$index}>
              <span style={{ flex: "1", height: "4px", background: b?.c, transition: "background-color 200ms ease" }}></span>
            </React.Fragment>
          ))}
        </div>
        {" "}
        {(v.twS1) ? (<>
          {" "}
          <form onSubmit={v.twNext} noValidate={true} style={{ flex: "1", display: "flex", flexDirection: "column", gap: "20px" }}>
            {" "}
            <h2 id={"tw-title"} style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>
              {"What needs doing?"}
            </h2>
            {" "}
            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "600" }}>
                {"Task name"}
              </span>
              {" "}
              <input autoFocus={true} value={(v.twTitle) ?? ""} onChange={v.twSetTitle} placeholder={"e.g. Refresh Meta ad creative"} style={{ height: "52px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", fontSize: "17px", letterSpacing: "inherit", color: "#0b1626", outline: "none", borderColor: v.twTitleBd }} className="dc120a618" />
              {" "}
              {(v.twTitleErr) ? (<>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>
                  {"Give the task a name."}
                </span>
              </>) : null}
              {" "}
            </label>
            {" "}
            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontWeight: "600" }}>
                {"Details "}
                <span style={{ fontWeight: "400", color: "#5a6474" }}>
                  {"(optional)"}
                </span>
              </span>
              {" "}
              <textarea value={(v.twDesc) ?? ""} onChange={v.twSetDesc} rows={"3"} placeholder={"What's the goal, and anything the team should know"} style={{ padding: "12px 16px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", letterSpacing: "inherit", color: "#0b1626", resize: "vertical", outline: "none" }} className="dc120a618"></textarea>
              {" "}
            </label>
            {" "}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginTop: "auto" }}>
              {" "}
              <button type={"button"} onClick={v.twBack} style={{ height: "48px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">
                {v.twBackLabel}
              </button>
              {" "}
              <button type={"submit"} style={{ height: "48px", padding: "0 22px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                {"Next"}
              </button>
              {" "}
            </div>
            {" "}
          </form>
          {" "}
        </>) : null}
        {" "}
        {(v.twS2) ? (<>
          {" "}
          <form onSubmit={v.twNext} noValidate={true} style={{ flex: "1", display: "flex", flexDirection: "column", gap: "20px" }}>
            {" "}
            <h2 id={"tw-title"} style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>
              {"Who is it for, and when?"}
            </h2>
            {" "}
            <fieldset style={{ margin: "0", padding: "0", border: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <legend style={{ padding: "0 0 8px", fontWeight: "600" }}>
                {"Client"}
              </legend>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {((v.twClients) || []).map((X, $index) => (
                  <React.Fragment key={$index}>
                    <button type={"button"} role={"radio"} aria-checked={X?.on} onClick={X?.pick} style={{ display: "flex", alignItems: "center", gap: "8px", minHeight: "44px", padding: "0 14px", border: `1.5px solid ${X?.bd ?? ""}`, borderRadius: "0", background: X?.bg, font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", transition: "background-color 140ms ease,border-color 140ms ease" }}>
                      {X?.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              {" "}
            </fieldset>
            {" "}
            <label style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "240px" }}>
              <span style={{ fontWeight: "600" }}>
                {"Due date "}
                <span style={{ fontWeight: "400", color: "#5a6474" }}>
                  {"(optional)"}
                </span>
              </span>
              {" "}
              <input type={"date"} value={(v.twDue) ?? ""} onChange={v.twSetDue} style={{ height: "52px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", fontSize: "17px", letterSpacing: "inherit", color: "#0b1626", outline: "none" }} className="dc120a618" />
              {" "}
            </label>
            {" "}
            <fieldset style={{ margin: "0", padding: "0", border: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <legend style={{ padding: "0 0 8px", fontWeight: "600" }}>
                {"Assign to"}
              </legend>
              {" "}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {((v.twPeople) || []).map((X, $index) => (
                  <React.Fragment key={$index}>
                    <button type={"button"} role={"checkbox"} aria-checked={X?.on} onClick={X?.pick} style={{ display: "flex", alignItems: "center", gap: "8px", minHeight: "44px", padding: "0 14px", border: `1.5px solid ${X?.bd ?? ""}`, borderRadius: "0", background: X?.bg, font: "inherit", fontSize: "15px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", transition: "background-color 140ms ease,border-color 140ms ease" }}>
                      <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: X?.av, display: "grid", placeItems: "center", fontSize: "11px", fontWeight: "700" }}>
                        {X?.i}
                      </span>
                      {X?.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              {" "}
              {(v.twWhoErr) ? (<>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>
                  {"Pick at least one person."}
                </span>
              </>) : null}
              {" "}
            </fieldset>
            {" "}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginTop: "auto" }}>
              {" "}
              <button type={"button"} onClick={v.twBack} style={{ height: "48px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">
                {v.twBackLabel}
              </button>
              {" "}
              <button type={"submit"} style={{ height: "48px", padding: "0 22px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                {"Next"}
              </button>
              {" "}
            </div>
            {" "}
          </form>
          {" "}
        </>) : null}
        {" "}
        {(v.twS3) ? (<>
          {" "}
          <form onSubmit={v.twNext} noValidate={true} style={{ flex: "1", display: "flex", flexDirection: "column", gap: "20px" }}>
            {" "}
            <h2 id={"tw-title"} style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>
              {"Any steps to tick off?"}
            </h2>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {" "}
              {((v.twItems) || []).map((it, $index) => (
                <React.Fragment key={$index}>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "44px", borderBottom: "1px solid #eef1f6" }}>
                    <span style={{ flex: "none", width: "18px", height: "18px", border: "1.5px solid #97a2b2" }}></span>
                    <span style={{ flex: "1" }}>
                      {it?.label}
                    </span>
                    <button type={"button"} onClick={it?.remove} aria-label={it?.removeLabel} style={{ width: "44px", height: "44px", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcf0b705f">
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#5a6474"} strokeWidth={"2.4"} strokeLinecap={"round"}>
                        <path d={"M6 6l12 12M18 6L6 18"}></path>
                      </svg>
                    </button>
                  </div>
                  {" "}
                </React.Fragment>
              ))}
              {" "}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                {" "}
                <input value={(v.twItemVal) ?? ""} onChange={v.twSetItem} onKeyDown={v.twItemKey} aria-label={"Add a step"} placeholder={"Add a step and press Enter"} style={{ flex: "1", minWidth: "0", height: "48px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outline: "none" }} className="dc120a618" />
                {" "}
                <button type={"button"} onClick={v.twAddItem} style={{ height: "48px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                  {"Add"}
                </button>
                {" "}
              </div>
              {" "}
              <span style={{ fontSize: "14px", color: "#5a6474" }}>
                {"Optional. You can add steps later from the task."}
              </span>
              {" "}
            </div>
            {" "}
            <div style={{ padding: "14px 16px", background: "#f4f7fb", display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontWeight: "700" }}>
                {v.twTitle}
              </span>
              <span style={{ fontSize: "14px", color: "#45505f" }}>
                {v.twSummary}
              </span>
            </div>
            {" "}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginTop: "auto" }}>
              {" "}
              <button type={"button"} onClick={v.twBack} style={{ height: "48px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" }} className="dcceddbc1">
                {v.twBackLabel}
              </button>
              {" "}
              <button type={"submit"} style={{ height: "48px", padding: "0 22px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                {"Create task"}
              </button>
              {" "}
            </div>
            {" "}
          </form>
          {" "}
        </>) : null}
        {" "}
      </div>
      {" "}
    </div>
    {" "}
  </>) : null}
      {/* Flag details: opens from Ask Analyst, so it shows on every page. */}
      <>
        <div onClick={v.rpClose} aria-hidden={"true"} style={{ position: "fixed", inset: "0", zIndex: "55", background: "rgba(11,22,38,.28)", opacity: v.rpO, pointerEvents: v.rpPe, transition: "opacity 200ms ease" }}></div>
        {" "}
        <aside role={"dialog"} aria-modal={"true"} aria-label={"Flagged client details"} style={{ position: "fixed", top: "0", bottom: "0", right: "0", zIndex: "60", width: "min(480px,100vw)", background: "#ffffff", boxShadow: "-24px 0 48px -24px rgba(11,22,38,.35)", display: "flex", flexDirection: "column", transform: `translateX(${v.rpX ?? ""})`, visibility: v.rpVis, transition: "transform 260ms cubic-bezier(0.23,1,0.32,1),visibility 260ms" }}>
          {" "}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "16px 20px", borderBottom: "1px solid #eef1f6" }}>
            {" "}
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#5a6474" }}>
              {"Flagged by "}
              <span style={{ color: "#1f6be2" }}>
                {"Analyst"}
              </span>
            </span>
            {" "}
            <button onClick={v.rpClose} aria-label={"Close details"} style={{ width: "44px", height: "44px", marginRight: "-10px", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }} className="dcf0b705f">
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.4"} strokeLinecap={"round"}>
                <path d={"M6 6l12 12M18 6L6 18"}></path>
              </svg>
            </button>
            {" "}
          </div>
          {" "}
          <div style={{ flex: "1", overflowY: "auto", padding: "20px 24px 32px", display: "flex", flexDirection: "column", gap: "28px" }}>
            {" "}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {" "}
              <span style={{ flex: "none", width: "48px", height: "48px", borderRadius: "50%", background: "#d6e4f8", display: "grid", placeItems: "center", fontWeight: "700" }}>
                {v.rpInitials}
              </span>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <h2 style={{ margin: "0", fontSize: "24px", fontWeight: "700", letterSpacing: "-0.6px" }}>
                  {v.rpName}
                </h2>
                <span style={{ alignSelf: "flex-start", padding: "2px 10px", borderRadius: "999px", background: v.rpPBg, color: v.rpPC, fontSize: "13px", fontWeight: "600" }}>
                  {v.rpStatus}
                </span>
              </div>
              {" "}
            </div>
            {" "}
            <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {" "}
              <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>
                {"Why "}
                <span style={{ color: "#1f6be2" }}>
                  {"Analyst"}
                </span>
                {" flagged them"}
              </h3>
              {" "}
              <ul style={{ margin: "0", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px", color: "#45505f", lineHeight: "1.5" }}>
                {((v.rpReasons) || []).map((rs, $index) => (
                  <React.Fragment key={$index}>
                    <li style={{ textWrap: "pretty" }}>
                      {rs}
                    </li>
                  </React.Fragment>
                ))}
              </ul>
              {" "}
            </section>
            {" "}
            <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {" "}
              <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>
                {"Leads, last 6 weeks"}
              </h3>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: "8px", alignItems: "end", height: "140px" }}>
                {" "}
                {((v.rpBars) || []).map((b, $index) => (
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
            <dl style={{ margin: "0", display: "grid", gridTemplateColumns: "130px minmax(0,1fr)", gap: "12px 16px" }}>
              {((v.rpFacts) || []).map((f, $index) => (
                <React.Fragment key={$index}>
                  <dt style={{ color: "#5a6474", fontSize: "14px" }}>
                    {f?.k}
                  </dt>
                  <dd style={{ margin: "0", fontWeight: "600" }}>
                    {f?.v}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
            {" "}
            <section aria-busy={v.rpAiBusy ? "true" : "false"} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "44px", marginBottom: "-8px" }}>
                <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>
                  <span style={{ color: "#1f6be2" }}>
                    {"Analyst"}
                  </span>
                  {"’s read"}
                </h3>
                {(v.rpAiHas && v.rpAiRefresh) ? (
                  <button onClick={v.rpAiRefresh} style={{ height: "44px", padding: "0 12px", marginRight: "-12px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#1f6be2", cursor: "pointer" }} className="dc20c6b10">
                    {"Write again"}
                  </button>
                ) : null}
              </div>
              {(v.rpAiBusy) ? (<>
                <p role={"status"} style={{ margin: "0", color: "#5a6474" }}>
                  {"Reading " + v.rpName + "’s numbers…"}
                </p>
                <span aria-hidden={"true"} style={{ height: "12px", width: "100%", background: "#eef1f6" }}></span>
                <span aria-hidden={"true"} style={{ height: "12px", width: "92%", background: "#eef1f6" }}></span>
                <span aria-hidden={"true"} style={{ height: "12px", width: "64%", background: "#eef1f6" }}></span>
              </>) : null}
              {(v.rpAiErr) ? (<>
                <p role={"alert"} style={{ margin: "0", color: "#a3330c", lineHeight: "1.5" }}>
                  {v.rpAiErr}
                </p>
                <button onClick={v.rpAiRetry} style={{ alignSelf: "flex-start", height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                  {"Try again"}
                </button>
              </>) : null}
              {(v.rpAiNone) ? (
                <button onClick={v.rpAiRetry} style={{ alignSelf: "flex-start", height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                  {"Explain this flag"}
                </button>
              ) : null}
              {(v.rpAiHas) ? (<>
                <p style={{ margin: "0", lineHeight: "1.5", textWrap: "pretty" }}>
                  {v.rpSummary}
                </p>
                {(v.rpHasCauses) ? (
                  <ul aria-label={"Likely causes"} style={{ margin: "0", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px", color: "#45505f", lineHeight: "1.5" }}>
                    {((v.rpCauses) || []).map((cs, $index) => (
                      <li key={$index} style={{ textWrap: "pretty" }}>
                        {cs}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>) : null}
              {(v.rpAiRefreshErr) ? (
                <p role={"alert"} style={{ margin: "0", fontSize: "14px", color: "#a3330c" }}>
                  {v.rpAiRefreshErr}
                </p>
              ) : null}
            </section>
            {" "}
            {(v.rpAiHas) ? (<>
              <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>
                  {"What to do"}
                </h3>
                <ol style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {((v.rpSteps) || []).map((st, $index) => (
                    <li key={$index} style={{ display: "grid", gridTemplateColumns: "20px minmax(0,1fr) auto", gap: "4px 10px", alignItems: "center" }}>
                      <span aria-hidden={"true"} style={{ alignSelf: "start", paddingTop: "1px", fontWeight: "700", color: "#5a6474", fontVariantNumeric: "tabular-nums" }}>
                        {st?.n}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                        <span style={{ fontWeight: "600", textWrap: "pretty" }}>
                          {st?.action}
                        </span>
                        <span style={{ fontSize: "14px", color: "#45505f", lineHeight: "1.45", textWrap: "pretty" }}>
                          {st?.why}
                        </span>
                      </span>
                      <button onClick={st?.add} aria-label={st?.addAria} aria-disabled={st?.added ? "true" : "false"} style={{ height: "44px", padding: "0 10px", marginRight: "-10px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: st?.added ? "#1d6b3a" : "#1f6be2", cursor: st?.added ? "default" : "pointer", whiteSpace: "nowrap" }} className="dc20c6b10">
                        {st?.addLabel}
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
              {" "}
              <section style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "16px", background: "#f4f7fb" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "700" }}>
                    {"Check-in message"}
                  </h3>
                  {(v.rpMsgTo) ? (
                    <span style={{ fontSize: "13px", color: "#5a6474" }}>
                      {v.rpMsgTo}
                    </span>
                  ) : null}
                </div>
                <p style={{ margin: "0", lineHeight: "1.5", whiteSpace: "pre-wrap", textWrap: "pretty" }}>
                  {v.rpMsg}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                  <button onClick={v.rpCopy} aria-live={"polite"} style={{ height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                    {v.rpCopyLabel}
                  </button>
                  {(v.rpHasMail) ? (
                    <a href={v.rpMailHref} style={{ height: "44px", padding: "0 16px", display: "inline-flex", alignItems: "center", border: "1px solid #d3dbe6", background: "#ffffff", fontWeight: "600", color: "#0b1626", textDecoration: "none" }} className="dce60d758">
                      {"Open in email"}
                    </a>
                  ) : null}
                </div>
              </section>
            </>) : null}
            {" "}
          </div>
          {" "}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "16px 24px", borderTop: "1px solid #eef1f6" }}>
            {" "}
            <button onClick={v.rpCreate} style={{ height: "44px", padding: "0 16px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
              {"Create task"}
            </button>
            {" "}
            <button onClick={v.rpAsk} style={{ height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
              {"Ask "}
              <span style={{ color: "#1f6be2" }}>
                {"Analyst"}
              </span>
            </button>
            {" "}
            <button onClick={v.rpProfile} style={{ height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
              {"View profile"}
            </button>
            {" "}
            <button onClick={v.rpDismiss} style={{ height: "44px", padding: "0 12px", marginLeft: "auto", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#5a6474", cursor: "pointer" }} className="dc20c6b10">
              {"Dismiss"}
            </button>
            {" "}
          </div>
          {" "}
        </aside>
      </>
    </>
  );
}
