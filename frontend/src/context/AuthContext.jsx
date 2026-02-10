import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/profile');
          setUser(response.data);
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login', { Useremail: email, Password: password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    // Fetch user profile after login
    const profileResponse = await api.get('/profile');
    setUser(profileResponse.data);
    return response.data;
  };

  const googleLogin = async (token) => {
    const response = await api.post('/auth/google', { token });
    const { token: jwtToken } = response.data;
    localStorage.setItem('token', jwtToken);
    const profileResponse = await api.get('/profile');
    setUser(profileResponse.data);
    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await api.post('/register', { Username: username, Useremail: email, Password: password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
