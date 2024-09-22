"use client";

import '../styles/globals.css';
import { ReactNode } from 'react';
import Header from '../components/header/Header';
import { usePathname } from 'next/navigation'; 

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const pathname = usePathname(); 

  const noHeaderPages = ['/auth/login', '/auth/register', '/auth/reset-password'];

  const showHeader = !noHeaderPages.includes(pathname);

  return (
    <html lang="pt-BR">
      <body>
        {showHeader && <Header />}
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
