import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  MapPin,
  MessageSquare,
  Bell,
  User,
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  CheckCircle,
  Award,
  LogOut,
  QrCode,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const { currentUser, logout, switchRole, openAuthModal } = useAuth();
  const { notifications, markNotificationsAsRead, clearAllData } = useData();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.is_read);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl gradient-blue-hero flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                  CampusFind
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  AI Smart
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium hidden sm:block">
                College Lost & Found Hub
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Search className="w-4 h-4" />
              Feed
            </Link>
            <Link
              to="/map"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/map')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Campus Map
            </Link>
            <Link
              to="/claims"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/claims')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Claims & Verification
            </Link>
            <Link
              to="/messages"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/messages')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Messages
            </Link>
            <Link
              to="/leaderboard"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive('/leaderboard')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Award className="w-4 h-4" />
              Leaderboard
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">

            {/* Quick Action Button */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/report-lost"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800/40 hover:bg-red-100 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Report Lost
              </Link>
              <Link
                to="/report-found"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Report Found
              </Link>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setProfileDropdownOpen(false);
                  if (unreadNotifs.length > 0) markNotificationsAsRead();
                }}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping" />
                )}
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl p-4 shadow-xl z-50 border border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-blue-500" /> Notifications
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">{notifications.length} Total</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{n.title}</span>
                            <span className="text-[10px] text-slate-400">Just now</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar or Sign In Button */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all"
                >
                  <img
                    src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="Avatar"
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/40"
                  />
                </button>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-transform hover:scale-105"
                >
                  Sign In / Sign Up
                </button>
              )}

              {/* Profile Dropdown */}
              {currentUser && profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl p-4 shadow-xl z-50 border border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{currentUser?.full_name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> {currentUser?.role}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                        {currentUser?.reputation_points} pts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-500" /> My Profile & Stats
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                    >
                      <Shield className="w-4 h-4 text-indigo-500" /> Admin Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        switchRole(currentUser?.role === 'ADMIN' ? 'STUDENT' : 'ADMIN');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-emerald-500" /> Role Toggle
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {currentUser?.role === 'ADMIN' ? 'To Student' : 'To Admin'}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        clearAllData();
                        logout();
                        setProfileDropdownOpen(false);
                        window.location.reload();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Clear Demo Data
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/report-lost"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-red-500 text-white shadow-md shadow-red-500/20"
            >
              <PlusCircle className="w-4 h-4" /> Report Lost
            </Link>
            <Link
              to="/report-found"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" /> Report Found
            </Link>
          </div>

          <div className="space-y-1 pt-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Search className="w-4 h-4 text-blue-500" /> Feed & Search
            </Link>
            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <MapPin className="w-4 h-4 text-indigo-500" /> Campus Map
            </Link>
            <Link
              to="/claims"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Claims & Verification
            </Link>
            <Link
              to="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <MessageSquare className="w-4 h-4 text-cyan-500" /> Messages
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Award className="w-4 h-4 text-amber-500" /> Leaderboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
