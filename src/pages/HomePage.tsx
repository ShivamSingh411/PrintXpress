import React from 'react';
import { Link } from 'react-router-dom';
import {
  Printer,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle,
  FileText,
  Package,
  Layers,
  ChevronRight,
  Store,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { OFFICIAL_COLLEGE_ADDRESS, CENTRAL_SHOP_NAME } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { getUserOrders } = useOrders();
  const { user } = useAuth();
  const myRecentOrders = getUserOrders(user?.id || 'usr-student-01').slice(0, 1);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-12 sm:pb-16">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] bg-[#FFCC00]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-card border border-theme text-xs font-semibold text-yellow-600 dark:text-[#FFCC00] mb-6 shadow-sm">
            <Store className="w-3.5 h-3.5" />
            <span>Central Campus Stationery & Print Shop</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-theme-main leading-[1.1] mb-6">
            Your Campus. Your Prints.{' '}
            <span className="text-[#FFCC00] inline-block relative">
              Your Convenience.
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#FFCC00]/40"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 9C50 3 150 3 197 9"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-theme-muted max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
            Print assignments, order stationery, and get everything delivered to your classroom or collect it from the central campus shop.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              to="/print"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] text-base sm:text-lg font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-[#FFCC00]/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Printer className="w-5 h-5 stroke-[2.5]" />
              <span>Upload & Print</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/stationery"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-theme-card hover:bg-theme-card-hover text-theme-main hover:text-[#FFCC00] text-base sm:text-lg font-semibold px-8 py-4 rounded-2xl border border-theme hover:border-[#FFCC00]/50 transition-all duration-200 shadow-sm"
            >
              <ShoppingBag className="w-5 h-5 text-[#FFCC00]" />
              <span>Explore Stationery</span>
            </Link>
          </div>

          {/* Key Campus Service Highlights Strip */}
          <div className="mt-12 pt-8 border-t border-theme/60 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-theme-card border border-theme shadow-sm">
              <p className="text-lg sm:text-xl font-black text-[#FFCC00]">₹2</p>
              <p className="text-xs text-theme-muted mt-0.5 font-medium">Per A4 B&W Page</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-theme-card border border-theme shadow-sm">
              <p className="text-lg sm:text-xl font-black text-[#FFCC00]">Direct</p>
              <p className="text-xs text-theme-muted mt-0.5 font-medium">Classroom Delivery</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-theme-card border border-theme shadow-sm">
              <p className="text-lg sm:text-xl font-black text-[#FFCC00]">₹0 Fee</p>
              <p className="text-xs text-theme-muted mt-0.5 font-medium">Counter Collection</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-theme-card border border-theme shadow-sm">
              <p className="text-lg sm:text-xl font-black text-[#FFCC00]">All Formats</p>
              <p className="text-xs text-theme-muted mt-0.5 font-medium">PDF, DOCX, Slides</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Recent Order Banner (if present) */}
      {myRecentOrders.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-theme-card border border-theme rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00] flex-shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#FFCC00]">
                    Recent Order: {myRecentOrders[0].id}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FFCC00]/15 text-yellow-600 dark:text-[#FFCC00] border border-[#FFCC00]/30">
                    {myRecentOrders[0].status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-theme-main mt-0.5">
                  {myRecentOrders[0].deliveryDetails.formattedDestination ||
                    (myRecentOrders[0].deliveryDetails.method === 'classroom_delivery'
                      ? 'Campus Classroom Delivery'
                      : 'Central Shop Counter Pickup')}
                </p>
              </div>
            </div>
            <Link
              to={`/orders/${myRecentOrders[0].id}`}
              className="flex items-center gap-2 text-xs font-bold bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] px-4 py-2.5 rounded-xl transition-all shadow-sm flex-shrink-0"
            >
              <span>Track Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#FFCC00]">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-main mt-1">
            How PrintXpress Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00] font-black text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-theme-main mb-2">
                Upload or Choose
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Upload your document (PDF, DOCX, PPTX slides, image) or choose stationery from our campus store.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00] font-black text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-theme-main mb-2">
                Select Options & Destination
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Customize colors, paper sizes, duplex mode, and select your campus building, classroom, hostel, or counter pickup.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00] font-black text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-theme-main mb-2">
                Track & Collect
              </h3>
              <p className="text-xs text-theme-muted leading-relaxed">
                Track live progress as your order is printed, bound, and delivered straight to your classroom or made ready at the shop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options (2 Attractive Cards) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1: Document Printing */}
          <div className="bg-theme-card border border-theme hover:border-[#FFCC00]/50 rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-md group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00] group-hover:scale-110 transition-transform">
                <Printer className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-theme-main">
                  Document Printing
                </h3>
                <p className="text-xs sm:text-sm text-theme-muted mt-2 leading-relaxed">
                  High-speed laser printing for lab records, project reports, assignments, and study slides. Supports single or double-sided printing, spiral binding, and hardcover finishing.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-theme-muted">
                <span className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme">A4 & A3 Papers</span>
                <span className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme">B&W and Full Color</span>
                <span className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme">Spiral Binding</span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-theme">
              <Link
                to="/print"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] px-5 py-3 rounded-xl transition-all shadow-sm"
              >
                <span>Upload & Print Document</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Campus Stationery */}
          <div className="bg-theme-card border border-theme hover:border-[#FFCC00]/50 rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 shadow-md group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-theme-main">
                  Campus Stationery
                </h3>
                <p className="text-xs sm:text-sm text-theme-muted mt-2 leading-relaxed">
                  Everyday academic essentials including registers, gel pens, report folders, sticky notes, geometry boxes, and practical graph sheets delivered directly to your desk.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-theme-muted">
                <span className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme">Pens & Registers</span>
                <span className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme">Files & Binders</span>
                <span className="px-2.5 py-1 rounded-lg bg-theme-input border border-theme">Exam Essentials</span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-theme">
              <Link
                to="/stationery"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-theme-input hover:bg-theme-card-hover border border-theme text-theme-main hover:text-[#FFCC00] px-5 py-3 rounded-xl transition-all shadow-sm"
              >
                <span>Explore Stationery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Campus Location Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-10 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFCC00]">
                <MapPin className="w-4 h-4" />
                <span>Serving students across campus</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-main">
                {CENTRAL_SHOP_NAME}
              </h2>
              <p className="text-xs sm:text-sm text-theme-muted leading-relaxed">
                {OFFICIAL_COLLEGE_ADDRESS}
              </p>
              <p className="text-xs text-theme-muted pt-1">
                Centrally situated on campus to serve as the dispatch hub for all classroom deliveries, hostel drop-offs, and instant counter pickups.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
              <Link
                to="/print"
                className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] px-6 py-3.5 rounded-xl transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </Link>
              <Link
                to="/stationery"
                className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold bg-theme-input hover:bg-theme-card-hover text-theme-main border border-theme px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-[#FFCC00]" />
                <span>Shop Stationery</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
