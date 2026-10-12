import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Field from "../components/Field";
import Notice from "../components/Notice";
import { useLibrary } from "../context/LibraryContext";
import { ACTION_LABEL } from "../data/seed";

export default function Transactions() {
  const { books, members, log, record } = useLibrary();
  const { q } = useOutletContext();
  const [f, setF] = useState({ bookId: "", memberId: "", qty: 1, action: "borrow" });
  const [msg, setMsg] = useState({ kind: "ok", text: "" });

  const needle = q.trim().toLowerCase();
  const shownLog = log.filter((t) => `${t.title} ${t.action} ${t.member} ${new Date(t.date).toLocaleString()}`.toLowerCase().includes(needle));
  const change = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const qty = Number(f.qty);
    let err;
    if (!f.bookId) err = "Select a book first.";
    else if (!Number.isInteger(qty) || qty < 1) err = "Quantity must be a whole number of at least 1.";
    else if (f.action !== "restock" && !f.memberId) err = "Select the member for this loan or return.";
    else err = record({ bookId: f.bookId, qty, action: f.action, memberId: f.memberId });
    if (err) return setMsg({ kind: "error", text: err });
    setMsg({ kind: "ok", text: "Transaction recorded." });
    setF((p) => ({ ...p, qty: 1 }));
  };

  return (
    <>
      <h1>Transactions</h1>
      <p className="sub">Record a loan, a return, or a fresh delivery of stock.</p>
      <form className="card form" onSubmit={submit} noValidate>
        <h2>Record a Transaction</h2>
        <Field label="Action">
          <select name="action" value={f.action} onChange={change}>
            <option value="borrow">Borrow (deduct stock)</option>
            <option value="return">Return (add stock)</option>
            <option value="restock">New stock arrived (add stock)</option>
          </select>
        </Field>
        <Field label="Book">
          <select name="bookId" value={f.bookId} onChange={change}>
            <option value="">Select a book</option>
            {books.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.stock} in stock)</option>)}
          </select>
        </Field>
        {f.action !== "restock" && (
          <Field label="Member">
            <select name="memberId" value={f.memberId} onChange={change}>
              <option value="">Select a member</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.membershipId})</option>)}
            </select>
          </Field>
        )}
        <Field label="Quantity"><input name="qty" type="number" min="1" value={f.qty} onChange={change} /></Field>
        <button className="btn" type="submit"><span aria-hidden="true">✎</span> Record</button>
        <Notice kind={msg.kind}>{msg.text}</Notice>
      </form>

      <h2>Transaction History</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Title</th><th>Action</th><th>Member</th><th>Qty</th></tr></thead>
          <tbody>
            {!shownLog.length && <tr><td colSpan="5" className="center">No transactions recorded.</td></tr>}
            {shownLog.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleString()}</td>
                <td><strong>{t.title}</strong></td>
                <td><span className={`status ${t.action === "borrow" ? "status-low" : "status-available"}`}>{ACTION_LABEL[t.action] ?? t.action}</span></td>
                <td>{t.member}</td>
                <td>{t.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
