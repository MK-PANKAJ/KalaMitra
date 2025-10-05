import React, { useState } from 'react';
import { Briefcase, Package, TrendingUp, Users, Mail, FileText, Calculator } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { currencyConverter, CurrencyCode } from '../utils/currencyService';

interface BulkOrder {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  companyName: string;
  contactPerson: string;
  email: string;
  status: 'draft' | 'submitted' | 'negotiating' | 'confirmed';
  createdAt: string;
}

export const B2BMarketplacePage: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'browse' | 'inquiry' | 'orders'>('browse');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(10);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // B2B filters
  const [minQuantity, setMinQuantity] = useState(10);

  const b2bProducts = state.products.filter(p => p.isActive && p.hasQualityBadge);

  const calculateBulkPrice = (basePrice: number, quantity: number): {
    unitPrice: number;
    discount: number;
    totalPrice: number;
    savings: number;
  } => {
    let discountPercent = 0;
    
    if (quantity >= 100) {
      discountPercent = 25; // 25% off for 100+
    } else if (quantity >= 50) {
      discountPercent = 20; // 20% off for 50+
    } else if (quantity >= 25) {
      discountPercent = 15; // 15% off for 25+
    } else if (quantity >= 10) {
      discountPercent = 10; // 10% off for 10+
    }

    const unitPrice = basePrice * (1 - discountPercent / 100);
    const totalPrice = unitPrice * quantity;
    const savings = (basePrice * quantity) - totalPrice;

    return {
      unitPrice,
      discount: discountPercent,
      totalPrice,
      savings,
    };
  };

  const handleSubmitInquiry = () => {
    if (!selectedProduct) return;

    const pricing = calculateBulkPrice(selectedProduct.price, quantity);

    alert(`Bulk Inquiry Submitted!

Product: ${selectedProduct.name}
Quantity: ${quantity} units
Unit Price: ${currencyConverter.formatPrice(pricing.unitPrice, currency)}
Discount: ${pricing.discount}%
Total: ${currencyConverter.formatPrice(pricing.totalPrice, currency)}
Savings: ${currencyConverter.formatPrice(pricing.savings, currency)}

The artisan will respond within 24-48 hours.`);

    setSelectedProduct(null);
    setQuantity(10);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Briefcase size={32} />
          B2B Wholesale Marketplace
        </h1>
        <p className="text-purple-50">Bulk orders for businesses, retailers, and corporate gifting</p>
      </div>

      {/* B2B Benefits */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-purple-600" size={24} />
            <span className="font-semibold">Bulk Discounts</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">Up to 25%</p>
          <p className="text-xs text-gray-500">On orders 100+ units</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-600" size={24} />
            <span className="font-semibold">MOQ</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">10 Units</p>
          <p className="text-xs text-gray-500">Minimum order quantity</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-green-600" size={24} />
            <span className="font-semibold">Direct Access</span>
          </div>
          <p className="text-2xl font-bold text-green-600">250+</p>
          <p className="text-xs text-gray-500">Verified artisans</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-orange-600" size={24} />
            <span className="font-semibold">Custom Orders</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">Available</p>
          <p className="text-xs text-gray-500">Customization support</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'browse'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Browse Products
        </button>
        <button
          onClick={() => setActiveTab('inquiry')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'inquiry'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Bulk Inquiry
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          My B2B Orders
        </button>
      </div>

      {/* Browse Products Tab */}
      {activeTab === 'browse' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2">Minimum Quantity</label>
                <select
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none"
                >
                  <option value={10}>10+ units</option>
                  <option value={25}>25+ units</option>
                  <option value={50}>50+ units</option>
                  <option value={100}>100+ units</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2">Display Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {b2bProducts.map(product => {
              const pricing = calculateBulkPrice(product.price, minQuantity);
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all">
                  <img
                    src={product.photos[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-deepblue-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.story}</p>
                    
                    <div className="bg-purple-50 p-3 rounded-lg mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Retail Price:</span>
                        <span className="line-through text-gray-500">
                          {currencyConverter.formatPrice(product.price, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold">Bulk Price ({minQuantity}+):</span>
                        <span className="text-xl font-bold text-purple-600">
                          {currencyConverter.formatPrice(pricing.unitPrice, currency)}
                        </span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Save {pricing.discount}% | {currencyConverter.formatPrice(pricing.savings, currency)} total
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setActiveTab('inquiry');
                      }}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Request Bulk Quote
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bulk Inquiry Tab */}
      {activeTab === 'inquiry' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-deepblue-800 mb-4">Submit Bulk Order Inquiry</h2>
          
          {selectedProduct ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <div className="flex gap-4">
                  <img
                    src={selectedProduct.photos[0]}
                    alt={selectedProduct.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-600">by {selectedProduct.artisanName}</p>
                    <p className="text-sm text-gray-600">{selectedProduct.region}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(10, Number(e.target.value)))}
                    min="10"
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map(qty => (
                      <button
                        key={qty}
                        onClick={() => setQuantity(qty)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          quantity === qty
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum order quantity: 10 units</p>
              </div>

              {(() => {
                const pricing = calculateBulkPrice(selectedProduct.price, quantity);
                return (
                  <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                    <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                      <Calculator size={20} />
                      Price Breakdown
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Retail Price (per unit):</span>
                        <span className="line-through text-gray-500">
                          {currencyConverter.formatPrice(selectedProduct.price, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Bulk Price (per unit):</span>
                        <span className="text-purple-600">
                          {currencyConverter.formatPrice(pricing.unitPrice, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span className="font-semibold">{pricing.discount}%</span>
                      </div>
                      <div className="border-t-2 border-purple-300 pt-2 mt-2">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total ({quantity} units):</span>
                          <span className="text-purple-600">
                            {currencyConverter.formatPrice(pricing.totalPrice, currency)}
                          </span>
                        </div>
                        <div className="flex justify-between text-green-600 mt-1">
                          <span>You Save:</span>
                          <span className="font-semibold">
                            {currencyConverter.formatPrice(pricing.savings, currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Company Name</label>
                  <input
                    type="text"
                    placeholder="Your Company Ltd."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Contact Person</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Additional Requirements (Optional)</label>
                <textarea
                  placeholder="Customization requests, delivery timeline, payment terms, etc."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg outline-none resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setActiveTab('browse');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitInquiry}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  Submit Inquiry
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-600 mb-4">No product selected</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
              >
                Browse Products
              </button>
            </div>
          )}
        </div>
      )}

      {/* My B2B Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-deepblue-800 mb-4">My B2B Orders</h2>
          
          <div className="text-center py-12">
            <Briefcase size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-600 mb-2">No B2B orders yet</p>
            <p className="text-gray-500 mb-4">Submit a bulk inquiry to get started</p>
            <button
              onClick={() => setActiveTab('browse')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Browse Wholesale Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
