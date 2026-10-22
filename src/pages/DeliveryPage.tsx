import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Store,
  ArrowRight,
  ArrowLeft,
  Clock,
  Building,
  Home,
  Coffee,
  Activity,
  User,
  Phone,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import {
  DeliveryMethod,
  DeliveryDetails,
  DestinationCategory,
} from '../types';
import {
  OFFICIAL_COLLEGE_ADDRESS,
  CENTRAL_SHOP_NAME,
  CAMPUS_DESTINATIONS,
  ACADEMIC_PROGRAM_MAP,
  COMMON_FLOORS,
  COLLEGE_BATCHES,
} from '../data/mockData';

export const DeliveryPage: React.FC = () => {
  const { user } = useAuth();
  const { items, stationerySubtotal, printingSubtotal, totalBeforeDelivery } = useCart();
  const { printRates } = useOrders();
  const navigate = useNavigate();

  // If cart is empty, redirect back to cart
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Delivery Method state
  const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod>('classroom_delivery');

  // Step 1: Destination Category
  const [category, setCategory] = useState<DestinationCategory>(
    user?.savedClassroom?.category || 'academic'
  );

  // Step 2: Destination Name
  const availableDestinations = CAMPUS_DESTINATIONS[category].items;
  const [destinationName, setDestinationName] = useState<string>(
    user?.savedClassroom?.building || availableDestinations[0]
  );

  // Update destinationName when category changes if not valid
  useEffect(() => {
    const validItems = CAMPUS_DESTINATIONS[category].items;
    if (!validItems.includes(destinationName)) {
      setDestinationName(validItems[0]);
    }
  }, [category, destinationName]);

  // Common contact info (prefilled from student profile)
  const [studentName, setStudentName] = useState(user?.name || 'Himanshu Kumar');
  const [phone, setPhone] = useState(user?.phone || '7061752337');

  // Academic Building fields
  const availablePrograms = ACADEMIC_PROGRAM_MAP[destinationName] || ['BCA', 'BBA', 'B.Tech'];
  const [department, setDepartment] = useState<string>(user?.department || 'BCA');
  const [batch, setBatch] = useState<string>(user?.batch || '2024–2027');
  const [floor, setFloor] = useState<string>(user?.savedClassroom?.floor || 'Basement');
  const [classroom, setClassroom] = useState<string>(user?.savedClassroom?.classroom || 'B-202');

  // Hostel fields
  const [blockWing, setBlockWing] = useState<string>('');
  const [roomNumber, setRoomNumber] = useState<string>('104');

  // Canteen / Sports Ground fields
  const [tableInstructions, setTableInstructions] = useState<string>('');
  const [meetingPoint, setMeetingPoint] = useState<string>('');
  const [generalInstructions, setGeneralInstructions] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or adjust department when destinationName changes
  useEffect(() => {
    if (category === 'academic') {
      const programs = ACADEMIC_PROGRAM_MAP[destinationName];
      if (programs && programs.length > 0 && !programs.includes(department)) {
        setDepartment(programs[0]);
      }
      if (destinationName === 'BCA–BBA Academic Building') {
        if (!floor) setFloor('Basement');
        if (!classroom) setClassroom('B-202');
      }
    }
  }, [destinationName, category, department, floor, classroom]);

  // Synchronize Counter Pickup mode
  useEffect(() => {
    if (selectedMethod === 'counter_pickup') {
      setCategory('shop');
      setDestinationName(CENTRAL_SHOP_NAME);
    } else if (category === 'shop') {
      // If student manually selects shop inside campus delivery, treat as pickup fee
    }
  }, [selectedMethod, category]);

  // Delivery fee computation
  const isShopPickup = selectedMethod === 'counter_pickup' || category === 'shop';
  const deliveryFee = isShopPickup ? 0 : printRates.classroomDeliveryFee;
  const finalPayable = totalBeforeDelivery + deliveryFee;

  // Formatted human-readable destination string for order details
  const getFormattedDestination = (): string => {
    if (isShopPickup) {
      return `${CENTRAL_SHOP_NAME} (Counter Pickup)`;
    }
    if (category === 'academic') {
      return `${destinationName} → ${floor || 'Floor'} → Room ${classroom || 'TBD'} (${department})`;
    }
    if (category === 'hostel') {
      return `${destinationName}${blockWing ? ` (${blockWing})` : ''} → Room ${roomNumber}`;
    }
    if (category === 'canteen') {
      return `${destinationName}${tableInstructions ? ` (${tableInstructions})` : ''}`;
    }
    if (category === 'sports') {
      return `Sports Ground${meetingPoint ? ` (${meetingPoint})` : ''}`;
    }
    return destinationName;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!phone.trim() || phone.trim().length < 8) newErrors.phone = 'Valid 10-digit phone number is required';

    if (!isShopPickup) {
      if (category === 'academic') {
        if (!department.trim()) newErrors.department = 'Program/Department is required';
        if (!floor.trim()) newErrors.floor = 'Floor is required';
        if (!classroom.trim()) newErrors.classroom = 'Classroom number is required';
      } else if (category === 'hostel') {
        if (!roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedDest = getFormattedDestination();

    const deliveryData: DeliveryDetails = {
      method: isShopPickup ? 'counter_pickup' : 'classroom_delivery',
      studentName,
      phone,
      category,
      destinationName,
      department: category === 'academic' ? department : undefined,
      batch: category === 'academic' ? batch : undefined,
      floor: category === 'academic' ? floor : undefined,
      classroom: category === 'academic' ? classroom : undefined,
      hostelBuilding: category === 'hostel' ? destinationName : undefined,
      blockWing: category === 'hostel' ? blockWing : undefined,
      roomNumber: category === 'hostel' ? roomNumber : undefined,
      canteenName: category === 'canteen' ? destinationName : undefined,
      tableInstructions: category === 'canteen' ? tableInstructions : undefined,
      meetingPoint: category === 'sports' ? meetingPoint : undefined,
      instructions: generalInstructions || undefined,
      formattedDestination: formattedDest,
      building: destinationName,
    };

    sessionStorage.setItem('printxpress_pending_delivery', JSON.stringify(deliveryData));
    navigate('/checkout/payment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-theme pb-6">
        <div>
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-1.5 text-xs text-theme-muted hover:text-[#FFCC00] mb-2 font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shopping Cart</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-main">
            Campus Delivery & Pickup
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Choose delivery to your classroom, hostel, canteen, or collect from the central shop
          </p>
        </div>
      </div>

      <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Delivery Method & Step-by-Step Form */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Step 0: Method Switcher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* OPTION 1: Deliver to Campus */}
            <div
              onClick={() => {
                setSelectedMethod('classroom_delivery');
                if (category === 'shop') setCategory('academic');
              }}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between shadow-sm ${
                selectedMethod === 'classroom_delivery' && category !== 'shop'
                  ? 'border-[#FFCC00] bg-theme-card shadow-lg ring-1 ring-[#FFCC00]/20'
                  : 'border-theme bg-theme-card hover:border-theme/80 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFCC00]/15 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-yellow-600 dark:text-[#FFCC00] bg-[#FFCC00]/15 border border-[#FFCC00]/30 px-2.5 py-1 rounded-full">
                    +₹{printRates.classroomDeliveryFee} delivery
                  </span>
                </div>

                <h3 className="text-base font-bold text-theme-main">
                  Deliver to Campus Location
                </h3>
                <p className="text-xs text-theme-muted mt-1.5 leading-relaxed">
                  Campus runners deliver directly to your academic classroom, hostel room, canteen, or sports ground in 10-15 minutes.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-theme flex items-center justify-between text-xs">
                <span className="text-theme-muted flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFCC00]" /> 10-15 mins delivery
                </span>
                <span className={`font-bold ${selectedMethod === 'classroom_delivery' && category !== 'shop' ? 'text-[#FFCC00]' : 'text-theme-muted'}`}>
                  {selectedMethod === 'classroom_delivery' && category !== 'shop' ? 'Selected ✓' : 'Select'}
                </span>
              </div>
            </div>

            {/* OPTION 2: Counter Pickup at Central Shop */}
            <div
              onClick={() => {
                setSelectedMethod('counter_pickup');
                setCategory('shop');
                setDestinationName(CENTRAL_SHOP_NAME);
              }}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between shadow-sm ${
                isShopPickup
                  ? 'border-[#FFCC00] bg-theme-card shadow-lg ring-1 ring-[#FFCC00]/20'
                  : 'border-theme bg-theme-card hover:border-theme/80 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                    <Store className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    FREE (₹0)
                  </span>
                </div>

                <h3 className="text-base font-bold text-theme-main">
                  Pick Up from Central Shop
                </h3>
                <p className="text-xs text-theme-muted mt-1.5 leading-relaxed">
                  Collect your packaged order directly from the counter at {CENTRAL_SHOP_NAME} with zero wait time.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-theme flex items-center justify-between text-xs">
                <span className="text-theme-muted flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFCC00]" /> Ready in 5-10 mins
                </span>
                <span className={`font-bold ${isShopPickup ? 'text-[#FFCC00]' : 'text-theme-muted'}`}>
                  {isShopPickup ? 'Selected ✓' : 'Select'}
                </span>
              </div>
            </div>

          </div>

          {/* SMART STEP-BY-STEP CAMPUS LOCATION SELECTOR */}
          <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            
            {/* Step 1: Destination Category Selection */}
            {!isShopPickup ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFCC00] text-[#0B1016] text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-theme-main">
                    Select Destination Category
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('academic');
                      setSelectedMethod('classroom_delivery');
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      category === 'academic'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main shadow-sm'
                        : 'border-theme bg-theme-input text-theme-muted hover:text-theme-main'
                    }`}
                  >
                    <Building className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                    <span>Academic Building</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('hostel');
                      setSelectedMethod('classroom_delivery');
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      category === 'hostel'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main shadow-sm'
                        : 'border-theme bg-theme-input text-theme-muted hover:text-theme-main'
                    }`}
                  >
                    <Home className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                    <span>Hostel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('canteen');
                      setSelectedMethod('classroom_delivery');
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      category === 'canteen'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main shadow-sm'
                        : 'border-theme bg-theme-input text-theme-muted hover:text-theme-main'
                    }`}
                  >
                    <Coffee className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                    <span>Canteen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('sports');
                      setSelectedMethod('classroom_delivery');
                    }}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      category === 'sports'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-theme-main shadow-sm'
                        : 'border-theme bg-theme-input text-theme-muted hover:text-theme-main'
                    }`}
                  >
                    <Activity className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                    <span>Sports Ground</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-theme-input border border-theme flex items-start gap-3">
                <Store className="w-5 h-5 text-[#FFCC00] flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-theme-main">Counter Pickup Point:</p>
                  <p className="text-theme-muted">{CENTRAL_SHOP_NAME}</p>
                  <p className="text-theme-muted/80">{OFFICIAL_COLLEGE_ADDRESS}</p>
                </div>
              </div>
            )}

            {/* Step 2: Destination Dropdown based on Category */}
            {!isShopPickup && (
              <div className="space-y-3 pt-2 border-t border-theme">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFCC00] text-[#0B1016] text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-theme-main">
                    Choose Specific {CAMPUS_DESTINATIONS[category].label}
                  </label>
                </div>

                <select
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  className="w-full bg-theme-input text-xs sm:text-sm font-semibold text-theme-main border border-theme rounded-xl px-3.5 py-3 focus:outline-none focus:border-[#FFCC00] transition-colors"
                >
                  {CAMPUS_DESTINATIONS[category].items.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Step 3: Dynamic Relevant Fields */}
            <div className="space-y-4 pt-2 border-t border-theme">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFCC00] text-[#0B1016] text-xs font-black flex items-center justify-center">
                  {!isShopPickup ? '3' : '1'}
                </span>
                <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-theme-main">
                  {!isShopPickup ? 'Location Details & Recipient Contact' : 'Pickup Recipient Contact'}
                </label>
              </div>

              {/* Dynamic Academic Building Fields */}
              {!isShopPickup && category === 'academic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                        Department / Program *
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3.5 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                      >
                        {availablePrograms.map((prog) => (
                          <option key={prog} value={prog}>
                            {prog}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                        Batch / Academic Year
                      </label>
                      <select
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3.5 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                      >
                        {COLLEGE_BATCHES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                        Floor *
                      </label>
                      <select
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        className={`w-full bg-theme-input text-xs text-theme-main border rounded-xl px-3.5 py-2.5 focus:outline-none ${
                          errors.floor ? 'border-rose-500' : 'border-theme focus:border-[#FFCC00]'
                        }`}
                      >
                        {COMMON_FLOORS.map((fl) => (
                          <option key={fl} value={fl}>
                            {fl}
                          </option>
                        ))}
                      </select>
                      {errors.floor && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.floor}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                        Classroom / Lab Number *
                      </label>
                      <input
                        type="text"
                        value={classroom}
                        onChange={(e) => setClassroom(e.target.value)}
                        placeholder="e.g. B-202, Room 105"
                        className={`w-full bg-theme-input text-xs text-theme-main border rounded-xl px-3.5 py-2.5 focus:outline-none ${
                          errors.classroom ? 'border-rose-500' : 'border-theme focus:border-[#FFCC00]'
                        }`}
                      />
                      {errors.classroom && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.classroom}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Hostel Fields */}
              {!isShopPickup && category === 'hostel' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                      Block or Wing (Optional)
                    </label>
                    <input
                      type="text"
                      value={blockWing}
                      onChange={(e) => setBlockWing(e.target.value)}
                      placeholder="e.g. Wing A, Block 2"
                      className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3.5 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g. 104, 212"
                      className={`w-full bg-theme-input text-xs text-theme-main border rounded-xl px-3.5 py-2.5 focus:outline-none ${
                        errors.roomNumber ? 'border-rose-500' : 'border-theme focus:border-[#FFCC00]'
                      }`}
                    />
                    {errors.roomNumber && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.roomNumber}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Dynamic Canteen Fields */}
              {!isShopPickup && category === 'canteen' && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                    Table or Meeting Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={tableInstructions}
                    onChange={(e) => setTableInstructions(e.target.value)}
                    placeholder="e.g. Corner table near water dispenser, or main entrance counter"
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3.5 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                  />
                </div>
              )}

              {/* Dynamic Sports Ground Fields */}
              {!isShopPickup && category === 'sports' && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                    Meeting Point Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    placeholder="e.g. Near pavilion stands, basketball court gate"
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3.5 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                  />
                </div>
              )}

              {/* Student Name & Phone (Always relevant) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                    Student Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Student full name"
                      className={`w-full bg-theme-input text-xs text-theme-main border rounded-xl pl-9 pr-3 py-2.5 focus:outline-none ${
                        errors.studentName ? 'border-rose-500' : 'border-theme focus:border-[#FFCC00]'
                      }`}
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                  </div>
                  {errors.studentName && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.studentName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 7061752337"
                      className={`w-full bg-theme-input text-xs text-theme-main border rounded-xl pl-9 pr-3 py-2.5 focus:outline-none ${
                        errors.phone ? 'border-rose-500' : 'border-theme focus:border-[#FFCC00]'
                      }`}
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Optional general delivery notes */}
              {!isShopPickup && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={generalInstructions}
                    onChange={(e) => setGeneralInstructions(e.target.value)}
                    placeholder="e.g. Ongoing lecture in progress, please hand over quietly at door"
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3.5 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                  />
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Right Column: Order Summary & Destination Card */}
        <div className="lg:col-span-4">
          <div className="bg-theme-card border border-theme rounded-3xl p-6 space-y-6 shadow-xl sticky top-24">
            <h2 className="text-base font-bold text-theme-main border-b border-theme pb-4">
              Selected Campus Destination
            </h2>

            {/* Destination Pill Summary */}
            <div className="p-4 rounded-2xl bg-theme-input border border-theme space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFCC00] block">
                Destination Summary
              </span>
              <p className="text-xs sm:text-sm font-bold text-theme-main leading-snug">
                {getFormattedDestination()}
              </p>
              <p className="text-[11px] text-theme-muted">
                Recipient: <span className="text-theme-main font-semibold">{studentName}</span> ({phone})
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-theme-muted">
                <span>Stationery Items</span>
                <span className="text-theme-main font-bold">₹{stationerySubtotal}</span>
              </div>

              <div className="flex items-center justify-between text-theme-muted">
                <span>Print Jobs</span>
                <span className="text-theme-main font-bold">₹{printingSubtotal}</span>
              </div>

              <div className="flex items-center justify-between text-theme-muted">
                <span>Campus Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-emerald-500 font-bold' : 'text-theme-main font-bold'}>
                  {deliveryFee === 0 ? 'FREE (₹0)' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-theme flex items-center justify-between text-sm font-black">
                <span className="text-theme-main">Total Payable</span>
                <span className="text-2xl font-black text-[#FFCC00]">
                  ₹{finalPayable}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] font-bold text-sm py-4 rounded-xl shadow-lg hover:shadow-[#FFCC00]/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-theme-muted">
              Step 2 of 3 • Next: Simulated Payment
            </p>
          </div>
        </div>

      </form>
    </div>
  );
};
