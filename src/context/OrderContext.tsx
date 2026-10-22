import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Order,
  OrderStatus,
  DeliveryDetails,
  PaymentMethod,
  PrintRates,
  Product,
  PrintSettings,
} from '../types';
import {
  SAMPLE_INITIAL_ORDERS,
  DEFAULT_PRINT_RATES,
  INITIAL_PRODUCTS,
} from '../data/mockData';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  products: Product[];
  printRates: PrintRates;
  getOrderById: (id: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  createOrder: (deliveryDetails: DeliveryDetails, paymentMethod: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, customDescription?: string) => void;
  updatePrintRates: (rates: Partial<PrintRates>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  calculatePrintPrice: (settings: PrintSettings) => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_KEY = 'printxpress_orders';
const PRODUCTS_KEY = 'printxpress_products';
const RATES_KEY = 'printxpress_print_rates';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items, stationerySubtotal, printingSubtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : SAMPLE_INITIAL_ORDERS;
    } catch {
      return SAMPLE_INITIAL_ORDERS;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [printRates, setPrintRates] = useState<PrintRates>(() => {
    try {
      const saved = localStorage.getItem(RATES_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PRINT_RATES;
    } catch {
      return DEFAULT_PRINT_RATES;
    }
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(RATES_KEY, JSON.stringify(printRates));
  }, [printRates]);

  const calculatePrintPrice = (settings: PrintSettings): number => {
    // 1. Calculate active pages to print
    let activePages = settings.pageCount || 1;
    if (settings.pageSelection === 'custom' && settings.pageRange) {
      // Parse ranges like "1-4, 7, 9-11"
      try {
        const parts = settings.pageRange.split(',');
        let count = 0;
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end) && end >= start) {
              count += Math.max(1, end - start + 1);
            }
          } else {
            const num = Number(trimmed);
            if (!isNaN(num) && num > 0) count += 1;
          }
        }
        if (count > 0) activePages = count;
      } catch {
        activePages = settings.pageCount || 1;
      }
    }

    // 2. Base rate per printed side
    const isA3 = settings.paperSize === 'A3';
    const isColor = settings.colorMode === 'color';

    let ratePerSide = printRates.a4Bw; // default ₹2
    if (isA3 && isColor) ratePerSide = printRates.a3Color;
    else if (isA3 && !isColor) ratePerSide = printRates.a3Bw;
    else if (!isA3 && isColor) ratePerSide = printRates.a4Color;
    else ratePerSide = printRates.a4Bw;

    // 3. Sides count
    // Single-sided vs double-sided: each page still constitutes a printed side.
    const printedSides = activePages;
    const documentPrintingCost = printedSides * ratePerSide * (settings.copies || 1);

    // 4. Binding addition
    let bindingCost = 0;
    if (settings.binding === 'staple') bindingCost = printRates.stapleBinding * settings.copies;
    if (settings.binding === 'spiral') bindingCost = printRates.spiralBinding * settings.copies;
    if (settings.binding === 'hardcover') bindingCost = printRates.hardcoverBinding * settings.copies;

    return documentPrintingCost + bindingCost;
  };

  const createOrder = async (
    deliveryDetails: DeliveryDetails,
    paymentMethod: PaymentMethod
  ): Promise<Order> => {
    // Calculate new sequential order ID
    const nextNum = 1000 + orders.length + 1;
    const newOrderId = `PX-${nextNum}`;

    const deliveryFee =
      deliveryDetails.method === 'classroom_delivery' ? printRates.classroomDeliveryFee : 0;
    const totalAmount = stationerySubtotal + printingSubtotal + deliveryFee;

    const initialStatus: OrderStatus = 'Requested';

    const newOrder: Order = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      userId: user?.id || 'guest',
      studentName: deliveryDetails.studentName || user?.name || 'Student',
      studentEmail: user?.email || 'student@college.edu',
      studentPhone: deliveryDetails.phone || user?.phone || '',
      items: [...items],
      stationerySubtotal,
      printingSubtotal,
      deliveryFee,
      totalAmount,
      deliveryDetails,
      paymentMethod,
      paymentStatus: 'Paid — Demo',
      status: initialStatus,
      estimatedTime: deliveryDetails.method === 'classroom_delivery' ? '12 - 18 mins' : '5 - 10 mins',
      timeline: [
        {
          status: 'Requested',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description:
            deliveryDetails.formattedDestination
              ? `Order confirmed: ${deliveryDetails.formattedDestination}`
              : deliveryDetails.method === 'classroom_delivery'
              ? `Order confirmed for delivery to ${deliveryDetails.destinationName || deliveryDetails.building || 'Campus Destination'}`
              : 'Order confirmed for counter pickup at Central Campus Stationery & Print Shop',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update product stock counts
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = items.find(
          (i) => i.type === 'stationery' && i.product.id === prod.id
        );
        if (orderedItem && orderedItem.type === 'stationery') {
          const updatedStock = Math.max(0, prod.stock - orderedItem.quantity);
          return {
            ...prod,
            stock: updatedStock,
            inStock: updatedStock > 0,
          };
        }
        return prod;
      })
    );

    // Clear cart after successful order creation
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    customDescription?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const defaultDescriptions: Record<OrderStatus, string> = {
          Requested: 'Order submitted and in queue',
          Processing: 'Items assembled and printing in progress',
          'Printing Complete': 'All documents printed, bound, and quality checked',
          'Ready for Pickup': 'Packaged and waiting at Central Campus Stationery & Print Shop',
          'On the Way': 'Campus delivery runner dispatched with your order',
          Delivered: 'Delivered to student at campus destination',
          Collected: 'Picked up by student at Central Campus Stationery & Print Shop counter',
          Cancelled: 'Order cancelled by student',
          Rejected: 'Order rejected by operator (out of stock or invalid document)',
        };

        const newTimelineEvent = {
          status,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: customDescription || defaultDescriptions[status] || `Status updated to ${status}`,
        };

        return {
          ...order,
          status,
          timeline: [...order.timeline, newTimelineEvent],
        };
      })
    );
  };

  const updatePrintRates = (newRates: Partial<PrintRates>) => {
    setPrintRates((prev) => ({ ...prev, ...newRates }));
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-custom-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id);
  };

  const getUserOrders = (userId: string) => {
    return orders.filter((o) => o.userId === userId || userId === 'all');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        products,
        printRates,
        getOrderById,
        getUserOrders,
        createOrder,
        updateOrderStatus,
        updatePrintRates,
        addProduct,
        updateProduct,
        deleteProduct,
        calculatePrintPrice,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
