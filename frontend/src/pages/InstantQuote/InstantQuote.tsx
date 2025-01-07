import React, { useRef, useState } from 'react';
import useDal from '../../common/hooks/useDAL';
import { data } from 'autoprefixer';
import { ICreateItemResponseDto } from '../../types/dto/item';
import { useNavigate } from 'react-router-dom';

const InstantQuote = () => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const dal = useDal();
  const navigate = useNavigate();

  // Trigger file input on button click
  const handleQuoteButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        setUploadStatus('Uploading...');
        const [fileUploadResponse, quoteResponse] = await Promise.all([dal.files.upload(formData), dal.quotes.createQuote({})]);
        if (fileUploadResponse && quoteResponse) {
          const item: ICreateItemResponseDto = await dal.items.createItem({
            cad_file_id: fileUploadResponse.file_id
          });
          if (item) {
            navigate(`/quotes/${quoteResponse.id}`);
          }
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus('An error occurred while uploading the file.');
      }
    }
  };

  return (
    <div className="flex-grow bg-gray-50 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Instant Quote</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instant Quotation */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Instant Quotation
            </h2>
            <p className="text-gray-600 mb-4">
              Get instant pricing, lead times, and DFM feedback for custom
              manufacturing from Karkhana.io. CNC Machining, 3D Printing, Sheet
              Cutting, Injection Moulding – all in one place.
            </p>
            <div
              className="border-dashed border-2 border-blue-400 rounded-md flex flex-col items-center justify-center h-40 mb-4"
            >
              <p className="text-gray-500">Drag and drop files to upload, or</p>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleQuoteButtonClick}
              >
                Get Instant Quotation
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {uploadStatus && <p className="text-sm text-gray-500">{uploadStatus}</p>}
            <p className="text-gray-500 text-sm mt-4">
              File types: STEP, STP, IGES, IGS, SLDPRT, 3DM, SAT, or X_T Files
              <br />
              File size: 100 MB
            </p>
            <p className="text-xs text-gray-400 mt-2">
              All your files are securely stored with us (read our privacy
              guarantee)
            </p>
          </div>

          {/* High Volume Production */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              High Volume Production
            </h2>
            <p className="text-gray-600 mb-4">
              Upload your files for a comprehensive quote from Karkhana.io
              experts. Get hassle-free and accurate project estimation for your
              custom manufacturing needs.
            </p>
            <div
              className="border-dashed border-2 border-blue-400 rounded-md flex flex-col items-center justify-center h-40 mb-4"
            >
              <p className="text-gray-500">Drag and drop files to upload, or</p>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleQuoteButtonClick}
              >
                Start your Large Order
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {uploadStatus && <p className="text-sm text-gray-500">{uploadStatus}</p>}
            <p className="text-gray-500 text-sm mt-4">
              File types: BOMs, Statement of Work, Part files, Technical
              drawings, etc.
              <br />
              File size: 100 MB
            </p>
            <p className="text-xs text-gray-400 mt-2">
              All your files are securely stored with us (read our privacy
              guarantee)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantQuote;
