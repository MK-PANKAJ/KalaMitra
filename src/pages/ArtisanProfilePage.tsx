import React, { useState } from 'react';
import { MapPin, Award, Star, Package, MessageCircle, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ReviewCard } from '../components/ReviewCard';
import { StarRating } from '../components/StarRating';
import { User } from '../types';

interface ArtisanProfilePageProps {
  artisanId: string;
  onClose: () => void;
  onMessageArtisan?: () => void;
}

export const ArtisanProfilePage: React.FC<ArtisanProfilePageProps> = ({
  artisanId,
  onClose,
  onMessageArtisan,
}) => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');

  // Find artisan info from products
  const artisanProducts = state.products.filter(p => p.artisanId === artisanId);
  const artisan = artisanProducts[0];

  if (!artisan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Artisan not found</p>
        <button onClick={onClose} className="mt-4 px-6 py-2 bg-terracotta-500 text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  // Calculate artisan stats
  const artisanOrders = state.orders.filter(o => o.artisanId === artisanId);
  const completedOrders = artisanOrders.filter(o => o.status === 'completed');
  
  // Get all reviews for artisan's products
  const artisanReviews = state.reviews.filter(r =>
    artisanProducts.some(p => p.id === r.productId)
  );
  
  const avgRating = artisanReviews.length > 0
    ? artisanReviews.reduce((sum, r) => sum + r.rating, 0) / artisanReviews.length
    : 0;

  const activeProducts = artisanProducts.filter(p => p.isActive);
  const qcVerifiedProducts = artisanProducts.filter(p => p.hasQualityBadge);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-deepblue-600 to-terracotta-500 text-white rounded-t-lg p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-deepblue-600 text-4xl font-bold shadow-lg">
              {artisan.artisanName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2">{artisan.artisanName}</h1>
              
              <div className="flex items-center gap-4 text-blue-100 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{artisan.region}</span>
                </div>
                {avgRating > 0 && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={avgRating} size={16} />
                    <span className="font-semibold">{avgRating.toFixed(1)}</span>
                    <span>({artisanReviews.length} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {artisan.craftSpecialty && artisan.craftSpecialty.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {artisan.craftSpecialty.map((craft, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-semibold"
                      >
                        {craft}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-semibold">
                    {artisan.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-deepblue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 -mt-8 px-8 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-terracotta-500">
          <div className="flex items-center gap-2 mb-1">
            <Package className="text-terracotta-500" size={20} />
            <span className="text-2xl font-bold text-deepblue-800">{activeProducts.length}</span>
          </div>
          <p className="text-sm text-gray-600">Active Products</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-green-500">
          <div className="flex items-center gap-2 mb-1">
            <Award className="text-green-500" size={20} />
            <span className="text-2xl font-bold text-deepblue-800">{qcVerifiedProducts.length}</span>
          </div>
          <p className="text-sm text-gray-600">QC Verified</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-blue-500">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-blue-500" size={20} />
            <span className="text-2xl font-bold text-deepblue-800">{completedOrders.length}</span>
          </div>
          <p className="text-sm text-gray-600">Completed Orders</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 border-t-4 border-gold-500">
          <div className="flex items-center gap-2 mb-1">
            <Star className="text-gold-500 fill-gold-500" size={20} />
            <span className="text-2xl font-bold text-deepblue-800">{artisanReviews.length}</span>
          </div>
          <p className="text-sm text-gray-600">Customer Reviews</p>
        </div>
      </div>

      {/* Bio/Story Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-deepblue-800 mb-4">About the Artisan</h2>
        <p className="text-gray-700 leading-relaxed">
          {artisan.bio || artisan.story || `${artisan.artisanName} is a skilled artisan from ${artisan.region}, specializing in traditional ${artisan.category}. With years of experience and dedication to preserving cultural heritage, they create authentic handcrafted products that tell a story of India's rich artisanal traditions.`}
        </p>

        {artisan.yearsOfExperience && (
          <div className="mt-4 flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <span className="font-semibold">{artisan.yearsOfExperience} years</span>
            <span>of craftsmanship experience</span>
          </div>
        )}

        {onMessageArtisan && (state.user?.role === 'coordinator' || state.user?.role === 'artisan' || state.user?.role === 'admin') && (
          <button
            onClick={onMessageArtisan}
            className="mt-4 px-6 py-3 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors font-semibold flex items-center gap-2"
          >
            <MessageCircle size={18} />
            Message Artisan
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'products'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Package size={18} />
          Products ({activeProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Star size={18} />
          Reviews ({artisanReviews.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProducts.map(product => (
            <ProductCard key={product.id} product={product} showActions={false} />
          ))}
          {activeProducts.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No active products yet</p>
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {artisanReviews.length > 0 ? (
            <>
              {/* Rating Summary */}
              <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gold-200 mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-deepblue-800 mb-2">
                      {avgRating.toFixed(1)}
                    </div>
                    <StarRating rating={avgRating} size={24} />
                    <div className="text-sm text-gray-600 mt-2">
                      Based on {artisanReviews.length} reviews
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = artisanReviews.filter(r => r.rating === stars).length;
                      const percentage = (count / artisanReviews.length) * 100;
                      return (
                        <div key={stars} className="flex items-center gap-2 mb-2">
                          <span className="text-sm w-16">{stars} star{stars !== 1 && 's'}</span>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold-500 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              {artisanReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Star size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold text-gray-700 mb-2">No reviews yet</p>
              <p className="text-gray-500">
                Be the first to purchase and review products from this artisan!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
