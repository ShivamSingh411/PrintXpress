import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Building,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import {
  COLLEGE_DEPARTMENTS,
  COLLEGE_BATCHES,
} from '../data/mockData';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState(COLLEGE_DEPARTMENTS[0]);
  const [batch, setBatch] = useState(COLLEGE_BATCHES[3]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError('Please enter your full name');
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid college email');
    if (!studentId.trim()) return setError('Please enter your Student ID / Roll Number');
    if (password.length < 4) return setError('Password must be at least 4 characters long');
    if (password !== confirmPassword) return setError('Passwords do not match');

    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        studentId: studentId.toUpperCase(),
        department,
        batch,
        phone: '7061752337',
      });
      setIsSubmitting(false);
      navigate('/');
    } catch {
      setError('Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Logo and Greeting */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Logo size="lg" showTagline={false} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-main">
            Create Student Account
          </h1>
          <p className="text-xs text-theme-muted">
            Register your college credentials to unlock classroom delivery and print credits
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & Student ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Himanshu Kumar"
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl pl-9 pr-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                  Student Roll No *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 241117106094"
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl pl-9 pr-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                    required
                  />
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                </div>
              </div>
            </div>

            {/* College Email */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                College Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. 24355EW021@glbim.ac.in"
                  className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl pl-9 pr-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
              </div>
            </div>

            {/* Department & Batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                  Department / Program *
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
                  Batch / Year *
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

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl pl-9 pr-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl pl-9 pr-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[#FFCC00]/20"
            >
              <span>{isSubmitting ? 'Creating Student Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-xs text-theme-muted pt-2 border-t border-theme">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FFCC00] font-bold hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

