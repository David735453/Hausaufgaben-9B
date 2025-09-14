import React from 'react';

const ConfirmationModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-5 border border-gray-200 dark:border-gray-700 w-96 shadow-lg rounded-md bg-white">
        {' '}
        {/* Changed background */}
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {' '}
          {/* Removed dark:text-white */}
          {title}
        </h3>
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">
            {' '}
            {/* Removed dark:text-gray-300 */}
            {message}
          </p>
        </div>
        <div className="items-center px-4 py-3 flex justify-end space-x-4">
          <button
            id="confirm-btn"
            className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            id="cancel-btn"
            className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
