import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MemberForm from "../components/MemberForm";
import Notice from "../components/Notice";
import { useLibrary } from "../context/LibraryContext";

export default function Users() {
  const { members, user, addMember, updateMember, deleteMember } = useLibrary();
  const { q } = useOutletContext();
  const [editing, setEditing] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [msg, setMsg] = useState({ kind: "ok", text: "" });
  const isAdmin = user?.role === "Admin";
  const needle = q.trim().toLowerCase();
  const shown = members.filter((m) => `${m.name} ${m.membershipId} ${m.role}`.toLowerCase().includes(needle));

  const reset = () => { setEditing(null); setFormKey((k) => k + 1); };

  const save = (data) => {
    const errors = editing ? updateMember(editing.id, data) : addMember(data);
    if (errors) return errors;
    setMsg({ kind: "ok", text: editing ? "Member updated." : "Member added." });
    reset();
    return null;
  };
  const remove = (m) => {
    if (!window.confirm(`Delete ${m.name}?`)) return;
    const err = deleteMember(m);
    if (err) return setMsg({ kind: "error", text: err });
    if (editing?.id === m.id) reset();
    setMsg({ kind: "ok", text: "Member deleted." });
  };

  return (
    <>
      <h1>User Management</h1>
      <p className="sub">Staff-only records of members, librarians, and administrators.</p>
      {isAdmin ? (
        <>
          <MemberForm key={`${editing?.id ?? "new"}-${formKey}`} initial={editing} onSave={save} onCancel={reset} />
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </>
      ) : (
        <p className="notice warn">Sign in as an Admin to add, update or delete members.</p>
      )}

      <div className="ledger-head"><h2>Registered Members &amp; Staff</h2></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Membership ID</th><th>Role</th>{isAdmin && <th>Actions</th>}</tr></thead>
          <tbody>
            {shown.map((m) => (
              <tr key={m.id}>
                <td><strong>{m.name}</strong></td><td><code>{m.membershipId}</code></td><td>{m.role}</td>
                {isAdmin && (
                  <td>
                    <button type="button" className="action-btn" aria-label={`Update ${m.name}`} onClick={() => { setEditing(m); window.scrollTo({ top: 0, behavior: "smooth" }); }}>✎ Update</button>
                    <button type="button" className="action-btn delete-btn" aria-label={`Delete ${m.name}`} onClick={() => remove(m)}>🗑 Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={isAdmin ? 4 : 3} className="center">No users registered.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
