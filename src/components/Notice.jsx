export default function Notice({ kind = "ok", children }) {
  return children ? <p className={`notice ${kind}`} role="status">{children}</p> : null;
}
