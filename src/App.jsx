import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import LeadTable from "./components/LeadTable";
import ContributeModal from "./components/ContributeModal";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-gray-800">
      <Navbar onContributeClick={() => setModalOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <LeadTable />
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
