import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../lib/api';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const response = await authApi.login({ email, password });
            setUser(response.user);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            throw err;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setError(null);
            await authApi.register({ name, email, password });
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
