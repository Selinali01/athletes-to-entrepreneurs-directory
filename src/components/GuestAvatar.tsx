import { useState } from 'react';
import type { Guest } from '../lib/types';
import { avatarSwatch, initialsOf } from '../lib/format';

export function GuestAvatar({
  guest,
  size,
  className = '',
}: {
  guest: Guest;
  size: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const photo = guest.profile?.photo ?? null;
  const showImage = photo && !failed;

  if (showImage) {
    return (
      <img
        src={photo}
        alt={guest.name}
        width={size}
        height={size}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const swatch = avatarSwatch(guest.name || guest.id);
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        background: swatch.bg,
        color: swatch.fg,
        fontSize: size * 0.36,
      }}
      aria-hidden
    >
      {initialsOf(guest.name)}
    </div>
  );
}
