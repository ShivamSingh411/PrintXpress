import { Product, PrintRates, UserProfile, Order, DestinationCategory } from '../types';

export const OFFICIAL_COLLEGE_ADDRESS =
  'Plot No. 2, APJ Abdul Kalam Road, Knowledge Park III, Greater Noida, Uttar Pradesh 201310';

export const CENTRAL_SHOP_NAME = 'Central Campus Stationery & Print Shop';

export const DEFAULT_PRINT_RATES: PrintRates = {
  a4Bw: 2,       // ₹2 per printed side
  a4Color: 10,   // ₹10 per printed side
  a3Bw: 5,       // ₹5 per printed side
  a3Color: 20,   // ₹20 per printed side
  stapleBinding: 5,
  spiralBinding: 35,
  hardcoverBinding: 120,
  classroomDeliveryFee: 15, // ₹15 for delivery to campus destination
};

// Structured Campus Destinations
export interface CampusDestinationOption {
  id: string;
  name: string;
  category: DestinationCategory;
  programs?: string[];
  defaultFloor?: string;
  defaultClassroom?: string;
}

export const CAMPUS_DESTINATIONS: Record<DestinationCategory, { label: string; items: string[] }> = {
  academic: {
    label: 'Academic Building',
    items: [
      'BCA–BBA Academic Building',
      'B.Tech Academic Building',
      'PGDM Academic Building',
      'MBA Academic Building',
      'MCA Academic Building',
      'BA LLB Academic Building',
    ],
  },
  hostel: {
    label: 'Hostel',
    items: ['Senior Boys Hostel', 'Junior Boys Hostel', 'Girls Hostel'],
  },
  canteen: {
    label: 'Canteen',
    items: ['BCA–BBA Canteen', 'MBA Canteen', 'B.Tech Canteen'],
  },
  sports: {
    label: 'Sports Ground',
    items: ['Sports Ground'],
  },
  shop: {
    label: 'Central Stationery Shop',
    items: ['Central Campus Stationery & Print Shop'],
  },
};

export const ACADEMIC_PROGRAM_MAP: Record<string, string[]> = {
  'BCA–BBA Academic Building': ['BCA', 'BBA'],
  'B.Tech Academic Building': ['B.Tech Computer Science', 'B.Tech Information Technology', 'B.Tech Mechanical', 'B.Tech Civil'],
  'PGDM Academic Building': ['PGDM General', 'PGDM Marketing', 'PGDM Finance'],
  'MBA Academic Building': ['MBA'],
  'MCA Academic Building': ['MCA'],
  'BA LLB Academic Building': ['BA LLB', 'BBA LLB'],
};

export const COMMON_FLOORS = [
  'Basement',
  'Ground Floor',
  '1st Floor',
  '2nd Floor',
  '3rd Floor',
  '4th Floor',
];

export const COLLEGE_DEPARTMENTS = [
  'BCA',
  'BBA',
  'B.Tech Computer Science',
  'B.Tech Information Technology',
  'PGDM',
  'MBA',
  'MCA',
  'BA LLB',
];

export const COLLEGE_BATCHES = [
  '2024–2027',
  '2023–2026',
  '2022–2025',
  '2024–2028 (B.Tech)',
  '2023–2027 (B.Tech)',
  '2024–2029 (Law)',
];

