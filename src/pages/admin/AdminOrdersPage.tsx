import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  Filter,
  ArrowLeft,
  FileText,
  ShoppingBag,
  MapPin,
  CheckCircle,
  XCircle,
  Truck,
  Printer,
  Eye,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { OrderStatus, Order, UploadedDocument } from '../../types';
import { CENTRAL_SHOP_NAME } from '../../data/mockData';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.studentPhone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
      setSelectedOrderForModal({
        ...selectedOrderForModal,
        status: newStatus,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-theme pb-6">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-theme-muted hover:text-[#FFCC00] mb-2 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard Overview</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-theme-main">
            Stationery & Print Order Queue
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Accept orders, inspect documents, assign print operators, and dispatch delivery runners
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, student, or phone..."
            className="w-full bg-theme-input text-xs text-theme-main placeholder-theme-muted/60 pl-9 pr-4 py-2.5 rounded-xl border border-theme focus:outline-none focus:border-[#FFCC00]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          'All',
          'Requested',
          'Processing',
          'Printing Complete',
          'Ready for Pickup',
          'On the Way',
          'Delivered',
          'Collected',
          'Rejected',
        ].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st as 'All' | OrderStatus)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === st
                ? 'bg-[#FFCC00] text-[#0B1016]'
                : 'bg-theme-card text-theme-muted hover:text-theme-main border border-theme'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-theme-card border border-theme rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-input text-theme-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order ID & Time</th>
                <th className="p-4">Student Info</th>
                <th className="p-4">Campus Destination</th>
                <th className="p-4">Documents / Products</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-theme-muted">
                    No orders match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const printJobs = ord.items.filter((i) => i.type === 'print');
                  const isClassroom = ord.deliveryDetails.method === 'classroom_delivery';

                  return (
                    <tr key={ord.id} className="hover:bg-theme-input/40 transition-colors">
                      <td className="p-4">
                        <span className="font-extrabold text-theme-main block">{ord.id}</span>
                        <span className="text-[10px] text-theme-muted">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-theme-main block">{ord.studentName}</span>
                        <span className="text-[10px] text-theme-muted">{ord.studentPhone}</span>
                        <span className="text-[10px] text-theme-muted block truncate max-w-[140px]">
                          {ord.studentEmail}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-[#FFCC00] block text-[11px]">
                          {isClassroom ? 'Campus Delivery' : 'Counter Pickup'}
                        </span>
                        {isClassroom ? (
                          <span className="text-[10px] text-theme-muted block max-w-[200px]">
                            {ord.deliveryDetails.formattedDestination || `${ord.deliveryDetails.building} • ${ord.deliveryDetails.classroom}`}
                          </span>
                        ) : (
                          <span className="text-[10px] text-theme-muted block">{CENTRAL_SHOP_NAME}</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          {printJobs.length > 0 && (
                            <button
                              onClick={() => setSelectedOrderForModal(ord)}
                              className="inline-flex items-center gap-1 text-[11px] text-sky-500 hover:underline font-semibold"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{printJobs.length} Document(s) [Inspect]</span>
                            </button>
                          )}
                          <span className="text-[10px] text-theme-muted block">
                            {ord.items.length} item(s) total
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-black text-theme-main block text-sm">
                          ₹{ord.totalAmount}
                        </span>
                        <span className="text-[10px] text-emerald-500 font-semibold">
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/30 inline-block">
                          {ord.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick advance status buttons based on current state */}
                          {ord.status === 'Requested' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(ord.id, 'Processing')}
                                className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-500 border border-sky-500/30 hover:bg-sky-500/30 font-bold text-[10px]"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusChange(ord.id, 'Rejected')}
                                className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500/30 font-bold text-[10px]"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {ord.status === 'Processing' && (
                            <button
                              onClick={() => handleStatusChange(ord.id, 'Printing Complete')}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-500 border border-indigo-500/30 hover:bg-indigo-500/30 font-bold text-[10px]"
                            >
                              Mark Printed
                            </button>
                          )}

                          {ord.status === 'Printing Complete' && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  ord.id,
                                  isClassroom ? 'On the Way' : 'Ready for Pickup'
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-[#FFCC00] text-[#0B1016] font-bold text-[10px]"
                            >
                              {isClassroom ? 'Dispatch Runner' : 'Ready at Desk'}
                            </button>
                          )}

                          {['Ready for Pickup', 'On the Way'].includes(ord.status) && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  ord.id,
                                  isClassroom ? 'Delivered' : 'Collected'
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-[10px]"
                            >
                              {isClassroom ? 'Mark Delivered' : 'Mark Collected'}
                            </button>
                          )}

                          {['Delivered', 'Collected'].includes(ord.status) && (
                            <span className="text-emerald-500 font-bold text-[11px] flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Done
                            </span>
                          )}

                          <button
                            onClick={() => setSelectedOrderForModal(ord)}
                            className="p-1 rounded-lg bg-theme-input text-theme-muted hover:text-theme-main border border-theme"
                            title="Inspect complete order modal"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Document Modal */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-card border border-theme rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <div>
                <h3 className="text-lg font-bold text-theme-main">
                  Order Inspection #{selectedOrderForModal.id}
                </h3>
                <p className="text-xs text-theme-muted">
                  Recipient: {selectedOrderForModal.studentName} ({selectedOrderForModal.studentPhone})
                </p>
                <p className="text-xs text-[#FFCC00] mt-1 font-semibold">
                  Destination: {selectedOrderForModal.deliveryDetails.formattedDestination || selectedOrderForModal.deliveryDetails.destinationName || selectedOrderForModal.deliveryDetails.building || CENTRAL_SHOP_NAME}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="text-theme-muted hover:text-theme-main text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Document Queue in this Order */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFCC00]">
                Uploaded Documents & Print Configuration
              </h4>
              {selectedOrderForModal.items
                .filter((i) => i.type === 'print')
                .map((item, idx) => {
                  if (item.type !== 'print') return null;
                  const { document } = item;
                  const { settings } = document;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-theme-input border border-theme space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#FFCC00]" />
                          <span className="font-bold text-theme-main">{document.fileName}</span>
                        </div>
                        <span className="text-xs font-extrabold text-[#FFCC00]">
                          ₹{document.calculatedPrice}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-theme-muted">
                        <div>• Mode: <span className="text-theme-main font-bold">{settings.colorMode.toUpperCase()}</span></div>
                        <div>• Size: <span className="text-theme-main font-bold">{settings.paperSize}</span></div>
                        <div>• Duplex: <span className="text-theme-main font-bold">{settings.duplexMode}</span></div>
                        <div>• Copies: <span className="text-theme-main font-bold">{settings.copies}</span></div>
                        <div>• Pages: <span className="text-theme-main font-bold">{settings.pageCount}</span></div>
                        <div>• Range: <span className="text-theme-main font-bold">{settings.pageRange || 'All'}</span></div>
                        <div>• Binding: <span className="text-[#FFCC00] font-bold">{settings.binding}</span></div>
                      </div>

                      {settings.notes && (
                        <div className="p-2 rounded-lg bg-theme-card text-[11px] text-theme-muted">
                          <span className="text-[#FFCC00] font-semibold">Student Note: </span>
                          {settings.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Change Status Controls inside modal */}
            <div className="pt-4 border-t border-theme flex items-center justify-between">
              <div>
                <span className="text-xs text-theme-muted block">Update Status:</span>
                <select
                  value={selectedOrderForModal.status}
                  aria-label="Modal status selector"
                  onChange={(e) => handleStatusChange(selectedOrderForModal.id, e.target.value as OrderStatus)}
                  className="bg-theme-input text-xs font-bold text-[#FFCC00] border border-theme rounded-xl px-3 py-2 mt-1 focus:outline-none"
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
              </div>

              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="bg-[#FFCC00] text-[#0B1016] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#E5B800] transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

