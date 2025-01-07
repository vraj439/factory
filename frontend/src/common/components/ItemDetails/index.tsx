import React, { useState } from 'react';

const ItemDetails = () => {
  const [selectedTab, setSelectedTab] = useState('itemDetails');
  const [quantity, setQuantity] = useState(1);
  const [technicalDrawingCount, setTechnicalDrawingCount] = useState(1); // Mock file count

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === 'increment' ? prev + 1 : Math.max(prev - 1, 1)));
  };

  const handleUploadClick = () => {
    alert('Upload technical drawing clicked');
  };

  const handleSave = () => {
    alert('Apply and Save clicked');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-2 text-sm ${
            selectedTab === 'itemDetails'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => handleTabClick('itemDetails')}
        >
          Item Details
        </button>
        <button
          className={`px-6 py-2 text-sm ${
            selectedTab === 'manufacturingFeedback'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600'
          }`}
          onClick={() => handleTabClick('manufacturingFeedback')}
        >
          Manufacturing Feedback
        </button>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Item Details Tab */}
        {selectedTab === 'itemDetails' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Process <span className="text-red-500">*</span>
              </label>
              <select className="w-full border rounded-md p-2 text-sm">
                <option>Select...</option>
                {/* Add more options */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Sub Process <span className="text-red-500">*</span>
              </label>
              <select className="w-full border rounded-md p-2 text-sm">
                <option>Select...</option>
                {/* Add more options */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Material <span className="text-red-500">*</span>
              </label>
              <select className="w-full border rounded-md p-2 text-sm">
                <option>Select...</option>
                {/* Add more options */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Grade <span className="text-red-500">*</span>
              </label>
              <select className="w-full border rounded-md p-2 text-sm">
                <option>Select...</option>
                {/* Add more options */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Surface Finish <span className="text-red-500">*</span>
              </label>
              <select className="w-full border rounded-md p-2 text-sm">
                <option>Select...</option>
                {/* Add more options */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Color"
                className="w-full border rounded-md p-2 text-sm bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tolerance <span className="text-red-500">*</span>
              </label>
              <select className="w-full border rounded-md p-2 text-sm">
                <option>Select...</option>
                {/* Add more options */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Cost
              </label>
              <input
                type="text"
                placeholder="0"
                className="w-full border rounded-md p-2 text-sm bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center">
                <div className="p-4 bg-blue-100 rounded">
                  <button
                    className="px-4 py-0.5 bg-black text-white rounded-l-md"
                    onClick={() => handleQuantityChange('decrement')}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center bg-blue-100 text-sm"
                  />
                  <button
                    className="px-4 py-0.5 bg-black text-white rounded-r-md"
                    onClick={() => handleQuantityChange('increment')}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="col-span-2 flex justify-end">
              <button
                onClick={handleUploadClick}
                className="px-4 py-2 bg-gray-200 border rounded-md"
              >
                Upload technical drawing ({technicalDrawingCount})
              </button>
            </div>
          </>
        )}
      </div>

      {/* Additional Details */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Additional Details
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Standard Inspection Report
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            CMM Inspection Report
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Material Test Certificate
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply and Save
        </button>
      </div>
    </div>
  );
};

export default ItemDetails;
