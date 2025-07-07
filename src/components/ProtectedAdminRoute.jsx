import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedAdminRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null); // null = unknown yet

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const ref = doc(db, "allowedUsers", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setIsAdmin(data?.isAdmin === true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Admin check failed:", err);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    if (user) {
      checkAdmin();
    } else {
      setChecking(false);
    }
  }, [user]);

  // Still loading auth or Firestore state
  if (loading || checking || isAdmin === null) {
    return <div className="p-6 text-center">Checking permissions...</div>;
  }

  // Not logged in at all
  if (!user) return <Navigate to="/" replace />;

  // Logged in, but not admin → redirect to home
  if (!isAdmin) return <Navigate to="/home" replace />;

  // ✅ Admin confirmed
  return children;
}
// export default function ProtectedAdminRoute({ children }) {
//   const [user, loading] = useAuthState(auth);

//   if (loading) return <div className="p-6 text-center">Checking access...</div>;
//   if (!user) return <Navigate to="/" replace />;

//   // 🚨 TEMP: Allow access to /signup for any authenticated user
//   return children;
// }