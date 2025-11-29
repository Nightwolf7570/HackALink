'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: Props) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium
    transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;
  
  const variantClasses = {
    primary: `
      bg-slate-900 text-white rounded-xl
      hover:bg-slate-800 active:bg-slate-950
      focus-visible:ring-slate-200
    `,
    secondary: `
      bg-white text-slate-700 rounded-xl border border-slate-200
      hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100
      focus-visible:ring-slate-100
    `,
    ghost: `
      text-slate-600 rounded-xl
      hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200
      focus-visible:ring-slate-100
    `,
    danger: `
      bg-red-600 text-white rounded-xl
      hover:bg-red-700 active:bg-red-800
      focus-visible:ring-red-100
    `,
  };

  const sizeClasses = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0 -ml-0.5">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0 -mr-0.5">{icon}</span>
      )}
    </button>
  );
}
