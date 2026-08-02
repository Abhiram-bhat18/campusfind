import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone, BookOpen, Key, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithCredentials, registerWithCredentials } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT'>('LOGIN');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engg');
  const [yearOfStudy, setYearOfStudy] = useState(3);
  const [studentId, setStudentId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Status
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = loginWithCredentials(email, password);
    if (res.success) {
      setSuccessMsg('Signed in successfully!');
      setTimeout(() => {
        onClose();
      }, 800);
    } else {
      setErrorMsg(res.message || 'Invalid credentials');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = registerWithCredentials(email, password, {
      full_name: fullName,
      department,
      year_of_study: Number(yearOfStudy),
      student_id: studentId,
      whatsapp_number: whatsapp
    });

    if (res.success) {
      setSuccessMsg('Account registered & verified successfully! Welcome to CampusFind.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Password reset instructions sent to your college email!');
    setTimeout(() => {
      setMode('LOGIN');
      setSuccessMsg('');
    }, 2000);
  };

  const quickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center space-y-1 mb-6">
          <div className="w-12 h-12 rounded-2xl gradient-blue-hero flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {mode === 'LOGIN' ? 'Sign In to CampusFind' : mode === 'REGISTER' ? 'Create Campus Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'LOGIN'
              ? 'Access your lost reports, claims, and realtime chat.'
              : mode === 'REGISTER'
              ? 'Verified sign up for college students & faculty.'
              : 'Enter your registered college email.'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'LOGIN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('REGISTER'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'REGISTER' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM: LOGIN */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">College Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-500 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                Remember credentials
              </label>
              <button
                type="button"
                onClick={() => setMode('FORGOT')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.01] transition-transform"
            >
              Sign In to Account
            </button>

            {/* Demo Accounts Quick Login */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-semibold block mb-2">QUICK TEST ACCOUNTS:</span>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => quickFill('alex.chen@campus.edu', 'student123')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-900"
                >
                  Student (Alex)
                </button>
                <button
                  type="button"
                  onClick={() => quickFill('admin@campus.edu', 'admin123')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-900"
                >
                  Admin (Security)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* FORM: REGISTER */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">College Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Student ID (Optional)</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. CS2024-8849"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Year of Study</label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">WhatsApp Contact *</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+919876543210"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md mt-2"
            >
              Complete Verified Sign Up
            </button>
          </form>
        )}

        {/* FORM: FORGOT */}
        {mode === 'FORGOT' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">College Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Send Reset Link
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
