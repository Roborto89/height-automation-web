"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/database';
import { User } from '@/lib/mockDb';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updatePassword: (password: string) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('height_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const result = await db.authenticate(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('height_user', JSON.stringify(result.user));
        setIsLoading(false);
        return { success: true, user: result.user };
      }
      setIsLoading(false);
      return { success: false, message: result.message };
    } catch (err) {
      console.error("Login sequence failed:", err);
    }
    setIsLoading(false);
    return { success: false, message: 'Network or system failure.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('height_user');
  };

  const updatePassword = async (password: string) => {
    try {
      if (user) {
        await db.updatePassword(user.id, user.email, password);
        const updatedUser = { ...user, mustChangePassword: false };
        setUser(updatedUser);
        localStorage.setItem('height_user', JSON.stringify(updatedUser));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to update password." };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
