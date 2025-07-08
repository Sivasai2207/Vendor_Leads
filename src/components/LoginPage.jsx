import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  // 🔁 Auto-redirect if already logged in and allowed
  useEffect(() => {
    const checkAccess = async () => {
      if (user) {
        const allowedRef = doc(db, "allowedUsers", user.uid);
        const allowedSnap = await getDoc(allowedRef);

        if (allowedSnap.exists()) {
          navigate("/home", { replace: true });
        } else {
          await auth.signOut();
          setError("You are not authorized to access this app.");
        }
      }
    };

    if (!loading) checkAccess();
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const signedUser = userCredential.user;

      const allowedRef = doc(db, "allowedUsers", signedUser.uid);
      const allowedSnap = await getDoc(allowedRef);

      if (allowedSnap.exists()) {
        navigate("/home");
      } else {
        setError("You are not authorized to access this app.");
        await auth.signOut();
      }
    } catch (err) {
      setError("Invalid email or password.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
