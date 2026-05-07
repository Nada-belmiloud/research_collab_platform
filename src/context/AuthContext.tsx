import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import api from "../api/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    const res = await api.get("/auth/me");
    return res.data;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then(user => setUser(user))
        .catch(() => logout())
        .finally(() => setLoading(false)); // ✅ only set false AFTER getMe resolves
    } else {
      setLoading(false); // ✅ no token = no need to wait
    }
  }, []);

  const login = async ({ email, password }: any) => {
    const res = await api.post("/auth/login", { email, password });

    const token =
      res.data.access_token ||
      res.data.token ||
      res.data.accessToken;

    if (!token) throw new Error("No token returned from backend");

    localStorage.setItem("token", token);

    const user = await getMe();
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const register = async (data: any) => {
    await api.post("/auth/signup", {
      email: data.email,
      full_name: data.full_name,
      password: data.password,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};