import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Printer,
  Search,
  User,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Sparkles,
  ClipboardList,
  Sun,
  Moon,
  PhoneCall,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { user, role, logout, demoLogin } = useAuth();
  const { itemCount, totalBeforeDelivery } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stationery?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" showTagline={true} />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pens, registers, highlighters, folders..."
                className="w-full bg-theme-input text-xs sm:text-sm text-theme-main placeholder:text-theme-muted/60 pl-9 pr-14 py-2.5 rounded-xl border border-theme focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] bg-[#FFCC00] text-[#0B1016] font-bold px-2 py-0.5 rounded-md"
                >
                  Find
                </button>
              )}
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive('/')
                  ? 'bg-[#FFCC00] text-[#0B1016]'
                  : 'text-theme-main hover:text-[#FFCC00] hover:bg-theme-card-hover'
              }`}
            >
              Home
            </Link>

            <Link
              to="/stationery"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive('/stationery')
                  ? 'bg-[#FFCC00] text-[#0B1016]'
                  : 'text-theme-main hover:text-[#FFCC00] hover:bg-theme-card-hover'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop</span>
            </Link>

            <Link
              to="/print"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive('/print')
                  ? 'bg-[#FFCC00] text-[#0B1016]'
                  : 'text-theme-main hover:text-[#FFCC00] hover:bg-theme-card-hover'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Upload & Print</span>
            </Link>

            <Link
              to="/orders"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive('/orders')
                  ? 'bg-[#FFCC00] text-[#0B1016]'
                  : 'text-theme-main hover:text-[#FFCC00] hover:bg-theme-card-hover'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Track Order</span>
            </Link>

            <a
              href="#contact"
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-theme-main hover:text-[#FFCC00] hover:bg-theme-card-hover transition-all"
            >
              Contact
            </a>

            {role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive('/admin')
                    ? 'bg-emerald-500 text-white'
                    : 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Operator</span>
              </Link>
            )}
          </nav>

          {/* Right Action Icons: Theme Toggle, Cart, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="p-2 sm:p-2.5 rounded-xl bg-theme-card border border-theme hover:border-[#FFCC00]/60 text-theme-main transition-transform hover:scale-105 active:scale-95 shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFCC00] animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-theme-card hover:bg-theme-card-hover border border-theme hover:border-[#FFCC00]/50 text-theme-main px-3 py-2 rounded-xl transition-all duration-200 shadow-sm group"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFCC00] group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFCC00] text-[#0B1016] text-[10px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider text-theme-muted font-medium leading-tight">
                  Cart
                </span>
                <span className="text-xs font-bold text-theme-main leading-tight">
                  ₹{totalBeforeDelivery}
                </span>
              </div>
            </Link>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-theme-card hover:bg-theme-card-hover border border-theme text-theme-main px-2.5 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00] font-bold text-xs">
                    {user.name ? user.name[0] : 'S'}
                  </div>
                  <div className="hidden md:flex flex-col text-left max-w-[110px]">
                    <span className="text-xs font-semibold truncate text-theme-main">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-theme-muted truncate">
                      {role === 'admin' ? 'Operator' : user.department || 'Student'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-theme-muted" />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-theme-card border border-theme rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-3 border-b border-theme">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-theme-main truncate">{user.name}</p>
                          {role === 'admin' ? (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                              Operator
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#FFCC00]/20 text-yellow-600 dark:text-[#FFCC00]">
                              Student
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-theme-muted truncate">{user.email}</p>
                        {user.department && (
                          <p className="text-[11px] text-theme-muted truncate mt-0.5">
                            {user.department} {user.academicYear ? `• ${user.academicYear}` : ''}
                          </p>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-theme-main hover:bg-theme-card-hover rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4 text-theme-muted" />
                          Student Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-theme-main hover:bg-theme-card-hover rounded-lg transition-colors"
                        >
                          <ClipboardList className="w-4 h-4 text-theme-muted" />
                          My Orders
                        </Link>
                        {role === 'admin' ? (
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Operator Dashboard
                          </Link>
                        ) : (
                          <button
                            onClick={() => {
                              demoLogin('admin');
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:bg-[#FFCC00]/10 rounded-lg transition-colors text-left"
                          >
                            <Sparkles className="w-4 h-4" />
                            Switch to Operator Mode
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-theme">
                        <button
                          onClick={() => {
                            logout();
                            setProfileOpen(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-theme-muted hover:text-theme-main bg-theme-card border border-theme rounded-xl"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pens, notebooks, files..."
              className="w-full bg-theme-input text-xs text-theme-main placeholder:text-theme-muted/60 pl-9 pr-4 py-2 rounded-xl border border-theme focus:outline-none focus:border-[#FFCC00]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          </form>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-theme bg-theme-card/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          <Link
            to="/print"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold bg-[#FFCC00] text-[#0B1016]"
          >
            <Printer className="w-5 h-5" />
            <span>Upload & Print Document</span>
          </Link>
          <Link
            to="/stationery"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-theme-main hover:bg-theme-card-hover"
          >
            <ShoppingBag className="w-5 h-5 text-[#FFCC00]" />
            <span>Explore Stationery Shop</span>
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-theme-main hover:bg-theme-card-hover"
          >
            <ClipboardList className="w-5 h-5 text-[#FFCC00]" />
            <span>Track My Order</span>
          </Link>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-theme-main hover:bg-theme-card-hover"
          >
            <PhoneCall className="w-5 h-5 text-[#FFCC00]" />
            <span>Campus Location & Contact</span>
          </a>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-theme-main hover:bg-theme-card-hover"
          >
            <User className="w-5 h-5 text-[#FFCC00]" />
            <span>Student Profile</span>
          </Link>
          {role === 'admin' ? (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Operator Dashboard</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                demoLogin('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-[#FFCC00]/10 border border-[#FFCC00]/30"
            >
              <Sparkles className="w-5 h-5" />
              <span>Switch to Operator Mode</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
