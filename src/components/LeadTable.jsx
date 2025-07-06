import { useState } from "react";
import { MoreVertical } from "lucide-react";
import Pagination from "./Pagination";

export default function LeadTable() {
  const initialLeads = [
    {
      name: "Sivasai",
      company: "Abc Solutions",
      email: "sivasai@example.com",
      phone: "+1-555-1234",
      notes: "Priority vendor",
      votes: { like: 4, dislike: 1, stopped: 0 },
    },
    ...Array(24).fill(null).map((_, i) => ({
      name: `Lead ${i + 2}`,
      company: `Company ${i + 2}`,
      email: `lead${i + 2}@example.com`,
      phone: `+1-555-10${i + 2}0`,
      notes: "Some notes about this vendor...",
      votes: { like: 2, dislike: 1, stopped: 0 },
    }))
  ];

  const [leads, setLeads] = useState(initialLeads);
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const handleVote = (index, type) => {
    const globalIndex = indexOfFirstLead + index;
    const updatedLeads = [...leads];
    updatedLeads[globalIndex].votes[type] += 1;
    setLeads(updatedLeads);
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#f1f3f9] text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Notes</th>
              <th className="px-6 py-4">Vote</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentLeads.map((lead, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{lead.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.notes}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleVote(i, 'like')} className="text-green-600 text-sm flex items-center gap-1">
                      👍 {lead.votes.like}
                    </button>
                    <button onClick={() => handleVote(i, 'dislike')} className="text-red-500 text-sm flex items-center gap-1">
                      👎 {lead.votes.dislike}
                    </button>
                    <button onClick={() => handleVote(i, 'stopped')} className="text-yellow-600 text-sm flex items-center gap-1">
                      ⛔ {lead.votes.stopped}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <MoreVertical className="text-gray-400 cursor-pointer" size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
