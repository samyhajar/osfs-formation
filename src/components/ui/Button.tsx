'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variants that follow a consistent design system */
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  /** Button size variants */
  size?: 'sm' | 'md' | 'lg';
  /** Displays loading spinner and disables button when true */
  loading?: boolean;
  /** Additional class names to apply to the button */
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles that apply to all buttons
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-slate-400';

    // Size-specific styles
    const sizeStyles = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-base'
    };

    // Variant-specific styles
    const variantStyles = {
      default: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700 disabled:bg-slate-300',
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400',
      outline: 'border border-slate-200 bg-transparent hover:bg-slate-50 active:bg-slate-100 disabled:bg-transparent disabled:text-slate-300',
      ghost: 'bg-transparent hover:bg-slate-100 active:bg-slate-200 disabled:bg-transparent disabled:text-slate-300',
      link: 'bg-transparent underline-offset-4 hover:underline text-slate-900 hover:bg-transparent disabled:text-slate-300 disabled:no-underline',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300'
    };

    // Combine all styles
    const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    return (
      <button
        className={`${buttonStyles} ${disabled || loading ? 'cursor-not-allowed opacity-70' : ''}`}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';