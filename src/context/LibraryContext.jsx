import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { START_BOOKS, START_MEMBERS } from "../data/seed";
import { flatIsbn, norm, uid } from "../utils/helpers";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [books, setBooks] = useLocalStorage("lib-books", START_BOOKS);
  const [members, setMembers] = useLocalStorage("lib-members", START_MEMBERS);
  const [log, setLog] = useLocalStorage("lib-log", []);
  const [userId, setUserId] = useLocalStorage("lib-session", null);

  const user = members.find((m) => m.id === userId) ?? null;

  // One-time clean-up for data saved by an older version: make sure the demo
  // accounts exist. It runs once only, so deleted demo users stay deleted.
  useEffect(() => {
    if (localStorage.getItem("lib-seed-v2")) return;
    setMembers((prev) => {
      let next = prev.map((m) =>
        m.membershipId === "LIB-001" && m.name === "Alex Morgan" ? { ...m, name: "Motlatsi Chaka" } : m,
      );
      START_MEMBERS.forEach((d) => {
        if (!next.some((m) => m.id === d.id || m.membershipId === d.membershipId)) next = [...next, d];
      });
      return next;
    });
    localStorage.setItem("lib-seed-v2", "1");
  }, [setMembers]);

  /* ---------- session ---------- */
  const login = (name, membershipId) => {
    const m = members.find((x) => norm(x.membershipId) === norm(membershipId) && norm(x.name) === norm(name));
    if (!m) return "No member matches that name and membership ID.";
    setUserId(m.id);
    return null;
  };
  const logout = () => setUserId(null);

  /* ---------- books (return an error object, or null on success) ---------- */
  const addBook = (data) => {
    if (books.some((b) => norm(b.title) === norm(data.title) && norm(b.author) === norm(data.author)))
      return { title: "This book already exists in the catalogue." };
    if (books.some((b) => flatIsbn(b.isbn) === flatIsbn(data.isbn)))
      return { isbn: "A book with this ISBN already exists." };
    setBooks((p) => [{ id: uid(), ...data }, ...p]);
    return null;
  };
  const updateBook = (id, data) => {
    if (books.some((b) => flatIsbn(b.isbn) === flatIsbn(data.isbn) && b.id !== id))
      return { isbn: "A book with this ISBN already exists." };
    setBooks((p) => p.map((b) => (b.id === id ? { ...b, ...data } : b)));
    return null;
  };
  const deleteBook = (id) => setBooks((p) => p.filter((b) => b.id !== id));

  /* ---------- stock transactions (return an error message, or null) ---------- */
  const record = ({ bookId, qty, action, memberId }) => {
    const b = books.find((x) => x.id === bookId);
    if (!b) return "Book not found.";
    const delta = action === "borrow" ? -qty : qty;
    if (b.stock + delta < 0)
      return `Only ${b.stock} ${b.stock === 1 ? "copy is" : "copies are"} available for “${b.title}”.`;
    const m = members.find((x) => x.id === memberId);
    setBooks((p) => p.map((x) => (x.id === bookId ? { ...x, stock: x.stock + delta } : x)));
    setLog((p) => [
      { id: uid(), date: new Date().toISOString(), title: b.title, action, qty, member: m ? m.name : "—" },
      ...p,
    ]);
    return null;
  };

  /* ---------- members ---------- */
  const adminCount = members.filter((m) => m.role === "Admin").length;

  const addMember = (data) => {
    if (members.some((m) => m.membershipId === data.membershipId))
      return { membershipId: "That membership ID is already in use." };
    setMembers((p) => [...p, { id: uid(), ...data }]);
    return null;
  };
  const updateMember = (id, data) => {
    const current = members.find((m) => m.id === id);
    if (members.some((m) => m.membershipId === data.membershipId && m.id !== id))
      return { membershipId: "That membership ID is already in use." };
    if (current?.role === "Admin" && data.role !== "Admin" && adminCount === 1)
      return { role: "At least one Admin is required." };
    setMembers((p) => p.map((m) => (m.id === id ? { ...m, ...data } : m)));
    return null;
  };
  // Returns an error message, or null when the member was deleted.
  const deleteMember = (m) => {
    if (m.id === user?.id) return "You can't delete the account you're signed in with.";
    if (m.role === "Admin" && adminCount === 1) return "At least one Admin is required.";
    setMembers((p) => p.filter((x) => x.id !== m.id));
    return null;
  };

  const value = { books, members, log, user, login, logout, addBook, updateBook, deleteBook, record, addMember, updateMember, deleteMember };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside <LibraryProvider>");
  return ctx;
}
