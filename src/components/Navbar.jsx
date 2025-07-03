import { Search, Plus, ChevronDown } from "lucide-react";

export default function Navbar({ onContributeClick }) {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h1 className="text-2xl font-bold text-gray-700">Vendor Leads</h1>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search leads..."
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
      </div>
    </header>
  );
}
