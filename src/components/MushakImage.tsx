import React from 'react';

interface MushakImageProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const MushakImage: React.FC<MushakImageProps> = ({
  className = 'w-10 h-10 object-contain',
  size,
  alt = 'Mushak Sacred Devotee Mouse',
}) => {
  const style = size
    ? {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }
    : undefined;

  return (
    <img
      src="/images/mushak.svg"
      alt={alt}
      className={`inline-block select-none drop-shadow-md transition-transform ${className}`}
      style={style}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};
