import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import BookCard from "../components/BookCard";
import Notice from "../components/Notice";
import { useLibrary } from "../context/LibraryContext";
import { LOW_STOCK_LIMIT } from "../data/seed";
import { matches } from "../utils/helpers";

export default function Dashboard() {
  const { books, members, log, user, record } = useLibrary();
  const { q } = useOutletContext();
  const [msg, setMsg] = useState({ kind: "ok", text: "" });

  const shown = books.filter((b) => matches(b, q));
  const copies = books.reduce((s, b) => s + b.stock, 0);
  const low = books.filter((b) => b.stock < LOW_STOCK_LIMIT);

  const onBorrow = (id) => {
    const err = record({ bookId: id, qty: 1, action: "borrow", memberId: user.id });
    setMsg(err ? { kind: "error", text: err } : { kind: "ok", text: "Borrowed 1 copy." });
  };

  const stats = [["Titles", books.length], ["Copies on shelf", copies], ["Members", members.length], ["Low or out of stock", low.length]];

  return (
    <>
      <h1>Books Collection</h1>
      <p className="sub">Welcome, {user.name.split(" ")[0]}. Here is what is happening in the library today.</p>
      <div className="stats">
        {stats.map(([l, v]) => (
          <div className={`card stat${l === "Low or out of stock" && v > 0 ? " warn" : ""}`} key={l}><strong>{v}</strong><span>{l}</span></div>
        ))}
      </div>
      {low.length > 0 && <p className="notice warn">Running low: {low.map((b) => b.title).join(", ")}.</p>}
      <Notice kind={msg.kind}>{msg.text}</Notice>
      <div className="grid">{shown.map((b) => <BookCard key={b.id} b={b} onBorrow={onBorrow} />)}</div>
      {!shown.length && <p className="muted center">No books match “{q}”.</p>}
      <h2>Recent activity</h2>
      {log.length ? (
        <ul className="activity">
          {log.slice(0, 5).map((t) => <li key={t.id}>{t.title}: {t.action} ({t.qty}){t.member !== "—" ? ` · ${t.member}` : ""}</li>)}
        </ul>
      ) : <p className="muted center">No activity yet. Loans will show up here.</p>}
    </>
  );
}
