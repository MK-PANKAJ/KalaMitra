import React from 'react';
import { Package, Clock, CheckCircle, AlertCircle, IndianRupee, MapPin } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { LazyImage } from './LazyImage';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
  userRole: 'artisan' | 'buyer' | 'coordinator';
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  accepted: { label: 'Accepted', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
  in_progress: { label: 'In Progress', color: 'text-purple-600 bg-purple-50', icon: Package },
  quality_check: { label: 'Quality Check', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  shipped: { label: 'Shipped', color: 'text-indigo-600 bg-indigo-50', icon: Package },
  delivered: { label: 'Delivered', color: 'text-teal-600 bg-teal-50', icon: CheckCircle },
  completed: { label: 'Completed', color: 'text-green-700 bg-green-100', icon: CheckCircle },
  disputed: { label: 'Disputed', color: 'text-red-600 bg-red-50', icon: AlertCircle },
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick, userRole }) => {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const otherParty = userRole === 'artisan' ? order.buyerName : order.artisanName;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer p-4 border-l-4 border-terracotta-500"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-deepblue-800 line-clamp-1">
            {order.product.name}
          </h3>
          <p className="text-sm text-gray-600">
            {userRole === 'artisan' ? 'Buyer' : 'Artisan'}: {otherParty}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold ${status.color}`}>
          <StatusIcon size={14} />
          {status.label}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <LazyImage
          src={order.product.photos[0]}
          alt={order.product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            Qty: {order.quantity}
          </p>
          <div className="flex items-center gap-1 text-lg font-bold text-terracotta-600">
            <IndianRupee size={16} />
            <span>{order.totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address - Only for Artisan and Coordinator */}
      {(userRole === 'artisan' || userRole === 'coordinator') && order.deliveryAddress && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-terracotta-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-700 mb-1">Delivery Address:</p>
              <p className="text-xs text-gray-600 leading-relaxed">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString('en-IN')}
        </span>
        {!order.paymentReleased && order.status === 'delivered' && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
            Payment Pending
          </span>
        )}
        {order.paymentReleased && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
            Payment Released
          </span>
        )}
      </div>

      {order.milestones.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            Latest: {order.milestones[order.milestones.length - 1].note}
          </div>
        </div>
      )}
    </div>
  );
};
