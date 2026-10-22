import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  ArrowLeft,
  Settings,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Product, StationeryCategory, PrintRates } from '../../types';

const CATEGORIES: StationeryCategory[] = [
  'Pens and pencils',
  'Notebooks and registers',
  'Scissors',
  'Staplers',
  'Files and folders',
  'Highlighters and markers',
  'Sticky notes',
  'Geometry supplies',
  'Project supplies',
];

export const AdminProductsPage: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    printRates,
    updatePrintRates,
  } = useOrders();

  // Print rates form state
  const [ratesForm, setRatesForm] = useState<PrintRates>({ ...printRates });
  const [ratesSaved, setRatesSaved] = useState(false);

  // New product form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<StationeryCategory>('Pens and pencils');
  const [newProductPrice, setNewProductPrice] = useState(40);
  const [newProductStock, setNewProductStock] = useState(25);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImage, setNewProductImage] = useState(
    'https://images.unsplash.com/photo-1585336261026-8c089cae49d6?auto=format&fit=crop&w=600&q=80'
  );

  // Editing product inline state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrintRates(ratesForm);
    setRatesSaved(true);
    setTimeout(() => setRatesSaved(false), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    addProduct({
      name: newProductName.trim(),
      category: newProductCategory,
      price: Number(newProductPrice),
      stock: Number(newProductStock),
      inStock: Number(newProductStock) > 0,
      description: newProductDesc.trim() || 'College stationery supply',
      image: newProductImage.trim(),
    });

    setShowAddModal(false);
    setNewProductName('');
    setNewProductDesc('');
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditPrice(prod.price);
    setEditStock(prod.stock);
  };

  const handleSaveEdit = (prod: Product) => {
    updateProduct({
      ...prod,
      price: Number(editPrice),
      stock: Number(editStock),
      inStock: Number(editStock) > 0,
    });
    setEditingProductId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
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
            Products & Printing Rates
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Configure student reprographics pricing, binding fees, and stationery stock levels
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Stationery Product</span>
        </button>
      </div>

      {/* Section 1: Configure Printing Rates */}
      <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#FFCC00]" />
            <div>
              <h2 className="text-base font-bold text-theme-main">
                Configure Printing Rates & Fees (in INR)
              </h2>
              <p className="text-xs text-theme-muted">
                Changes apply instantly across checkout, cart, and document live calculator
              </p>
            </div>
          </div>
          {ratesSaved && (
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Rates Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveRates} className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                A4 B&W (₹ / side)
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={ratesForm.a4Bw}
                onChange={(e) => setRatesForm({ ...ratesForm, a4Bw: Number(e.target.value) })}
                className="w-full bg-theme-input text-xs font-bold text-[#FFCC00] border border-theme rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                A4 Color (₹ / side)
              </label>
              <input
                type="number"
                min="1"
                value={ratesForm.a4Color}
                onChange={(e) => setRatesForm({ ...ratesForm, a4Color: Number(e.target.value) })}
                className="w-full bg-theme-input text-xs font-bold text-[#FFCC00] border border-theme rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                A3 B&W (₹ / side)
              </label>
              <input
                type="number"
                min="1"
                value={ratesForm.a3Bw}
                onChange={(e) => setRatesForm({ ...ratesForm, a3Bw: Number(e.target.value) })}
                className="w-full bg-theme-input text-xs font-bold text-[#FFCC00] border border-theme rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                A3 Color (₹ / side)
              </label>
              <input
                type="number"
                min="1"
                value={ratesForm.a3Color}
                onChange={(e) => setRatesForm({ ...ratesForm, a3Color: Number(e.target.value) })}
                className="w-full bg-theme-input text-xs font-bold text-[#FFCC00] border border-theme rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FFCC00]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                Staple Binding (₹)
              </label>
              <input
                type="number"
                min="0"
                value={ratesForm.stapleBinding}
                onChange={(e) => setRatesForm({ ...ratesForm, stapleBinding: Number(e.target.value) })}
                className="w-full bg-theme-input text-xs font-bold text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                Spiral Binding (₹)
              </label>
              <input
                type="number"
                min="0"
                value={ratesForm.spiralBinding}
                onChange={(e) => setRatesForm({ ...ratesForm, spiralBinding: Number(e.target.value) })}
                className="w-full bg-theme-input text-xs font-bold text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                Hardcover Binding (₹)
              </label>
              <input
                type="number"
                min="0"
                value={ratesForm.hardcoverBinding}
                onChange={(e) => setRatesForm({ ...ratesForm, hardcoverBinding: Number(e.target.value) })}
                className="w-full bg-theme-input text-xs font-bold text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FFCC00]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                Classroom Delivery Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={ratesForm.classroomDeliveryFee}
                onChange={(e) => setRatesForm({ ...ratesForm, classroomDeliveryFee: Number(e.target.value) })}
                className="w-full bg-theme-input text-xs font-bold text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FFCC00]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Rates</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Manage Stationery Products */}
      <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <div>
            <h2 className="text-base font-bold text-theme-main">
              Stationery Catalog ({products.length} Items)
            </h2>
            <p className="text-xs text-theme-muted">
              Edit inventory counts, adjust prices, or toggle in-stock flags
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-input text-theme-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock Units</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {products.map((prod) => {
                const isEditing = editingProductId === prod.id;

                return (
                  <tr key={prod.id} className="hover:bg-theme-input/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover bg-theme-input border border-theme"
                        />
                        <span className="font-bold text-theme-main line-clamp-1 max-w-[220px]">
                          {prod.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-theme-muted">{prod.category}</td>

                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-20 bg-theme-input text-xs font-bold text-[#FFCC00] border border-theme rounded px-2 py-1"
                        />
                      ) : (
                        <span className="font-bold text-[#FFCC00]">₹{prod.price}</span>
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(Number(e.target.value))}
                          className="w-20 bg-theme-input text-xs font-bold text-theme-main border border-theme rounded px-2 py-1"
                        />
                      ) : (
                        <span className="font-semibold text-theme-main">{prod.stock}</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.inStock
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : 'bg-rose-500/20 text-rose-500'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(prod)}
                            className="px-2.5 py-1 rounded bg-[#FFCC00] text-[#0B1016] font-bold text-xs"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(prod)}
                            className="p-1.5 rounded-lg bg-theme-input text-theme-muted hover:text-theme-main border border-theme"
                            title="Edit price and stock"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 rounded-lg bg-theme-input text-theme-muted hover:text-rose-500 border border-theme"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-card border border-theme rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <h3 className="text-base font-bold text-theme-main">
                Add Stationery Item
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-theme-muted hover:text-theme-main font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Camlin Exam Ruler 30cm"
                  className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#FFCC00]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1">
                    Category *
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as StationeryCategory)}
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(Number(e.target.value))}
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1">
                  Short Description
                </label>
                <textarea
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Item details, brand, or exam specifications..."
                  rows={2}
                  className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-theme-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FFCC00] text-[#0B1016] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#E5B800] transition-colors"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
