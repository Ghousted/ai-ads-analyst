import React from 'react';

export function SettingsView({ v }) {
  // Settings, including integrations
  return (
    <>
      {(v.vSet) ? (<>
        {" "}
        <header style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "20px", borderBottom: "1px solid #e6ebf2" }}>
          {" "}
          <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "700", letterSpacing: "-1px", lineHeight: "1.2" }}>
            {"Settings"}
          </h1>
          {" "}
          <svg aria-hidden={"true"} width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#5a6474"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"}>
            <path d={"M9 6l6 6-6 6"}></path>
          </svg>
          {" "}
          <span style={{ fontSize: "22px", color: "#5a6474" }}>
            {v.stgCrumb}
          </span>
          {" "}
        </header>
        {" "}
        <div style={{ display: "grid", gridTemplateColumns: v.stgCols, gap: "32px", alignItems: "start" }}>
          {" "}
          <nav aria-label={"Settings sections"} style={{ position: "sticky", top: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {" "}
            {((v.stgNav) || []).map((ng, $index) => (
              <React.Fragment key={$index}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {" "}
                  <span style={{ padding: "0 12px 6px", fontSize: "13px", fontWeight: "600", color: "#5a6474" }}>
                    {ng?.label}
                  </span>
                  {" "}
                  {((ng?.items) || []).map((ni, $index) => (
                    <React.Fragment key={$index}>
                      {" "}
                      <button onClick={ni?.pick} aria-current={ni?.aria} style={{ display: "flex", alignItems: "center", gap: "12px", height: "44px", padding: "0 12px", border: "0", borderRadius: "0", background: ni?.bg, font: "inherit", fontWeight: ni?.fw, letterSpacing: "inherit", color: ni?.c, cursor: "pointer", textAlign: "left", transition: "background-color 140ms ease" }} className="dc228142d">
                        <svg aria-hidden={"true"} width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={ni?.ic} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={ni?.icon}></path>
                        </svg>
                        {ni?.label}
                      </button>
                      {" "}
                    </React.Fragment>
                  ))}
                  {" "}
                </div>
                {" "}
              </React.Fragment>
            ))}
            {" "}
          </nav>
          {" "}
          <div style={{ minWidth: "0", display: "flex", flexDirection: "column", gap: "44px" }}>
            {" "}
            {((v.stgGroups) || []).map((sg, $index) => (
              <React.Fragment key={$index}>
                {" "}
                <section style={{ display: "flex", flexDirection: "column" }}>
                  {" "}
                  <h2 style={{ margin: "0", paddingBottom: "14px", borderBottom: "1px solid #e6ebf2", display: "flex", alignItems: "center", gap: "12px", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }}>
                    {(sg?.hasLogo) ? (<>
                      <span aria-hidden={"true"} style={{ display: "block", width: "24px", height: "24px", background: `url('${sg?.logo ?? ""}') center / contain no-repeat` }}></span>
                    </>) : null}
                    {sg?.title}
                  </h2>
                  {" "}
                  {(sg?.isBrand) ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px 0" }}>
                      <span style={{ color: "#5a6474", textWrap: "pretty" }}>{"Your logo and colour go on every report you send: the logo at the top, the colour on the top bar and charts."}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: "600", fontSize: "17px", minWidth: "120px" }}>{"Logo"}</span>
                        {v.brand.hasLogo ? <img src={v.brand.logo} alt={v.brand.agency + " logo"} style={{ height: "44px", maxWidth: "200px", objectFit: "contain", display: "block" }} /> : <span style={{ color: "#5a6474" }}>{"No logo yet"}</span>}
                        {v.brand.manager ? (<>
                          <label style={{ position: "relative", display: "inline-flex", alignItems: "center", height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", background: "#ffffff", fontWeight: "600", cursor: "pointer" }} className="dce60d758">
                            {v.brand.hasLogo ? "Replace logo" : "Upload logo"}
                            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={v.brand.pick} style={{ position: "absolute", width: "1px", height: "1px", opacity: "0" }} />
                          </label>
                          {v.brand.hasLogo ? <button type="button" onClick={v.brand.remove} style={{ height: "44px", padding: "0 12px", border: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#a3330c", cursor: "pointer" }}>{"Remove"}</button> : null}
                        </>) : null}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: "600", fontSize: "17px", minWidth: "120px" }}>{"Brand colour"}</span>
                        <span role="radiogroup" aria-label="Brand colour" style={{ display: "flex", gap: "6px" }}>
                          {v.brand.colors.map(c => <button key={c.hex} type="button" role="radio" aria-checked={c.on} aria-label={c.hex} onClick={c.pick} disabled={!v.brand.manager} style={{ width: "44px", height: "44px", borderRadius: "50%", border: `3px solid ${c.on ? c.hex : "transparent"}`, background: "#ffffff", padding: "4px", cursor: v.brand.manager ? "pointer" : "default" }}><span style={{ display: "block", width: "100%", height: "100%", borderRadius: "50%", background: c.hex }}></span></button>)}
                        </span>
                      </div>
                      <div aria-label="Preview" style={{ maxWidth: "460px", background: "#ffffff", boxShadow: "0 1px 2px rgba(11,22,38,.08),0 8px 24px -16px rgba(11,22,38,.3)" }}>
                        <div style={{ height: "6px", background: v.brand.color }}></div>
                        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700" }}>{v.brand.hasLogo ? <img src={v.brand.logo} alt="" style={{ height: "24px", maxWidth: "120px", objectFit: "contain" }} /> : null}{v.brand.agency}</span>
                          <span style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.5px" }}>{"Weekly report preview"}</span>
                          <span style={{ display: "block", height: "40px", background: v.brand.color + "1f", borderBottom: `2px solid ${v.brand.color}` }}></span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {(sg?.hasChecks) ? (<>
                    {" "}
                    <fieldset style={{ margin: "0", padding: "0 0 4px", border: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {" "}
                      <legend style={{ padding: "20px 0 8px", fontWeight: "600", fontSize: "17px" }}>
                        {sg?.checkTitle}
                      </legend>
                      {" "}
                      {((sg?.checks) || []).map((ck, $index) => (
                        <React.Fragment key={$index}>
                          {" "}
                          <button role={"checkbox"} aria-checked={ck?.on} onClick={ck?.toggle} style={{ display: "flex", alignItems: "center", gap: "12px", minHeight: "40px", padding: "0", border: "0", background: "transparent", font: "inherit", letterSpacing: "inherit", color: "#45505f", cursor: "pointer", textAlign: "left" }}>
                            <span style={{ flex: "none", width: "20px", height: "20px", border: `1.5px solid ${ck?.bd ?? ""}`, background: ck?.bg, display: "grid", placeItems: "center", transition: "background-color 140ms ease" }}>
                              <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#ffffff"} strokeWidth={"3.4"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ opacity: ck?.o }}>
                                <path d={"M5 12.5l4.5 4.5L19 7.5"}></path>
                              </svg>
                            </span>
                            <span>
                              {ck?.ls?.a}
                              <span style={{ color: "#1f6be2" }}>
                                {ck?.ls?.b}
                              </span>
                              {ck?.ls?.c}
                            </span>
                          </button>
                          {" "}
                        </React.Fragment>
                      ))}
                      {" "}
                    </fieldset>
                    {" "}
                  </>) : null}
                  {" "}
                  {((sg?.rows) || []).map((r, $index) => (
                    <React.Fragment key={$index}>
                      {" "}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", flexWrap: "wrap", padding: "20px 0" }}>
                        {" "}
                        <div style={{ flex: "1 1 300px", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                          {" "}
                          <span style={{ fontWeight: "600", fontSize: "17px" }}>
                            {r?.ts?.a}
                            <span style={{ color: "#1f6be2" }}>
                              {r?.ts?.b}
                            </span>
                            {r?.ts?.c}
                          </span>
                          {" "}
                          <span style={{ color: "#5a6474", textWrap: "pretty" }}>
                            {r?.ds?.a}
                            <span style={{ color: "#1f6be2" }}>
                              {r?.ds?.b}
                            </span>
                            {r?.ds?.c}
                          </span>
                          {" "}
                        </div>
                        {" "}
                        {(r?.isToggle) ? (<>
                          <button role={"switch"} aria-checked={r?.on} aria-label={r?.t} onClick={r?.toggle} style={{ flex: "none", width: "48px", height: "44px", padding: "0", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}>
                            <span style={{ position: "relative", width: "44px", height: "26px", background: r?.tBg, transition: "background-color 200ms ease" }}>
                              <span style={{ position: "absolute", top: "3px", left: "3px", width: "20px", height: "20px", borderRadius: "50%", background: "#ffffff", transform: `translateX(${r?.tX ?? ""}px)`, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}></span>
                            </span>
                          </button>
                        </>) : null}
                        {" "}
                        {(r?.isSelect) ? (<>
                          <select aria-label={r?.t} value={(r?.val) ?? ""} onChange={r?.set} style={{ flex: "none", height: "44px", padding: "0 36px 0 14px", border: "0", borderRadius: "0", background: "#eef1f6 url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235a6474%22 stroke-width=%222.6%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>') right 12px center no-repeat", appearance: "none", font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }}>
                            {((r?.opts) || []).map((op, $index) => (
                              <React.Fragment key={$index}>
                                <option value={(op) ?? ""}>{op}</option>
                              </React.Fragment>
                            ))}
                          </select>
                        </>) : null}
                        {" "}
                        {(r?.isBtn) ? (<>
                          <button onClick={r?.btn} style={{ flex: "none", height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                            {r?.btnLabel}
                          </button>
                        </>) : null}
                        {" "}
                        {(r?.hasBtn2) ? (<>
                          <button onClick={r?.btn2} style={{ flex: "none", height: "44px", padding: "0 16px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }} className="dce60d758">
                            {r?.btn2Label}
                          </button>
                        </>) : null}
                        {" "}
                        {(r?.isPrimary) ? (<>
                          <button onClick={r?.btn} style={{ flex: "none", height: "44px", padding: "0 16px", border: "0", borderRadius: "0", background: "#1f6be2", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" }} className="dc9482609">
                            {r?.btnLabel}
                          </button>
                        </>) : null}
                        {" "}
                      </div>
                      {" "}
                    </React.Fragment>
                  ))}
                  {" "}
                  {(sg?.hasSub) ? (<>
                    {" "}
                    <button onClick={sg?.subToggle} aria-expanded={sg?.subOpen} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "52px", padding: "0 16px", border: "0", borderRadius: "0", background: "#eef1f6", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" }} className="dcbbe0dc7">
                      <span>
                        {sg?.subLabel}
                      </span>
                      <svg aria-hidden={"true"} width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#45505f"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} style={{ transform: sg?.subChev, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}>
                        <path d={"M6 9l6 6 6-6"}></path>
                      </svg>
                    </button>
                    {" "}
                    <div style={{ display: "grid", gridTemplateRows: sg?.subRows, transition: "grid-template-rows 240ms cubic-bezier(0.23,1,0.32,1)" }}>
                      {" "}
                      <div style={{ overflow: "hidden", minHeight: "0" }}>
                        {" "}
                        {((sg?.sub) || []).map((r, $index) => (
                          <React.Fragment key={$index}>
                            {" "}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "12px 16px", borderBottom: "1px solid #eef1f6", background: "#ffffff" }}>
                              {" "}
                              <div style={{ flex: "1 1 220px", minWidth: "0", display: "flex", flexDirection: "column" }}>
                                <span style={{ fontWeight: "600" }}>
                                  {r?.t}
                                </span>
                                <span style={{ fontSize: "14px", color: "#5a6474", fontVariantNumeric: "tabular-nums" }}>
                                  {r?.d}
                                </span>
                              </div>
                              {" "}
                              <select aria-label={r?.aria} value={(r?.val) ?? ""} onChange={r?.set} style={{ flex: "none", height: "44px", minWidth: "200px", padding: "0 36px 0 14px", border: "0", borderRadius: "0", background: "#eef1f6 url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235a6474%22 stroke-width=%222.6%22 stroke-linecap=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>') right 12px center no-repeat", appearance: "none", font: "inherit", letterSpacing: "inherit", color: r?.c, cursor: "pointer" }}>
                                {((r?.opts) || []).map((op, $index) => (
                                  <React.Fragment key={$index}>
                                    <option value={(op) ?? ""}>{op}</option>
                                  </React.Fragment>
                                ))}
                              </select>
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
                </section>
                {" "}
              </React.Fragment>
            ))}
            {" "}
            {(v.stgToast) ? (<>
              <span role={"status"} style={{ fontSize: "14px", fontWeight: "600", color: "#1d6b3a" }}>
                {v.stgToastText}
              </span>
            </>) : null}
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </>) : null}
    </>
  );
}

const btnPrimary = { height: "48px", padding: "0 22px", border: "0", borderRadius: "0", color: "#ffffff", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer" };
const btnGhost = { height: "48px", padding: "0 18px", border: "0", borderRadius: "0", background: "transparent", font: "inherit", fontWeight: "600", letterSpacing: "inherit", color: "#45505f", cursor: "pointer" };
const choice = o => ({ display: "flex", alignItems: "center", gap: "12px", minHeight: "56px", padding: "8px 14px", border: `1.5px solid ${o.bd}`, borderRadius: "0", background: o.bg, font: "inherit", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer", textAlign: "left" });

export function SettingsOverlay({ v }) {
  // Dialogs opened from settings rows: profile, integrations, agency, team and billing
  if (!v.dlgOpen) return null;
  return (
    <div onClick={v.dlgBackdrop} style={{ position: "fixed", inset: "0", zIndex: "70", background: "rgba(11,22,38,.45)", display: "grid", placeItems: "center", padding: "24px" }}>
      <form role="dialog" aria-modal="true" aria-labelledby="dlg-title" onSubmit={v.dlgSubmit} noValidate style={{ width: "min(560px,100%)", maxHeight: "calc(100vh - 48px)", overflowY: "auto", background: "#ffffff", borderRadius: "0", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0 30px 80px -30px rgba(11,22,38,.5)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <h2 id="dlg-title" style={{ margin: "0", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.8px" }}>{v.dlgTitle}</h2>
            <p style={{ margin: "0", color: "#5a6474", textWrap: "pretty" }}>{v.dlgText}</p>
          </div>
          <button type="button" onClick={v.dlgClose} aria-label="Close" style={{ flex: "none", width: "44px", height: "44px", margin: "-10px -10px 0 0", border: "0", borderRadius: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#45505f" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
        </div>
        {v.dlgHasInput ? (
          <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}><span style={{ fontWeight: "600" }}>{v.dlgInputLabel}</span>
            <input autoFocus type={v.dlgInputType} value={v.dlgVal} onChange={v.dlgSetVal} placeholder={v.dlgPlaceholder} aria-invalid={v.dlgHasErr} autoComplete={v.dlgSecret ? "off" : undefined} spellCheck={v.dlgSecret ? false : undefined} style={{ height: "48px", padding: "0 14px", border: `1px solid ${v.dlgInputBd}`, borderRadius: "0", font: "inherit", letterSpacing: "inherit", color: "#0b1626", outline: "none" }} />
          </label>
        ) : null}
        {v.dlgHasRoles ? (
          <fieldset style={{ margin: "0", padding: "0", border: "0", display: "flex", flexDirection: "column", gap: "8px" }}><legend style={{ padding: "0 0 8px", fontWeight: "600" }}>{v.dlgRoleLegend}</legend>
            {v.dlgRoles.map(r => (<button key={r.label} type="button" role="radio" aria-checked={r.on} onClick={r.pick} style={choice(r)}><span style={{ display: "flex", flexDirection: "column", lineHeight: "1.3" }}><span style={{ fontWeight: "600" }}>{r.label}</span><span style={{ fontSize: "14px", color: "#5a6474" }}>{r.desc}</span></span></button>))}
          </fieldset>
        ) : null}
        {v.dlgHasTools ? (
          <div role="radiogroup" aria-label="Tool" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: "8px" }}>
            {v.dlgTools.map(t => (<button key={t.label} type="button" role="radio" aria-checked={t.on} aria-disabled={t.disabled} onClick={t.pick} style={{ ...choice(t), opacity: t.o, cursor: t.disabled ? "default" : "pointer" }}><span aria-hidden="true" style={{ flex: "none", width: "22px", height: "22px", background: `url('${t.logo}') center / contain no-repeat` }}></span><span style={{ display: "flex", flexDirection: "column", lineHeight: "1.3", minWidth: "0" }}><span style={{ fontWeight: "600" }}>{t.label}</span><span style={{ fontSize: "13px", color: "#5a6474" }}>{t.desc}</span></span></button>))}
          </div>
        ) : null}
        {v.dlgSigning ? (
          <div role="status" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "#f4f7fb" }}><span style={{ width: "20px", height: "20px", borderRadius: "50%", border: "3px solid #e6ebf2", borderTopColor: "#1f6be2", animation: "clario-spin 800ms linear infinite" }}></span>{v.dlgSignText}</div>
        ) : null}
        {v.dlgHasPlans ? (
          <div role="radiogroup" aria-label="Plan" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {v.dlgPlans.map(p => (<button key={p.label} type="button" role="radio" aria-checked={p.on} onClick={p.pick} style={{ ...choice(p), justifyContent: "space-between" }}><span style={{ display: "flex", flexDirection: "column", lineHeight: "1.3" }}><span style={{ fontWeight: "600" }}>{p.label}</span><span style={{ fontSize: "14px", color: "#5a6474" }}>{p.note}</span></span><span style={{ fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>{p.price}</span></button>))}
          </div>
        ) : null}
        {v.dlgHasInvoices ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {v.dlgInvoices.map(i => (<div key={i.date} style={{ display: "flex", alignItems: "center", gap: "16px", minHeight: "56px", borderTop: "1px solid #eef1f6" }}><span style={{ flex: "1", fontWeight: "600" }}>{i.date}</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{i.amt}</span><button type="button" onClick={i.download} style={{ height: "40px", padding: "0 14px", border: "1px solid #d3dbe6", borderRadius: "0", background: "#ffffff", font: "inherit", fontSize: "14px", fontWeight: "600", letterSpacing: "inherit", color: "#0b1626", cursor: "pointer" }}>Download</button></div>))}
          </div>
        ) : null}
        {v.dlgHasErr ? <span role="alert" style={{ fontSize: "14px", fontWeight: "600", color: "#a3330c" }}>{v.dlgErr}</span> : null}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          {v.dlgShowCancel ? <button type="button" onClick={v.dlgClose} style={btnGhost}>Cancel</button> : null}
          <button type={v.dlgSigning ? "button" : "submit"} disabled={v.dlgSigning} style={{ ...btnPrimary, background: v.dlgSubmitBg, opacity: v.dlgSigning ? 0.8 : 1 }}>{v.dlgSubmitLabel}</button>
        </div>
      </form>
    </div>
  );
}
