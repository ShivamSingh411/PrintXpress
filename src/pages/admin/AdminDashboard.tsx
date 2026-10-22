import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShoppingBag,
  Printer,
  Clock,
  TrendingUp,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Settings,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { OrderStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { orders, products, printRates, updateOrderStatus } = useOrders();
  const { role, demoLogin } = useAuth();

  // Metrics computation
  const totalOrders = orders.length;
  const newRequests = orders.filter((o) => o.status === 'Requested').length;
  const processing = orders.filter((o) => o.status === 'Processing').length;
  const printingComplete = orders.filter((o) => o.status === 'Printing Complete').length;
  const readyPickup = orders.filter((o) => o.status === 'Ready for Pickup').length;
  const onTheWay = orders.filter((o) => o.status === 'On the Way').length;
  const completed = orders.filter((o) => ['Delivered', 'Collected'].includes(o.status)).length;
  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Operator Role notice */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-theme-card to-theme-card border border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Reprographics Station Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-main">
            Operator Dashboard
          </h1>
          <p className="text-xs text-theme-muted mt-1">
            Real-time management for document printing queues, delivery dispatch, and stationery inventory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-bold bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] px-4 py-2.5 rounded-xl transition-all shadow-md"
          >
            <span>Order Processing Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center gap-1.5 text-xs font-bold bg-theme-input hover:bg-theme-card text-theme-main border border-theme px-4 py-2.5 rounded-xl transition-all"
          >
            <Settings className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span>Manage Products & Rates</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-theme-card border border-theme rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-theme-muted">Total Orders</span>
            <Package className="w-4 h-4 text-[#FFCC00]" />
          </div>
          <p className="text-2xl font-black text-theme-main mt-2">{totalOrders}</p>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">Live synced</span>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-theme-muted">New Requests</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <p className="text-2xl font-black text-amber-500 mt-2">{newRequests}</p>
          <span className="text-[10px] text-theme-muted mt-1 block">Awaiting confirmation</span>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-theme-muted">In Print / Transit</span>
            <Printer className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-sky-500 mt-2">{processing + printingComplete + onTheWay}</p>
          <span className="text-[10px] text-theme-muted mt-1 block">Active on floor</span>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-theme-muted">Demo Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-500 mt-2">₹{totalSalesRevenue}</p>
          <span className="text-[10px] text-theme-muted mt-1 block">Simulated total sales</span>
        </div>
      </div>

      {/* Operational Breakdown by Status */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-theme-card border border-theme rounded-xl p-3 text-center">
          <span className="text-[11px] text-theme-muted">Requested</span>
          <p className="text-lg font-bold text-amber-500">{newRequests}</p>
        </div>
        <div className="bg-theme-card border border-theme rounded-xl p-3 text-center">
          <span className="text-[11px] text-theme-muted">Processing</span>
          <p className="text-lg font-bold text-sky-500">{processing}</p>
        </div>
        <div className="bg-theme-card border border-theme rounded-xl p-3 text-center">
          <span className="text-[11px] text-theme-muted">Printed</span>
          <p className="text-lg font-bold text-indigo-500">{printingComplete}</p>
        </div>
        <div className="bg-theme-card border border-theme rounded-xl p-3 text-center">
          <span className="text-[11px] text-theme-muted">Ready Pickup</span>
          <p className="text-lg font-bold text-yellow-500">{readyPickup}</p>
        </div>
        <div className="bg-theme-card border border-theme rounded-xl p-3 text-center">
          <span className="text-[11px] text-theme-muted">Out for Delivery</span>
          <p className="text-lg font-bold text-purple-500">{onTheWay}</p>
        </div>
        <div className="bg-theme-card border border-theme rounded-xl p-3 text-center">
          <span className="text-[11px] text-theme-muted">Completed</span>
          <p className="text-lg font-bold text-emerald-500">{completed}</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <div>
            <h2 className="text-base font-bold text-theme-main">
              Recent Campus Orders
            </h2>
            <p className="text-xs text-theme-muted">Quick status transition shortcuts</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#FFCC00] hover:underline"
          >
            View Full Queue →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-input text-theme-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Order ID</th>
                <th className="p-3">Student & Contact</th>
                <th className="p-3">Method</th>
                <th className="p-3">Items Summary</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 rounded-r-xl text-right">Quick Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-theme-input/40 transition-colors">
                  <td className="p-3 font-bold text-theme-main">{ord.id}</td>
                  <td className="p-3">
                    <span className="font-semibold text-theme-main block">{ord.studentName}</span>
                    <span className="text-[10px] text-theme-muted">{ord.studentPhone}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] text-theme-muted">
                      {ord.deliveryDetails.method === 'classroom_delivery' ? 'Campus Delivery' : 'Counter Pickup'}
                    </span>
                  </td>
                  <td className="p-3 text-theme-muted max-w-[200px] truncate">
                    {ord.items.length} item(s)
                  </td>
                  <td className="p-3 font-bold text-[#FFCC00]">₹{ord.totalAmount}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/30">
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={ord.status}
                      aria-label={`Change status for order ${ord.id}`}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-theme-input text-[11px] font-bold text-[#FFCC00] border border-theme rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="Requested">Requested</option>
                      <option value="Processing">Processing</option>
                      <option value="Printing Complete">Printing Complete</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="On the Way">On the Way</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Collected">Collected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printing Rate Snapshot */}
      <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-theme pb-3">
          <div>
            <h2 className="text-base font-bold text-theme-main">Active Pricing Configuration</h2>
            <p className="text-xs text-theme-muted">Standard college student rates applied</p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-[#FFCC00] hover:underline"
          >
            Edit Rates →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-theme-input border border-theme">
            <span className="text-theme-muted block">A4 Black & White</span>
            <span className="text-base font-black text-[#FFCC00]">₹{printRates.a4Bw} / page</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-input border border-theme">
            <span className="text-theme-muted block">A4 Full Color</span>
            <span className="text-base font-black text-[#FFCC00]">₹{printRates.a4Color} / page</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-input border border-theme">
            <span className="text-theme-muted block">Spiral Binding</span>
            <span className="text-base font-black text-[#FFCC00]">₹{printRates.spiralBinding}</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-input border border-theme">
            <span className="text-theme-muted block">Classroom Delivery</span>
            <span className="text-base font-black text-[#FFCC00]">₹{printRates.classroomDeliveryFee}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
