import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDal from '../../common/hooks/useDAL';
import Pagination from '../../common/components/Pagination';
import { PAGE_SIZE } from '../Quotes/constants';
import { IQuoteItemRequest } from '../../types/dto/quote';

const Items = () => {
  const [selectedItem, setSelectedItem] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const dal = useDal();
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setTotalPages] = useState(1);

  async function getItems() {
    const data = await dal.items.getItems(currentPage, PAGE_SIZE);
    setItems(data.items);
    setTotalPages(data.pages);
  }

  const navigate = useNavigate();

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    getItems();
  }, [currentPage]);

  const addItem = (item) => {
    setSelectedItem((prev) => {
      return [...prev, item.id];
    });
  };

  const onCancel = () => {
    setSelectedItem([]);
  };

  const createNewQuote = async () => {
    try {
      const quoteResponse = await dal.quotes.createQuote({});

      if (quoteResponse) {
        await dal.quotes.addExistingItemsToQuote({
          quote_id: quoteResponse.id,
          item_id: selectedItem[0].id,
          process: '',
          sub_process: '',
          material: '',
          material_grade: '',
          surface_finish: '',
          color: '',
          tolerance: '',
          target_cost: null,
          quantity: 1,
          additional_details: {},
          last_updated_at: new Date()
        });
        navigate(`/quotes/${quoteResponse.id}`);
      }
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-black font-bold">Quotes</h1>
        <button
          className="bg-blue-800 font-semibold px-4 py-2 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          onClick={() => {
            navigate('/instant-quote');
          }}
        >
          + New Quote
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((card) => (
          <div
            key={card.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-row items-center"
          >
            <img
              src={card.image}
              alt={card.fileName}
              className="w-24 h-24 mb-4 object-contain"
            />
            <div className="flex flex-col p-4">
              <h2 className="font-bold text-black mb-2">{card.fileName}</h2>
              <p className="text-gray-500 mb-4">
                Update Date: {card.updateDate}
              </p>
              {selectedItem.indexOf(card.id) === -1 ? (
                <button
                  onClick={() => {
                    addItem(card);
                  }}
                  className="relative bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg border-2 border-sky-600 backdrop-blur-md hover:bg-sky-500 hover:text-white transition duration-300"
                >
                  Order Item
                </button>
              ) : (
                <button
                  onClick={() => {
                    addItem(card);
                  }}
                  className="relative bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg border-2 border-sky-600 backdrop-blur-md hover:bg-sky-500 hover:text-white transition duration-300"
                >
                  Selected Item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      {items.length ? (
        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          onPageChange={(value) => {
            setCurrentPage(value);
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-black text-xl font-bold">No Items</span>
        </div>
      )}
      {selectedItem.length ? (
        <div className="flex flex-row justify-end mt-2">
          <button
            className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 transition duration-300 ml-4"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 transition duration-300 ml-4"
            onClick={() => {
              createNewQuote();
            }}
          >
            Create Quote
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Items;