export const COLLEGE_ACADEMIC_YEARS = [
  '1st year',
  '2nd year',
  '3rd year',
  '4th year',
  '5th year',
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Pens and pencils
  {
    id: 'prod-pen-1',
    name: 'Classmate Octane Gel Pen (Blue, Pack of 5)',
    category: 'Pens and pencils',
    price: 50,
    description: 'Smooth writing 0.5mm Japanese tip gel pens with smudge-proof waterproof ink.',
    stock: 45,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1585336261026-8c089cae49d6?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    featured: true,
  },
  {
    id: 'prod-pen-2',
    name: 'Camlin 0.7mm Mechanical Pencil + Lead Box',
    category: 'Pens and pencils',
    price: 45,
    description: 'Ergonomic grip mechanical pencil with 2B dark polymer lead tube.',
    stock: 28,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
  },
  {
    id: 'prod-pen-3',
    name: 'Reynolds 045 Fine Carbure Ball Pen (Black, Pack of 5)',
    category: 'Pens and pencils',
    price: 35,
    description: 'Classic laser-smooth reliable ball pen for fast note-taking and exams.',
    stock: 60,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
  },

  // 2. Notebooks and registers
  {
    id: 'prod-note-1',
    name: 'Classmate Long Ruled Register (180 Pages, Hard Bound)',
    category: 'Notebooks and registers',
    price: 75,
    description: 'Chlorine-free bright paper with index page, page numbers, and sturdy cover.',
    stock: 35,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    featured: true,
  },
  {
    id: 'prod-note-2',
    name: 'Spiral Bound College Project Notebook (200 Pages)',
    category: 'Notebooks and registers',
    price: 95,
    description: '360° folding spiral binding notebook with 70 GSM ruled sheets.',
    stock: 22,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    featured: true,
  },
  {
    id: 'prod-note-3',
    name: 'A4 Engineering Graph Pad (50 Sheets, 1mm Grid)',
    category: 'Notebooks and registers',
    price: 60,
    description: 'Precision mm-grid green ruled graph sheets for lab calculations and plots.',
    stock: 19,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
  },

  // 3. Scissors
  {
    id: 'prod-sci-1',
    name: 'Scotch Precision 6-inch Stainless Steel Craft Scissors',
    category: 'Scissors',
    price: 85,
    description: 'Rust-resistant blades with soft-touch comfort grips for project trimming.',
    stock: 15,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
  },
  {
    id: 'prod-sci-2',
    name: 'Compact Pocket Safety Scissor with Cap',
    category: 'Scissors',
    price: 40,
    description: 'Blunt safety-tip mini scissors that safely fit inside any pencil pouch.',
    stock: 0,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&w=600&q=80',
    rating: 4.2,
  },

  // 4. Staplers
  {
    id: 'prod-staple-1',
    name: 'Kangaro No. 10 Mini Stapler + 1000 Staple Pins Combo',
    category: 'Staplers',
    price: 65,
    description: 'Compact steel stapler binding up to 20 sheets with integrated staple remover.',
    stock: 40,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    featured: true,
  },
  {
    id: 'prod-staple-2',
    name: 'Kangaro 24/6 Staple Pin Pack (2000 Pins)',
    category: 'Staplers',
    price: 30,
    description: 'Rust-free zinc-coated heavy duty staple pins for standard lab record binding.',
    stock: 55,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
  },

  // 5. Files and folders
  {
    id: 'prod-file-1',
    name: 'Clear Presentation Report Folder (Pack of 5)',
    category: 'Files and folders',
    price: 60,
    description: 'Transparent front slide-lock binder for semester project submissions and reports.',
    stock: 50,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    featured: true,
  },
  {
    id: 'prod-file-2',
    name: 'Deluxe Polypropylene 2-Ring Lever Arch File',
    category: 'Files and folders',
    price: 110,
    description: 'Heavy duty 75mm spine ring binder with card pocket and finger ring.',
    stock: 14,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
  },

  // 6. Highlighters and markers
  {
    id: 'prod-high-1',
    name: 'Faber-Castell Textliner 38 Pastel Set (4 Shades)',
    category: 'Highlighters and markers',
    price: 120,
    description: 'Chisel tip soft pastel tones that do not bleed through notebook sheets.',
    stock: 30,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    featured: true,
  },
  {
    id: 'prod-high-2',
    name: 'Camlin Whiteboard Marker (Pack of 4 Assorted Colors)',
    category: 'Highlighters and markers',
    price: 80,
    description: 'Alcohol based non-toxic dry erase markers for presentation and group study.',
    stock: 25,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
  },

  // 7. Sticky notes
  {
    id: 'prod-sticky-1',
    name: 'Post-it 3x3 Inch Neon Sticky Notes (Pack of 3 Pads)',
    category: 'Sticky notes',
    price: 90,
    description: 'Strong adhesive self-stick note pads in neon yellow, pink, and green.',
    stock: 45,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    featured: true,
  },
  {
    id: 'prod-sticky-2',
    name: 'Arrow Film Index Tabs & Page Flags (200 Strips)',
    category: 'Sticky notes',
    price: 45,
    description: 'Transparent writable page bookmarks for marking textbook chapters and code references.',
    stock: 38,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
  },

  // 8. Geometry supplies
  {
    id: 'prod-geo-1',
    name: 'Camlin Exam Mathematical Drawing Instruments Box',
    category: 'Geometry supplies',
    price: 130,
    description: 'Self-centering compass, divider, 15cm ruler, 45° and 60° set squares, and protractor.',
    stock: 24,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
  },
  {
    id: 'prod-geo-2',
    name: 'Camlin 30cm Stainless Steel Precision Ruler',
    category: 'Geometry supplies',
    price: 40,
    description: 'Double sided cm and inch laser etched markings with conversion table on back.',
    stock: 32,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
  },

  // 9. Project supplies
  {
    id: 'prod-proj-1',
    name: 'Fevistik 15g Non-Messy Glue Stick (Pack of 2)',
    category: 'Project supplies',
    price: 50,
    description: 'Instant bonding non-staining adhesive stick for lab charts and project photos.',
    stock: 50,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
  },
  {
    id: 'prod-proj-2',
    name: 'A1 Sized Thick White Chart Paper (Pack of 5)',
    category: 'Project supplies',
    price: 60,
    description: '150 GSM thick smooth ivory sheets for college poster presentations and exhibits.',
    stock: 20,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
  },
  {
    id: 'prod-proj-3',
    name: 'Double-Sided Heavy Duty Foam Mounting Tape (10m)',
    category: 'Project supplies',
    price: 70,
    description: 'High tensile foam tape for model building, electronics breadboard mount, and posters.',
    stock: 18,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1585336261026-8c089cae49d6?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
  },
];

