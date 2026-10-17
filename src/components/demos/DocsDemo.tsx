"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";
import { DemoShell, Empty, Meter, Tag, money, useLog } from "@/components/demos/DemoKit";

/**
 * ZynDocs, three connected systems: classification + field extraction with a confidence score per field
 * (fields under the review threshold go to people); a human review queue to confirm or correct them;
 * and validation of the invoice against its purchase order and goods received note before posting.
 */
type Field = { k: string; v: string; c: number };
type Doc = { id: string; kind: string; title: string; from: string; fields: Field[]; lines: string[] };
const DOCS: Doc[] = [
  { id: "inv", kind: "Supplier invoice", title: "INV-30418", from: "Ceylon Foods Ltd", lines: ["TAX INVOICE", "Ceylon Foods Ltd · Colombo 10", "Invoice INV-30418 · 12 Oct 2026", "PO ref PO-7712", "Basmati rice 50kg × 20", "Coconut oil 5L × 30", "Red onions 10kg × 12", "Subtotal 165,600 · VAT 29,808", "TOTAL LKR 195,408", "Bank 0081-4412-77"],
    fields: [{ k: "Supplier", v: "Ceylon Foods Ltd", c: 99 }, { k: "Invoice no.", v: "INV-30418", c: 98 }, { k: "Date", v: "12 Oct 2026", c: 96 }, { k: "PO reference", v: "PO-7712", c: 91 }, { k: "Subtotal", v: "LKR 165,600", c: 97 }, { k: "VAT", v: "LKR 29,808", c: 94 }, { k: "Total", v: "LKR 195,408", c: 97 }, { k: "Bank account", v: "0081-4412-77", c: 71 }] },
  { id: "rcpt", kind: "Expense receipt", title: "Photo, creased", from: "Keells Super", lines: ["KEELLS SUPER", "Nawala branch", "14/10/26 18:42", "14 items", "TOTAL 8,940.00", "CARD ****4412", "Thank you"],
    fields: [{ k: "Merchant", v: "Keells Super", c: 92 }, { k: "Date", v: "14 Oct 2026", c: 78 }, { k: "Items", v: "14", c: 66 }, { k: "Total", v: "LKR 8,940", c: 88 }, { k: "Payment", v: "Card •• 4412", c: 83 }] },
  { id: "ctr", kind: "Supplier contract", title: "Supply agreement", from: "Lanka Linen Co.", lines: ["SUPPLY AGREEMENT", "Between Lotus Hotels and Lanka Linen Co.", "Term: 24 months", "Notice: 60 days in writing", "Renews automatically unless…", "Liability capped at LKR 5,000,000", "Governing law: Sri Lanka"],
    fields: [{ k: "Parties", v: "Lotus Hotels · Lanka Linen Co.", c: 97 }, { k: "Term", v: "24 months", c: 93 }, { k: "Notice period", v: "60 days", c: 89 }, { k: "Auto-renewal", v: "Yes (risk)", c: 74 }, { k: "Liability cap", v: "LKR 5,000,000 (low)", c: 68 }] },
];
type Review = { id: string; doc: string; field: string; value: string; c: number };
const LINES = [
  { item: "Basmati rice 50kg", po: [20, 4200], grn: 20, inv: [20, 4200] },
  { item: "Coconut oil 5L", po: [30, 2100], grn: 28, inv: [30, 2100] },
  { item: "Red onions 10kg", po: [12, 1500], grn: 12, inv: [12, 1550] },
];
const TABS = [
  { id: "ext", label: "Extract", hint: "Read any document" },
  { id: "rev", label: "Review queue", hint: "People check the unsure" },
  { id: "val", label: "Validate & post", hint: "Match to PO and GRN" },
];

