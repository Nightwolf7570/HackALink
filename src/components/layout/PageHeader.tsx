'use client';

import { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; href: string }[];
}

export default function PageHeader({ title, subtitle, actions, breadcrumb }: Props) {
  return (
    <div className="mb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          {breadcrumb.map((item, idx) => (
            <span key={item.href} className="flex items-center gap-2">
              {idx > 0 && <span className="text-slate-300">/</span>}
              <a href={item.href} className="hover:text-slate-900 transition-colors">
                {item.label}
              </a>
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
