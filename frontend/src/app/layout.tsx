// src/app/layout.tsx

import '../styles/globals.css';
import { ReactNode } from 'react';
import Header from '../components/Header';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
