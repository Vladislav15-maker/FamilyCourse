
"use client";
import type { User } from '@/lib/types';
import { users } from '@/lib/data';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password_provided: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for persisted user session (e.g., from localStorage)
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem('currentUser');
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password_provided: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = users.find(u => u.username === username && u.password === password_provided);
    if (user) {
      const { password, ...userToStore } = user; // Don't store password
      setCurrentUser(userToStore);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      setLoading(false);
      return true;
    }
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
