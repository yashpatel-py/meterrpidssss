import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'meteorroids_admin_token_v1';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(STORAGE_KEY) || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const resetAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000'}/api/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Profile request failed');
        }

        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        resetAuth();
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token, resetAuth]);

  const login = useCallback(async (email, password) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000'}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unable to login' }));
      throw new Error(error.error || 'Unable to login');
    }

    const data = await response.json();
    window.localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    resetAuth();
  }, [resetAuth]);

  const value = useMemo(
    () => ({ token, user, loading, login, logout, isAuthenticated: Boolean(token && user) }),
    [token, user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
