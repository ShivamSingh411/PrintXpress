import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  FileText,
  Home,
  Store,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { CENTRAL_SHOP_NAME, OFFICIAL_COLLEGE_ADDRESS } from '../data/mockData';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const { getOrderById, orders } = useOrders();

  const order = orderId ? getOrderById(orderId) : orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-theme-main">Order not found</h2>
        <Link to="/orders" className="text-xs text-[#FFCC00] mt-2 block underline">
          View all your orders
        </Link>
      </div>
    );
  }

  const handlePrintReceipt = () => {
    window.print();
  };

  const isPickup = order.deliveryDetails.method === 'counter_pickup' || order.deliveryDetails.category === 'shop';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Card Header */}
      <div className="bg-theme-card border border-theme rounded-3xl p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#FFCC00]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto mb-5 shadow-sm">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-[#FFCC00]">
          Order Confirmed • Simulated Payment
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-theme-main mt-1">
          Thank you for your order!
        </h1>
        <p className="text-sm text-theme-muted mt-2 max-w-md mx-auto">
          Order <span className="text-yellow-600 dark:text-[#FFCC00] font-bold">#{order.id}</span> has been dispatched to {CENTRAL_SHOP_NAME}.
        </p>

        {/* Highlighted Order ID and Estimated Time */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-theme-input border border-theme">
            <span className="text-[11px] text-theme-muted block font-medium">Order Number</span>
            <span className="text-sm font-black text-yellow-600 dark:text-[#FFCC00]">{order.id}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-theme-input border border-theme">
            <span className="text-[11px] text-theme-muted block font-medium">Payment Mode</span>
            <span className="text-sm font-bold text-emerald-500">{order.paymentStatus}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-theme-input border border-theme">
            <span className="text-[11px] text-theme-muted block font-medium">Estimated Ready</span>
            <span className="text-sm font-bold text-theme-main">{order.estimatedTime}</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/orders/${order.id}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
          >
            <Clock className="w-4 h-4" />
            <span>Track Live Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handlePrintReceipt}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-theme-input hover:bg-theme-card-hover text-theme-main border border-theme font-semibold text-xs px-5 py-3.5 rounded-xl transition-all"
          >
            <Printer className="w-4 h-4 text-[#FFCC00]" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Order Itemized Summary Card */}
      <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
        <h2 className="text-base font-bold text-theme-main border-b border-theme pb-4">
          Order Details & Campus Destination
        </h2>

        {/* Destination Box */}
        <div className="p-4 rounded-2xl bg-theme-input border border-theme flex items-start gap-3">
          {isPickup ? (
            <Store className="w-5 h-5 text-[#FFCC00] flex-shrink-0 mt-0.5" />
          ) : (
            <MapPin className="w-5 h-5 text-[#FFCC00] flex-shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <span className="font-bold text-theme-main">
              {isPickup ? 'Central Shop Counter Pickup' : 'Campus Delivery Destination'}
            </span>
            <p className="font-semibold text-yellow-600 dark:text-[#FFCC00]">
              {order.deliveryDetails.formattedDestination || order.deliveryDetails.destinationName || 'Campus Location'}
            </p>
            <p className="text-theme-muted">
              Recipient: <span className="text-theme-main font-medium">{order.deliveryDetails.studentName}</span> ({order.deliveryDetails.phone})
            </p>
            {isPickup && (
              <p className="text-theme-muted text-[11px] pt-0.5">
                Location: {CENTRAL_SHOP_NAME}, {OFFICIAL_COLLEGE_ADDRESS}
              </p>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
            Items in this Order ({order.items.length})
          </h3>
          {order.items.map((item, idx) => {
            if (item.type === 'stationery') {
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-2 border-b border-theme/60"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-[#FFCC00]" />
                    <span className="font-medium text-theme-main">
                      {item.product.name} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-theme-main">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              );
            }
            if (item.type === 'print') {
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-2 border-b border-theme/60"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#FFCC00]" />
                    <div>
                      <span className="font-medium text-theme-main">
                        {item.document.fileName}
                      </span>
                      <span className="text-[10px] text-theme-muted block">
                        {item.document.settings.colorMode.toUpperCase()} • {item.document.settings.paperSize} • {item.document.settings.duplexMode} • {item.document.settings.copies} copy(s)
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-yellow-600 dark:text-[#FFCC00]">
                    ₹{item.document.calculatedPrice}
                  </span>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Financial Breakdown */}
        <div className="pt-2 border-t border-theme space-y-2 text-xs">
          <div className="flex justify-between text-theme-muted">
            <span>Stationery Charges:</span>
            <span className="text-theme-main font-medium">₹{order.stationerySubtotal}</span>
          </div>
          <div className="flex justify-between text-theme-muted">
            <span>Document Printing Charges:</span>
            <span className="text-theme-main font-medium">₹{order.printingSubtotal}</span>
          </div>
          <div className="flex justify-between text-theme-muted">
            <span>Campus Delivery:</span>
            <span className="text-theme-main font-medium">{order.deliveryFee === 0 ? 'FREE (₹0)' : `₹${order.deliveryFee}`}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-theme-main pt-2 border-t border-theme">
            <span>Total Amount:</span>
            <span className="text-yellow-600 dark:text-[#FFCC00] text-lg">₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-theme-muted hover:text-[#FFCC00] font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Campus Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
