'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { profile } from '@/data/profile';

/**
 * Avatar that renders the profile image, gracefully falling back to initials
 * if the image is missing (the default avatar path is a TODO placeholder).
 */
export function Avatar({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg',
        className
      )}
    >
      {errored ? (
        <span
          className="font-semibold text-white"
          style={{ fontSize: size * 0.36 }}
        >
          {initials}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar}
          alt={profile.name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
