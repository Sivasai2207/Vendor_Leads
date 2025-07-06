import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import LeadTable from "./components/LeadTable";
import ContributeModal from "./components/ContributeModal";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Add searchTerm state

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-gray-800">
      {/* ✅ Pass onSearch to Navbar */}
      <Navbar
        onContributeClick={() => setModalOpen(true)}
        onSearch={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ✅ Pass searchTerm to LeadTable */}
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
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
