'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
  checkAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      console.log('Checking auth...');
      const response = await fetch('http://localhost:5000/auth/session', {
        credentials: 'include',
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
      } else if (response.status === 401) {
        console.log('No user session');
        setUser(null);
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra auth:', error);
      setUser(null);
    }
  };

  const login = (userData: User) => {
    const safeUserData = { ...userData, name: userData.name || 'User' };
    setUser(safeUserData);
  };

  const logout = async () => {
    try {
      console.log('Starting logout...');
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Logout response status:', response.status);
      if (response.ok) {
        setUser(null);
        await checkAuth();
        console.log('Redirecting to /');
        router.push('/');
      } else {
        console.error('Lỗi khi đăng xuất:', await response.json());
      }
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};