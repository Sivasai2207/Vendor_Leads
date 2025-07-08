import { useState } from "react";
import { secondaryAuth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar"; // ✅ Add the Navbar

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // ✅ Create new user using secondary auth instance
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Add user data to Firestore
      try {
        await setDoc(doc(db, "allowedUsers", user.uid), {
          email: user.email,
          name,
          isAdmin,
          createdAt: new Date(),
        });
      } catch (firestoreErr) {
        console.error("❌ Firestore write error:", firestoreErr.message);
        toast.error("❌ Account created, but failed to save in database.");
        return;
      }

      // ✅ Sign out secondary session (admin stays logged in)
      await secondaryAuth.signOut();

      // ✅ Success toast
      toast.success(`✅ ${isAdmin ? "Admin" : "User"} "${name}" created successfully.`);

      // ✅ Reset form
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        toast.error("❌ Email is already in use.");
      } else {
        toast.error("❌ Failed to create account. " + (err.message || ""));
      }
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ Add shared navigation */}
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {isAdmin ? "Admin" : "User"} Signup
          </h1>

          {/* 🔄 Admin/User toggle */}
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

          {/* 📋 Signup Form */}
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
    </>
  );
}
