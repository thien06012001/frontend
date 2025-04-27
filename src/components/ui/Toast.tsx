import React from 'react';

type ToastType = 'info' | 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

const toastIcons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const Toast: React.FC<ToastProps> = ({ message, type, isVisible }) => {
  return (
    <div
      className={`flex items-center space-x-2 text-white text-sm py-2 px-4 rounded-md shadow-lg transition-all duration-300 ${
        isVisible ? 'animate-slideIn' : 'animate-collapse'
      } ${
        type === 'success'
          ? 'bg-green-500'
          : type === 'error'
            ? 'bg-red-500'
            : 'bg-blue-500'
      }`}
    >
      <span className="text-lg">{toastIcons[type]}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
