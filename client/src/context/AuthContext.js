import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        // Check for stored user on load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${apiUrl}/login`, { email, password });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: error.response?.data?.detail || "Login failed" };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, apiUrl }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
