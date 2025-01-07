import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TableProps {
  headers: string[];
  data: Array<Record<string, string | number>>;
  actions?: (row: Record<string, string | number>) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ headers, data, actions }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden rounded-lg shadow-md">
      <table className="min-w-full table-auto border border-gray-300 text-left">
        <thead>
        <tr className="bg-blue-200 text-black">
          {headers.map((header, index) => (
            <th
              key={index}
              className="p-3 border border-gray-300 text-sm font-semibold"
            >
              {header}
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={Object.keys(data[0] || {}).length + (actions ? 7 : 0)}
              className="p-3 text-center text-black"
            >
              No quotes available
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-100 bg-white text-black"
              style={{ height: '60px' }}
            >
              {Object.entries(row).map(([key, value], colIndex) => (
                <td
                  key={colIndex}
                  className="p-3 border border-gray-300 text-sm"
                >
                  {key === 'id' ? (
                    <a
                      href="#"
                      className="text-blue-600 hover:underline"
                      onClick={() =>
                        navigate(`/quotes/${row.id}`)
                      }
                    >
                      {value as string}
                    </a>
                  ) : (
                    value
                  )}
                </td>
              ))}
              {actions && (
                <td className="p-3 border border-gray-300">{actions(row)}</td>
              )}
            </tr>
          ))
        )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
