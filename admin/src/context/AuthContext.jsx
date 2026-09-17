import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('chatter_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      if (data.user.role !== 'admin') {
        localStorage.removeItem('chatter_admin_token');
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch {
      localStorage.removeItem('chatter_admin_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.user.role !== 'admin') {
      throw new Error('This account does not have admin access.');
    }
    localStorage.setItem('chatter_admin_token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('chatter_admin_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
