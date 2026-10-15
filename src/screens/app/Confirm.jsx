import React from 'react';

// The app's confirmation dialog: one question, what happens, and the choices. Opened with app.confirm({ ... }).
// The safe choice (Cancel / Keep editing) has focus, so Enter or Escape never destroys anything by accident.
export default function Confirm({ v }) {
  if (!v.cfOn) return null;
  const danger = v.cfTone === 'danger';
  const base = { height: "44px", padding: "0 18px", borderRadius: "0", font: "inherit", fontWeight: "600", letterSpacing: "inherit", cursor: "pointer", whiteSpace: "nowrap" };
  return (
    <div onClick={e => { if (e.target === e.currentTarget) v.cfCancel(); }} onKeyDown={e => { if (e.key === "Escape") { e.stopPropagation(); v.cfCancel(); } }} style={{ position: "fixed", inset: "0", zIndex: "90", background: "rgba(11,22,38,.45)", display: "grid", placeItems: "center", padding: "24px", fontFamily: "'DM Sans',ui-sans-serif,system-ui,sans-serif", fontSize: "16px", letterSpacing: "-0.4px", lineHeight: "1.5", color: "#0b1626" }}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="cf-title" aria-describedby="cf-body" style={{ width: "min(460px,100%)", display: "flex", flexDirection: "column", gap: "12px", padding: "24px 24px 20px", background: "#ffffff", boxShadow: "0 24px 64px -24px rgba(11,22,38,.45)" }}>
        <h2 id="cf-title" style={{ margin: "0", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.4px", textWrap: "balance" }}>{v.cfTitle}</h2>
        <p id="cf-body" style={{ margin: "0", color: "#45505f", lineHeight: "1.5", textWrap: "pretty" }}>{v.cfBody}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
          <button type="button" autoFocus onClick={v.cfCancel} style={{ ...base, border: "0", background: "transparent", color: "#45505f" }} className="dc20c6b10">{v.cfCancelLabel}</button>
          {v.cfAltLabel ? <button type="button" onClick={v.cfAlt} style={{ ...base, border: "1px solid #d3dbe6", background: "#ffffff", color: "#a3330c" }} className="dce60d758">{v.cfAltLabel}</button> : null}
          <button type="button" onClick={v.cfDo} disabled={v.cfBusy} style={{ ...base, border: "0", background: danger ? "#a3330c" : "#1f6be2", color: "#ffffff", opacity: v.cfBusy ? 0.6 : 1 }} className="dc9482609">{v.cfBusy ? v.cfBusyLabel : v.cfConfirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
