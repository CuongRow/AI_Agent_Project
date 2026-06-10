import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (e) {
        // Clear corrupt data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  }, []);

  // Listen to logout events from axios interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    };
    
    window.addEventListener('auth-logout', handleForceLogout);
    return () => {
      window.removeEventListener('auth-logout', handleForceLogout);
    };
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await api.post('/api/auth/login', { usernameOrEmail, password });
      const { token: accessToken, refreshToken, id, username, email, roles, avatarUrl } = response.data;
      
      const userData = { id, username, email, roles, avatarUrl };
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { username, email, password });
      const { token: accessToken, refreshToken, id, username: registeredUsername, email: registeredEmail, roles, avatarUrl } = response.data;
      
      const userData = { id, username: registeredUsername, email: registeredEmail, roles, avatarUrl };
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken });
      }
    } catch (e) {
      console.warn('Logout request failed on server', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const hasRole = (roleName) => {
    return user && user.roles && user.roles.includes(roleName);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout, hasRole, updateUser }}>
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
