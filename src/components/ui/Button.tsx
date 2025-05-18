// src/ui/components/ui/Button.tsx

import React from 'react';

//////////////////////
// Prop Definitions //
//////////////////////

/**
 * Props for the Button component.
 *
 * @property type      - HTML button type attribute (button, submit, reset). Defaults to 'button'.
 * @property children  - Content to render inside the button (text, icons, etc.).
 * @property onClick   - Click handler callback.
 * @property className - Additional CSS classes for custom styling.
 * @property disabled  - Whether the button is disabled. Defaults to false.
 * @property variant   - Visual style variant: 'default' (solid) or 'outline'. Defaults to 'default'.
 */
type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline';
};

////////////////////////
// Component Definition //
////////////////////////

/**
 * Button
 *
 * A reusable button component with two variants:
 *  - 'default': solid background (primary color) with hover darkening.
 *  - 'outline': transparent background with primary-colored border and text.
 *
 * Includes built-in disabled styling and supports additional custom classes.
 */
const Button: React.FC<ButtonProps> = ({
  type = 'button',
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'default',
}) => {
  //////////////////////
  // Base Styling     //
  //////////////////////
  // Shared classes for padding, rounded corners, transition, and disabled state.
  const baseClasses =
    'transition-all duration-200 p-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  //////////////////////
  // Variant Styles   //
  //////////////////////
  // Defines background, border, and text color for each variant.
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
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
