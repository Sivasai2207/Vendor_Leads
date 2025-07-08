import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  // ⏳ While checking auth status, show a loader
  if (loading) return <div className="p-6 text-center">Loading...</div>;

  // ❌ Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ✅ Authenticated → show protected content
  return children;
}
