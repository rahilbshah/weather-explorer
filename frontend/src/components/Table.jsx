import React, { useState } from "react";

const Table = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  if (!data || data.length === 0) {
    return (
      <div className="glass-card rounded-xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📋 Data Table
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">📑</p>
          <p>No data to display in table</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
  const headers = Object.keys(data[0]);

  const formatHeader = (header) => {
    return header.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatValue = (value, header) => {
    if (typeof value === "number") {
      if (header.includes("temp")) {
        return `${value.toFixed(1)}°C`;
      }
      return value.toFixed(2);
    }
    return value;
  };

  return (
    <div className="glass-card rounded-xl shadow-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        📋 Data Table
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {formatHeader(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                {headers.map((h) => (
                  <td key={h} className="px-4 py-3 text-sm text-gray-700">
                    {formatValue(row[h], h)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, data.length)} of {data.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
