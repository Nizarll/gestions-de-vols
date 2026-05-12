import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setUser(user);

    return user;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const { token, user } = response.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
