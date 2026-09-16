import React from 'react';

interface GaneshaImageProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const GaneshaImage: React.FC<GaneshaImageProps> = ({
  className = 'w-10 h-10 object-contain',
  size,
  alt = 'Lord Ganesha Divine Murti',
}) => {
  const style = size
    ? {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }
    : undefined;

  return (
    <img
      src="/images/ganesha.svg"
      alt={alt}
      className={`inline-block select-none drop-shadow-md transition-transform ${className}`}
      style={style}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};
