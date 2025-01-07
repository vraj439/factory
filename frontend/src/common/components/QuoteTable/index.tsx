import React from 'react';

// Table Component
const QuoteTable = ({ headers, rows }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <table className="w-full text-sm text-left text-gray-700">
        {/* Table Header */}
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-3">
              {header}
            </th>
          ))}
        </tr>
        </thead>

        {/* Table Body */}
        <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-t hover:bg-gray-50">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-4 py-3">
                {cell}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuoteTable;
