'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, actionButton }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h2 className="text-2xl font-bold text-[#4a2c2a] mb-4">{title}</h2>
        <p className="text-[#6b4e3d] mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="bg-[#2a9d8f] text-white px-4 py-2 rounded-full hover:bg-[#264653] transition"
            >
              {actionButton.label}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 text-[#4a2c2a] px-4 py-2 rounded-full hover:bg-gray-400 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;