export default function DocsDemo({ accent }: { accent: string }) {
  const [tab, setTab] = useState("ext");
  const { log, push } = useLog(9 * 60 + 5);
  const [docId, setDocId] = useState("inv");
  const [state, setState] = useState<Record<string, "idle" | "scan" | "done">>({});
  const [threshold, setThreshold] = useState(85);
  const [queue, setQueue] = useState<Review[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(0);
  const [tol, setTol] = useState(2);
  const [debit, setDebit] = useState(false);
  const [posted, setPosted] = useState(false);

  const doc = DOCS.find((d) => d.id === docId)!;
  const st = state[docId] ?? "idle";
  const extract = () => {
    setState((s) => ({ ...s, [docId]: "scan" }));
    setTimeout(() => {
      setState((s) => ({ ...s, [docId]: "done" }));
      const low = doc.fields.filter((f) => f.c < threshold);
      setQueue((q) => [...q.filter((r) => r.doc !== doc.title), ...low.map((f) => ({ id: `${doc.id}-${f.k}`, doc: doc.title, field: f.k, value: f.v, c: f.c }))]);
      push(`${doc.title} classified as ${doc.kind} · ${doc.fields.length} fields extracted · ${low.length} sent for review`);
    }, 1500);
  };
  const confirm = (r: Review) => {
    const v = edits[r.id] ?? r.value;
    setQueue((q) => q.filter((x) => x.id !== r.id));
    setConfirmed((n) => n + 1);
    push(`${r.doc} · ${r.field} ${v === r.value ? "confirmed" : `corrected to “${v}”`} by reviewer · model feedback stored`);
  };

  const rows = LINES.map((l) => {
    const qtyOk = l.inv[0] <= l.grn || debit;
    const variance = ((l.inv[1] - l.po[1]) / l.po[1]) * 100;
    const priceOk = Math.abs(variance) <= tol;
    return { ...l, qtyOk, variance, priceOk };
  });
  const ready = rows.every((r) => r.qtyOk && r.priceOk);
  const invTotal = LINES.reduce((s, l) => s + l.inv[0] * l.inv[1], 0) - (debit ? 2 * 2100 : 0);

  return (
    <DemoShell title="ZynDocs · Accounts payable" accent={accent} tabs={TABS} tab={tab} setTab={setTab} log={log}>
      {tab === "ext" && (
        <div className="dm-docs">
          <div className="dm-doclist">
            {DOCS.map((d) => (
              <button key={d.id} type="button" className={`dm-tile row${d.id === docId ? " is-on" : ""}`} onClick={() => setDocId(d.id)}>
                <b>{d.title}</b><span>{d.from}</span>
                {state[d.id] === "done" ? <Tag tone="ok">{d.kind}</Tag> : <Tag>Unread</Tag>}
              </button>
            ))}
            <label className="dm-field"><span>Review below · {threshold}% confidence</span><input type="range" className="dm-range" min={60} max={99} value={threshold} onChange={(e) => setThreshold(+e.target.value)} /></label>
          </div>
          <div className={`dm-paper-doc${st === "scan" ? " is-scan" : ""}`}>
            {doc.lines.map((l, i) => <p key={i} className={i === 0 ? "big" : undefined}>{l}</p>)}
            <span className="dm-scanline" />
          </div>
          <div className="dm-panel">
            <div className="dm-h"><b>Extracted fields</b>{st === "done" && <Tag tone="ok">{doc.kind} · 98%</Tag>}</div>
            {st === "done" ? doc.fields.map((f) => (
              <div key={f.k} className="dm-field-out">
                <div className="dm-row"><span>{f.k}</span>{f.c < threshold ? <Tag tone="warn">Review</Tag> : <Tag tone="ok">{f.c}%</Tag>}</div>
                <b>{f.v}</b>
                <Meter value={f.c} tone={f.c < threshold ? "warn" : "ok"} />
              </div>
            )) : (
              <>
                <Empty>{st === "scan" ? "Reading layout, text and tables…" : "Run extraction to read this document."}</Empty>
                <button type="button" className="dm-btn wide" disabled={st === "scan"} onClick={extract}><ScanLine size={14} /> Extract fields</button>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "rev" && (
        <div className="dm-panel">
          <div className="dm-h"><b>Human review queue</b><span className="dm-inline"><Tag tone={queue.length ? "warn" : "ok"}>{queue.length} waiting</Tag><Tag tone="ok">{confirmed} confirmed</Tag></span></div>
          {queue.length ? queue.map((r) => (
            <div key={r.id} className="dm-row dm-review">
              <span><b>{r.field}</b><small>{r.doc} · model {r.c}% sure</small></span>
              <input className="dm-input" value={edits[r.id] ?? r.value} onChange={(e) => setEdits((s) => ({ ...s, [r.id]: e.target.value }))} aria-label={`${r.field} value`} />
              <button type="button" className="dm-btn" onClick={() => confirm(r)}>{(edits[r.id] ?? r.value) === r.value ? "Confirm" : "Save correction"}</button>
            </div>
          )) : <Empty>Nothing to review. Extract a document; any field under {threshold}% confidence lands here.</Empty>}
        </div>
      )}

      {tab === "val" && (
        <div className="dm-panel">
          <div className="dm-h"><b>INV-30418 vs PO-7712 vs GRN-5520</b>{posted ? <Tag tone="ok">Posted</Tag> : ready ? <Tag tone="ok">Ready to post</Tag> : <Tag tone="bad">On hold</Tag>}</div>
          <div className="dm-table">
            <div className="dm-tr head six"><span>Item</span><span>Ordered</span><span>Received</span><span>Billed</span><span>Price vs PO</span><span>Check</span></div>
            {rows.map((r) => (
              <div key={r.item} className="dm-tr six">
                <span>{r.item}</span>
                <span>{r.po[0]} @ {money(r.po[1])}</span>
                <span>{r.grn}</span>
                <span>{r.inv[0]} @ {money(r.inv[1])}</span>
                <span className={r.priceOk ? undefined : "neg"}>{r.variance > 0 ? "+" : ""}{r.variance.toFixed(1)}%</span>
                <span>{!r.qtyOk ? <Tag tone="bad">Short delivery</Tag> : !r.priceOk ? <Tag tone="warn">Price variance</Tag> : <Tag tone="ok">Match</Tag>}</span>
              </div>
            ))}
          </div>
          <div className="dm-split flat">
            <div>
              <label className="dm-field"><span>Accept price variance up to · {tol}%</span><input type="range" className="dm-range" min={0} max={5} step={0.5} value={tol} onChange={(e) => setTol(+e.target.value)} /></label>
              <button type="button" className="dm-btn ghost" disabled={debit} onClick={() => { setDebit(true); push("Debit note DN-221 raised · 2 × coconut oil short-delivered · LKR 4,200"); }}>{debit ? "Debit note raised" : "Raise debit note for short delivery"}</button>
            </div>
            <div>
              <div className="dm-total big"><span>Payable</span><b>LKR {money(invTotal * 1.18)}</b></div>
              <button type="button" className="dm-btn wide" disabled={!ready || posted} onClick={() => { setPosted(true); push(`INV-30418 posted to accounts · LKR ${money(invTotal * 1.18)} scheduled for payment run`); }}>{posted ? "Posted to accounts" : "Post to accounts"}</button>
            </div>
          </div>
        </div>
      )}
    </DemoShell>
  );
}
