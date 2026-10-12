import { Navigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { canOpen } from "../utils/helpers";

// Sends signed-out visitors to /login, and sends users to the Dashboard
// when their role is not allowed to open `path`.
export default function ProtectedRoute({ path, children }) {
  const { user } = useLibrary();
  if (!user) return <Navigate to="/login" replace />;
  if (!canOpen(user, path)) return <Navigate to="/" replace />;
  return children;
}
