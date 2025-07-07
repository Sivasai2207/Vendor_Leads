import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Pages & Components
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Navbar from "./components/Navbar";
import LeadTable from "./components/LeadTable";
import ContributeModal from "./components/ContributeModal";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"; // ✅ NEW

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-gray-800">
      <Navbar
        onContributeClick={() => setModalOpen(true)}
        onSearch={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <LeadTable searchTerm={searchTerm} />
      </main>
      <ContributeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 👤 Public Login Route */}
        <Route path="/" element={<LoginPage />} />

        {/* 🔒 Protected User Route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Admin-Only Signup Route */}
        <Route
          path="/signup"
          element={
            <ProtectedAdminRoute>
              <SignupPage />
            </ProtectedAdminRoute>
          }
        />
        {/* <Route path="/signup" element={<SignupPage />} /> */}
      </Routes>
    </Router>
  );
}