'use client';

import { useState } from 'react';

interface Props {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ src, name, size = 'md', className = '' }: Props) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Generate consistent soft color based on name
  const getColorClasses = (name: string) => {
    const colors = [
      'bg-slate-100 text-slate-600',
      'bg-sky-50 text-sky-600',
      'bg-violet-50 text-violet-600',
      'bg-amber-50 text-amber-600',
      'bg-emerald-50 text-emerald-600',
      'bg-rose-50 text-rose-600',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const showImage = src && !imageError;

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex items-center justify-center 
        font-semibold 
        ring-2 ring-white
        overflow-hidden
        flex-shrink-0
        ${!showImage ? getColorClasses(name) : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        getInitial(name)
      )}
    </div>
  );
}
