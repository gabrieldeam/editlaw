"use client";

import React, { useState } from 'react';
import { resetPassword } from '../../../services/authService';
import Input from '../../../components/input/Input'; // Reutilizando o componente Input
import Notification from '../../../components/notification/Notification'; // Reutilizando o componente Notification
import Link from 'next/link';
import Image from 'next/image'; // Importando o componente Image
import styles from './reset-password.module.css';

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await resetPassword(email);
      setNotification({ message: 'E-mail de redefinição enviado com sucesso!', type: 'success' });
      console.log('E-mail de redefinição enviado:', data);
    } catch (error) {
      setNotification({ message: 'Erro ao enviar e-mail de redefinição. Verifique o e-mail.', type: 'error' });
      console.error('Erro ao redefinir senha:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Exibe a notificação, se houver */}
      {notification && <Notification message={notification.message} type={notification.type} />}

      <Link href="/">
        {/* Substituído o <img> por <Image /> */}
        <Image src="/image/editlawblack.svg" alt="EditLaw Logo" className={styles.logo} width={200} height={50} />
      </Link>

      <h1 className={styles.title}>Redefinir Senha</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
        />
        <button className={styles.button} type="submit">Enviar</button>
      </form>

      <p className={styles.backToLogin}>
        Lembrou a senha?{' '}
        <Link href="/auth/login" className={styles.link}>Fazer login</Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
