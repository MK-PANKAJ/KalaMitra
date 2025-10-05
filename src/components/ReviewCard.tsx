import React from 'react';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import { Review } from '../types';
import { StarRating } from './StarRating';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [helpful, setHelpful] = React.useState(review.helpful);
  const [hasVoted, setHasVoted] = React.useState(false);

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpful(helpful + 1);
      setHasVoted(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-100 hover:border-terracotta-200 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-400 to-terracotta-500 flex items-center justify-center text-white font-bold">
          {review.buyerName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-deepblue-800">{review.buyerName}</h4>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    <CheckCircle size={12} />
                    Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <StarRating rating={review.rating} size={16} />
          </div>

          <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mb-3">
              {review.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                />
              ))}
            </div>
          )}

          <button
            onClick={handleHelpful}
            disabled={hasVoted}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              hasVoted
                ? 'text-terracotta-600 cursor-default'
                : 'text-gray-600 hover:text-terracotta-600 cursor-pointer'
            }`}
          >
            <ThumbsUp size={16} className={hasVoted ? 'fill-terracotta-600' : ''} />
            Helpful ({helpful})
          </button>
        </div>
      </div>
    </div>
  );
};
