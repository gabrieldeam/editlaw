"use client";

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginUser } from '../../../services/authService'; // Serviço de login
import Input from '../../../components/input/Input';
import Notification from '../../../components/notification/Notification';
import Link from 'next/link';
import styles from './login.module.css';
import { useAuth } from '../../../context/AuthContext'; // Importe o AuthContext

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth(); // Função para atualizar o estado de autenticação

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });
      setNotification({ message: 'Login bem-sucedido!', type: 'success' });
      console.log('Login bem-sucedido:', data);

      // Atualiza o estado de autenticação
      refreshUser();

      // Verifica se há uma URL de redirecionamento na query string
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch (error) {
      setNotification({ message: 'Erro no login. Verifique suas credenciais.', type: 'error' });
      console.error('Erro no login:', error);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftContainer}>
        {notification && <Notification message={notification.message} type={notification.type} />}
        <Link href="/">
          {/* Use Image do Next.js para otimização */}
          <Image src="/image/editlawblack.svg" alt="EditLaw Logo" className={styles.logo} width={200} height={50} />
        </Link>
  
        <h1 className={styles.title}>Entrar</h1>
  
        <button className={styles.googleButton} onClick={handleGoogleSignIn}>
          <Image src="/image/google.svg" alt="Google Icon" className={styles.googleIcon} width={24} height={24} />
          Entrar com o Google
        </button>
  
        <div className={styles.separator}>
          <hr className={styles.line} />
          <span className={styles.or}>ou</span>
          <hr className={styles.line} />
        </div>
  
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.button} type="submit">Entrar</button>
        </form>
  
        <p className={styles.loginText}>
          Não tem uma conta?{' '}
          <Link href="/auth/register" className={styles.link}>Criar uma conta</Link>
        </p>
  
        <p className={styles.loginText}>
          Esqueceu sua senha?{' '}
          <Link href="/auth/reset-password" className={styles.link}>Redefinir senha</Link>
        </p>
      </div>
  
      <div className={styles.rightContainer}>
        {/* Use Image do Next.js para otimização */}
        <Image src="/icon/checklogo.svg" alt="Check Logo" className={styles.rightImage} width={500} height={500} />
      </div>
    </div>
  );
  
};

export default LoginPage;
