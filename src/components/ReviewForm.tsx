import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Order, Review } from '../types';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  order: Order;
  onSubmit: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => void;
  onCancel: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ order, onSubmit, onCancel }) => {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState('');

  const handleAddPhoto = () => {
    if (photoInput.trim() && photos.length < 5) {
      setPhotos([...photos, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    const review: Omit<Review, 'id' | 'createdAt' | 'helpful'> = {
      productId: order.productId,
      orderId: order.id,
      buyerId: order.buyerId,
      buyerName: order.buyerName,
      title: comment.trim().split('\n')[0].slice(0, 60) || 'Review',
      rating,
      comment: comment.trim(),
      photos: photos.length > 0 ? photos : undefined,
      verified: true,
    };

    onSubmit(review);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-terracotta-200">
      <h3 className="text-2xl font-bold text-deepblue-800 mb-4">Write a Review</h3>

      <div className="mb-4 p-4 bg-saffron-50 rounded-lg border-2 border-saffron-200">
        <div className="flex gap-4">
          <img
            src={order.product.photos[0]}
            alt={order.product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div>
            <h4 className="font-semibold text-deepblue-800">{order.product.name}</h4>
            <p className="text-sm text-gray-600">by {order.artisanName}</p>
            <p className="text-xs text-gray-500 mt-1">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className="flex items-center gap-4">
            <StarRating rating={rating} size={32} interactive onRate={(r) => setRating(r as 1 | 2 | 3 | 4 | 5)} />
            <span className="text-sm font-semibold text-gray-600">
              {rating === 5 && '⭐ Excellent!'}
              {rating === 4 && '👍 Very Good'}
              {rating === 3 && '😊 Good'}
              {rating === 2 && '😐 Fair'}
              {rating === 1 && '😞 Poor'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product... What did you like? What could be better?"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none resize-none min-h-[120px]"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 20 characters ({comment.length}/20)
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={photoInput}
              onChange={(e) => setPhotoInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPhoto();
                }
              }}
              placeholder="Enter image URL"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
            />
            <button
              type="button"
              onClick={handleAddPhoto}
              disabled={photos.length >= 5}
              className="px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Camera size={18} />
              Add
            </button>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Review ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Add up to 5 photos to help others see your experience
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={comment.trim().length < 20}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              comment.trim().length >= 20
                ? 'bg-terracotta-500 text-white hover:bg-terracotta-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};
