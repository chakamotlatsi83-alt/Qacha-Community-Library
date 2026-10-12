import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { NAV } from "../data/seed";
import { canOpen } from "../utils/helpers";

// Sidebar + top bar. Pages render in <Outlet /> and read the search text
// with useOutletContext().
export default function Layout() {
  const { user, logout } = useLibrary();
  const { pathname } = useLocation();
  const [q, setQ] = useState("");

  useEffect(() => { setQ(""); }, [pathname]);

  useEffect(() => {
    const page = NAV.find(([to]) => to === pathname);
    document.title = `📚 ${user && page ? page[1] : "Sign in"} · Maseru Community Library`;
  }, [pathname, user]);

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">❢</span>
          <div className="brand-text"><strong>Maseru Community</strong><span>Library &amp; Reading Room</span></div>
        </div>
        <nav>
          {user
            ? NAV.filter(([to]) => canOpen(user, to)).map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)
            : <NavLink to="/login">Sign in</NavLink>}
        </nav>
        {user && (
          <div className="who">
            <strong>{user.name}</strong><span>{user.role}</span>
            <button className="link" onClick={logout}>Sign out <span aria-hidden="true">→</span></button>
          </div>
        )}
        <p className="hours">Open Tue–Sat<br />9:00 – 17:00</p>
      </aside>
      <div className="main">
        <header className="top">
          {user && (
            <div className="search-wrap">
              <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search titles, authors, members…" aria-label="Search" />
            </div>
          )}
          <time>{today}</time>
        </header>
        <main className="page"><Outlet context={{ q }} /></main>
      </div>
    </div>
  );
}
