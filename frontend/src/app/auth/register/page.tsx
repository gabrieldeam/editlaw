"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa o hook useRouter
import { registerUser } from '../../../services/authService';
import Input from '../../../components/input/Input';
import Notification from '../../../components/notification/Notification'; // Importa o componente de notificação
import Link from 'next/link';
import styles from './register.module.css';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState(''); // Adicionado estado para o nome
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const router = useRouter(); // Hook para redirecionamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Passa o nome, email e senha para o endpoint
      const data = await registerUser({ name, email, password });
      setNotification({ message: 'Registro bem-sucedido!', type: 'success' }); // Notificação de sucesso
      console.log('Registro bem-sucedido:', data);

      // Redireciona para a home após o registro
      router.push('/');
    } catch (error) {
      setNotification({ message: 'Erro no registro. Tente novamente.', type: 'error' }); // Notificação de erro
      console.error('Erro no registro:', error);
    }
  };

  // Função para redirecionar o usuário para autenticação do Google
  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className={styles.container}>
      {/* Exibe a notificação, se houver */}
      {notification && <Notification message={notification.message} type={notification.type} />}

      <Link href="/">
        <img src="/image/editlawblack.svg" alt="EditLaw Logo" className={styles.logo} />
      </Link>

      <h1 className={styles.title}>Criar uma conta</h1>

      <button className={styles.googleButton} onClick={handleGoogleSignIn}>
        <img src="/image/google.svg" alt="Google Icon" className={styles.googleIcon} />
        Registrar-se com o Google
      </button>

      <div className={styles.separator}>
        <hr className={styles.line} />
        <span className={styles.or}>ou</span>
        <hr className={styles.line} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Adicionando o campo Nome */}
        <Input
          label="Nome"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
