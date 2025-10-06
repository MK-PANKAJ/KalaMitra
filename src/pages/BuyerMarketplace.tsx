import React, { useState } from 'react';
import { Search, Filter, MapPin, Award, ShoppingBag, CreditCard, Heart, MessageCircle, Star, Flag, X, AlertTriangle, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BuyerMarketplace: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'orders' | 'wishlist' | 'referral'>('marketplace');
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [onlyQCVerified, setOnlyQCVerified] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponValidation, setCouponValidation] = useState<any>(null);
  const buyerOrders = state.orders.filter(o => o.buyerId === state.user?.id);
  const wishlistProducts = state.products.filter(p => state.user?.wishlist?.includes(p.id));
  const productReviews = selectedProduct ? state.reviews.filter(r => r.productId === selectedProduct.id) : [];
  const avgRating = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : 0;

  // Check if buyer has purchased this product
  const hasPurchasedProduct = (productId: string) => {
    return buyerOrders.some(order => order.productId === productId);
  };

  // Check if buyer has already reviewed this product
  const hasReviewedProduct = (productId: string) => {
    return state.reviews.some(review => 
      review.productId === productId && review.buyerId === state.user?.id
    );
  };

  const filteredProducts = state.products.filter(product => {
    if (!product.isActive) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.story.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterRegion && !product.region.toLowerCase().includes(filterRegion.toLowerCase())) {
      return false;
    }
    if (filterCategory && product.category !== filterCategory) {
      return false;
    }
    if (onlyQCVerified && !product.hasQualityBadge) {
      return false;
    }
    return true;
  });

  const regions = [...new Set(state.products.map(p => p.region))];
  const categories = [...new Set(state.products.map(p => p.category))];

  const handlePlaceOrder = async (product: Product) => {
    if (!deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    // Payment verification
    const paymentConfirmed = confirm(
      `🔐 Payment Verification\n\n` +
      `Amount: ₹${product.price.toLocaleString('en-IN')}\n` +
      `Method: ${paymentMethod.toUpperCase()}\n\n` +
      `Click OK to process payment and place order.\n` +
      `This will charge your account.`
    );

    if (!paymentConfirmed) {
      return; // User cancelled payment
    }

    // Simulate payment processing
    alert('⏳ Processing payment...\n\nPlease wait while we verify your payment.');

    // In production, this would call payment gateway API
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    // Payment successful
    const milestone: OrderMilestone = {
      status: 'pending',
      timestamp: new Date().toISOString(),
      note: `Payment verified via ${paymentMethod.toUpperCase()}. Order placed successfully.`,
    };

    const order: Order = {
      id: `order-${Date.now()}`,
      productId: product.id,
      product: product,
      buyerId: state.user!.id,
      buyerName: state.user!.name,
      artisanId: product.artisanId,
      artisanName: product.artisanName,
      quantity: 1,
      totalPrice: product.price,
      status: 'pending',
      milestones: [milestone],
      paymentReleased: false,
      createdAt: new Date().toISOString(),
      deliveryAddress: deliveryAddress,
    };

    // Save to backend
    await backendService.addOrder(order);
    
    dispatch({ type: 'ADD_ORDER', payload: order });
    
    // Success notification
    alert(
      `✅ Payment Successful!\n\n` +
      `Order ID: ${order.id}\n` +
      `Amount Paid: ₹${product.price.toLocaleString('en-IN')}\n` +
      `Payment Method: ${paymentMethod.toUpperCase()}\n\n` +
      `Your order has been placed and is awaiting artisan confirmation.`
    );
    
    setSelectedProduct(null);
    setShowPayment(false);
    setDeliveryAddress('');
    setActiveTab('orders');
  };

  const handleReportProduct = () => {
    if (!reportDetails.trim()) {
      alert('Please provide report details');
      return;
    }

    // In production, this would save to database
    alert(`Product reported successfully!\n\nCategory: ${reportCategory}\nDetails: ${reportDetails}\n\nAdmin will review this report.`);
    
    setShowReportModal(false);
    setReportReason('');
    setReportDetails('');
    setReportCategory('misleading');
  };

  const handleSubmitProductReview = async (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };

    dispatch({ type: 'ADD_REVIEW', payload: newReview });
    setShowProductReviewForm(false);
    alert('✅ Review submitted successfully! Thank you for your feedback.');
  };

  const handleToggleWishlist = (productId: string) => {
    if (state.user?.wishlist?.includes(productId)) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: productId });
    }
  };

  const handleSubmitReview = async (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };

    dispatch({ type: 'ADD_REVIEW', payload: newReview });
    
    // Update artisan's rating
    const artisan = await backendService.getProducts(review.productId);
    // Would update artisan stats here
    
    setShowReviewForm(false);
    setSelectedOrderForReview(null);
    alert('Thank you for your review!');
  };

  const hasUserReviewed = (orderId: string) => {
    return state.reviews.some(r => r.orderId === orderId);
  };

  if (showReviewForm && selectedOrderForReview) {
    return (
      <div className="max-w-4xl mx-auto">
        <ReviewForm
          order={selectedOrderForReview}
          onSubmit={handleSubmitReview}
          onCancel={() => {
            setShowReviewForm(false);
            setSelectedOrderForReview(null);
          }}
        />
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <img
                src={selectedProduct.photos[0]}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="grid grid-cols-3 gap-2">
                {selectedProduct.photos.slice(1).map((photo, idx) => (
                  <img key={idx} src={photo} alt="" className="w-full h-20 object-cover rounded" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-deepblue-800">{selectedProduct.name}</h1>
                  <button
                    onClick={() => handleToggleWishlist(selectedProduct.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title={state.user?.wishlist?.includes(selectedProduct.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart
                      size={28}
                      className={
                        state.user?.wishlist?.includes(selectedProduct.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }
                    />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {selectedProduct.hasQualityBadge && (
                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      <Award size={16} />
                      Quality Verified
                    </div>
                  )}
                  {productReviews.length > 0 && (
                    <div className="inline-flex items-center gap-1">
                      <StarRating rating={avgRating} size={16} />
                      <span className="text-sm font-semibold text-gray-700">
                        {avgRating.toFixed(1)} ({productReviews.length} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{selectedProduct.region}</span>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Artisan:</strong> {selectedProduct.artisanName}
              </div>

              <div className="py-4 border-y border-gray-200">
                <div className="text-4xl font-bold text-terracotta-600">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-deepblue-800 mb-2">Story</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProduct.story}</p>
              </div>

              {selectedProduct.materials && selectedProduct.materials.length > 0 && (
                <div>
                  <h3 className="font-bold text-deepblue-800 mb-2">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.materials.map((material, idx) => (
                      <span key={idx} className="bg-saffron-100 text-saffron-800 px-3 py-1 rounded-full text-sm">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!showPayment ? (
                <>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setShowPayment(true)}
                      className="flex-1 px-6 py-3 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} />
                      Proceed to Payment
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    {hasReviewedProduct(selectedProduct.id) ? (
                      <button
                        disabled
                        className="flex-1 px-4 py-2 border-2 border-green-300 text-green-700 rounded-lg bg-green-50 cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                      >
                        <Star size={16} className="fill-green-700" />
                        Already Reviewed
                      </button>
                    ) : hasPurchasedProduct(selectedProduct.id) ? (
                      <button
                        onClick={() => setShowProductReviewForm(true)}
                        className="flex-1 px-4 py-2 border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <Star size={16} />
                        Write Review ✅
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-500 rounded-lg bg-gray-50 cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                        title="Purchase this product first to write a review"
                      >
                        <Star size={16} />
                        Purchase to Review
                      </button>
                    )}
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="flex-1 px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Flag size={16} />
                      Report Product
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="font-bold text-deepblue-800">Payment & Delivery</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter complete delivery address"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Coupon Code (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-400 outline-none"
                        disabled={appliedCoupon !== null}
                      />
                      {!appliedCoupon ? (
                        <button
                          onClick={() => {
                            if (couponCode.trim()) {
                              const validation = couponService.validateCoupon(
                                couponCode,
                                selectedProduct.price,
                                state.user?.id,
                                [selectedProduct.category],
                                [selectedProduct.id]
                              );
                              setCouponValidation(validation);
                              if (validation.valid && validation.coupon) {
                                setAppliedCoupon(validation.coupon);
                                couponService.applyCoupon(couponCode, state.user?.id);
                                alert(`✅ ${validation.message}`);
                              } else {
                                alert(validation.message);
                              }
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                        >
                          Apply
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setAppliedCoupon(null);
                            setCouponValidation(null);
                            setCouponCode('');
                            alert('Coupon removed');
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {couponValidation && !couponValidation.valid && (
                      <p className="text-red-600 text-sm mt-1">{couponValidation.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          paymentMethod === 'upi'
                            ? 'bg-terracotta-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-terracotta-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          paymentMethod === 'netbanking'
                            ? 'bg-terracotta-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Net Banking
                      </button>
                    </div>
                  </div>

                  <div className="bg-saffron-50 p-4 rounded-lg border-2 border-saffron-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Product Price:</span>
                      <span className="font-semibold">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Coupon Discount ({appliedCoupon.code}):</span>
                        <span className="font-semibold">-₹{couponValidation.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Platform Fee:</span>
                      <span className="font-semibold">₹0</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-saffron-300">
                      <span className="font-bold text-lg">Total Amount:</span>
                      <span className="font-bold text-lg text-terracotta-600">₹{(appliedCoupon ? couponValidation.finalAmount : selectedProduct.price).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPayment(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handlePlaceOrder(selectedProduct)}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} />
                      Pay ₹{(appliedCoupon ? couponValidation.finalAmount : selectedProduct.price).toLocaleString('en-IN')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-bold text-deepblue-800 mb-4 flex items-center gap-2">
              <Star className="text-gold-500" size={24} />
              Customer Reviews
              {productReviews.length > 0 && (
                <span className="text-lg font-normal text-gray-600">
                  ({productReviews.length})
                </span>
              )}
            </h2>

            {productReviews.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md border-2 border-gold-200 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-deepblue-800">{avgRating.toFixed(1)}</div>
                      <StarRating rating={avgRating} size={20} />
                      <div className="text-sm text-gray-600 mt-1">
                        {productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = productReviews.filter(r => r.rating === stars).length;
                        const percentage = (count / productReviews.length) * 100;
                        return (
                          <div key={stars} className="flex items-center gap-2 mb-1">
                            <span className="text-sm w-12">{stars} star{stars !== 1 && 's'}</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {productReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <Star size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Product Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="text-red-600" />
                  Report Product
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Report Category
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value as any)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-400 outline-none"
                  >
                    <option value="misleading">Misleading Description</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="quality">Quality Issues</option>
                    <option value="fake">Fake/Counterfeit Product</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Report Details *
                  </label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Please provide detailed information about the issue..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-400 outline-none"
                    rows={4}
                    required
                  />
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Your report will be reviewed by our admin team. False reports may result in account suspension.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportProduct}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <Flag size={20} />
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Review Form Modal */}
        {showProductReviewForm && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Star className="text-gold-500" />
                  Write a Review
                </h3>
                <button
                  onClick={() => setShowProductReviewForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <ReviewForm
                order={{
                  id: `temp-${Date.now()}`,
                  productId: selectedProduct.id,
                  product: selectedProduct,
                  buyerId: state.user!.id,
                  buyerName: state.user!.name,
                  artisanId: selectedProduct.artisanId,
                  artisanName: selectedProduct.artisanName,
                  quantity: 1,
                  totalPrice: selectedProduct.price,
                  status: 'completed',
                  milestones: [],
                  createdAt: new Date().toISOString(),
                  deliveryAddress: ''
                } as Order}
                onSubmit={handleSubmitProductReview}
                onCancel={() => setShowProductReviewForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-deepblue-600 to-terracotta-500 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome, {state.user?.name}!</h1>
        <p className="text-blue-50">Discover authentic handcrafted products from Indian artisans</p>
      </div>

      <div className="flex gap-4 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'marketplace'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <ShoppingBag size={18} />
          My Orders ({buyerOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Heart size={18} className={wishlistProducts.length > 0 ? 'fill-red-500 text-red-500' : ''} />
          Wishlist ({wishlistProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('referral')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'referral'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Gift size={18} />
          Refer & Earn
        </button>
      </div>

      {activeTab === 'marketplace' && (
        <>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name or story..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
                />
              </div>

              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <label className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={onlyQCVerified}
                  onChange={(e) => setOnlyQCVerified(e.target.checked)}
                  className="w-4 h-4"
                />
                <Award size={18} className="text-green-600" />
                <span className="text-sm font-semibold">QC Only</span>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
                showActions
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Filter size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No products match your filters</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'orders' && (
        <div className="grid md:grid-cols-2 gap-4">
          {buyerOrders.map(order => (
            <div key={order.id} className="relative">
              <OrderCard order={order} userRole="buyer" />
              {order.status === 'delivered' && !hasUserReviewed(order.id) && (
                <button
                  onClick={() => {
                    setSelectedOrderForReview(order);
                    setShowReviewForm(true);
                  }}
                  className="absolute top-4 right-4 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Star size={16} />
                  Write Review
                </button>
              )}
              {hasUserReviewed(order.id) && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold flex items-center gap-2">
                  <Star size={16} className="fill-green-700" />
                  Reviewed
                </div>
              )}
            </div>
          ))}
          {buyerOrders.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg">You haven't placed any orders yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <>
          {wishlistProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(product => (
                <div key={product.id} className="relative">
                  <ProductCard
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                    showActions
                  />
                  <button
                    onClick={() => handleToggleWishlist(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart size={20} className="fill-red-500 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Heart size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</p>
              <p className="text-gray-500 mb-4">
                Save your favorite products by clicking the heart icon
              </p>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-6 py-3 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors font-semibold"
              >
                Browse Marketplace
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'referral' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg p-6 shadow-lg">
            <h2 className="text-3xl font-bold mb-2">🎁 Refer & Earn</h2>
            <p className="text-green-50">Invite friends and earn ₹100 per successful referral!</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6 border-2 border-green-200">
              <p className="font-bold text-lg mb-3 text-gray-800">📱 Your Referral Code:</p>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-green-500 mb-4">
                <p className="text-3xl font-mono font-bold text-green-600 text-center">
                  {referralService.generateReferralCode(state.user!.id, state.user!.name)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const code = referralService.generateReferralCode(state.user!.id, state.user!.name);
                    const link = referralService.getShareableLink(code);
                    navigator.clipboard.writeText(link);
                    alert('Referral link copied to clipboard!');
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  📋 Copy Link
                </button>
                <button
                  onClick={() => {
                    const code = referralService.generateReferralCode(state.user!.id, state.user!.name);
                    const text = referralService.getShareText(state.user!.name, code);
                    const link = referralService.getShareableLink(code);
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`);
                  }}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                >
                  💬 Share on WhatsApp
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg text-center border-2 border-blue-200">
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {referralService.getReferralStats(state.user!.id).totalReferrals}
                </p>
                <p className="text-sm text-gray-600 font-semibold">Total Referrals</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center border-2 border-green-200">
                <p className="text-4xl font-bold text-green-600 mb-2">
                  ₹{referralService.getReferralStats(state.user!.id).totalRewards}
                </p>
                <p className="text-sm text-gray-600 font-semibold">Total Earned</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center border-2 border-purple-200">
                <p className="text-4xl font-bold text-purple-600 mb-2">
                  {referralService.getReferralStats(state.user!.id).pendingReferrals}
                </p>
                <p className="text-sm text-gray-600 font-semibold">Pending</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">📋 How it Works:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-800">Share your code</p>
                    <p className="text-sm text-gray-600">Send your unique referral code to friends</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-800">Friend signs up</p>
                    <p className="text-sm text-gray-600">They use your code during registration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <p className="font-semibold text-gray-800">Both earn rewards!</p>
                    <p className="text-sm text-gray-600">You get ₹100, they get ₹50 credit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