// Initial default student profile as specified:
// Name: Himanshu Kumar
// Phone: 7061752337
// Email: 24355EW021@glbim.ac.in
// Roll Number: 241117106094
// Department: BCA
// Academic Year: 3rd year
// Batch: 2024–2027
// Building: BCA–BBA Academic Building, Floor: Basement, Classroom: B-202
export const DEMO_STUDENT: UserProfile = {
  id: 'usr-student-01',
  name: 'Himanshu Kumar',
  email: '24355EW021@glbim.ac.in',
  studentId: '241117106094',
  department: 'BCA',
  academicYear: '3rd year',
  batch: '2024–2027',
  phone: '7061752337',
  role: 'student',
  savedClassroom: {
    category: 'academic',
    building: 'BCA–BBA Academic Building',
    floor: 'Basement',
    classroom: 'B-202',
  },
};

export const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  name: 'Central Stationery & Print Shop Desk',
  email: 'admin@printxpress.campus.edu',
  studentId: 'STAFF-PX-01',
  department: 'Central Campus Stationery & Print Shop',
  batch: 'Campus Staff',
  phone: 'Central Campus Desk',
  role: 'admin',
};

export const SAMPLE_INITIAL_ORDERS: Order[] = [
  {
    id: 'PX-1001',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    userId: 'usr-student-01',
    studentName: 'Himanshu Kumar',
    studentEmail: '24355EW021@glbim.ac.in',
    studentPhone: '7061752337',
    items: [
      {
        type: 'print',
        document: {
          id: 'doc-sample-1',
          fileName: 'Database_Management_Systems_Lab_Assignment.pdf',
          fileSize: 2457600,
          fileType: 'application/pdf',
          uploadProgress: 100,
          status: 'ready',
          settings: {
            colorMode: 'bw',
            paperSize: 'A4',
            orientation: 'portrait',
            duplexMode: 'double',
            copies: 1,
            pageSelection: 'all',
            pageCount: 16,
            binding: 'spiral',
            notes: 'Cover page on thick sheet please',
          },
          calculatedPrice: 67, // 16 pages B&W (₹32) + spiral binding (₹35)
        },
      },
      {
        type: 'stationery',
        product: INITIAL_PRODUCTS[0], // Octane gel pen
        quantity: 1,
      },
    ],
    stationerySubtotal: 50,
    printingSubtotal: 67,
    deliveryFee: 15,
    totalAmount: 132,
    deliveryDetails: {
      method: 'classroom_delivery',
      studentName: 'Himanshu Kumar',
      phone: '7061752337',
      category: 'academic',
      destinationName: 'BCA–BBA Academic Building',
      department: 'BCA',
      academicYear: '3rd year',
      batch: '2024–2027',
      floor: 'Basement',
      classroom: 'B-202',
      formattedDestination: 'BCA–BBA Academic Building → Basement → Classroom B-202',
      instructions: 'Deliver quietly during practical session.',
    },
    paymentMethod: 'demo',
    paymentStatus: 'Paid — Demo',
    status: 'On the Way',
    estimatedTime: '8 - 12 mins',
    timeline: [
      {
        status: 'Requested',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: 'Order placed by student with simulated payment',
      },
      {
        status: 'Processing',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: 'Documents queued for printing at Central Campus Stationery & Print Shop',
      },
      {
        status: 'Printing Complete',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: 'Spiral binding completed and packaged',
      },
      {
        status: 'On the Way',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: 'Campus delivery runner dispatched to BCA–BBA Academic Building, Basement, B-202',
      },
    ],
  },
  {
    id: 'PX-1002',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    userId: 'usr-student-01',
    studentName: 'Himanshu Kumar',
    studentEmail: '24355EW021@glbim.ac.in',
    studentPhone: '7061752337',
    items: [
      {
        type: 'stationery',
        product: INITIAL_PRODUCTS[3], // Classmate Long Ruled Register
        quantity: 2,
      },
      {
        type: 'stationery',
        product: INITIAL_PRODUCTS[10], // Sticky notes
        quantity: 1,
      },
    ],
    stationerySubtotal: 240,
    printingSubtotal: 0,
    deliveryFee: 0,
    totalAmount: 240,
    deliveryDetails: {
      method: 'counter_pickup',
      studentName: 'Himanshu Kumar',
      phone: '7061752337',
      category: 'shop',
      destinationName: 'Central Campus Stationery & Print Shop',
      formattedDestination: 'Central Campus Stationery & Print Shop (Counter Pickup)',
    },
    paymentMethod: 'demo',
    paymentStatus: 'Paid — Demo',
    status: 'Collected',
    estimatedTime: 'Ready',
    timeline: [
      {
        status: 'Requested',
        timestamp: '10:05 AM',
        description: 'Order confirmed and paid',
      },
      {
        status: 'Processing',
        timestamp: '10:10 AM',
        description: 'Stationery packaged for pickup',
      },
      {
        status: 'Ready for Pickup',
        timestamp: '10:15 AM',
        description: 'Ready at Central Campus Stationery & Print Shop counter',
      },
      {
        status: 'Collected',
        timestamp: '10:45 AM',
        description: 'Student collected order at shop counter with Order ID',
      },
    ],
  },
];
