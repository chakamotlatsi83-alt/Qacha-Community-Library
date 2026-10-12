import { money, status } from "../utils/helpers";

export default function BookCard({ b, onBorrow }) {
  const [, tone] = status(b.stock);
  const out = b.stock === 0;
  return (
    <article className={`card book ${tone}`}>
      <div className="card-body">
        <h3>{b.title}</h3>
        <p>by {b.author}</p>
        <p>{b.genre} · <code>{b.isbn}</code></p>
        <p>{money(b.price)}</p>
        <p className={`tag ${tone}`}>{out ? "Out of stock" : `Stock: ${b.stock}`}</p>
      </div>
      <button className="btn" disabled={out} onClick={() => onBorrow(b.id)}>{out ? "Unavailable" : "Borrow"}</button>
    </article>
  );
}
