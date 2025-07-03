import { MoreVertical } from "lucide-react";

export default function LeadTable() {
  const leads = [
    {
      name: "Sivasai",
      company: "Abc Solutions",
      email: "sivasai@example.com",
      phone: "+1-555-1234",
      notes: "Priority vendor",
      votes: { like: 4, dislike: 1, stopped: 0 },
    },
    ...Array(9).fill(null).map((_, i) => ({
      name: `Lead ${i + 2}`,
      company: `Company ${i + 2}`,
      email: `lead${i + 2}@example.com`,
      phone: `+1-555-10${i + 2}0`,
      notes: "Some notes about this vendor...",
      votes: { like: 2, dislike: 1, stopped: 0 },
    }))
  ];

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
              <th className="px-6 py-4">Votes</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{lead.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.notes}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm flex items-center gap-1">👍 {lead.votes.like}</span>
                    <span className="text-red-500 text-sm flex items-center gap-1">👎 {lead.votes.dislike}</span>
                    <span className="text-yellow-600 text-sm flex items-center gap-1">⛔ {lead.votes.stopped}</span>
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

      <div className="flex justify-between items-center px-6 py-4 bg-white border-t text-sm text-gray-600">
        <div>
          Showing <strong>10</strong> out of <strong>10</strong> Leads
        </div>
        <div className="flex items-center gap-2">
          <select className="border rounded px-2 py-1 text-sm">
            <option>10</option>
            <option>5</option>
          </select>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded text-sm border ${page === 1 ? "bg-pink-500 text-white" : "bg-white hover:bg-gray-100"}`}
              >
                {page}
              </button>
            ))}
            <span className="px-2 text-gray-400">...</span>
            <button className="px-3 py-1 rounded text-sm border bg-white hover:bg-gray-100">4</button>
          </div>
        </div>
      </div>
    </div>
  );
}
