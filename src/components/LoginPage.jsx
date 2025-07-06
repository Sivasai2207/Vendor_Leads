import { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        navigate("/home");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider).catch((err) => console.error(err));
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Vendor Leads Database App</h1>
      <p className="text-gray-600 mb-10 max-w-md">
        Sign in with your Google account to access the application and submit or vote on vendor leads.
      </p>
      <button
        onClick={loginWithGoogle}
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-8 py-3 rounded shadow-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}
