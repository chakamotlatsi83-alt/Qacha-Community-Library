import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import BookForm from "../components/BookForm";
import Notice from "../components/Notice";
import { useLibrary } from "../context/LibraryContext";
import { matches, money } from "../utils/helpers";

export default function Books() {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const { q } = useOutletContext();
  const [editing, setEditing] = useState(null);
  const [formKey, setFormKey] = useState(0); // remounts the form to clear it
  const [msg, setMsg] = useState("");
  const shown = books.filter((b) => matches(b, q));

  const reset = () => { setEditing(null); setFormKey((k) => k + 1); };

  const save = (data) => {
    const errors = editing ? updateBook(editing.id, data) : addBook(data);
    if (errors) return errors;
    setMsg(editing ? "Book updated." : "Book added.");
    reset();
    return null;
  };
  const remove = (b) => {
    if (!window.confirm(`Delete “${b.title}”?`)) return;
    deleteBook(b.id);
    if (editing?.id === b.id) reset();
    setMsg("Book deleted.");
  };

  return (
    <>
      <h1>Book Management</h1>
      <BookForm key={`${editing?.id ?? "new"}-${formKey}`} initial={editing} onSave={save} onCancel={reset} />
      <Notice>{msg}</Notice>
      <h2>Book List</h2>
      <div className="table-wrap table-wrap--books">
        <table>
          <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Price (M)</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {shown.map((b) => (
              <tr key={b.id}>
                <td><strong>{b.title}</strong></td><td>{b.author}</td><td>{b.genre}</td><td><code>{b.isbn}</code></td><td>{money(b.price)}</td><td>{b.stock}</td>
                <td>
                  <button type="button" className="action-btn" aria-label={`Update ${b.title}`} onClick={() => { setEditing(b); window.scrollTo({ top: 0, behavior: "smooth" }); }}>✎ Update</button>
                  <button type="button" className="action-btn delete-btn" aria-label={`Delete ${b.title}`} onClick={() => remove(b)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan="7" className="center">No books in library.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
