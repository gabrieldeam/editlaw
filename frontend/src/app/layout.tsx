"use client";

import '../styles/globals.css';
import { ReactNode, useEffect, useState } from 'react';
import Header from '../components/header/Header';
import { usePathname, useRouter } from 'next/navigation'; 
import { checkAuth } from '../services/authService';  // Serviço para verificar a autenticação

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathname = usePathname(); 
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const noHeaderPages = ['/auth/login', '/auth/register', '/auth/reset-password'];

  const showHeader = !noHeaderPages.includes(pathname);

  // Função para verificar a autenticação e redirecionar se o usuário estiver logado
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await checkAuth();
        if (response.message === 'Autenticado!') {
          setIsAuthenticated(true);
          if (noHeaderPages.includes(pathname)) {
            // Redireciona o usuário para a home se ele tentar acessar páginas de login/registro autenticado
            router.push('/');
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [pathname, router]);

  if (loading) {
    // Mostra um spinner ou loader enquanto verifica a autenticação
    return <div>Carregando...</div>;
  }

  return (
    <html lang="pt-BR">
      <body>
        {showHeader && <Header />}
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
