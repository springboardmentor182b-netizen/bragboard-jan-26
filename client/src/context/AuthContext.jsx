import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // login can be called two ways:
    //   login(email, password)  – calls API, stores token, fetches user
    //   login(userObj, token)   – directly sets user & token (used by Login.jsx)
    const login = async (emailOrUser, passwordOrToken) => {
        // If first arg is an object, the caller already did the API call
        if (typeof emailOrUser === 'object' && emailOrUser !== null) {
            localStorage.setItem('token', passwordOrToken);
            setUser(emailOrUser);
            return { user: emailOrUser, access_token: passwordOrToken };
        }

        // Otherwise, do the API call ourselves
        const response = await api.post('/auth/login', {
            email: emailOrUser,
            password: passwordOrToken,
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        await checkAuth();
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
