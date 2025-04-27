import React from 'react';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const Button = ({
  type = 'button',
  children,
  onClick,
  className = '',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-primary hover:bg-primary/90 disabled:bg-primary/80 transition-all duration-200 text-white p-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
