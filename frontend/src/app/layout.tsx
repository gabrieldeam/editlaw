// components/RootLayout.tsx
'use client';

import '../styles/globals.css';
import './fonts/fontawesome';
import { ReactNode, useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { usePathname, useRouter } from 'next/navigation';
import { checkAuth, isAdmin } from '../services/authService';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { PaymentProvider } from '../context/PaymentContext';
import { initMercadoPago } from '@mercadopago/sdk-react';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define as páginas que não exibem o Header
  const noHeaderPages = ['/auth/login', '/auth/register', '/auth/reset-password', '/auth/reset-password/[token]'];
  
  // Define as rotas protegidas que necessitam de autenticação
  const protectedRoutes = ['/admin', '/account', '/purchases'];
  
  // Define as rotas que requerem que o usuário seja administrador
  const adminRoutes = ['/admin', '/admin/users', '/admin/categories'];

  const showHeader = !noHeaderPages.includes(pathname);  // Não exibe o header nas rotas de autenticação

  // Função para verificar a autenticação e papel do usuário
  useEffect(() => {
    const verifyAuthAndRole = async () => {
      try {
        // Verifica se o usuário está autenticado
        const response = await checkAuth();
        if (response.message === 'Autenticado!') {
          setIsAuthenticated(true);

          // Redireciona para a home se o usuário autenticado tentar acessar páginas de login/registro
          if (noHeaderPages.includes(pathname)) {
            router.push('/');
          }

          // Verifica se o usuário é admin ao acessar rotas de admin
          if (adminRoutes.includes(pathname)) {
            const adminResponse = await isAdmin();
            if (!adminResponse.isAdmin) {
              // Se o usuário não for admin, redireciona para a home
              router.push('/');
            } else {
              setIsAdminUser(true); // Define como admin
            }
          }
        } else {
          // Se o usuário tentar acessar uma rota protegida sem estar autenticado
          if (protectedRoutes.includes(pathname) || adminRoutes.includes(pathname)) {
            router.push('/auth/login'); // Redireciona para a página de login
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        // Redireciona para o login se o usuário tentar acessar uma rota protegida sem estar autenticado
        if (protectedRoutes.includes(pathname) || adminRoutes.includes(pathname)) {
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuthAndRole();
  }, [pathname, router]);

  // Inicializa a biblioteca do Mercado Pago usando a variável de ambiente
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey); // Inicializando o Mercado Pago com a chave pública do .env.local
    } else {
      console.error('Mercado Pago PUBLIC_KEY não definida.');
    }
  }, []);

  if (loading) {
    // Mostra um spinner ou loader enquanto verifica a autenticação
    return <div>Carregando...</div>;
  }

  return (
    <html lang="pt-BR">
      <body>        
        <AuthProvider>
          <CartProvider>
            <PaymentProvider>
              {showHeader && <Header />}
              <main>{children}</main>
              <Footer /> {/* Adiciona o Footer aqui */}
            </PaymentProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
