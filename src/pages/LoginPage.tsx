import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Role>('student');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!emailOrId.trim()) {
      setError('Please provide your college email or Student ID.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ emailOrId, password, role: activeTab });
      setIsLoading(false);
      navigate(activeTab === 'admin' ? '/admin' : '/');
    } catch {
      setError('Authentication failed. Please check credentials.');
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (role: Role) => {
    demoLogin(role);
    navigate(role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo and Greeting */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Logo size="lg" showTagline={false} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-theme-main">
            Welcome to PrintXpress
          </h1>
          <p className="text-xs text-theme-muted">
            Sign in with your campus identity to order stationery and print documents
          </p>
        </div>

        {/* Quick-Access Demo Bar */}
        <div className="bg-theme-card border border-[#FFCC00]/40 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FFCC00]">
            <Sparkles className="w-4 h-4" />
            <span>Fast Sign-In (Demo Access)</span>
          </div>
          <p className="text-[11px] text-theme-muted">
            Select a profile below to instantly sign in for evaluation:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="py-2 px-3 rounded-xl bg-theme-input hover:bg-theme-card border border-theme hover:border-[#FFCC00] text-xs font-semibold text-theme-main transition-all text-left flex items-center justify-between"
            >
              <span>Demo Student</span>
              <span className="text-[#FFCC00] text-xs">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-3 rounded-xl bg-theme-input hover:bg-theme-card border border-theme hover:border-emerald-500 text-xs font-semibold text-emerald-500 transition-all text-left flex items-center justify-between"
            >
              <span>Demo Operator</span>
              <span className="text-emerald-500 text-xs">→</span>
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-theme-card border border-theme rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          {/* Tab Selector: Student vs Operator */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-theme-input rounded-2xl border border-theme">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'student'
                  ? 'bg-[#FFCC00] text-[#0B1016] shadow-sm'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'admin'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-theme-muted hover:text-theme-main'
              }`}
            >
              Admin / Operator
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted block mb-1.5">
                {activeTab === 'student' ? 'College Email or Student ID' : 'Staff Email / Operator ID'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder={activeTab === 'student' ? 'e.g. 241117106094 or 24355EW021@glbim.ac.in' : 'admin@printxpress.campus.edu'}
                  className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl pl-9 pr-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#FFCC00] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-theme-input text-xs text-theme-main border border-theme rounded-xl pl-9 pr-3 py-2.5 focus:border-[#FFCC00] focus:outline-none"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg ${
                activeTab === 'student'
                  ? 'bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016]'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              <span>{isLoading ? 'Authenticating...' : `Sign In as ${activeTab === 'student' ? 'Student' : 'Operator'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration link */}
          <div className="text-center text-xs text-theme-muted pt-2 border-t border-theme">
            Don&apos;t have a student account yet?{' '}
            <Link to="/register" className="text-[#FFCC00] font-bold hover:underline">
              Register Student ID
            </Link>
          </div>
        </div>

        {/* Note */}
        <div className="text-center text-[11px] text-theme-muted/80 flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#FFCC00]" />
          <span>Demo mode active. Any test password will log you in successfully.</span>
        </div>

      </div>
    </div>
  );
};

