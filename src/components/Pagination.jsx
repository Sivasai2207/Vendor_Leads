export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-t text-sm text-gray-600">
      <div>
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </div>
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded text-sm border transition ${
              page === currentPage
                ? "bg-pink-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
