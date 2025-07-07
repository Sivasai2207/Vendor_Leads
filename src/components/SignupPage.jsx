import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Admin/User toggle
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // 🔥 Add user to allowedUsers collection
      await setDoc(doc(db, "allowedUsers", user.uid), {
        email: user.email,
        name,
        isAdmin, // ✅ store admin flag
        createdAt: new Date(),
      });

      navigate("/home");
    } catch (err) {
      console.error("Signup error", err);
      setError(err.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isAdmin ? "Admin" : "User"} Signup
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* ✅ Admin/User toggle */}
        <div className="mb-4">
          <label className="text-sm font-medium mr-2">Sign up as:</label>
          <select
            value={isAdmin ? "admin" : "user"}
            onChange={(e) => setIsAdmin(e.target.value === "admin")}
            className="px-2 py-1 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Create {isAdmin ? "Admin" : "User"} Account
          </button>
        </form>
      </div>
    </div>
  );
}