import { useState } from "react";
import Field from "./Field";
import { GENRES } from "../data/seed";
import { validIsbn } from "../utils/helpers";

const EMPTY_BOOK = { title: "", author: "", genre: "", isbn: "", price: "", stock: "" };

// Controlled form used for both "Add New Book" and "Edit Book".
export default function BookForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState({ ...EMPTY_BOOK, ...initial });
  const [errors, setErrors] = useState({});
  const change = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));
  // keep a genre that is not in the list (older data) selectable while editing
  const genres = !f.genre || GENRES.includes(f.genre) ? GENRES : [...GENRES, f.genre];

  const submit = (e) => {
    e.preventDefault();
    const clean = {
      title: f.title.trim(),
      author: f.author.trim(),
      genre: f.genre,
      isbn: f.isbn.trim(),
      price: f.price === "" ? 0 : Number(f.price), // price is optional
      stock: Number(f.stock),
    };
    const next = {};
    if (!clean.title) next.title = "Enter a title.";
    if (!clean.author) next.author = "Enter an author.";
    if (!clean.genre) next.genre = "Select a genre.";
    if (!clean.isbn) next.isbn = "Enter the ISBN.";
    else if (!validIsbn(clean.isbn)) next.isbn = "ISBN must have 10 or 13 digits.";
    if (isNaN(clean.price) || clean.price < 0) next.price = "Price must be 0 or more.";
    if (f.stock === "" || !Number.isInteger(clean.stock) || clean.stock < 0) next.stock = "Enter a whole number, 0 or more.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setErrors(onSave(clean) ?? {});
  };

  return (
    <>
      <h2>{initial ? "Edit Book" : "Add New Book"}</h2>
      <form className="card form form--book" onSubmit={submit} noValidate>
        <Field error={errors.title}><input name="title" aria-label="Book title" placeholder="Book Title" value={f.title} onChange={change} /></Field>
        <Field error={errors.author}><input name="author" aria-label="Author" placeholder="Author" value={f.author} onChange={change} /></Field>
        <Field error={errors.genre}>
          <select name="genre" aria-label="Genre" value={f.genre} onChange={change}>
            <option value="" disabled>Select genre</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field error={errors.isbn}><input name="isbn" aria-label="ISBN" placeholder="ISBN (10 or 13 digits)" value={f.isbn} onChange={change} /></Field>
        <Field error={errors.price}><input name="price" type="number" min="0" step="0.01" aria-label="Price" placeholder="Price (M), optional" value={f.price} onChange={change} /></Field>
        <Field error={errors.stock}><input name="stock" type="number" min="0" aria-label="Quantity" placeholder={initial ? "Quantity in stock" : "Initial quantity"} value={f.stock} onChange={change} /></Field>
        <button className="btn" type="submit">{initial ? "Save Changes" : "Add Book"}</button>
        {initial && <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>}
      </form>
    </>
  );
}
