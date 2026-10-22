import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { MapPin, ShieldCheck, ArrowRight, Store } from 'lucide-react';
import { OFFICIAL_COLLEGE_ADDRESS, CENTRAL_SHOP_NAME } from '../../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-theme-card border-t border-theme text-theme-muted mt-auto transition-colors duration-200">
      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-theme-muted leading-relaxed">
              Campus printing and stationery service delivering directly to classrooms, hostels, and canteens, or ready for counter collection.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-theme-input border border-theme text-[11px] text-[#FFCC00] font-medium">
              <Store className="w-3.5 h-3.5" />
              <span>Campus Stationery & Reprographics</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main mb-4">
              Quick Services
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/print" className="hover:text-[#FFCC00] transition-colors">
                  Upload & Print Documents
                </Link>
              </li>
              <li>
                <Link to="/stationery" className="hover:text-[#FFCC00] transition-colors">
                  Stationery Store
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#FFCC00] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#FFCC00] transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Location */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-theme-main mb-3">
              Campus Location & Pickup Point
            </h3>
            <div className="p-4 rounded-2xl bg-theme-input border border-theme space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFCC00] flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold text-theme-main">{CENTRAL_SHOP_NAME}</p>
                  <p className="text-theme-muted mt-1">{OFFICIAL_COLLEGE_ADDRESS}</p>
                </div>
              </div>
              <p className="text-[11px] text-theme-muted pt-1 border-t border-theme/60">
                Central pickup point for counter orders and campus delivery hub.
              </p>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] text-emerald-500 hover:underline font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Operator Portal</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-theme flex flex-col sm:flex-row items-center justify-between text-xs text-theme-muted/70 gap-4">
          <p>© {new Date().getFullYear()} PrintXpress. Central Campus Stationery & Print Shop.</p>
          <div className="flex gap-4">
            <span className="hover:text-theme-main cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-theme-main cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-theme-main cursor-pointer">Campus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
