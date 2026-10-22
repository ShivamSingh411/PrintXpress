export type Role = 'student' | 'admin';

export type DestinationCategory = 'academic' | 'hostel' | 'canteen' | 'sports' | 'shop';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId: string; // Roll number
  department: string;
  academicYear?: string;
  batch: string;
  phone?: string;
  role: Role;
  savedClassroom?: {
    category?: DestinationCategory;
    building: string;
    floor: string;
    classroom: string;
  };
}

export type StationeryCategory =
  | 'Pens and pencils'
  | 'Notebooks and registers'
  | 'Scissors'
  | 'Staplers'
  | 'Files and folders'
  | 'Highlighters and markers'
  | 'Sticky notes'
  | 'Geometry supplies'
  | 'Project supplies';

export interface Product {
  id: string;
  name: string;
  category: StationeryCategory;
  price: number;
  description: string;
  stock: number;
  inStock: boolean;
  image: string;
  rating?: number;
  featured?: boolean;
}

export type PaperSize = 'A4' | 'A3';
export type ColorMode = 'bw' | 'color';
export type Orientation = 'portrait' | 'landscape';
export type DuplexMode = 'single' | 'double';
export type BindingOption = 'none' | 'staple' | 'spiral' | 'hardcover';

export interface PrintSettings {
  colorMode: ColorMode;
  paperSize: PaperSize;
  orientation: Orientation;
  duplexMode: DuplexMode;
  copies: number;
  pageSelection: 'all' | 'custom';
  pageRange?: string; // e.g., "1-5" or "1,3,5"
  pageCount: number;
  binding: BindingOption;
  notes?: string;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  uploadProgress: number;
  status: 'uploading' | 'ready' | 'error';
  fileUrl?: string;
  settings: PrintSettings;
  calculatedPrice: number;
}

export interface CartStationeryItem {
  type: 'stationery';
  product: Product;
  quantity: number;
}

export interface CartPrintItem {
  type: 'print';
  document: UploadedDocument;
}

export type CartItem = CartStationeryItem | CartPrintItem;

export type DeliveryMethod = 'counter_pickup' | 'classroom_delivery';

export interface DeliveryDetails {
  method: DeliveryMethod;
  studentName: string;
  phone: string;
  category?: DestinationCategory;
  destinationName?: string; // e.g. "BCA–BBA Academic Building"
  
  // Academic building fields
  department?: string;
  academicYear?: string;
  batch?: string;
  floor?: string;
  classroom?: string;
  
  // Hostel fields
  hostelBuilding?: string;
  blockWing?: string;
  roomNumber?: string;
  
  // Canteen fields
  canteenName?: string;
  tableInstructions?: string;
  
  // Sports ground & general instructions
  meetingPoint?: string;
  instructions?: string;
  
  // Formatted human-readable destination (e.g. "BCA–BBA Academic Building → Basement → Classroom B-202")
  formattedDestination?: string;
  building?: string; // backwards compatibility
}

export type PaymentMethod = 'demo' | 'upi' | 'card' | 'netbanking';

export type PaymentStatus = 'Paid — Demo' | 'Pending' | 'Failed';

export type OrderStatus =
  | 'Requested'
  | 'Processing'
  | 'Printing Complete'
  | 'Ready for Pickup'
  | 'On the Way'
  | 'Delivered'
  | 'Collected'
  | 'Cancelled'
  | 'Rejected';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string; // e.g. PX-1001
  createdAt: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  items: CartItem[];
  stationerySubtotal: number;
  printingSubtotal: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryDetails: DeliveryDetails;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  estimatedTime: string;
  timeline: OrderTimelineEvent[];
}

export interface PrintRates {
  a4Bw: number;       // default ₹2
  a4Color: number;    // default ₹10
  a3Bw: number;       // default ₹5
  a3Color: number;    // default ₹20
  stapleBinding: number; // default ₹5
  spiralBinding: number; // default ₹35
  hardcoverBinding: number; // default ₹120
  classroomDeliveryFee: number; // default ₹15
}
