import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Building,
  Save,
  CheckCircle,
  Sparkles,
  ClipboardList,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import {
  CAMPUS_DESTINATIONS,
  COLLEGE_DEPARTMENTS,
  COLLEGE_BATCHES,
  COMMON_FLOORS,
} from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, demoLogin, role } = useAuth();
  const { getUserOrders } = useOrders();
  const { itemCount } = useCart();

  const userOrders = getUserOrders(user?.id || 'usr-student-01');

  const academicBuildings = CAMPUS_DESTINATIONS.academic.items;

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || 'BCA');
  const [academicYear, setAcademicYear] = useState(user?.academicYear || '3rd year');
  const [batch, setBatch] = useState(user?.batch || '2024–2027');
  const [building, setBuilding] = useState(user?.savedClassroom?.building || 'BCA–BBA Academic Building');
  const [floor, setFloor] = useState(user?.savedClassroom?.floor || 'Basement');
  const [classroom, setClassroom] = useState(user?.savedClassroom?.classroom || 'B-202');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      department,
      academicYear,
      batch,
      savedClassroom: {
        building,
        floor,
        classroom,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-theme pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-xs font-bold text-[#FFCC00] mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Campus Identity</span>
          </div>
          <h1 className="text-3xl font-extrabold text-theme-main">
            Student Profile & Settings
          </h1>
          <p className="text-xs text-theme-muted mt-1">
            Manage your default classroom delivery coordinates and contact info
          </p>
        </div>

        {/* Demo switcher */}
        <div className="flex items-center gap-2">
          {role === 'student' ? (
            <button
              onClick={() => demoLogin('admin')}
              className="flex items-center gap-2 text-xs font-bold bg-theme-input hover:bg-theme-card border border-emerald-500/40 text-emerald-400 px-4 py-2 rounded-xl transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Switch to Admin Mode</span>
            </button>
          ) : (
            <button
              onClick={() => demoLogin('student')}
              className="flex items-center gap-2 text-xs font-bold bg-theme-input hover:bg-theme-card border border-[#FFCC00]/40 text-[#FFCC00] px-4 py-2 rounded-xl transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Switch to Student Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-theme-card border border-theme rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00]">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-black text-theme-main">{userOrders.length}</p>
            <p className="text-xs text-theme-muted">Total Orders Placed</p>
          </div>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00]/30 flex items-center justify-center text-[#FFCC00]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-black text-theme-main">{itemCount}</p>
            <p className="text-xs text-theme-muted">Items in Cart</p>
          </div>
        </div>

        <div className="bg-theme-card border border-theme rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-black text-theme-main">{user?.studentId || '241117106094'}</p>
            <p className="text-xs text-theme-muted">Roll Number</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-theme pb-4">
          <h2 className="text-base font-bold text-theme-main">
            Personal & Academic Details
          </h2>
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold animate-in fade-in">
              <CheckCircle className="w-4 h-4" /> Preferences Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
              College Email (Protected)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || '24355EW021@glbim.ac.in'}
              className="w-full bg-theme-input/50 text-xs text-theme-muted border border-theme rounded-xl px-3 py-2.5 cursor-not-allowed opacity-80"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
              Student Roll Number (Protected)
            </label>
            <input
              type="text"
              disabled
              value={user?.studentId || '241117106094'}
              className="w-full bg-theme-input/50 text-xs text-theme-muted border border-theme rounded-xl px-3 py-2.5 cursor-not-allowed opacity-80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
              Program / Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
            >
              {COLLEGE_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
              Academic Year
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
            >
              <option value="1st year">1st year</option>
              <option value="2nd year">2nd year</option>
              <option value="3rd year">3rd year</option>
              <option value="4th year">4th year</option>
              <option value="5th year">5th year</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
              Batch
            </label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
            >
              {COLLEGE_BATCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Saved Classroom Coordinates */}
        <div className="pt-4 border-t border-theme space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FFCC00]">
            <MapPin className="w-4 h-4" />
            <span>Default Campus Delivery Location (Auto-Filled at Checkout)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                Academic Building
              </label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
              >
                {academicBuildings.map((bldg) => (
                  <option key={bldg} value={bldg}>
                    {bldg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                Floor
              </label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
              >
                {COMMON_FLOORS.map((fl) => (
                  <option key={fl} value={fl}>
                    {fl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                Classroom / Room
              </label>
              <input
                type="text"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl px-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};

