import { useState } from "react";
import Field from "./Field";
import { ROLES } from "../data/seed";

// Controlled form used for both "Add New User" and "Edit User".
export default function MemberForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState(initial ?? { name: "", membershipId: "", role: "Member" });
  const [errors, setErrors] = useState({});
  const change = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const clean = { name: f.name.trim(), membershipId: f.membershipId.trim().toUpperCase(), role: f.role };
    const next = {};
    if (clean.name.length < 2) next.name = "Enter the member's full name.";
    if (!/^[A-Z]{3}-\d{3}$/.test(clean.membershipId)) next.membershipId = "Use the format LIB-004.";
    if (!next.name && !next.membershipId) Object.assign(next, onSave(clean) ?? {});
    setErrors(next);
  };

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <div className="panel-head"><h2>{initial ? "Edit User" : "Add New User"}</h2></div>
      <Field label="Full name" error={errors.name}><input name="name" value={f.name} onChange={change} placeholder="e.g. Thabo Mokoena" /></Field>
      <Field label="Membership ID" error={errors.membershipId}><input name="membershipId" value={f.membershipId} onChange={change} placeholder="LIB-004" /></Field>
      <Field label="Role" error={errors.role}>
        <select name="role" value={f.role} onChange={change}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
      </Field>
      <button className="btn" type="submit"><span aria-hidden="true">+</span> {initial ? "Update User" : "Add User"}</button>
      {initial && <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}
