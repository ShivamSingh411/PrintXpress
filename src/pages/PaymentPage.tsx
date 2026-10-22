import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Building2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Lock,
  AlertTriangle,
  Store,
  MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { PaymentMethod, DeliveryDetails } from '../types';
import { CENTRAL_SHOP_NAME } from '../data/mockData';

export const PaymentPage: React.FC = () => {
  const { items, stationerySubtotal, printingSubtotal, totalBeforeDelivery } = useCart();
  const { createOrder, printRates } = useOrders();
  const navigate = useNavigate();

  // Retrieve delivery details from sessionStorage
  const [deliveryDetails] = useState<DeliveryDetails | null>(() => {
    try {
      const raw = sessionStorage.getItem('printxpress_pending_delivery');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // If no items or delivery details, navigate back
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    } else if (!deliveryDetails) {
      navigate('/checkout/delivery');
    }
  }, [items, deliveryDetails, navigate]);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('demo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDoneStep, setShowDoneStep] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const isShopPickup =
    deliveryDetails?.method === 'counter_pickup' || deliveryDetails?.category === 'shop';
  const deliveryFee = isShopPickup ? 0 : printRates.classroomDeliveryFee;
  const finalPayable = totalBeforeDelivery + deliveryFee;

  const handleStartPayment = async () => {
    if (!deliveryDetails) return;
    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        const order = await createOrder(deliveryDetails, selectedMethod);
        setConfirmedOrderId(order.id);
        setIsProcessing(false);
        setShowDoneStep(true);

        // Fire celebratory confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      } catch (e) {
        console.error(e);
        setIsProcessing(false);
      }
    }, 1100);
  };

  const handleFinishAndTrack = () => {
    sessionStorage.removeItem('printxpress_pending_delivery');
    if (confirmedOrderId) {
      navigate(`/order-success?id=${confirmedOrderId}`);
    } else {
      navigate('/orders');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-theme pb-6">
        <button
          onClick={() => navigate('/checkout/delivery')}
          className="inline-flex items-center gap-1.5 text-xs text-theme-muted hover:text-[#FFCC00] mb-2 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Delivery Selection</span>
        </button>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-main">
          Checkout & Payment
        </h1>
        <p className="text-sm text-theme-muted mt-1">
          Complete simulated campus payment to confirm your order
        </p>
      </div>

      {/* Transparent Demo Notice Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-700 dark:text-amber-300 text-xs sm:text-sm">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
        <div>
          <span className="font-bold">Simulated Campus Payment Gateway:</span>{' '}
          Demo payment only. No real money has been charged. Do not enter actual credit cards, CVVs, or banking credentials.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Payment Options */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <h3 className="text-base font-bold text-theme-main flex items-center justify-between border-b border-theme pb-4">
              <span>Select Payment Method</span>
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Secure Demo Gateway
              </span>
            </h3>

            {/* Payment Method Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Option 1: Demo 1-Click Payment */}
              <div
                onClick={() => setSelectedMethod('demo')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedMethod === 'demo'
                    ? 'border-[#FFCC00] bg-[#FFCC00]/10 shadow-sm'
                    : 'border-theme bg-theme-input hover:border-theme/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FFCC00]/20 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00]">
                    <Sparkles className="w-5 h-5 text-yellow-600 dark:text-[#FFCC00]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase rounded px-2 py-0.5 bg-[#FFCC00] text-[#0B1016]">
                    Instant Demo
                  </span>
                </div>
                <h4 className="text-sm font-bold text-theme-main">1-Click Simulated Payment</h4>
                <p className="text-[11px] text-theme-muted mt-1">
                  Instant authorization and order processing.
                </p>
              </div>

              {/* Option 2: UPI Simulation */}
              <div
                onClick={() => setSelectedMethod('upi')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedMethod === 'upi'
                    ? 'border-[#FFCC00] bg-[#FFCC00]/10 shadow-sm'
                    : 'border-theme bg-theme-input hover:border-theme/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase rounded px-2 py-0.5 bg-theme-card border border-theme text-theme-muted">
                    GPay / PhonePe
                  </span>
                </div>
                <h4 className="text-sm font-bold text-theme-main">UPI / QR Code</h4>
                <p className="text-[11px] text-theme-muted mt-1">
                  Simulated campus UPI scanner flow.
                </p>
              </div>

              {/* Option 3: Card Simulation */}
              <div
                onClick={() => setSelectedMethod('card')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedMethod === 'card'
                    ? 'border-[#FFCC00] bg-[#FFCC00]/10 shadow-sm'
                    : 'border-theme bg-theme-input hover:border-theme/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase rounded px-2 py-0.5 bg-theme-card border border-theme text-theme-muted">
                    Debit / Credit
                  </span>
                </div>
                <h4 className="text-sm font-bold text-theme-main">Debit / Credit Card</h4>
                <p className="text-[11px] text-theme-muted mt-1">
                  Simulated test card verification.
                </p>
              </div>

              {/* Option 4: Net Banking Simulation */}
              <div
                onClick={() => setSelectedMethod('netbanking')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedMethod === 'netbanking'
                    ? 'border-[#FFCC00] bg-[#FFCC00]/10 shadow-sm'
                    : 'border-theme bg-theme-input hover:border-theme/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase rounded px-2 py-0.5 bg-theme-card border border-theme text-theme-muted">
                    Net Banking
                  </span>
                </div>
                <h4 className="text-sm font-bold text-theme-main">Campus Net Banking</h4>
                <p className="text-[11px] text-theme-muted mt-1">
                  Simulated bank portal authorization.
                </p>
              </div>

            </div>

            {/* Simulated Payment Method Visual Panels */}
            {selectedMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-theme-input border border-theme space-y-2.5">
                <p className="text-xs font-bold text-theme-main">Simulated UPI Checkout:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    value="student.campus@upi (Simulated)"
                    className="flex-1 bg-theme-card text-xs text-theme-muted border border-theme rounded-xl px-3 py-2 cursor-not-allowed"
                  />
                  <span className="text-xs text-[#FFCC00] font-bold px-3">Ready</span>
                </div>
                <p className="text-[11px] text-theme-muted">
                  Click &ldquo;Complete Demo Payment&rdquo; to simulate instant UPI approval.
                </p>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-theme-input border border-theme space-y-2.5">
                <p className="text-xs font-bold text-theme-main">Simulated Test Card:</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    disabled
                    value="4111 •••• •••• 1111 (Test Card)"
                    className="w-full bg-theme-card text-xs text-theme-muted border border-theme rounded-xl px-3 py-2 cursor-not-allowed"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      disabled
                      value="12/28"
                      className="bg-theme-card text-xs text-theme-muted border border-theme rounded-xl px-3 py-2 cursor-not-allowed"
                    />
                    <input
                      type="text"
                      disabled
                      value="•••"
                      className="bg-theme-card text-xs text-theme-muted border border-theme rounded-xl px-3 py-2 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-theme-input border border-theme space-y-2">
                <p className="text-xs font-bold text-theme-main">Select Simulated Bank:</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-theme-card border border-[#FFCC00]/50 text-yellow-600 dark:text-[#FFCC00] font-bold">
                    SBI Student
                  </div>
                  <div className="p-2 rounded-xl bg-theme-card border border-theme text-theme-muted">
                    HDFC Bank
                  </div>
                  <div className="p-2 rounded-xl bg-theme-card border border-theme text-theme-muted">
                    ICICI Bank
                  </div>
                </div>
              </div>
            )}

            {/* Destination Recap */}
            {deliveryDetails && (
              <div className="pt-4 border-t border-theme text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FFCC00]" />
                  <p className="font-bold text-theme-main">
                    Destination: {deliveryDetails.formattedDestination || deliveryDetails.destinationName}
                  </p>
                </div>
                <p className="text-theme-muted pl-6">
                  Recipient: <span className="text-theme-main font-semibold">{deliveryDetails.studentName}</span> ({deliveryDetails.phone})
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Final Summary & Payment Button */}
        <div className="lg:col-span-4">
          <div className="bg-theme-card border border-theme rounded-3xl p-6 space-y-6 shadow-xl sticky top-24">
            <h2 className="text-base font-bold text-theme-main border-b border-theme pb-4">
              Payment Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-theme-muted">
                <span>Stationery Items</span>
                <span className="text-theme-main font-bold">₹{stationerySubtotal}</span>
              </div>

              <div className="flex items-center justify-between text-theme-muted">
                <span>Document Printing</span>
                <span className="text-theme-main font-bold">₹{printingSubtotal}</span>
              </div>

              <div className="flex items-center justify-between text-theme-muted">
                <span>Delivery Charge</span>
                <span className={deliveryFee === 0 ? 'text-emerald-500 font-bold' : 'text-theme-main font-bold'}>
                  {deliveryFee === 0 ? 'FREE (₹0)' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-theme flex items-center justify-between text-sm font-black">
                <span className="text-theme-main">Final Payable Amount</span>
                <span className="text-2xl font-black text-[#FFCC00]">
                  ₹{finalPayable}
                </span>
              </div>
            </div>

            {/* Interactive Payment Flow Buttons */}
            {!showDoneStep ? (
              <button
                type="button"
                onClick={handleStartPayment}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-[#FFCC00]/20 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B1016] border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Demo Payment</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Simulated payment approved! Order #{confirmedOrderId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleFinishAndTrack}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-4 rounded-xl shadow-lg transition-all"
                >
                  <span>Done • View Order Confirmation & Track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-[11px] text-center text-theme-muted leading-relaxed">
              &ldquo;Paid — Demo&rdquo; status will be attached to order #{confirmedOrderId || 'PX-XXXX'}.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
