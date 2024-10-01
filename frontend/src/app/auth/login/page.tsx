"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../../services/authService'; // Serviço de login
import Input from '../../../components/input/Input';
import Notification from '../../../components/notification/Notification';
import Link from 'next/link';
import styles from './login.module.css';
import { useCart } from '../../../context/CartContext'; // Importa o contexto do carrinho

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const router = useRouter();
  const { cartItems } = useCart(); // Usa o carrinho para verificar se ele está correto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });
      setNotification({ message: 'Login bem-sucedido!', type: 'success' });
      console.log('Login bem-sucedido:', data);

      // Verifica se o carrinho está correto após o login
      const storedCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('Itens no carrinho após o login:', storedCartItems);

      // Redireciona para a home após o login bem-sucedido
      router.push('/');
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
          <img src="/image/editlawblack.svg" alt="EditLaw Logo" className={styles.logo} />
        </Link>

        <h1 className={styles.title}>Entrar</h1>

        <button className={styles.googleButton} onClick={handleGoogleSignIn}>
          <img src="/image/google.svg" alt="Google Icon" className={styles.googleIcon} />
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
        <img src="/icon/checklogo.svg" alt="Check Logo" className={styles.rightImage} />
      </div>
    </div>
  );
};

export default LoginPage;
