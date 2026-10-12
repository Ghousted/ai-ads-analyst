import React from 'react';

export function DashboardView({ v }) {
  // Dashboard analytics
  return (
    <>
      {(v.vAn) ? (<>
        {" "}
      </>) : null}
      {" "}
      {(v.vAn) ? (<>
        {" "}
        {(v.anEmpty) ? (<>
          {" "}
          <div style={{ minHeight: "52vh", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", textAlign: "center" }}>
            {" "}
            <span role={"img"} aria-label={`${v.anEmptyTool ?? ""} logo`} style={{ display: "block", width: "56px", height: "56px", marginBottom: "8px", background: `url('${v.anEmptyLogo ?? ""}') center / contain no-repeat` }}></span>
            {" "}
            <span style={{ fontWeight: "700", fontSize: "18px" }}>
              {v.anEmptyTitle}
            </span>
            {" "}
            <span style={{ color: "#5a6474", maxWidth: "420px" }}>
              {"Connect it and "}
              <span style={{ color: "#1f6be2" }}>
                {"Clario"}
              </span>
              {" will pull in the results automatically, so you never have to log in to the tool itself."}
            </span>
            {" "}
            <button onClick={v.anEmptyGo} style={{ marginTop: "8px", height: "44px", padding: "0 18px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
              {v.anEmptyBtn}
            </button>
            {" "}
          </div>
          {" "}
        </>) : null}
        {" "}
        {(v.anHas) ? (<>
          {" "}
          <section style={{ "--an-tint": v.anTint, "--an-ink": v.anInk, background: "#ffffff", borderRadius: "0", padding: "14px 22px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {" "}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
              {" "}
              <div role={"tablist"} aria-label={"Metric"} style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginLeft: "-12px" }}>
                {" "}
                {((v.anMetrics) || []).map((m, $index) => (
                  <React.Fragment key={$index}>
                    {" "}
                    <button role={"tab"} aria-selected={m?.on} onClick={m?.pick} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0", minHeight: "44px", padding: "8px 12px", border: "0", borderRadius: "0", background: m?.bg, font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left", transition: "background-color 160ms ease" }} className="dcf0b705f">
                      {" "}
                      <span style={{ fontSize: "14px", color: "#5a6474" }}>
                        {m?.label}
                      </span>
                      {" "}
                      <span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-0.8px", fontVariantNumeric: "tabular-nums", lineHeight: "1.25" }}>
                        {m?.value}
                      </span>
                      {" "}
                      <span style={{ fontSize: "13px", fontWeight: "600", color: m?.c }}>
                        {m?.note}
                      </span>
                      {" "}
                    </button>
                    {" "}
                  </React.Fragment>
                ))}
                {" "}
              </div>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", paddingTop: "8px" }}>
                {" "}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {" "}
                  {((v.anRanges) || []).map((r, $index) => (
                    <React.Fragment key={$index}>
                      <button onClick={r?.pick} style={{ height: "36px", padding: "0 14px", border: `1px solid ${r?.bd ?? ""}`, borderRadius: "0", background: r?.bg, font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: r?.c, cursor: "pointer", transition: "background-color 160ms ease" }}>
                        {r?.label}
                      </button>
                    </React.Fragment>
                  ))}
                  {" "}
                </div>
                {" "}
                <div onMouseEnter={v.showTake} onMouseLeave={v.hideTake} onFocus={v.showTake} onBlur={v.hideTake} style={{ position: "relative" }}>
                  {" "}
                  <button onClick={v.tapTake} aria-expanded={v.takeOpenB} aria-label={"Clario's take"} aria-describedby={"clario-take"} style={{ display: "grid", placeItems: "center", width: "44px", height: "44px", padding: "0", border: "0", borderRadius: "12px", background: v.takeBtnBg, cursor: "pointer", transition: "background-color 160ms ease,transform 120ms ease" }} className="dce5ff64e">
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1f6be2"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M9 18h6M10 21h4"}></path>
                      <path d={"M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z"}></path>
                    </svg>
                  </button>
                  {" "}
                  <p id={"clario-take"} role={"tooltip"} style={{ position: "absolute", right: "0", top: "calc(100% + 8px)", zIndex: "20", width: "min(420px,80vw)", margin: "0", padding: "14px 16px", borderRadius: "0", background: "#0b1626", color: "#ffffff", lineHeight: "1.5", fontSize: "15px", boxShadow: "0 18px 40px -18px rgba(11,22,38,.5)", transformOrigin: "top right", opacity: v.takeO, transform: v.takeT, visibility: v.takeVis, transition: "opacity 160ms ease,transform 200ms cubic-bezier(0.23,1,0.32,1),visibility 160ms" }}>
                    {v.anTake}
                  </p>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "14px", color: "#5a6474" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "12px", height: "3px", borderRadius: "0", background: v.anColor }}></span>
                {"This period"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "12px", height: "0", borderTop: "2px dashed #97a2b2" }}></span>
                {"Previous period"}
              </span>
            </div>
            {" "}
            <div ref={v.chartRef} tabIndex={"0"} aria-label={"Chart, scroll sideways to see earlier days"} style={{ overflowX: "auto", overflowY: "hidden", margin: "0 -22px", padding: "0 22px 6px", scrollbarWidth: "thin", outline: "none" }}>
              {" "}
              <div style={{ position: "relative", width: v.anChartW, minWidth: "100%" }}>
                {" "}
                <svg viewBox={v.anVB} preserveAspectRatio={"none"} role={"img"} aria-label={v.anChartLabel} style={{ width: "100%", height: "220px", display: "block" }}>
                  <path d={v.anGrid} stroke={"#eef1f6"} strokeWidth={"1"} vectorEffect={"non-scaling-stroke"}></path>
                  <path d={v.anArea} fill={v.anFill}></path>
                  <path d={v.anPrev} stroke={"#97a2b2"} strokeWidth={"2"} fill={"none"} strokeDasharray={"5 5"} vectorEffect={"non-scaling-stroke"}></path>
                  <path d={v.anLine} stroke={v.anColor} strokeWidth={"3"} fill={"none"} strokeLinecap={"round"} strokeLinejoin={"round"} vectorEffect={"non-scaling-stroke"}></path>
                </svg>
                {" "}
                <div style={{ position: "relative", height: "22px", marginTop: "8px", fontSize: "13px", color: "#5a6474" }}>
                  {" "}
                  {((v.anDays) || []).map((d, $index) => (
                    <React.Fragment key={$index}>
                      <span style={{ position: "absolute", top: "0", left: d?.x, transform: `translateX(${d?.tx ?? ""})`, whiteSpace: "nowrap" }}>
                        {d?.t}
                      </span>
                    </React.Fragment>
                  ))}
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </section>
          {" "}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: "16px" }}>
            {" "}
            {((v.anSections) || []).map((s, $index) => (
              <React.Fragment key={$index}>
                {" "}
                <section style={{ background: "#ffffff", borderRadius: "0", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px", minWidth: "0", gridColumn: s?.span }}>
                  {" "}
                  <h2 style={{ margin: "0", fontSize: "17px", fontWeight: "700" }}>
                    {s?.title}
                  </h2>
                  {" "}
                  {(s?.isBars) ? (<>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
                      {" "}
                      <div style={{ position: "relative", flex: "none", width: "150px", height: "150px" }}>
                        {" "}
                        <svg viewBox={"0 0 100 100"} role={"img"} aria-label={s?.aria} style={{ width: "150px", height: "150px", display: "block", transform: "rotate(-90deg)" }}>
                          <circle cx={"50"} cy={"50"} r={"40"} fill={"none"} stroke={"#f0f3f8"} strokeWidth={"14"}></circle>
                          {((s?.rows) || []).map((r, $index) => (
                            <React.Fragment key={$index}>
                              <circle cx={"50"} cy={"50"} r={"40"} fill={"none"} stroke={r?.col} strokeWidth={"14"} strokeDasharray={r?.dash} strokeDashoffset={r?.off}>
                                <title>{`${r?.label ?? ""} ${r?.pctLabel ?? ""}`}</title>
                              </circle>
                            </React.Fragment>
                          ))}
                        </svg>
                        {" "}
                        <span style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: "1.15" }}>
                          <span style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-0.8px" }}>
                            {s?.topPct}
                          </span>
                          <span style={{ fontSize: "12px", color: "#5a6474", maxWidth: "80px" }}>
                            {s?.topLabel}
                          </span>
                        </span>
                        {" "}
                      </div>
                      {" "}
                      <div style={{ flex: "1", minWidth: "200px", display: "flex", flexDirection: "column" }}>
                        {" "}
                        {((s?.rows) || []).map((r, $index) => (
                          <React.Fragment key={$index}>
                            {" "}
                            <div style={{ display: "grid", gridTemplateColumns: "20px minmax(0,1fr) 44px auto", alignItems: "center", gap: "10px", minHeight: "36px", fontSize: "15px" }}>
                              {" "}
                              <span style={{ display: "grid", placeItems: "center", width: "20px", height: "20px" }}>
                                {(r?.hasLogo) ? (<>
                                  <span aria-hidden={"true"} style={{ display: "block", width: "18px", height: "18px", background: `url('${r?.logo ?? ""}') center / contain no-repeat` }}></span>
                                </>) : null}
                                {(r?.hasIcon) ? (<>
                                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={r?.col} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                    <path d={r?.icon}></path>
                                  </svg>
                                </>) : null}
                                {(r?.noLogo) ? (<>
                                  <span style={{ width: "10px", height: "10px", borderRadius: "0", background: r?.col }}></span>
                                </>) : null}
                              </span>
                              {" "}
                              <span style={{ minWidth: "0" }}>
                                {r?.label}
                              </span>
                              {" "}
                              <span style={{ fontSize: "14px", color: "#5a6474", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                {r?.pctLabel}
                              </span>
                              {" "}
                              <span style={{ fontWeight: "600", textAlign: "right", fontVariantNumeric: "tabular-nums", minWidth: "52px" }}>
                                {r?.value}
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
                  {" "}
                  {(s?.isFunnel) ? (<>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {" "}
                      {((s?.rows) || []).map((r, $index) => (
                        <React.Fragment key={$index}>
                          {" "}
                          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,180px) minmax(0,1fr) 150px", alignItems: "center", gap: "14px", minHeight: "44px" }}>
                            {" "}
                            <span style={{ fontSize: "15px" }}>
                              {r?.label}
                            </span>
                            {" "}
                            <span style={{ height: "28px", borderRadius: "0", background: "#f0f3f8", overflow: "hidden" }}>
                              <span style={{ display: "block", height: "100%", width: r?.w, background: r?.col, borderRadius: "0" }}></span>
                            </span>
                            {" "}
                            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: "1.2" }}>
                              <span style={{ fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                                {r?.value}
                              </span>
                              <span style={{ fontSize: "13px", color: r?.dc }}>
                                {r?.drop}
                              </span>
                            </span>
                            {" "}
                          </div>
                          {" "}
                        </React.Fragment>
                      ))}
                      {" "}
                    </div>
                    {" "}
                  </>) : null}
                  {" "}
                  {(s?.isTable) ? (<>
                    {" "}
                    <div style={{ overflowX: "auto", margin: "0 -22px" }}>
                      {" "}
                      <table style={{ width: "100%", minWidth: "520px", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums", fontSize: "15px" }}>
                        <thead>
                          <tr>
                            {((s?.cols) || []).map((col, $index) => (
                              <React.Fragment key={$index}>
                                <th style={{ fontSize: "13px", fontWeight: "600", color: "#5a6474", padding: "8px 22px", textAlign: col?.a }}>
                                  {col?.t}
                                </th>
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {((s?.rows) || []).map((row, $index) => (
                            <React.Fragment key={$index}>
                              <tr style={{ borderTop: "1px solid #eef1f6" }}>
                                {((row?.cells) || []).map((cell, $index) => (
                                  <React.Fragment key={$index}>
                                    <td style={{ padding: "12px 22px", textAlign: cell?.a, fontWeight: cell?.fw, color: cell?.c }}>
                                      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                        {(cell?.logo) ? (<>
                                          <span aria-hidden={"true"} style={{ flex: "none", display: "block", width: "18px", height: "18px", background: `url('${cell?.logo ?? ""}') center / contain no-repeat` }}></span>
                                        </>) : null}
                                        {cell?.v}
                                      </span>
                                    </td>
                                  </React.Fragment>
                                ))}
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                      {" "}
                    </div>
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
        </>) : null}
        {" "}
      </>) : null}
    </>
  );
}
