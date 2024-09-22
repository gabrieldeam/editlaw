"use client";

import React, { useState } from 'react';
import { loginUser } from '../../../services/authService'; // Serviço de login
import Input from '../../../components/input/Input'; // Reutiliza o Input
import Notification from '../../../components/notification/Notification'; // Reutiliza o Notification
import Link from 'next/link';
import styles from './login.module.css'; // Estilos específicos de login

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });
      setNotification({ message: 'Login bem-sucedido!', type: 'success' });
      console.log('Login bem-sucedido:', data);
    } catch (error) {
      setNotification({ message: 'Erro no login. Verifique suas credenciais.', type: 'error' });
      console.error('Erro no login:', error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Lado esquerdo - Formulário de login */}
      <div className={styles.leftContainer}>
        {/* Exibe a notificação, se houver */}
        {notification && <Notification message={notification.message} type={notification.type} />}

        <Link href="/">
          <img src="/image/editlawblack.svg" alt="EditLaw Logo" className={styles.logo} />
        </Link>

        <h1 className={styles.title}>Entrar</h1>

        <button className={styles.googleButton}>
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

      {/* Lado direito - Imagem */}
      <div className={styles.rightContainer}>
        <img src="/icon/checklogo.svg" alt="Check Logo" className={styles.rightImage} />
      </div>
    </div>
  );
};

export default LoginPage;
