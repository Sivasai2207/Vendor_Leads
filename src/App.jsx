import { useState } from "react";
import Navbar from "./components/Navbar";
import LeadTable from "./components/LeadTable";
import ContributeModal from "./components/ContributeModal";

export default function App() {
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
