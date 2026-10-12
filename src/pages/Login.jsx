import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Field from "../components/Field";
import Notice from "../components/Notice";
import { useLibrary } from "../context/LibraryContext";
import { DEMO } from "../data/seed";

export default function Login() {
  const { user, login } = useLibrary();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", membershipId: "" });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.membershipId.trim()) return setError("Enter your name and membership ID.");
    const err = login(f.name, f.membershipId);
    if (err) return setError(err);
    navigate("/", { replace: true });
  };

  return (
    <>
      <h1>Welcome back</h1>
      <p className="sub">Sign in with your name and membership ID to open the library desk.</p>
      <form className="card login-card" onSubmit={submit} noValidate>
        <div className="panel-head"><h2>Sign in</h2></div>
        <Field label="Full name"><input autoFocus autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Motlatsi Chaka" /></Field>
        <Field label="Membership ID"><input value={f.membershipId} onChange={(e) => setF({ ...f, membershipId: e.target.value })} placeholder="LIB-001" /></Field>
        <button className="btn" type="submit"><span aria-hidden="true">🔑</span> Sign in</button>
        <Notice kind="error">{error}</Notice>
        <div className="demo">
          <p className="muted small center">Demo accounts, tap to fill in</p>
          <div className="actions">
            {DEMO.map(([role, name, id]) => (
              <button key={role} type="button" className="btn sm ghost" onClick={() => setF({ name, membershipId: id })}>{role}</button>
            ))}
          </div>
        </div>
      </form>
    </>
  );
}
