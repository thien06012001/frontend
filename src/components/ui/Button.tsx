import React from 'react';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline';
};

const Button = ({
  type = 'button',
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'default',
}: ButtonProps) => {
  const baseClasses =
    'transition-all duration-200 p-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    default: 'bg-primary hover:bg-primary/90 text-white',
    outline:
      'border border-primary text-primary hover:bg-primary/10 bg-transparent',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
