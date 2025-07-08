import { useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { Search, Plus, ChevronDown } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ onContributeClick, onSearch, authorOptions = [] }) {
  const [user] = useAuthState(auth);
  const [showMenu, setShowMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const filterRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔁 Detect route
  const isSignupPage = location.pathname === "/signup";
  const isHomePage = location.pathname === "/home";

  // ✅ Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const snap = await getDoc(doc(db, "allowedUsers", user.uid));
        if (snap.exists()) {
          setIsAdmin(snap.data().isAdmin === true);
        }
      }
    };
    checkAdmin();
  }, [user]);

  const handleLogout = () => signOut(auth);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val, authorFilter);
  };

  const handleAuthorChange = (e) => {
    const val = e.target.value;
    setAuthorFilter(val);
    onSearch(query, val);
  };

  const handleAuthorSearchInput = (e) => setAuthorSearch(e.target.value);

  const handleApplyAuthorSearch = () => {
    setAuthorFilter(authorSearch);
    onSearch(query, authorSearch);
  };

  const handleClearFilters = () => {
    setQuery("");
    setAuthorFilter("");
    setAuthorSearch("");
    onSearch("", "");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const filteredAuthorOptions = authorOptions.filter((name) =>
    name.toLowerCase().includes(authorSearch.toLowerCase())
  );

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative">
      <h1
        className="text-2xl font-bold text-gray-700 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        Vendor Leads
      </h1>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">

        {/* 🔘 Admin Toggle Button */}
        {isAdmin && (
          <button
            onClick={() => navigate(isSignupPage ? "/home" : "/signup")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
          >
            {isSignupPage ? "Home" : "Signup"}
          </button>
        )}

        {/* 🔍 Search Input */}
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

        {/* 🔘 Search + Contribute Buttons */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          onClick={() => onSearch(query, authorFilter)}
        >
          Search
        </button>

        <button
          onClick={onContributeClick}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
        >
          <Plus size={16} className="mr-1" /> Contribute
        </button>

        {/* 🔽 Filter Panel */}
        <div className="relative" ref={filterRef}>
          <button
            className="flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-md border hover:bg-gray-200 text-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter <ChevronDown size={16} className="ml-1" />
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border p-4 z-30">
              <label className="block text-xs text-gray-600 mb-1">Search Authors</label>
              <input
                type="text"
                placeholder="Search author name..."
                value={authorSearch}
                onChange={handleAuthorSearchInput}
                className="w-full mb-2 border rounded px-2 py-1 text-sm"
              />
              <button
                className="w-full bg-blue-500 text-white py-1 px-2 rounded text-sm mb-2"
                onClick={handleApplyAuthorSearch}
              >
                Apply Author Search
              </button>
              <label className="block text-xs text-gray-600 mb-1">Filter by Author</label>
              <select
                value={authorFilter}
                onChange={handleAuthorChange}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="">All Authors</option>
                {filteredAuthorOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleClearFilters}
                className="mt-3 text-xs text-blue-600 hover:underline w-full text-left"
              >
                Clear Author Filter
              </button>
            </div>
          )}
        </div>

        {/* 👤 User Avatar Menu */}
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
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  {user.displayName}
                </div>
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
