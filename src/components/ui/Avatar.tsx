'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, name = 'User', size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Size mapping
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base'
  };

  const sizeClass = sizeClasses[size];
  const displayName = name || 'User';
  const initials = getInitials(displayName);

  // Show the image if source is provided and there's no error
  if (src && !imageError) {
    return (
      <div className={`relative rounded-full overflow-hidden ${sizeClass} ${className}`}>
        <Image
          src={src}
          alt={`${displayName}'s avatar`}
          className="object-cover"
          fill
          sizes={`(max-width: 768px) ${size === 'sm' ? '2rem' : size === 'md' ? '2.5rem' : '3.5rem'}, ${size === 'sm' ? '2rem' : size === 'md' ? '2.5rem' : '3.5rem'}`}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Show initials fallback
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-slate-100 ${sizeClass} ${className}`}
      aria-label={`${displayName}'s avatar`}
    >
      <span className="font-medium text-slate-600">{initials}</span>
    </div>
  );
}