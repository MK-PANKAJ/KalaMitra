import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Package, Users, Award, XCircle, RotateCcw, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderCard } from '../components/OrderCard';
import { QualityCheckForm } from '../components/QualityCheckForm';
import { ProductCard } from '../components/ProductCard';
import { Dispute, Product, QualityCheck } from '../types';
import { backendService } from '../services/backendService';

export const CoordinatorDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'qc' | 'orders' | 'disputes'>('qc');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQC, setShowQC] = useState(false);
  const [resolution, setResolution] = useState('');
  const [resolutionAction, setResolutionAction] = useState<'full_refund' | 'partial_refund' | 'replacement' | 'no_action'>('no_action');

  const pendingQC = state.products.filter(p => !p.hasQualityBadge && !p.isActive);
  const pendingOrders = state.orders.filter(o => o.status === 'quality_check' || o.status === 'pending');
  const activeDisputes = state.disputes.filter(d => d.status === 'open' || d.status === 'under_review');

  const handleQCComplete = async (qc: QualityCheck) => {
    if (selectedProduct) {
      await backendService.updateProduct(selectedProduct.id, {
        qualityCheck: qc,
        hasQualityBadge: true,
        isActive: true,
      });

      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: {
          id: selectedProduct.id,
          updates: {
            qualityCheck: qc,
            hasQualityBadge: true,
            isActive: true,
          },
        },
      });

      setShowQC(false);
      setSelectedProduct(null);
      alert('Product approved and activated!');
    }
  };

  const handleRejectProduct = async (productId: string) => {
    if (confirm('Are you sure you want to reject this product?')) {
      await backendService.deleteProduct(productId);
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
      alert('Product rejected and removed.');
    }
  };

  const handleResolveDispute = async (dispute: Dispute, resolutionText: string, action: string) => {
    let orderUpdate: any = { status: 'completed' };

    if (action === 'full_refund') {
      orderUpdate = { status: 'completed', paymentReleased: false };
    } else if (action === 'partial_refund') {
      orderUpdate = { status: 'completed', paymentReleased: true };
    } else if (action === 'replacement') {
      orderUpdate = { status: 'pending' };
    } else {
      orderUpdate = { status: 'completed', paymentReleased: true };
    }

    await backendService.updateDispute(dispute.id, {
      status: 'resolved',
      resolution: resolutionText,
      resolvedBy: state.user?.id,
      resolvedAt: new Date().toISOString(),
    });

    await backendService.updateOrder(dispute.orderId, orderUpdate);

    dispatch({
      type: 'UPDATE_DISPUTE',
      payload: {
        id: dispute.id,
        updates: {
          status: 'resolved',
          resolution: resolutionText,
          resolvedBy: state.user?.id,
          resolvedAt: new Date().toISOString(),
        },
      },
    });

    dispatch({
      type: 'UPDATE_ORDER',
      payload: {
        id: dispute.orderId,
        updates: orderUpdate,
      },
    });

    setSelectedDispute(null);
    setResolution('');
    setResolutionAction('no_action');
  };

  const handleReleasePayment = async (orderId: string) => {
    await backendService.updateOrder(orderId, {
      paymentReleased: true,
      status: 'completed',
    });

    dispatch({
      type: 'UPDATE_ORDER',
      payload: {
        id: orderId,
        updates: {
          paymentReleased: true,
          status: 'completed',
        },
      },
    });
  };

  if (selectedDispute) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-deepblue-800 mb-6 flex items-center gap-2">
            <AlertCircle className="text-red-600" />
            Dispute Resolution
          </h2>

          <div className="space-y-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="font-semibold text-red-900 mb-2">Dispute Details</div>
              <div className="text-sm space-y-1 text-red-800">
                <div><strong>Order:</strong> {selectedDispute.order.product.name}</div>
                <div><strong>Raised by:</strong> {selectedDispute.raisedBy} ({selectedDispute.raisedByRole})</div>
                <div><strong>Reason:</strong> {selectedDispute.reason}</div>
                <div><strong>Date:</strong> {new Date(selectedDispute.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700">{selectedDispute.description}</p>
            </div>

            {selectedDispute.photos.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Evidence Photos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDispute.photos.map((photo, idx) => (
                    <img key={idx} src={photo} alt="" className="w-full h-32 object-cover rounded" />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Product Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  <img
                    src={selectedDispute.order.product.photos[0]}
                    alt=""
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <div className="font-semibold">{selectedDispute.order.product.name}</div>
                    <div className="text-sm text-gray-600">Artisan: {selectedDispute.order.artisanName}</div>
                    <div className="text-sm text-gray-600">Buyer: {selectedDispute.order.buyerName}</div>
                    <div className="font-bold text-terracotta-600">₹{selectedDispute.order.totalPrice}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Resolution Action
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setResolutionAction('full_refund')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                    resolutionAction === 'full_refund'
                      ? 'bg-red-500 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                  }`}
                >
                  <RotateCcw size={16} className="inline mr-2" />
                  Full Refund
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionAction('partial_refund')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                    resolutionAction === 'partial_refund'
                      ? 'bg-yellow-500 text-white border-yellow-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-400'
                  }`}
                >
                  <DollarSign size={16} className="inline mr-2" />
                  Partial Refund
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionAction('replacement')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                    resolutionAction === 'replacement'
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <Package size={16} className="inline mr-2" />
                  Replacement
                </button>
                <button
                  type="button"
                  onClick={() => setResolutionAction('no_action')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                    resolutionAction === 'no_action'
                      ? 'bg-green-500 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                  }`}
                >
                  <CheckCircle size={16} className="inline mr-2" />
                  No Action (Favor Artisan)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Your Resolution Decision
              </label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Explain your decision and how the dispute will be resolved..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none resize-none min-h-[120px]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedDispute(null);
                  setResolution('');
                  setResolutionAction('no_action');
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolveDispute(selectedDispute, resolution, resolutionAction)}
                disabled={!resolution.trim()}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  resolution.trim()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Resolution
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gold-500 to-saffron-600 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Coordinator Dashboard</h1>
        <p className="text-saffron-50">Manage quality control, orders, and disputes</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-terracotta-600" size={32} />
            <div>
              <div className="text-3xl font-bold text-deepblue-800">{pendingQC.length}</div>
              <div className="text-sm text-gray-600">Pending QC</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-blue-600" size={32} />
            <div>
              <div className="text-3xl font-bold text-deepblue-800">{state.orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-600" size={32} />
            <div>
              <div className="text-3xl font-bold text-deepblue-800">{activeDisputes.length}</div>
              <div className="text-sm text-gray-600">Active Disputes</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-purple-600" size={32} />
            <div>
              <div className="text-3xl font-bold text-deepblue-800">{state.products.length}</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab('qc')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'qc'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Award size={18} />
          Quality Control ({pendingQC.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Orders for Review
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'disputes'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <AlertCircle size={18} />
          Disputes ({activeDisputes.length})
        </button>
      </div>

      {showQC && selectedProduct ? (
        <QualityCheckForm
          onComplete={handleQCComplete}
          onCancel={() => {
            setShowQC(false);
            setSelectedProduct(null);
          }}
        />
      ) : null}

      {activeTab === 'qc' && !showQC && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingQC.map(product => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowQC(true);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Verify QC
                </button>
                <button
                  onClick={() => handleRejectProduct(product.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
          {pendingQC.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <Award size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No products pending QC review</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {pendingOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <OrderCard order={order} userRole="coordinator" />
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReleasePayment(order.id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Approve & Release Payment
                  </button>
                  <button
                    className="px-6 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                  >
                    Request Changes
                  </button>
                </div>
              </div>
            </div>
          ))}
          {pendingOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No orders pending review</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {activeDisputes.map(dispute => (
            <div key={dispute.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-deepblue-800">{dispute.order.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Raised by {dispute.raisedBy} ({dispute.raisedByRole})
                  </p>
                  <p className="text-sm text-red-600 font-semibold">{dispute.reason}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  dispute.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {dispute.status.toUpperCase()}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{dispute.description}</p>

              {dispute.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {dispute.photos.map((photo, idx) => (
                    <img key={idx} src={photo} alt="" className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              )}

              <button
                onClick={() => setSelectedDispute(dispute)}
                className="px-6 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors font-semibold"
              >
                Review & Resolve
              </button>
            </div>
          ))}
          {activeDisputes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg">No active disputes</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
