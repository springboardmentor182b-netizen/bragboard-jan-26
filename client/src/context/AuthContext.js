import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setError('Session initialization failed');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, accessToken) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('access_token', accessToken);
      setError(null);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to save login information');
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout properly');
    }
  };

  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      return true;
    } catch (err) {
      console.error('Update user error:', err);
      setError('Failed to update user information');
      return false;
    }
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('access_token');
  };

  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
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
