import React from 'react';

const OrdersPage = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 ">
      {/* Header */}
      <div className="bg-white py-4 px-6 border-b">
        <h1 className="text-2xl text-black font-bold">Orders</h1>
      </div>

      {/* Main Content */}
      <div className="flex grid grid-cols-3 gap-6 p-6">
        {/* Orders in Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-black font-bold">Orders in Progress</h2>
            <span className="text-4xl font-bold">0</span>
          </div>
          <div className="mt-4">
            <p className="text-black">
              <svg
                className="inline-block w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm5-8c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5 5 2.24 5 5z" />
              </svg>
              Orders in Progress
            </p>
          </div>
        </div>

        {/* Orders in Transit */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-black font-bold">Orders in Transit</h2>
            <span className="text-4xl font-bold">0</span>
          </div>
          <div className="mt-4">
            <p className="text-gray-500">
              <svg
                className="inline-block w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l2.5 3.23V16h-2v-4h-2v4h-2v-4h-2v4h-2v-4h-3V8h12.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
              Orders in Transit
            </p>
          </div>
        </div>

        {/* Orders Completed */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-black font-bold">Orders Completed</h2>
            <span className="text-4xl text-gray font-bold">0</span>
          </div>
          <div className="mt-4">
            <p className="text-gray-500">
              <svg
                className="inline-block w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Orders Completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
