import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { HomeFeed } from './pages/HomeFeed';
import { ReportWizard } from './pages/ReportWizard';
import { ItemDetail } from './pages/ItemDetail';
import { CampusMap } from './pages/CampusMap';
import { ClaimsPortal } from './pages/ClaimsPortal';
import { MessagingView } from './pages/MessagingView';
import { UserProfileView } from './pages/UserProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = window.localStorage.getItem('campusfind-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { authModalOpen, closeAuthModal, openAuthModal, currentUser } = useAuth();

  useEffect(() => {
    window.localStorage.setItem('campusfind-theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!currentUser) {
      openAuthModal();
    }
  }, [currentUser]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Top Navigation */}
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Global Auth Modal */}
        <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />

        {/* Main Application Routes */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomeFeed />} />
            <Route path="/report-lost" element={<ReportWizard />} />
            <Route path="/report-found" element={<ReportWizard />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/map" element={<CampusMap />} />
            <Route path="/claims" element={<ClaimsPortal />} />
            <Route path="/messages" element={<MessagingView />} />
            <Route path="/profile" element={<UserProfileView />} />
            <Route path="/leaderboard" element={<UserProfileView />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Modern Footer */}
        <footer className="glass-panel border-t border-slate-200/80 dark:border-slate-800 py-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-blue-hero flex items-center justify-center text-white font-bold text-xs">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">CampusFind</span>
              <span className="text-xs text-slate-400 font-medium">| AI Lost & Found System</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> WCAG Compliant
              </span>
              <span>•</span>
              <span>College Security Hotline: 1800-CAMPUS</span>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for College Students
            </p>
          </div>
        </footer>

      </div>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
