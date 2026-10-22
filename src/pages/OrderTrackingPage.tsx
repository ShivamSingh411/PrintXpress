import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  Truck,
  Store,
  Printer,
  ShoppingBag,
  ArrowLeft,
  MapPin,
  Sparkles,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { OrderStatus } from '../types';
import { CENTRAL_SHOP_NAME, OFFICIAL_COLLEGE_ADDRESS } from '../data/mockData';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById, updateOrderStatus, orders } = useOrders();
  const { addStationery, addPrintJob } = useCart();
  const navigate = useNavigate();

  const order = id ? getOrderById(id) : orders[0];

  const [simulatorStatus, setSimulatorStatus] = useState<OrderStatus>(order?.status || 'Requested');

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-theme-main">Order not found</h2>
        <Link to="/orders" className="text-xs text-[#FFCC00] mt-2 block underline">
          Back to all orders
        </Link>
      </div>
    );
  }

  const isClassroom = order.deliveryDetails.method === 'classroom_delivery';

  // Specific tracking steps based on delivery method
  const classroomSteps: OrderStatus[] = [
    'Requested',
    'Processing',
    'Printing Complete',
    'On the Way',
    'Delivered',
  ];

  const counterSteps: OrderStatus[] = [
    'Requested',
    'Processing',
    'Printing Complete',
    'Ready for Pickup',
    'Collected',
  ];

  const activeSteps = isClassroom ? classroomSteps : counterSteps;
  const currentStepIndex = activeSteps.indexOf(order.status);

  // Status Simulator for evaluation/demo
  const handleSimulatorChange = (newStatus: OrderStatus) => {
    setSimulatorStatus(newStatus);
    updateOrderStatus(order.id, newStatus, `Order status updated to: ${newStatus}`);
  };

  const handleReorder = () => {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-theme pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-1.5 text-xs text-theme-muted hover:text-[#FFCC00] mb-2 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All My Orders</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-main">
              Tracking Order #{order.id}
            </h1>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/30">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-theme-muted mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReorder}
            className="flex items-center gap-1.5 bg-theme-input hover:bg-theme-card text-theme-main border border-theme text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span>Reorder Items</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Demo Status Simulator */}
      <div className="bg-theme-card border border-[#FFCC00]/40 rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase text-[#FFCC00]">
                  Order Status Simulator (Demo & Staff Controls)
                </span>
                <span className="text-[10px] bg-theme-input text-theme-muted px-2 py-0.5 rounded border border-theme">
                  Interactive Control
                </span>
              </div>
              <p className="text-xs text-theme-muted mt-0.5">
                Simulate status transitions to inspect live order progress updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={order.status}
              aria-label="Advance order status"
              onChange={(e) => handleSimulatorChange(e.target.value as OrderStatus)}
              className="bg-theme-input text-xs font-bold text-[#FFCC00] border border-theme rounded-xl px-3 py-2 focus:border-[#FFCC00] focus:outline-none"
            >
              {activeSteps.map((step) => (
                <option key={step} value={step}>
                  Advance to: {step}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Timeline Stepper Card */}
      <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <div>
            <h2 className="text-base font-bold text-theme-main flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFCC00]" />
              Live Order Progress
            </h2>
            <p className="text-xs text-theme-muted mt-0.5">
              Estimated Completion: <span className="text-[#FFCC00] font-bold">{order.estimatedTime}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-theme-muted block">Method</span>
            <span className="text-xs font-bold text-theme-main">
              {isClassroom ? 'Campus Delivery' : 'Counter Pickup'}
            </span>
          </div>
        </div>

        {/* Step-by-Step Stepper Line */}
        <div className="relative">
          <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-1 bg-theme-input -translate-y-1/2 z-0">
            <div
              className="h-full bg-[#FFCC00] transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentStepIndex / (activeSteps.length - 1)) * 100)}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
            {activeSteps.map((stepName, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div
                  key={stepName}
                  className="flex sm:flex-col items-center gap-3 sm:text-center group"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${
                      isCurrent
                        ? 'bg-[#FFCC00] text-[#0B1016] ring-4 ring-[#FFCC00]/25 scale-110'
                        : isCompleted
                        ? 'bg-[#FFCC00] text-[#0B1016]'
                        : 'bg-theme-input text-theme-muted border border-theme'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5 stroke-[2.5]" /> : index + 1}
                  </div>

                  <div>
                    <p
                      className={`text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'text-[#FFCC00]'
                          : isCompleted
                          ? 'text-theme-main'
                          : 'text-theme-muted/60'
                      }`}
                    >
                      {stepName}
                    </p>
                    {isCurrent && (
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Timeline Events History */}
        <div className="pt-4 border-t border-theme space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
            Activity Log & Timestamps
          </h3>
          <div className="space-y-2.5">
            {order.timeline.map((event, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-theme-input border border-theme text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-[#FFCC00] mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-theme-main">{event.status}</span>
                    <span className="text-[11px] text-theme-muted">{event.timestamp}</span>
                  </div>
                  <p className="text-theme-muted text-[11px] mt-0.5">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recipient & Items Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipient & Destination Info */}
        <div className="bg-theme-card border border-theme rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-theme-main flex items-center gap-2 border-b border-theme pb-3">
            <MapPin className="w-4 h-4 text-[#FFCC00]" />
            <span>Delivery Destination</span>
          </h3>

          <div className="text-xs space-y-3 text-theme-muted">
            <div>
              <span className="font-semibold text-theme-main">Recipient: </span>
              <span>{order.deliveryDetails.studentName} ({order.deliveryDetails.phone})</span>
            </div>

            {isClassroom ? (
              <>
                <div className="p-3 rounded-xl bg-theme-input border border-theme space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFCC00] block">
                    Campus Destination
                  </span>
                  <p className="text-sm font-bold text-theme-main">
                    {order.deliveryDetails.formattedDestination || `${order.deliveryDetails.building} → ${order.deliveryDetails.floor} → ${order.deliveryDetails.classroom}`}
                  </p>
                  {order.deliveryDetails.department && (
                    <p className="text-xs text-theme-muted">
                      Program: {order.deliveryDetails.department}
                      {order.deliveryDetails.academicYear && ` • Year: ${order.deliveryDetails.academicYear}`}
                    </p>
                  )}
                </div>

                {order.deliveryDetails.instructions && (
                  <div>
                    <span className="font-semibold text-theme-main">Delivery Instructions: </span>
                    <span>{order.deliveryDetails.instructions}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="p-3 rounded-xl bg-theme-input border border-theme space-y-1">
                <div className="flex items-center gap-2 text-theme-main font-bold">
                  <Store className="w-4 h-4 text-[#FFCC00]" />
                  <span>{CENTRAL_SHOP_NAME}</span>
                </div>
                <p className="text-[11px] text-theme-muted">
                  Reference point for counter collection in the middle of campus.
                </p>
                <p className="text-[10px] text-theme-muted mt-1">
                  {OFFICIAL_COLLEGE_ADDRESS}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Payment Summary */}
        <div className="bg-theme-card border border-theme rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-theme-main flex items-center gap-2 border-b border-theme pb-3">
            <ShoppingBag className="w-4 h-4 text-[#FFCC00]" />
            <span>Payment Breakdown</span>
          </h3>

          <div className="text-xs space-y-1.5 text-theme-muted">
            <div className="flex justify-between">
              <span>Stationery Subtotal:</span>
              <span className="text-theme-main font-medium">₹{order.stationerySubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Document Printing:</span>
              <span className="text-theme-main font-medium">₹{order.printingSubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="text-theme-main font-medium">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-theme font-bold text-sm text-theme-main">
              <span>Total Paid:</span>
              <span className="text-[#FFCC00]">₹{order.totalAmount} ({order.paymentStatus})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

