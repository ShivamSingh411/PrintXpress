import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  File,
  Image as ImageIcon,
  Trash2,
  Settings2,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Info,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import {
  UploadedDocument,
  PrintSettings,
  PaperSize,
  ColorMode,
  Orientation,
  DuplexMode,
  BindingOption,
} from '../types';

export const PrintPage: React.FC = () => {
  const { printRates, calculatePrintPrice } = useOrders();
  const { addPrintJob } = useCart();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [activeDocIndex, setActiveDocIndex] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [addedSuccessMessage, setAddedSuccessMessage] = useState<string | null>(null);

  const activeDoc = documents[activeDocIndex];

  // Allowed file extensions and MIME types
  const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.jpg', '.jpeg', '.png'];
  const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

  const handleFiles = (fileList: FileList) => {
    setUploadError(null);
    const newDocs: UploadedDocument[] = [];

    Array.from(fileList).forEach((file) => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setUploadError(`File "${file.name}" has an unsupported format. Please upload PDF, DOCX, PPTX, JPG, or PNG.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`File "${file.name}" exceeds maximum allowed limit of 50MB.`);
        return;
      }

      // Initial reasonable page estimate based on file type and size
      let estimatedPages = 1;
      if (ext === '.pdf') {
        // approximate pages ~ 1 page per 100KB for text or min 2
        estimatedPages = Math.max(1, Math.min(60, Math.round(file.size / (120 * 1024))));
        if (estimatedPages === 0) estimatedPages = 1;
      } else if (ext === '.docx') {
        estimatedPages = Math.max(1, Math.min(30, Math.round(file.size / (150 * 1024))));
      } else if (ext === '.pptx') {
        estimatedPages = Math.max(1, Math.min(45, Math.round(file.size / (250 * 1024))));
      } else {
        // JPG / PNG image is 1 page
        estimatedPages = 1;
      }

      const defaultSettings: PrintSettings = {
        colorMode: 'bw',
        paperSize: 'A4',
        orientation: 'portrait',
        duplexMode: 'double',
        copies: 1,
        pageSelection: 'all',
        pageCount: estimatedPages,
        binding: 'none',
      };

      const calculatedPrice = calculatePrintPrice(defaultSettings);

      const docItem: UploadedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || ext,
        uploadProgress: 100,
        status: 'ready',
        settings: defaultSettings,
        calculatedPrice,
      };

      newDocs.push(docItem);
    });

    if (newDocs.length > 0) {
      setDocuments((prev) => {
        const updated = [...prev, ...newDocs];
        setActiveDocIndex(updated.length - 1);
        return updated;
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeDoc = (index: number) => {
    setDocuments((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (activeDocIndex >= updated.length) {
        setActiveDocIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const updateActiveSettings = (updates: Partial<PrintSettings>) => {
    if (!activeDoc) return;

    const newSettings: PrintSettings = {
      ...activeDoc.settings,
      ...updates,
    };

    const newPrice = calculatePrintPrice(newSettings);

    setDocuments((prev) =>
      prev.map((doc, idx) => {
        if (idx === activeDocIndex) {
          return {
            ...doc,
            settings: newSettings,
            calculatedPrice: newPrice,
          };
        }
        return doc;
      })
    );
  };

  const handleAddToCart = () => {
    if (documents.length === 0) return;
    documents.forEach((doc) => addPrintJob(doc));
    setAddedSuccessMessage(`${documents.length} print job(s) added to cart!`);
    setTimeout(() => setAddedSuccessMessage(null), 3000);
    // clear local uploaded documents
    setDocuments([]);
  };

  const handleProceedDirectToCheckout = () => {
    if (documents.length === 0) return;
    documents.forEach((doc) => addPrintJob(doc));
    navigate('/checkout/delivery');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-rose-400" />;
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <ImageIcon className="w-5 h-5 text-sky-400" />;
    return <File className="w-5 h-5 text-[#FFCC00]" />;
  };

  const totalAllDocsPrice = documents.reduce((sum, d) => sum + d.calculatedPrice, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-theme pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-xs font-bold text-[#FFCC00] mb-2">
          <Settings2 className="w-3.5 h-3.5" />
          <span>High-Speed Campus Reprographics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-main">
          Upload & Print Documents
        </h1>
        <p className="text-sm text-theme-muted mt-1">
          Support for PDF, DOCX, PPTX slides, and images with automatic side calculations and binding options
        </p>
      </div>

      {/* Upload Zone & Document Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload area and document queue */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Drag & Drop Card */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-[#FFCC00] bg-[#FFCC00]/10 scale-[1.01]'
                : 'border-theme hover:border-[#FFCC00]/60 bg-theme-card/70 hover:bg-theme-card'
            }`}
            onClick={() => document.getElementById('printFileInput')?.click()}
          >
            <input
              id="printFileInput"
              type="file"
              multiple
              accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            
            <div className="w-16 h-16 rounded-2xl bg-theme-input border border-theme flex items-center justify-center text-[#FFCC00] mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-theme-main">
              Click to browse or drop your files here
            </h3>
            <p className="text-xs text-theme-muted mt-1.5 max-w-sm mx-auto">
              PDF, DOCX, PPTX, JPG, PNG (Max 50MB per file). Multiple documents can be configured in one order.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#0B1016] bg-[#FFCC00] hover:bg-[#E5B800] px-4 py-2 rounded-xl transition-colors">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Select Files from Device</span>
            </div>
          </div>

          {uploadError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-500 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
              <span>{uploadError}</span>
            </div>
          )}

          {addedSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-600 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>{addedSuccessMessage}</span>
            </div>
          )}

          {/* Queue of Uploaded Documents */}
          {documents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                  Uploaded Documents ({documents.length})
                </h3>
                <span className="text-xs text-[#FFCC00] font-semibold">
                  Click any document to customize print options
                </span>
              </div>

              <div className="space-y-2">
                {documents.map((doc, idx) => {
                  const isSelected = idx === activeDocIndex;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setActiveDocIndex(idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-theme-card border-[#FFCC00] shadow-md shadow-[#FFCC00]/10'
                          : 'bg-theme-card border-theme hover:border-theme-muted/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-theme-input border border-theme flex items-center justify-center flex-shrink-0">
                          {getFileIcon(doc.fileName)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-theme-main truncate">
                            {doc.fileName}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-theme-muted mt-0.5">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <span>•</span>
                            <span>{doc.settings.pageCount} Pages</span>
                            <span>•</span>
                            <span className="text-[#FFCC00] font-semibold">
                              {doc.settings.colorMode === 'bw' ? 'B&W' : 'Color'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-extrabold text-theme-main">
                          ₹{doc.calculatedPrice}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDoc(idx);
                          }}
                          className="p-1.5 rounded-lg text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Reference Information */}
          <div className="bg-theme-card border border-theme rounded-2xl p-4 text-xs text-theme-muted space-y-2">
            <div className="flex items-center gap-2 text-theme-main font-bold">
              <Info className="w-4 h-4 text-[#FFCC00]" />
              <span>Campus Printing Rates</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>• A4 Black & White: ₹{printRates.a4Bw} / page</div>
              <div>• A4 High Color: ₹{printRates.a4Color} / page</div>
              <div>• A3 Black & White: ₹{printRates.a3Bw} / page</div>
              <div>• A3 Full Color: ₹{printRates.a3Color} / page</div>
              <div>• Spiral Binding: ₹{printRates.spiralBinding}</div>
              <div>• Hardcover Binding: ₹{printRates.hardcoverBinding}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Print Customization Studio */}
        <div className="lg:col-span-6">
          {activeDoc ? (
            <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl sticky top-24">
              <div className="flex items-start justify-between border-b border-theme pb-4">
                <div>
                  <h3 className="text-base font-bold text-theme-main flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FFCC00]" />
                    Print Settings for:
                  </h3>
                  <p className="text-xs text-[#FFCC00] font-semibold truncate max-w-xs mt-0.5">
                    {activeDoc.fileName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-theme-muted block">Document Total</span>
                  <span className="text-2xl font-black text-[#FFCC00]">
                    ₹{activeDoc.calculatedPrice}
                  </span>
                </div>
              </div>

              {/* 1. Color Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                  1. Color Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateActiveSettings({ colorMode: 'bw' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activeDoc.settings.colorMode === 'bw'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main'
                        : 'border-theme bg-theme-input text-theme-muted hover:border-theme-muted/40'
                    }`}
                  >
                    <div className="font-bold text-xs text-theme-main">Black & White</div>
                    <div className="text-[11px] text-theme-muted mt-0.5">₹{printRates.a4Bw} per printed side</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateActiveSettings({ colorMode: 'color' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activeDoc.settings.colorMode === 'color'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main'
                        : 'border-theme bg-theme-input text-theme-muted hover:border-theme-muted/40'
                    }`}
                  >
                    <div className="font-bold text-xs text-theme-main">Full Color Laser</div>
                    <div className="text-[11px] text-theme-muted mt-0.5">₹{printRates.a4Color} per printed side</div>
                  </button>
                </div>
              </div>

              {/* 2. Paper Size & Orientation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                    Paper Size
                  </label>
                  <select
                    value={activeDoc.settings.paperSize}
                    onChange={(e) => updateActiveSettings({ paperSize: e.target.value as PaperSize })}
                    className="w-full bg-theme-input text-xs font-semibold text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                  >
                    <option value="A4">A4 (Standard Manual/Assignment)</option>
                    <option value="A3">A3 (Engineering Poster/CAD)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                    Orientation
                  </label>
                  <select
                    value={activeDoc.settings.orientation}
                    onChange={(e) => updateActiveSettings({ orientation: e.target.value as Orientation })}
                    className="w-full bg-theme-input text-xs font-semibold text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                  >
                    <option value="portrait">Portrait (Vertical)</option>
                    <option value="landscape">Landscape (Horizontal/Slides)</option>
                  </select>
                </div>
              </div>

              {/* 3. Sides & Copies */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                    Duplex Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateActiveSettings({ duplexMode: 'single' })}
                      className={`py-2 px-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        activeDoc.settings.duplexMode === 'single'
                          ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-[#FFCC00]'
                          : 'border-theme bg-theme-input text-theme-muted'
                      }`}
                    >
                      Single Sided
                    </button>
                    <button
                      type="button"
                      onClick={() => updateActiveSettings({ duplexMode: 'double' })}
                      className={`py-2 px-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        activeDoc.settings.duplexMode === 'double'
                          ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-[#FFCC00]'
                          : 'border-theme bg-theme-input text-theme-muted'
                      }`}
                    >
                      Double Sided
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                    Copies
                  </label>
                  <div className="flex items-center gap-2 bg-theme-input border border-theme rounded-xl px-3 py-1">
                    <button
                      type="button"
                      onClick={() => updateActiveSettings({ copies: Math.max(1, activeDoc.settings.copies - 1) })}
                      className="text-lg font-bold text-theme-muted hover:text-theme-main px-1"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-xs text-theme-main">
                      {activeDoc.settings.copies}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateActiveSettings({ copies: activeDoc.settings.copies + 1 })}
                      className="text-lg font-bold text-[#FFCC00] hover:text-[#E5B800] px-1"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Page Range selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                    Pages to Print
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-theme-muted flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="pageSel"
                        checked={activeDoc.settings.pageSelection === 'all'}
                        onChange={() => updateActiveSettings({ pageSelection: 'all' })}
                        className="text-[#FFCC00] focus:ring-0"
                      />
                      <span>All ({activeDoc.settings.pageCount} pgs)</span>
                    </label>
                    <label className="text-xs text-theme-muted flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="pageSel"
                        checked={activeDoc.settings.pageSelection === 'custom'}
                        onChange={() => updateActiveSettings({ pageSelection: 'custom', pageRange: '1-5' })}
                        className="text-[#FFCC00] focus:ring-0"
                      />
                      <span>Custom Range</span>
                    </label>
                  </div>
                </div>

                {activeDoc.settings.pageSelection === 'custom' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={activeDoc.settings.pageRange || ''}
                      onChange={(e) => updateActiveSettings({ pageRange: e.target.value })}
                      placeholder="e.g. 1-5, 8, 11-14"
                      className="w-full bg-theme-input text-xs font-semibold text-theme-main border border-theme rounded-xl px-3 py-2 focus:border-[#FFCC00] focus:outline-none"
                    />
                    <p className="text-[10px] text-theme-muted mt-1">
                      Specify ranges separated by commas (e.g. 1-4, 7, 10-12)
                    </p>
                  </div>
                )}
              </div>

              {/* 5. Binding Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                  Finishing & Binding
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateActiveSettings({ binding: 'none' })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      activeDoc.settings.binding === 'none'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main'
                        : 'border-theme bg-theme-input text-theme-muted'
                    }`}
                  >
                    <span className="font-bold block">Loose Sheets</span>
                    <span className="text-[10px] text-theme-muted">₹0 (Free)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateActiveSettings({ binding: 'staple' })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      activeDoc.settings.binding === 'staple'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main'
                        : 'border-theme bg-theme-input text-theme-muted'
                    }`}
                  >
                    <span className="font-bold block">Corner Stapled</span>
                    <span className="text-[10px] text-theme-muted">+₹{printRates.stapleBinding}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateActiveSettings({ binding: 'spiral' })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      activeDoc.settings.binding === 'spiral'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main'
                        : 'border-theme bg-theme-input text-theme-muted'
                    }`}
                  >
                    <span className="font-bold block">Spiral Binding</span>
                    <span className="text-[10px] text-theme-muted">+₹{printRates.spiralBinding} (Clear cover)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateActiveSettings({ binding: 'hardcover' })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      activeDoc.settings.binding === 'hardcover'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main'
                        : 'border-theme bg-theme-input text-theme-muted'
                    }`}
                  >
                    <span className="font-bold block">Hardcover Project</span>
                    <span className="text-[10px] text-theme-muted">+₹{printRates.hardcoverBinding} (Gold embossing)</span>
                  </button>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                  Special Operator Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={activeDoc.settings.notes || ''}
                  onChange={(e) => updateActiveSettings({ notes: e.target.value })}
                  placeholder="e.g. Please print cover page on thick ivory sheet"
                  className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2 focus:border-[#FFCC00] focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-theme space-y-3">
                <div className="flex items-center justify-between text-sm font-bold text-theme-main mb-1">
                  <span>Total for {documents.length} document(s):</span>
                  <span className="text-xl text-[#FFCC00]">₹{totalAllDocsPrice}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 bg-theme-input hover:bg-theme-card text-theme-main border border-theme hover:border-[#FFCC00]/50 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FFCC00]" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedDirectToCheckout}
                    className="flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] font-bold text-xs sm:text-sm py-3 rounded-xl shadow-lg transition-all"
                  >
                    <span>Proceed to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-theme-card/50 border border-theme rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-theme-input border border-theme flex items-center justify-center text-theme-muted mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-theme-main">No document selected</h3>
              <p className="text-xs text-theme-muted max-w-xs mt-1">
                Upload your files on the left to configure printing options, colors, and binding.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
