import { FC, useEffect, useState } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(3); // Đếm ngược từ 5 giây

  // Đếm ngược
  useEffect(() => {
    if (isOpen) {
      setCountdown(3); // Reset countdown khi modal mở
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-[#2156c8] rounded-3xl shadow-lg p-8 max-w-sm w-full transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center text-white">Đăng nhập thành công!</h2>
        <p className="text-center text-white mt-2">
          Chuyển hướng sau <span className="font-semibold">{countdown}</span> giây...
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-white text-[#0088cc] rounded-3xl font-semibold hover:bg-gray-200 text-lg transition duration-200"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;