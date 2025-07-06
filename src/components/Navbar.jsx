import { useState } from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { Search, Plus, ChevronDown } from "lucide-react";

export default function Navbar({ onContributeClick, onSearch }) {
  const [user] = useAuthState(auth);
  const [showMenu, setShowMenu] = useState(false);
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // ✅ Send search text to parent
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h1 className="text-2xl font-bold text-gray-700">Vendor Leads</h1>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search leads..."
            value={query}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded-md pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
          Search
        </button>
        <button
          onClick={onContributeClick}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
        >
          <Plus size={16} className="mr-1" /> Contribute
        </button>
        <button className="flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-md border hover:bg-gray-200 text-sm">
          Filter <ChevronDown size={16} className="ml-1" />
        </button>

        {user && (
          <div className="relative">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-9 h-9 rounded-full cursor-pointer border border-gray-300"
                onClick={() => setShowMenu(!showMenu)}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold cursor-pointer border"
                onClick={() => setShowMenu(!showMenu)}
              >
                {getInitials(user.displayName)}
              </div>
            )}

            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-20 border">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">{user.displayName}</div>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => alert("Profile Page Coming Soon")}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
