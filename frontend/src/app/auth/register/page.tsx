"use client";

import React, { useState } from 'react';
import { registerUser } from '../../../services/authService';
import Input from '../../../components/input/Input';
import Notification from '../../../components/notification/Notification'; // Importa o componente de notificação
import Link from 'next/link';
import styles from './register.module.css';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await registerUser({ email, password });
      setNotification({ message: 'Registro bem-sucedido!', type: 'success' }); // Notificação de sucesso
      console.log('Registro bem-sucedido:', data);
    } catch (error) {
      setNotification({ message: 'Erro no registro. Tente novamente.', type: 'error' }); // Notificação de erro
      console.error('Erro no registro:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Exibe a notificação, se houver */}
      {notification && <Notification message={notification.message} type={notification.type} />}

      <Link href="/">
        <img src="/image/editlawblack.svg" alt="EditLaw Logo" className={styles.logo} />
      </Link>
      
      <h1 className={styles.title}>Criar uma conta</h1>

      <button className={styles.googleButton}>
        <img src="/image/google.svg" alt="Google Icon" className={styles.googleIcon} />
        Registra-se com o Google
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
        <button className={styles.button} type="submit">Registrar</button>
      </form>

      <p className={styles.termsText}>
        Ao clicar em "Criar conta", você aceita os{' '}
        <Link href="/terms" className={styles.link}>Termos de Serviço</Link> e a{' '}
        <Link href="/privacy" className={styles.link}>Política de Privacidade</Link>.
      </p>

      <p className={styles.loginText}>
        Já tem uma conta?{' '}
        <Link href="/auth/login" className={styles.link}>Fazer login</Link>
      </p>

      {/* Adicionando imagens no fundo */}
      <img src="/icon/checklogo.svg" alt="Check Logo" className={styles.logo1} />
      <img src="/icon/checklogo.svg" alt="Check Logo" className={styles.logo2} />
    </div>
  );
};

export default RegisterPage;
