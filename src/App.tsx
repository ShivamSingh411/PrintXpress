import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { StationeryPage } from './pages/StationeryPage';
import { PrintPage } from './pages/PrintPage';
import { CartPage } from './pages/CartPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';

// Protected Route Guard for Admin
const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, demoLogin } = useAuth();

  if (role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-theme-card border border-theme rounded-3xl p-8 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
            🔒
          </div>
          <h2 className="text-xl font-bold text-theme-main">
            Staff & Operator Access Required
          </h2>
          <p className="text-xs text-theme-muted leading-relaxed">
            This section is restricted to Central Campus Stationery & Print Shop operators and reprographics personnel.
          </p>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => demoLogin('admin')}
              className="w-full bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] text-xs font-bold py-3 rounded-xl transition-all shadow-md"
            >
              Authorize as Demo Operator (1-Click)
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-theme-input text-theme-muted hover:text-theme-main text-xs font-semibold py-2.5 rounded-xl border border-theme transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-theme-main text-theme-main transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public & Student Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/stationery" element={<StationeryPage />} />
          <Route path="/print" element={<PrintPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/delivery" element={<DeliveryPage />} />
          <Route path="/checkout/payment" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderTrackingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Admin Operator Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminDashboard />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRouteGuard>
                <AdminOrdersPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRouteGuard>
                <AdminProductsPage />
              </AdminRouteGuard>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <AppContent />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
