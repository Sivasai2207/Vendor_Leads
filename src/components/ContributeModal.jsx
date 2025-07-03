export default function ContributeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-4 sm:p-5">
        <h2 className="text-lg font-semibold mb-4 text-center">Contribute a Lead</h2>

        <form className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Name:</label>
            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Company Name:</label>
            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Email:</label>
            <input type="email" className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Phone:</label>
            <input type="tel" className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Author:</label>
            <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select user</option>
              <option>Sai</option>
              <option>John</option>
              <option>Ravi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Notes:</label>
            <textarea className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
            <button type="button" className="bg-black text-white px-3 py-1.5 text-xs rounded hover:bg-gray-900 w-full sm:w-auto">
              Validate
            </button>
            <button type="submit" className="bg-green-600 text-white px-3 py-1.5 text-xs rounded hover:bg-green-700 w-full sm:w-auto">
              Submit
            </button>
            <button type="button" className="bg-red-500 text-white px-3 py-1.5 text-xs rounded hover:bg-red-600 w-full sm:w-auto" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
