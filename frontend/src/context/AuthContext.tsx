// src/context/AuthContext.tsx

"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getUserInfo } from '../services/authService';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  // Adicione outros campos conforme necessário
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isAuthenticated = !!user;

  const fetchUser = async () => {
    try {
      const userData = await getUserInfo();
      console.log('Dados do usuário:', userData);
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('Usuário:', user);
    console.log('Autenticado:', isAuthenticated);
    console.log('Carregando:', loading);
  }, [user, isAuthenticated, loading]);

  const refreshUser = () => {
    setLoading(true);
    fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
