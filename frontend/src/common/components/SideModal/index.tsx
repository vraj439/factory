import React from 'react';

interface ISideModalProps {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  cancelButtonTitle?: string;
  buttonActionTitle: string;
  description?: string;
}

const SideModal = ({
                     title,
                     onClose,
                     content,
                     cancelButtonTitle,
                     buttonActionTitle,
                     description,
                     onSubmit
                   }: ISideModalProps) => {

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full sm:w-1/3 h-full shadow-lg overflow-y-auto flex flex-col">
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
        <div className="p-6">
          {content}
        </div>
        <div className="flex p-6 justify-end">
          {cancelButtonTitle && (
            <button
              className=" text-gray-500 px-6 py-2 rounded"
              onClick={onClose}
            >
              {cancelButtonTitle}
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            onClick={() => onSubmit()}
          >
            {buttonActionTitle}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideModal;
