'use client';

import { Avatar } from './Avatar';

interface UserAvatarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  size?: 'sm' | 'md' | 'lg';
  hideDetails?: boolean;
  className?: string;
}

export function UserAvatar({
  user,
  size = 'md',
  hideDetails = false,
  className = ''
}: UserAvatarProps) {
  const displayName = user.name || user.email || 'User';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar
        src={user.image}
        name={displayName}
        size={size}
      />

      {!hideDetails && (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 leading-tight">
            {user.name || 'Anonymous User'}
          </span>
          {user.email && (
            <span className="text-xs text-slate-500 leading-tight">
              {user.email}
            </span>
          )}
        </div>
      )}
    </div>
  );
}