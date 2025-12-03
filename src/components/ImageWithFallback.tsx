import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

  export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    const [didError, setDidError] = useState(false);
  
    const { src, alt, className = '', ...rest } = props;
    // Don't force a fixed height here — allow parent classes to control sizing.
    const defaultClasses = 'w-full object-cover bg-gray-100 transition-transform duration-300';

    // If no src is provided or it's an empty/invalid string, immediately render a placeholder instead of attempting to load.
    const isMissingSrc = !src || (typeof src === 'string' && (!src.trim() || src.trim().toLowerCase() === 'null' || src.trim().toLowerCase() === 'undefined'));
    if (isMissingSrc) {
      return (
        <div className={[defaultClasses, className, 'flex items-center justify-center'].filter(Boolean).join(' ')}>
          <img src={ERROR_IMG_SRC} alt={alt || 'No image'} className="w-16 h-16 opacity-70" />
        </div>
      );
    }

    return didError ? (
      <div className={[defaultClasses, className, 'flex items-center justify-center'].filter(Boolean).join(' ')}>
        <img
          src={ERROR_IMG_SRC}
          alt="Error loading image"
          className="w-16 h-16 opacity-70"
        />
      </div>
    ) : (
      <img
        src={src}
        alt={alt}
        className={[defaultClasses, className].filter(Boolean).join(' ')}
        onError={() => setDidError(true)}
        {...rest}
      />
    );
  }
  