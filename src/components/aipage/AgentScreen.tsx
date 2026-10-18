"use client";

import { CheckCircle2, Heart, MessageCircle, ScanLine } from "lucide-react";
import type { Out } from "@/components/aipage/delegateTasks";

/**
 * What an agent is producing, drawn from its progress `k` (0–1) so it stays in step with the agent's
 * lane without timers of its own: email bodies type out, chats arrive message by message, invoices get
 * scanned field by field, sheets and calendars fill in row by row.
 */
const part = (k: number, end = 0.9) => Math.min(1, Math.max(0, k / end));

export default function AgentScreen({ out, k, done }: { out: Out; k: number; done: boolean }) {
  const p = done ? 1 : part(k);
  const ok = done && <p className="ail-dl-scr-ok"><CheckCircle2 size={15} />{out.done}</p>;

  if (out.kind === "email") {
    const n = Math.floor(out.body.length * p);
    return (
      <div className="ail-dl-scr mail">
        <div className="ail-dl-scr-bar"><i /><i /><i /><span>New message</span></div>
        <div className="ail-dl-mail-h"><span>To</span><b>{out.to}</b></div>
        <div className="ail-dl-mail-h"><span>Subject</span><b>{out.subject}</b></div>
        <p className="ail-dl-mail-body">{out.body.slice(0, n)}{!done && <span className="ail-dl-caret" />}</p>
        {ok}
      </div>
    );
  }

  if (out.kind === "chat") {
    const n = done ? out.msgs.length : Math.min(out.msgs.length, Math.floor(out.msgs.length * part(k, 0.95)) + 1);
    return (
      <div className="ail-dl-scr chat">
        <div className="ail-dl-scr-bar"><i /><i /><i /><span>{out.with}</span></div>
        <div className="ail-dl-chat">
          {out.msgs.slice(0, n).map((m, i) => <p key={i} className={m.me ? "me" : undefined}>{m.text}</p>)}
          {!done && n < out.msgs.length && <p className={`typing${out.msgs[n].me ? " me" : ""}`}><i /><i /><i /></p>}
        </div>
        {ok}
      </div>
    );
  }

  if (out.kind === "invoice") {
    const n = Math.floor(out.fields.length * p);
    return (
      <div className="ail-dl-scr inv">
        <div className="ail-dl-scr-bar"><i /><i /><i /><span>{out.title}</span></div>
        <div className="ail-dl-inv">
          <div className="ail-dl-paper">
            <pre>{out.paper.join("\n")}</pre>
            {!done && <span className="ail-dl-scan" aria-hidden="true" />}
          </div>
          <dl>
            <p className="ail-dl-inv-h"><ScanLine size={13} />Extracted</p>
            {out.fields.map(([l, v], i) => (
              <div key={l} className={i < n ? "on" : undefined}><dt>{l}</dt><dd>{i < n ? v : ""}</dd></div>
            ))}
          </dl>
        </div>
        {ok}
      </div>
    );
  }

  if (out.kind === "sheet") {
    const n = Math.floor(out.rows.length * p);
    return (
      <div className="ail-dl-scr sheet">
        <div className="ail-dl-scr-bar"><i /><i /><i /><span>{out.title}</span></div>
        <div className="ail-dl-sheet" style={{ ["--cols" as string]: out.cols.length }}>
          {out.cols.map((c) => <b key={c}>{c}</b>)}
          {out.rows.map((r, i) => r.map((c, j) => <span key={`${i}-${j}`} className={i < n ? (i === n - 1 && !done ? "on new" : "on") : undefined}>{i < n ? c : ""}</span>))}
        </div>
        {ok}
      </div>
    );
  }

  if (out.kind === "calendar") {
    const n = Math.floor(out.events.length * p);
    return (
      <div className="ail-dl-scr cal">
        <div className="ail-dl-scr-bar"><i /><i /><i /><span>{out.title}</span></div>
        <div className="ail-dl-cal">
          {out.days.map((d, di) => (
            <div key={d}>
              <b>{d}</b>
              {out.events.map((e, i) => (e.day === di && i < n ? <span key={i}><small>{e.time}</small>{e.label}</span> : null))}
            </div>
          ))}
        </div>
        {ok}
      </div>
    );
  }

  const n = Math.floor(out.caption.length * part(k, 0.85));
  return (
    <div className="ail-dl-scr post">
      <div className="ail-dl-post-h"><i />{out.account}</div>
      <div className={`ail-dl-post-img${p > 0.2 || done ? " on" : ""}`}><b>{out.image}</b></div>
      <div className="ail-dl-post-icons" aria-hidden="true"><Heart size={16} /><MessageCircle size={16} /></div>
      <p className="ail-dl-post-cap">{done ? out.caption : out.caption.slice(0, n)}{!done && <span className="ail-dl-caret" />}</p>
      {ok}
    </div>
  );
}
