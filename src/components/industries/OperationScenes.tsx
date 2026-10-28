import type { ReactNode } from "react";
import { Check, Search, X } from "lucide-react";

/**
 * One before/after scene per industry for OperationSlider. "Before" is that industry's real desk: four
 * artifacts in the four spots (s0..s3), each pinned with the problem it causes (p[i]). "After" is that
 * industry's ZINTRAZ screen: four cards in the same quadrants (c0..c3), each ending in its outcome (o[i]).
 */
type Props = { t: string[] };
export type Scene = { app: string; url: string; Before: (p: Props) => ReactNode; After: (p: Props) => ReactNode };

const Tag = ({ children }: { children?: string }) => <em className="bf-tag"><X size={11} /><span>{children}</span></em>;
const Ok = ({ children }: { children?: string }) => <p className="ops-ok"><Check size={13} />{children}</p>;
const Card = ({ c, cap, live, ok, children }: { c: number; cap: string; live?: boolean; ok?: string; children: ReactNode }) => (
  <section className={`ops-card c${c}`}>
    <small className="ops-cap">{cap}{live && <em>Live</em>}</small>
    {children}
    <Ok>{ok}</Ok>
  </section>
);
const Bars = ({ v }: { v: number[] }) => <div className="ops-bars">{v.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>;
const Kpis = ({ k }: { k: [string, string][] }) => <div className="ops-kpis">{k.map(([l, v]) => <div key={l}><small>{l}</small><b>{v}</b></div>)}</div>;
const Rows = ({ r }: { r: [string, string, string?][] }) => (
  <ul className="af-rows">{r.map(([a, b, tone]) => <li key={a}><span>{a}</span><b className={tone}>{b}</b></li>)}</ul>
);
const Chat = ({ title, badge, msgs }: { title: string; badge: string; msgs: [string, string, boolean?][] }) => (
  <>
    <div className="ops-chat-bar"><b>{title}</b><span>{badge}</span></div>
    {msgs.map(([who, text, me], i) => <div key={i} className={`ops-msg ${me ? "me" : "them"}`}>{!me && <small>{who}</small>}{text}{me && <small>{who}</small>}</div>)}
  </>
);
const Sheet = ({ name, rows }: { name: string; rows: string[][] }) => (
  <>
    <div className="ops-sheet-bar"><span>X</span>{name}</div>
    <table><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={/^#|\?\?/.test(c) ? "err" : undefined}>{c}</td>)}</tr>)}</tbody></table>
  </>
);

export const SCENES: Record<string, Scene> = {
  hospitality: {
    app: "Front office",
    url: "app.zyntraz.com/hotel/front-office",
    Before: ({ t }) => (
      <>
        <div className="ops-spot s0 bf-ledger">
          <h4>Reservations · October</h4>
          <ol>
            <li><b>14</b>Perera · Dbl · 2n <i>(phone)</i></li>
            <li><b>14</b><s>Lee · Dbl</s> also booked on web!!</li>
            <li><b>15</b>Walk-in · Sgl · paid?</li>
            <li><b>15</b>Fernando · Suite <i>(agent)</i></li>
          </ol>
          <Tag>{t[0]}</Tag>
        </div>
        <div className="ops-spot s1 ops-chat" style={{ rotate: "-2deg", top: "47%" }}>
          <Chat title="Housekeeping" badge="23 unread" msgs={[["Front desk · 10:02", "204 still not cleaned? guest waiting"], ["Maintenance · 10:05", "AC leaking in 311 again"], ["10:06 ✓", "who has the master key", true]]} />
          <Tag>{t[1]}</Tag>
        </div>
        <div className="ops-spot s2 bf-receipt">
          <h4>KOT #482 · Table 7</h4>
          <p>2 × Rice &amp; curry</p><p>1 × Fresh lime</p><p>1 × Watalappan</p>
          <p className="hand">charge to room?? which one</p>
          <Tag>{t[2]}</Tag>
        </div>
        <div className="ops-spot s3 ops-sticky" style={{ rotate: "4deg" }}>
          <i className="ops-tape" />Revenue today = ??<br />ask accounts tmrw<small>— GM</small>
          <Tag>{t[3]}</Tag>
        </div>
      </>
    ),
    After: ({ t }) => (
      <>
        <Card c={0} cap="Tonight" live ok={t[0]}><Kpis k={[["Occupancy", "86%"], ["ADR", "$142"], ["Revenue", "$12.4k"]]} /></Card>
        <Card c={1} cap="Room board" ok={t[1]}>
          <div className="af-rooms">{"OOCODOOMOCOODOCO".split("").map((s, i) => <i key={i} className={s}>{201 + i}</i>)}</div>
        </Card>
        <Card c={2} cap="Restaurant → folio" live ok={t[2]}><Rows r={[["Table 7 · KOT 482", "Room 204", "ok"], ["Table 2 · KOT 483", "Room 311", "ok"], ["Bar · 3 items", "Posted", "ok"]]} /></Card>
        <Card c={3} cap="Kitchen stock" ok={t[3]}><Rows r={[["Rice", "82%"], ["Chicken", "Reorder sent", "warn"], ["Limes", "64%"]]} /></Card>
      </>
    ),
  },

  healthcare: {
    app: "Clinic",
    url: "app.zyntraz.com/clinic/today",
    Before: ({ t }) => (
      <>
        <div className="ops-spot s0 bf-folders">
          <span>A – F</span><span>G – M</span><span>N – Z</span>
          <p className="bf-loose hand">Lab report — whose is this?</p>
          <Tag>{t[0]}</Tag>
        </div>
        <div className="ops-spot s1 bf-ledger" style={{ rotate: "-3deg" }}>
          <h4>Appointments · Tue 14</h4>
          <ol>
            <li><b>9:00</b>Silva ✓</li>
            <li><b>9:30</b><s>Ahmed</s> no show</li>
            <li><b>10:00</b><s>Kumar</s> no show</li>
          </ol>
          <Tag>{t[1]}</Tag>
        </div>
        <div className="ops-spot s2 bf-clip">
          <h4>Pharmacy count</h4>
          <p><span>Amoxicillin</span><b className="hand">|||| ||</b></p>
          <p><span>Paracetamol</span><b className="hand">|||| |||| ?</b></p>
          <p><span>Insulin</span><b className="hand red">OUT??</b></p>
          <Tag>{t[2]}</Tag>
        </div>
        <div className="ops-spot s3 bf-form">
          <h4>Insurance claim · A-2291</h4>
          <p>Procedure code: ______</p><p>Amount: 18,400</p>
          <span className="bf-stamp">Rejected</span>
          <Tag>{t[3]}</Tag>
        </div>
      </>
    ),
    After: ({ t }) => (
      <>
        <Card c={0} cap="Patient #10482" ok={t[0]}>
          <div className="af-patient"><span>NP</span><div><b>N. Perera · 42</b><small>BP 118/76 · HbA1c 6.1 · Allergy: penicillin</small></div></div>
          <div className="af-chips"><i>Lab</i><i>X-ray</i><i>Rx</i><i>Notes</i></div>
        </Card>
        <Card c={1} cap="Today" live ok={t[1]}><Rows r={[["09:30 · Ahmed", "Reminder sent", "ok"], ["10:00 · Kumar", "Confirmed", "ok"], ["10:30 · Nair", "Checked in", "ok"]]} /></Card>
        <Card c={2} cap="Pharmacy & billing" ok={t[2]}><Rows r={[["Insulin", "Reorder sent", "warn"], ["Claim A-2291", "Approved", "ok"], ["Amoxicillin", "124 in stock"]]} /></Card>
        <Card c={3} cap="Admin hours / week" ok={t[3]}><Bars v={[90, 82, 70, 58, 47, 38, 30]} /></Card>
      </>
    ),
  },

  education: {
    app: "School portal",
    url: "app.zyntraz.com/school/term-3",
    Before: ({ t }) => (
      <>
        <div className="ops-spot s0 bf-receipt bf-carbon">
          <h4>Receipt No. 0841</h4>
          <p>Received from: <span className="hand">Mrs. Jayasinghe</span></p>
          <p>For: <span className="hand">Term 3 fee (part)</span></p>
          <p>Rs. <span className="hand">7,500 cash</span></p>
          <Tag>{t[0]}</Tag>
        </div>
        <div className="ops-spot s1 bf-register">
          <h4>Register · Grade 7B</h4>
          {[["Amaya", "✓✓A✓"], ["Dinuli", "✓A A?"], ["Kavin", "✓✓✓✓"], ["Ravi", "A✓ ?✓"]].map(([n, m]) => <p key={n}><span>{n}</span><b className="hand">{m}</b></p>)}
          <Tag>{t[1]}</Tag>
        </div>
        <div className="ops-spot s2 bf-phone">
          <div className="bf-notif"><b>Missed call ×3</b>Parent · Grade 7</div>
          <div className="bf-notif"><b>SMS</b>How is Dinuli doing in maths?</div>
          <div className="bf-notif"><b>SMS</b>Was she in school today??</div>
          <Tag>{t[2]}</Tag>
        </div>
        <div className="ops-spot s3 bf-board">
          <h4 className="hand">Timetable T3</h4>
          <p className="hand">Mon P3: Maths 7B / <s>Sci</s></p>
          <p className="hand red">Maths 7B — 2 teachers?!</p>
          <p className="hand">Lab free?? ask Mr. R</p>
          <Tag>{t[3]}</Tag>
        </div>
      </>
    ),
    After: ({ t }) => (
      <>
        <Card c={0} cap="Term 3 fees" live ok={t[0]}>
          <div className="af-progress"><i style={{ width: "88%" }} /><b>88% collected</b></div>
          <Rows r={[["Jayasinghe · 7B", "Paid online", "ok"], ["Fernando · 9A", "Due Fri", "warn"]]} />
        </Card>
        <Card c={1} cap="Attendance today" ok={t[1]}><Bars v={[96, 92, 98, 89, 95, 97, 93]} /></Card>
        <Card c={2} cap="Parent app" ok={t[2]}>
          <div className="af-push"><b>Report card published</b><small>Dinuli · Grade 7B · Maths A–</small></div>
          <div className="af-push"><b>Arrived at school · 07:28</b><small>Gate check-in</small></div>
        </Card>
        <Card c={3} cap="Timetable · Mon" ok={t[3]}>
          <div className="af-tt">{["Maths", "Sci", "Eng", "Art", "Sci", "Maths", "ICT", "Eng", "Hist", "PE", "Maths", "Sci"].map((s, i) => <i key={i} data-s={s}>{s}</i>)}</div>
        </Card>
      </>
    ),
  },

  retail: {
    app: "Commerce",
    url: "app.zyntraz.com/retail/overview",
    Before: ({ t }) => (
      <>
        <div className="ops-spot s0 ops-sheet">
          <Sheet name="stock_colombo_vs_kandy (3).xlsx" rows={[["SKU", "Item", "Colombo", "Kandy"], ["1042", "Sofa 3-seat", "12", "0??"], ["1043", "Armchair", "4", "4"], ["1107", "Lamp", "#REF!", "9"], ["1210", "Rug 2×3", "??", "2"]]} />
          <Tag>{t[0]}</Tag>
        </div>
        <div className="ops-spot s1 bf-print">
          <h4>Web order #10937</h4>
          <p>1 × Armchair · Grey</p><p>Ship to: Nugegoda</p>
          <p className="hand red">typed into POS? ✓ or not?</p>
          <Tag>{t[1]}</Tag>
        </div>
        <div className="ops-spot s2 bf-receipt" style={{ rotate: "2deg" }}>
          <h4>Day total · 14 Oct</h4>
          <p>Colombo ........ 84,200</p><p>Kandy .......... <span className="hand red">???</span></p><p>Online ......... <span className="hand red">ask Nimal</span></p>
          <Tag>{t[2]}</Tag>
        </div>
        <div className="ops-spot s3 ops-sticky" style={{ rotate: "-3deg", background: "linear-gradient(170deg,#fbcfe8,#f9a8d4)" }}>
          <i className="ops-tape" />Call back Mrs. Silva re: sofa<small>(3 weeks ago!)</small>
          <Tag>{t[3]}</Tag>
        </div>
      </>
    ),
    After: ({ t }) => (
      <>
        <Card c={0} cap="Inventory" live ok={t[0]}>
          <table className="af-table"><tbody><tr><th>SKU</th><th>Colombo</th><th>Kandy</th><th>Web</th></tr><tr><td>1042</td><td>12</td><td>3</td><td>15</td></tr><tr><td>1107</td><td>7</td><td>9</td><td>16</td></tr></tbody></table>
        </Card>
        <Card c={1} cap="Orders" live ok={t[1]}>
          <div className="af-flow"><span><b>24</b>New</span><span><b>18</b>Packed</span><span><b>61</b>Shipped</span></div>
        </Card>
        <Card c={2} cap="Sales · all channels" ok={t[2]}><Kpis k={[["Today", "Rs 212k"], ["Stores", "64%"], ["Online", "36%"]]} /></Card>
        <Card c={3} cap="Follow-up · Mrs. Silva" ok={t[3]}>
          <ol className="af-steps"><li className="done">Thank-you sent</li><li className="done">Day 3 · care tips</li><li>Day 14 · cushion offer</li></ol>
        </Card>
      </>
    ),
  },

  corporate: {
    app: "Workspace",
    url: "app.zyntraz.com/workspace/approvals",
    Before: ({ t }) => (
      <>
        <div className="ops-spot s0 bf-inbox">
          <div className="bf-inbox-bar"><b>Inbox</b><span>47 unread</span></div>
          <p><b>RE: RE: FW: Approval needed — PO 2291</b>Still waiting on this…</p>
          <p><b>Reminder: approval?? (3)</b>Supplier is chasing us</p>
          <p><b>RE: who approved the Q3 spend</b>Can&apos;t find the thread</p>
          <Tag>{t[0]}</Tag>
        </div>
        <div className="ops-spot s1 bf-files">
          <div className="bf-files-bar">Shared ▸ Clients ▸ Client A</div>
          {["Contract_final.docx", "Contract_final_v2.docx", "Contract_FINAL_real.docx", "Contract (1).docx"].map((f) => <p key={f}><i />{f}</p>)}
          <Tag>{t[1]}</Tag>
        </div>
        <div className="ops-spot s2 bf-board">
          <h4 className="hand">Client work</h4>
          <p className="hand">Client A — ? (Sam?)</p>
          <p className="hand">Client B — waiting on docs</p>
          <p className="hand red">Client C — who owns this??</p>
          <Tag>{t[2]}</Tag>
        </div>
        <div className="ops-spot s3 ops-sheet">
          <Sheet name="Report_Sept_DRAFT3.xlsx" rows={[["Team", "Hours", "Billed", "Notes"], ["Audit", "412", "#REF!", "copy from HR"], ["Advisory", "??", "38,200", "paste from CRM"], ["Tax", "296", "#####", "check w/ Ana"]]} />
          <Tag>{t[3]}</Tag>
        </div>
      </>
    ),
    After: ({ t }) => (
      <>
        <Card c={0} cap="PO 2291 · approval" live ok={t[0]}>
          <ol className="af-chain"><li className="done">Requested</li><li className="done">Manager</li><li className="done">Finance</li><li className="now">Approved</li></ol>
        </Card>
        <Card c={1} cap="Documents" ok={t[1]}>
          <div className="af-search"><Search size={12} />contract client a</div>
          <Rows r={[["Contract · v4 · signed", "1 result", "ok"]]} />
        </Card>
        <Card c={2} cap="Client work" live ok={t[2]}>
          <div className="af-kanban"><span><b>To do</b><i>Client C</i></span><span><b>Doing</b><i>Client A</i><i>Client B</i></span><span><b>Done</b><i>Client D</i></span></div>
        </Card>
        <Card c={3} cap="Sept report · auto 06:00" ok={t[3]}><Bars v={[48, 62, 55, 70, 66, 81, 92]} /></Card>
      </>
    ),
  },

  other: {
    app: "Custom platform",
    url: "app.zyntraz.com/ops/live",
    Before: ({ t }) => (
      <>
        <div className="ops-spot s0 bf-listing">
          <h4>3-bed house · Kottawa</h4>
          <p>Rs 32.5M · 10 perch</p>
          <span className="ops-sticky bf-mini">077-xxx 4512<br />who called him??</span>
          <Tag>Leads lost between agents</Tag>
        </div>
        <div className="ops-spot s1 bf-form" style={{ rotate: "-3deg" }}>
          <h4>Delivery note #5531</h4>
          <p>Consignee: ________</p><p>Signature: <span className="hand red">lost?</span></p>
          <Tag>Proof of delivery lost on paper</Tag>
        </div>
        <div className="ops-spot s2 bf-board">
          <h4 className="hand">Dispatch · today</h4>
          <svg viewBox="0 0 120 50" className="bf-route" aria-hidden="true"><path d="M8 40 C 30 5, 50 45, 70 18 S 100 30, 112 10" /><path d="M8 40 L 40 44 L 60 30" /></svg>
          <p className="hand red">Van 2 → where??</p>
          <Tag>Manual dispatch, no live tracking</Tag>
        </div>
        <div className="ops-spot s3 bf-napkin">
          <p className="hand">our process → ??? → done</p>
          <p className="hand">no app does this</p>
          <Tag>{t[2] ?? "No software fits the way you work"}</Tag>
        </div>
      </>
    ),
    After: ({ t }) => (
      <>
        <Card c={0} cap="Lead pipeline" live ok={t[0]}>
          <div className="af-flow"><span><b>14</b>New</span><span><b>6</b>Viewing</span><span><b>2</b>Offer</span></div>
        </Card>
        <Card c={1} cap="Proof of delivery" ok={t[1]}><Rows r={[["#5531 · Nugegoda", "Signed · photo", "ok"], ["#5532 · Maharagama", "Signed", "ok"]]} /></Card>
        <Card c={2} cap="Live tracking" live ok={t[2]}>
          <svg viewBox="0 0 120 50" className="af-map" aria-hidden="true"><path d="M8 40 C 30 30, 50 40, 70 22 S 100 18, 112 10" /><circle cx="70" cy="22" r="4" /><circle cx="112" cy="10" r="3" /></svg>
        </Card>
        <Card c={3} cap="Your workflow" ok={t[3]}>
          <div className="af-chain af-mods"><span>Intake</span><span>Assign</span><span>Track</span><span>Report</span></div>
        </Card>
      </>
    ),
  },
};
