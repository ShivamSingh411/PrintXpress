import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product, UploadedDocument, PrintSettings } from '../types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  stationerySubtotal: number;
  printingSubtotal: number;
  totalBeforeDelivery: number;
  addStationery: (product: Product, quantity?: number) => void;
  updateStationeryQty: (productId: string, quantity: number) => void;
  removeStationery: (productId: string) => void;
  addPrintJob: (document: UploadedDocument) => void;
  updatePrintJobSettings: (documentId: string, settings: PrintSettings, calculatedPrice: number) => void;
  removePrintJob: (documentId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'printxpress_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items]);

  const addStationery = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.type === 'stationery' && item.product.id === product.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex] as { type: 'stationery'; product: Product; quantity: number };
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        updated[existingIndex] = { ...existing, quantity: newQty };
        return updated;
      }

      return [...prev, { type: 'stationery', product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const updateStationeryQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeStationery(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.type === 'stationery' && item.product.id === productId) {
          return { ...item, quantity: Math.min(quantity, item.product.stock) };
        }
        return item;
      })
    );
  };

  const removeStationery = (productId: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.type === 'stationery' && item.product.id === productId))
    );
  };

  const addPrintJob = (document: UploadedDocument) => {
    setItems((prev) => [...prev, { type: 'print', document }]);
  };

  const updatePrintJobSettings = (
    documentId: string,
    settings: PrintSettings,
    calculatedPrice: number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.type === 'print' && item.document.id === documentId) {
          return {
            ...item,
            document: {
              ...item.document,
              settings,
              calculatedPrice,
            },
          };
        }
        return item;
      })
    );
  };

  const removePrintJob = (documentId: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.type === 'print' && item.document.id === documentId))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string): number => {
    const found = items.find(
      (item) => item.type === 'stationery' && item.product.id === productId
    );
    return found && found.type === 'stationery' ? found.quantity : 0;
  };

  const stationerySubtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      if (item.type === 'stationery') {
        return sum + item.product.price * item.quantity;
      }
      return sum;
    }, 0);
  }, [items]);

  const printingSubtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      if (item.type === 'print') {
        return sum + item.document.calculatedPrice;
      }
      return sum;
    }, 0);
  }, [items]);

  const totalBeforeDelivery = stationerySubtotal + printingSubtotal;

  const itemCount = useMemo(() => {
    return items.reduce((count, item) => {
      return count + (item.type === 'stationery' ? item.quantity : 1);
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        stationerySubtotal,
        printingSubtotal,
        totalBeforeDelivery,
        addStationery,
        updateStationeryQty,
        removeStationery,
        addPrintJob,
        updatePrintJobSettings,
        removePrintJob,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
