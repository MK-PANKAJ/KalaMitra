import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onRate,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (selectedRating: number) => {
    if (interactive && onRate) {
      onRate(selectedRating);
    }
  };

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;
        const isPartial = !isFilled && starValue - 0.5 <= displayRating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-gold-500 text-gold-500'
                  : isPartial
                  ? 'fill-gold-300 text-gold-500'
                  : 'fill-none text-gray-300'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
