import React, { useEffect, useState } from 'react';
import Table from '../../common/components/Table';
import Pagination from '../../common/components/Pagination';
import { useNavigate } from 'react-router-dom';
import { PAGE_SIZE, TABLE_HEADERS } from './constants';
import useDal from '../../common/hooks/useDAL';

const QuotesPage = () => {
  const navigate = useNavigate();
  const dal = useDal();
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setTotalPages] = useState(1);

  const [quotes, setQuotes] = useState([]);

  async function getQuotes() {
    const data = await dal.quotes.getQuotes(currentPage, PAGE_SIZE);
    setQuotes(data.items);
    setTotalPages(data.pages);
  }

  useEffect(() => {
    getQuotes();
  }, []);

  useEffect(() => {
    getQuotes();
  }, [currentPage]);

  const actions = (row) => (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      onClick={() => {
        navigate(`/quotes/${row.id}`);
      }}
    >
      Configure
    </button>
  );

  return (
    <div className="flex-grow bg-gray-50 overflow-y-auto">
      <div className="min-h-screen bg-gray-50">
        <main className="p-6">
          <div className="flex justify-end items-end mb-4">
            <div className="flex ">
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => {
                  navigate(`/instant-quote`);
                }}
              >
                + New Quote
              </button>
            </div>
          </div>

          <div>
            <Table headers={TABLE_HEADERS} actions={actions} data={quotes} />
            {quotes.length ? (
              <Pagination
                currentPage={currentPage}
                totalPages={pages}
                onPageChange={(value) => {
                  setCurrentPage(value);
                }}
              />
            ) : (
              <></>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuotesPage;
