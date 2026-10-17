import { AlertTriangle, Bell, Bot, Check, FileText, LayoutGrid, Package, Receipt, Settings, Thermometer, Truck, Users, Wifi, Zap, Droplets, DoorClosed } from "lucide-react";

// Product-style mock-ups for the three solution blocks. Pure HTML/CSS (animations in globals.css under
// "Solutions page"), decorative only — the figures are illustrative, not client data.

function Chrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sx-win" aria-hidden="true">
      <span className="sx-glint" />
      <div className="sx-win-bar">
        <i /><i /><i />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* Software: an operations app — KPIs, a live order table and the workflow an order moves through. */
export function SoftwareVisual() {
  const orders = [
    { id: "#4821", who: "Lotus Kitchen", amt: "18,400", st: "Paid" },
    { id: "#4822", who: "Harbour Hotel", amt: "62,150", st: "Packing" },
    { id: "#4823", who: "Green Mart", amt: "9,870", st: "Shipped" },
    { id: "#4824", who: "City Clinic", amt: "24,300", st: "Paid" },
  ];
  return (
    <Chrome title="operations.zyntraz.app">
      <div className="sx-app">
        <nav className="sx-side">
          <LayoutGrid size={15} className="on" /><Receipt size={15} /><Package size={15} /><Truck size={15} /><Users size={15} /><Settings size={15} />
        </nav>
        <div className="sx-main">
          <div className="sx-kpis">
            <div><span>Orders today</span><b>128</b><em>▲ 12%</em></div>
            <div><span>Fulfilment</span><b>96%</b><em>▲ 4%</em></div>
            <div><span>Revenue</span><b>486k</b><em>▲ 9%</em></div>
          </div>
          <div className="sx-table">
            {orders.map((o, i) => (
              <div key={o.id} className="sx-row" style={{ ["--i" as string]: i }}>
                <span className="sx-mono">{o.id}</span>
                <span>{o.who}</span>
                <span className="sx-mono">{o.amt}</span>
                <span className={`sx-pill ${o.st.toLowerCase()}`}>{o.st}</span>
              </div>
            ))}
          </div>
          <div className="sx-flow">
            {["Order", "Invoice", "Pack", "Dispatch"].map((s, i) => (
              <span key={s} style={{ ["--i" as string]: i }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* AI: document intelligence — an invoice is scanned, fields are extracted with confidence, an agent acts. */
export function AIVisual() {
  const fields = [
    { k: "Supplier", v: "Ceylon Fresh Foods", c: "99%" },
    { k: "Invoice no.", v: "INV-20931", c: "98%" },
    { k: "Amount", v: "LKR 142,600", c: "97%" },
    { k: "Due date", v: "30 Nov 2026", c: "96%" },
  ];
  return (
    <Chrome title="Document intelligence">
      <div className="sx-ai">
        <div className="sx-doc">
          <div className="sx-doc-head"><FileText size={14} /> invoice_20931.pdf</div>
          <div className="sx-doc-page">
            {[70, 45, 88, 60, 92, 52, 80, 38].map((w, i) => <i key={i} style={{ width: `${w}%` }} />)}
            <span className="sx-scan" />
          </div>
        </div>
        <div className="sx-fields">
          {fields.map((f, i) => (
            <div key={f.k} className="sx-field" style={{ ["--i" as string]: i }}>
              <span>{f.k}</span>
              <b>{f.v}</b>
              <em>{f.c}</em>
            </div>
          ))}
        </div>
        <div className="sx-agent">
          <Bot size={16} />
          <p>Matched to PO-7781, approved within policy and posted to accounts.</p>
          <Check size={16} className="ok" />
        </div>
      </div>
    </Chrome>
  );
}

/* IoT: a live telemetry board — sensor tiles with sparklines and an anomaly the system acted on. */
const spark = (pts: number[]) => pts.map((y, i) => `${i ? "L" : "M"}${(i * 100) / (pts.length - 1)} ${y}`).join(" ");
export function IoTVisual() {
  const tiles = [
    { icon: Thermometer, k: "Cold room 1", v: "3.8°C", pts: [20, 22, 19, 21, 20, 22, 21, 20], ok: true },
    { icon: Thermometer, k: "Cold room 2", v: "6.9°C", pts: [26, 24, 22, 19, 16, 12, 9, 6], ok: false },
    { icon: Droplets, k: "Humidity", v: "62%", pts: [18, 16, 20, 15, 17, 14, 16, 15], ok: true },
    { icon: Zap, k: "Power draw", v: "12.4 kW", pts: [22, 18, 20, 12, 16, 10, 14, 12], ok: true },
  ];
  return (
    <Chrome title="Site monitor · Colombo 03">
      <div className="sx-iot">
        <div className="sx-iot-top">
          <span><Wifi size={13} /> 24 devices online</span>
          <span className="sx-live"><i /> Live</span>
        </div>
        <div className="sx-tiles">
          {tiles.map(({ icon: Icon, k, v, pts, ok }) => (
            <div key={k} className={`sx-tile${ok ? "" : " warn"}`}>
              <span className="sx-tile-k"><Icon size={13} /> {k}</span>
              <b>{v}</b>
              <svg className="sx-spark" viewBox="0 0 100 30" preserveAspectRatio="none"><path d={spark(pts)} pathLength={1} /></svg>
            </div>
          ))}
        </div>
        <div className="sx-alert">
          <AlertTriangle size={15} />
          <p><b>Cold room 2 trending up.</b> Door sensor reports open for 6 min — technician notified.</p>
          <span className="sx-alert-ico"><DoorClosed size={14} /><Bell size={14} /></span>
        </div>
      </div>
    </Chrome>
  );
}
