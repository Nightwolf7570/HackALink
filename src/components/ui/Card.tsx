'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  noPadding?: boolean;
  variant?: 'default' | 'elevated' | 'interactive';
}

export default function Card({ 
  children, 
  title, 
  subtitle, 
  action,
  className = '', 
  noPadding = false,
  variant = 'default'
}: Props) {
  const variantClasses = {
    default: 'card',
    elevated: 'card-elevated',
    interactive: 'card-interactive',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {title && (
                <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : (title || subtitle ? 'px-6 pb-6' : 'p-6')}>
        {children}
      </div>
    </div>
  );
}
