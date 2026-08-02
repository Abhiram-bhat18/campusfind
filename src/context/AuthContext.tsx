import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DatabaseService } from '../services/dbService';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithCredentials: (email: string, pass: string) => { success: boolean; message?: string };
  registerWithCredentials: (
    email: string,
    pass: string,
    profileData: Partial<UserProfile>
  ) => { success: boolean; message?: string };
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => DatabaseService.getCurrentSession());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    DatabaseService.setCurrentSession(currentUser);
  }, [currentUser]);

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const loginWithCredentials = (email: string, pass: string) => {
    const res = DatabaseService.loginUser(email, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const registerWithCredentials = (email: string, pass: string, profileData: Partial<UserProfile>) => {
    const res = DatabaseService.registerUser(email, pass, profileData);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const logout = () => {
    setCurrentUser(null);
    DatabaseService.setCurrentSession(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    DatabaseService.setCurrentSession(updated);
  };

  const switchRole = (role: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    DatabaseService.setCurrentSession(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithCredentials,
        registerWithCredentials,
        logout,
        updateProfile,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
