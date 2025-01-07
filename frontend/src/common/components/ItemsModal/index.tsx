import React, { useEffect, useRef, useState } from 'react';
import useDal from '../../hooks/useDAL';
import { PAGE_SIZE } from '../../../pages/Quotes/constants';
export const ItemsModalContent = ({ quoteId }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const dal = useDal();
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setTotalPages] = useState(1);
  const [items, setItems] = useState([]);

  async function getItems() {
    const data = await dal.items.getItems(currentPage, PAGE_SIZE);
    setItems(data.items);
    setTotalPages(data.pages);
  }

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    getItems();
  }, [currentPage]);

  const handleToggleItemSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };
  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4 text-left text-gray-600 font-medium">
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedItems(
                    e.target.checked ? items.map((item) => item.id) : []
                  )
                }
                checked={selectedItems.length === items.length}
              />
            </th>
            <th className="p-4 text-left text-gray-600 font-medium">
              Item Name
            </th>
            <th className="p-4 text-left text-gray-600 font-medium">
              Update Date
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleToggleItemSelection(item.id)}
                />
              </td>
              <td className="p-4">{item.name}</td>
              <td className="p-4">{item.updateDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
