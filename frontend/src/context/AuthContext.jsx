import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null;
    } catch (e) {
      console.warn('Failed to read token from localStorage', e);
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse user from localStorage', e);
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('role') || null;
    } catch (e) {
      console.warn('Failed to read role from localStorage', e);
      return null;
    }
  });

  // Restore & sync to localStorage with try/catch
  const saveAuthSession = (authData) => {
    const { token: newToken, userId, name, email, role: newRole, workshopId } = authData;
    const userInfo = {
      userId: userId || authData.id,
      name: name || '',
      email: email || '',
      role: newRole,
      workshopId: workshopId || null,
    };

    setToken(newToken);
    setRole(newRole);
    setUser(userInfo);

    try {
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', newRole);
      localStorage.setItem('user', JSON.stringify(userInfo));
    } catch (err) {
      console.error('Failed to save auth to localStorage', err);
    }
  };

  const login = async (emailOrPayload, password) => {
    const payload = typeof emailOrPayload === 'object' && emailOrPayload !== null
      ? emailOrPayload
      : { email: emailOrPayload, password };

    const data = await authApi.login(payload);
    saveAuthSession(data);
    return data;
  };

  const signup = async (nameOrPayload, email, password) => {
    const payload = typeof nameOrPayload === 'object' && nameOrPayload !== null
      ? nameOrPayload
      : { name: nameOrPayload, email, password };

    const data = await authApi.signup(payload);
    saveAuthSession(data);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Failed to clear auth from localStorage', err);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, role, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
