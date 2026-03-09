import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Specific Admin List
const AUTHORIZED_ADMINS = [
  'admin1@nimbusease.com',
  'admin2@nimbusease.com',
  'admin3@nimbusease.com'
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isAdmin = user && AUTHORIZED_ADMINS.includes(user.email);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
