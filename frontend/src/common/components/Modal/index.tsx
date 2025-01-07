import React, { useRef, useState } from 'react';
import useDal from '../../hooks/useDAL';

interface IModalProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  cancelButtonTitle?: string;
  buttonActionTitle: string;
  description?: string;
  onSubmit: any
}

const Modal = ({
  title,
  onClose,
  content,
  cancelButtonTitle,
  buttonActionTitle,
  description,
  onSubmit
}: IModalProps) => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const dal = useDal();
  

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full sm:w-1/3 h-auto shadow-lg overflow-y-auto flex flex-col rounded-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold capitalize">{title}</h2>
            {description && <p className="pt-1 text-gray-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6">{content}</div>
        <div className="flex p-6 justify-end">
          {cancelButtonTitle && (
            <button
              className="text-gray-500 px-6 py-2 rounded"
              onClick={onClose}
            >
              {cancelButtonTitle}
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            {buttonActionTitle}
          </button>
          <button
            onClick={() => {
              const fileInput = fileInputRef.current;
              if (fileInput) {
                fileInput.click();
              }
            }}
            className="bg-green-600 text-white px-6 py-2 rounded ml-4 hover:bg-green-700"
          >
            Add New Item
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={async (event) => {
                const file = event.target.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append('file', file);

                  try {
                    setUploadStatus('Uploading...');
                    const response: any = await dal.files.upload(formData);

                    if (response.ok) {
                      setUploadStatus('File uploaded successfully!');
                    } else {
                      setUploadStatus(
                        'Failed to upload file. Please try again.'
                      );
                    }
                  } catch (error) {
                    console.error('Error uploading file:', error);
                    setUploadStatus(
                      'An error occurred while uploading the file.'
                    );
                  }
                }
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
