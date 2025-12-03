import { useState, useEffect, KeyboardEvent } from 'react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function Stars({ 
  rating, 
  maxRating = 5, 
  size = 20, 
  interactive = false,
  onRatingChange 
}: RatingStarsProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(rating ? Math.max(0, Math.floor(rating) - 1) : null);

  // Sync selectedIndex if parent rating changes
  useEffect(() => {
    if (typeof rating === 'number' && rating > 0) {
      setSelectedIndex(Math.max(0, Math.floor(rating) - 1));
    }
  }, [rating]);

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      // set selected and hover so UI reflects selection immediately
      setSelectedIndex(index);
      setHoverIndex(index);
      onRatingChange(index + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (!interactive || !onRatingChange) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedIndex(index);
      setHoverIndex(index);
      onRatingChange(index + 1);
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      onRatingChange(index);
    }
    if (e.key === 'ArrowRight' && index < maxRating - 1) {
      e.preventDefault();
      onRatingChange(index + 2);
    }
  };

  const displayCount = hoverIndex !== null ? hoverIndex + 1 : (selectedIndex !== null ? selectedIndex + 1 : Math.round(rating || 0));

  return (
    <div className="flex gap-1 items-center leading-none" role={interactive ? 'radiogroup' : undefined}>
      {Array.from({ length: maxRating }, (_, index) => {
        const filled = index < displayCount;

        const StarSVG = ({ filled }: { filled: boolean }) => (
          <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <path
              d="M12 .587l3.668 7.431L24 9.753l-6 5.847L19.335 24 12 20.201 4.665 24 6 15.6 0 9.753l8.332-1.735L12 .587z"
              fill={filled ? '#F59E0B' : '#D1D5DB'}
            />
          </svg>
        );

        return (
          <div
            key={index}
            className="inline-block star-wrapper focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 rounded"
            onClick={() => handleClick(index)}
            onMouseEnter={() => interactive && setHoverIndex(index)}
            onMouseLeave={() => interactive && setHoverIndex(null)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role={interactive ? 'radio' : undefined}
            aria-checked={interactive ? rating >= index + 1 : undefined}
            tabIndex={interactive ? 0 : -1}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            <StarSVG filled={filled} />
          </div>
        );
      })}
    </div>
  );
}
