import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Printer,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  FileText,
  Layers,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { PrintSettings } from '../types';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    stationerySubtotal,
    printingSubtotal,
    totalBeforeDelivery,
    updateStationeryQty,
    removeStationery,
    removePrintJob,
    updatePrintJobSettings,
    clearCart,
  } = useCart();
  const { printRates, calculatePrintPrice } = useOrders();
  const navigate = useNavigate();

  // Modal or drawer state for editing print job settings in cart
  const [editingPrintJobId, setEditingPrintJobId] = useState<string | null>(null);

  const activeEditingJob = items.find(
    (item) => item.type === 'print' && item.document.id === editingPrintJobId
  );

  const handleEditCopies = (jobId: string, currentSettings: PrintSettings, delta: number) => {
    const newCopies = Math.max(1, currentSettings.copies + delta);
    const newSettings = { ...currentSettings, copies: newCopies };
    const newPrice = calculatePrintPrice(newSettings);
    updatePrintJobSettings(jobId, newSettings, newPrice);
  };

  const handleToggleColor = (jobId: string, currentSettings: PrintSettings) => {
    const newColor: 'bw' | 'color' = currentSettings.colorMode === 'bw' ? 'color' : 'bw';
    const newSettings: PrintSettings = { ...currentSettings, colorMode: newColor };
    const newPrice = calculatePrintPrice(newSettings);
    updatePrintJobSettings(jobId, newSettings, newPrice);
  };

  const handleToggleDuplex = (jobId: string, currentSettings: PrintSettings) => {
    const newDuplex: 'single' | 'double' = currentSettings.duplexMode === 'single' ? 'double' : 'single';
    const newSettings: PrintSettings = { ...currentSettings, duplexMode: newDuplex };
    const newPrice = calculatePrintPrice(newSettings);
    updatePrintJobSettings(jobId, newSettings, newPrice);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-theme-card border border-theme rounded-3xl p-12 shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-theme-input border border-theme flex items-center justify-center text-theme-muted mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#FFCC00]/70" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-main">
            Your shopping cart is empty
          </h2>
          <p className="text-sm text-theme-muted mt-2 max-w-md mx-auto">
            Add exam essentials, registers, or upload college documents for high-speed printing.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/print"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <Printer className="w-4 h-4" />
              <span>Upload Document to Print</span>
            </Link>

            <Link
              to="/stationery"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-theme-input hover:bg-theme-card text-theme-main border border-theme font-bold text-sm px-6 py-3.5 rounded-xl transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#FFCC00]" />
              <span>Browse Stationery Store</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-theme pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-xs font-bold text-[#FFCC00] mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Review</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-main">
            Your Shopping Cart ({itemCount} items)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-500 hover:text-rose-400 font-semibold transition-colors"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item, index) => {
            if (item.type === 'stationery') {
              const { product, quantity } = item;
              const lineTotal = product.price * quantity;

              return (
                <div
                  key={`stationery-${product.id}`}
                  className="bg-theme-card border border-theme rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md transition-all hover:border-theme-muted/50"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-theme-input border border-theme flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFCC00]">
                        {product.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-theme-main line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-theme-muted mt-0.5">
                        ₹{product.price} each • In Stock ({product.stock} available)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-theme">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-theme-input border border-theme rounded-xl p-1">
                      <button
                        onClick={() => updateStationeryQty(product.id, quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-theme-card hover:bg-theme-input text-theme-main flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-[#FFCC00] px-2 min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateStationeryQty(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="w-7 h-7 rounded-lg bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] flex items-center justify-center transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-base font-black text-theme-main">
                        ₹{lineTotal}
                      </span>
                    </div>

                    <button
                      onClick={() => removeStationery(product.id)}
                      className="p-2 text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            }

            if (item.type === 'print') {
              const { document } = item;
              const { settings } = document;

              return (
                <div
                  key={`print-${document.id}`}
                  className="bg-theme-card border border-theme rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-md transition-all hover:border-[#FFCC00]/30"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-theme-input border border-theme flex items-center justify-center flex-shrink-0 text-[#FFCC00]">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFCC00]/15 text-[#FFCC00]">
                            Print Document
                          </span>
                          <span className="text-xs text-theme-muted">
                            {(document.fileSize / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-theme-main line-clamp-1 mt-1">
                          {document.fileName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="text-right">
                        <span className="text-xs text-theme-muted block">Print Total</span>
                        <span className="text-lg font-black text-[#FFCC00]">
                          ₹{document.calculatedPrice}
                        </span>
                      </div>

                      <button
                        onClick={() => removePrintJob(document.id)}
                        className="p-2 text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                        title="Remove print job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline quick-edit settings pills */}
                  <div className="pt-3 border-t border-theme flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Color mode toggle */}
                      <button
                        onClick={() => handleToggleColor(document.id, settings)}
                        className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme hover:border-[#FFCC00] text-theme-main font-medium transition-colors"
                        title="Click to toggle B&W / Color"
                      >
                        Color: <span className="text-[#FFCC00] font-bold uppercase">{settings.colorMode}</span>
                      </button>

                      {/* Paper & Duplex */}
                      <span className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme text-theme-muted">
                        {settings.paperSize} • {settings.orientation}
                      </span>

                      <button
                        onClick={() => handleToggleDuplex(document.id, settings)}
                        className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme hover:border-[#FFCC00] text-theme-main font-medium transition-colors"
                        title="Click to toggle single / double sided"
                      >
                        {settings.duplexMode === 'single' ? 'Single-Sided' : 'Double-Sided'}
                      </button>

                      <span className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme text-theme-muted">
                        {settings.pageSelection === 'all' ? `${settings.pageCount} Pages` : `Range: ${settings.pageRange}`}
                      </span>

                      {settings.binding !== 'none' && (
                        <span className="px-2.5 py-1 rounded-lg bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-[#FFCC00] font-semibold">
                          Binding: {settings.binding}
                        </span>
                      )}
                    </div>

                    {/* Copies Counter */}
                    <div className="flex items-center gap-2 bg-theme-input border border-theme rounded-xl px-2 py-0.5">
                      <span className="text-[11px] text-theme-muted">Copies:</span>
                      <button
                        onClick={() => handleEditCopies(document.id, settings, -1)}
                        className="text-sm font-bold text-theme-muted hover:text-theme-main px-1"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#FFCC00]">
                        {settings.copies}
                      </span>
                      <button
                        onClick={() => handleEditCopies(document.id, settings, 1)}
                        className="text-sm font-bold text-[#FFCC00] hover:text-[#E5B800] px-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

          <div className="flex items-center justify-between pt-4">
            <Link
              to="/stationery"
              className="text-xs font-bold text-[#FFCC00] hover:underline flex items-center gap-1.5"
            >
              <span>+ Add More Stationery</span>
            </Link>

            <Link
              to="/print"
              className="text-xs font-bold text-[#FFCC00] hover:underline flex items-center gap-1.5"
            >
              <span>+ Upload Another Document</span>
            </Link>
          </div>
        </div>

        {/* Order Summary & Proceed Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-theme-card border border-theme rounded-3xl p-6 space-y-6 shadow-xl sticky top-24">
            <h2 className="text-base font-bold text-theme-main border-b border-theme pb-4">
              Order Pricing Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-theme-muted">
                <span>Stationery Subtotal</span>
                <span className="text-theme-main font-bold">₹{stationerySubtotal}</span>
              </div>

              <div className="flex items-center justify-between text-theme-muted">
                <span>Document Printing Subtotal</span>
                <span className="text-theme-main font-bold">₹{printingSubtotal}</span>
              </div>

              <div className="flex items-center justify-between text-theme-muted">
                <span>Delivery Charge</span>
                <span className="text-emerald-500 font-bold">Calculated at next step</span>
              </div>

              <div className="pt-3 border-t border-theme flex items-center justify-between text-sm font-black">
                <span className="text-theme-main">Total Payable</span>
                <span className="text-2xl font-black text-[#FFCC00]">
                  ₹{totalBeforeDelivery}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout/delivery')}
              className="w-full flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] font-bold text-sm py-4 rounded-xl shadow-xl hover:shadow-[#FFCC00]/20 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Proceed to Select Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3.5 rounded-2xl bg-theme-input border border-theme text-[11px] text-theme-muted flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FFCC00] flex-shrink-0 mt-0.5" />
              <span>
                Pick between classroom delivery straight to your desk or instant zero-wait counter pickup in the next step.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
