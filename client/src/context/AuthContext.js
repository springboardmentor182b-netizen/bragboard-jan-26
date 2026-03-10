import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.get(`${apiUrl}/me`);
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                } catch (error) {
                    console.error("Auth check failed:", error);
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${apiUrl}/login`, { email, password });
            const { access_token } = response.data;

            // In a real app, you'd fetch user profile with the token
            // For now, we'll store the token and a basic user object
            localStorage.setItem('token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            // Fetch actual user profile
            const profileResponse = await axios.get(`${apiUrl}/me`);
            const userObj = profileResponse.data;

            setUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));

            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: error.response?.data?.detail || "Login failed" };
        }
    };

    const signup = async (userData) => {
        try {
            await axios.post(`${apiUrl}/users/`, userData);
            return { success: true };
        } catch (error) {
            console.error("Signup failed:", error);
            let message = "Signup failed";
            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    message = error.response.data.detail.map(err => err.msg).join(", ");
                } else {
                    message = error.response.data.detail;
                }
            }
            return { success: false, message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, apiUrl }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
