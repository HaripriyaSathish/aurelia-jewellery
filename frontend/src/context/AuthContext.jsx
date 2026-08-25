import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aurelia_access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('aurelia_access_token');
        localStorage.removeItem('aurelia_refresh_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const storeTokens = (data) => {
    localStorage.setItem('aurelia_access_token', data.access);
    localStorage.setItem('aurelia_refresh_token', data.refresh);
  };

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    storeTokens(data);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    storeTokens(data);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aurelia_access_token');
    localStorage.removeItem('aurelia_refresh_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
