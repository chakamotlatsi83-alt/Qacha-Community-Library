export default function Field({ label, error, children }) {
  return (
    <label>
      {label}
      {children}
      {error && <small className="field-error" role="alert">{error}</small>}
    </label>
  );
}
