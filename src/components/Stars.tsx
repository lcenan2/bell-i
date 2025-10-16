import { Star } from 'lucide-react';

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
  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const fillPercentage = Math.min(Math.max(rating - index, 0), 1);
        
        return (
          <div 
            key={index} 
            className="relative"
            onClick={() => handleClick(index)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            <Star 
              size={size} 
              className="text-gray-300"
              fill="currentColor"
            />
            <div 
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercentage * 100}%` }}
            >
              <Star 
                size={size} 
                className="text-yellow-400"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
