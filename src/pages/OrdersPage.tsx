import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  Printer,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  Search,
  Filter,
  FileText,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderStatus } from '../types';
import { CENTRAL_SHOP_NAME } from '../data/mockData';

export const OrdersPage: React.FC = () => {
  const { orders, getUserOrders } = useOrders();
  const { addStationery, addPrintJob } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userOrders = getUserOrders(user?.id || 'usr-student-01');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');

  const filteredOrders = userOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.type === 'stationery'
          ? item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
          : item.document.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReorder = (order: typeof userOrders[0]) => {
    order.items.forEach((item) => {
      if (item.type === 'stationery') {
        addStationery(item.product, item.quantity);
      } else if (item.type === 'print') {
        addPrintJob(item.document);
      }
    });
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-theme pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-xs font-bold text-[#FFCC00] mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Student Order History</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-main">
            My Orders & Print Jobs
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Track deliveries, print receipts, and reorder previous stationery batches
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID or item..."
            className="w-full bg-theme-input text-xs text-theme-main placeholder-theme-muted/60 pl-9 pr-4 py-2.5 rounded-xl border border-theme focus:outline-none focus:border-[#FFCC00]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-theme-card border border-theme rounded-3xl p-12 text-center max-w-md mx-auto my-8">
          <ClipboardList className="w-12 h-12 text-theme-muted mx-auto mb-4" />
          <h3 className="text-base font-bold text-theme-main">No orders found</h3>
          <p className="text-xs text-theme-muted mt-1">
            You haven&apos;t placed any stationery orders or print requests matching this filter.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/print"
              className="text-xs font-bold bg-[#FFCC00] text-[#0B1016] px-4 py-2.5 rounded-xl hover:bg-[#E5B800] transition-colors"
            >
              Print Document
            </Link>
            <Link
              to="/stationery"
              className="text-xs font-bold bg-theme-input text-theme-main border border-theme px-4 py-2.5 rounded-xl hover:bg-theme-card transition-colors"
            >
              Shop Stationery
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isClassroom = order.deliveryDetails.method === 'classroom_delivery';

            return (
              <div
                key={order.id}
                className="bg-theme-card border border-theme hover:border-[#FFCC00]/40 rounded-3xl p-5 sm:p-6 shadow-md transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-theme-main">
                      #{order.id}
                    </span>
                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/30">
                      {order.status}
                    </span>
                    <span className="text-xs text-theme-muted hidden sm:inline">
                      • {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-[#FFCC00]">
                      ₹{order.totalAmount}
                    </span>
                    <span className="text-[11px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => {
                    if (item.type === 'stationery') {
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs text-theme-muted">
                          <span className="flex items-center gap-2">
                            <ShoppingBag className="w-3.5 h-3.5 text-[#FFCC00]" />
                            <span className="text-theme-main font-medium">{item.product.name}</span> × {item.quantity}
                          </span>
                          <span>₹{item.product.price * item.quantity}</span>
                        </div>
                      );
                    }
                    if (item.type === 'print') {
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs text-theme-muted">
                          <span className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-[#FFCC00]" />
                            <span className="text-theme-main font-medium">{item.document.fileName}</span>{' '}
                            <span className="text-[10px] text-theme-muted">
                              ({item.document.settings.colorMode.toUpperCase()}, {item.document.settings.copies} copy)
                            </span>
                          </span>
                          <span>₹{item.document.calculatedPrice}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Bottom Bar: Delivery destination and Action Buttons */}
                <div className="pt-3 border-t border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-theme-muted">
                    <MapPin className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                    <span>
                      {isClassroom
                        ? (order.deliveryDetails.formattedDestination || `${order.deliveryDetails.building}, ${order.deliveryDetails.classroom}`)
                        : CENTRAL_SHOP_NAME}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-input border border-theme text-theme-muted hover:text-theme-main transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#FFCC00]" />
                      <span>Reorder</span>
                    </button>

                    <Link
                      to={`/orders/${order.id}`}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] font-bold transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

