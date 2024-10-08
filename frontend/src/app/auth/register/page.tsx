"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../../services/authService';
import Input from '../../../components/input/Input';
import Notification from '../../../components/notification/Notification';
import Link from 'next/link';
import Image from 'next/image'; // Importa o componente Image do Next.js
import styles from './register.module.css';
import { validatePassword } from '../../../utils/passwordValidation'; // Importe a função de validação

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validação de senha
    const passwordError = validatePassword(password);
    if (passwordError) {
      setNotification({ message: passwordError, type: 'error' });
      return;
    }

    try {
      const data = await registerUser({ name, email, password });
      setNotification({ message: 'Registro bem-sucedido!', type: 'success' });
      console.log('Registro bem-sucedido:', data);
      router.push('/');
    } catch (error: unknown) { // Substituído 'any' por 'unknown'
      if (error instanceof Error) {
        // Verifica se o erro possui uma resposta específica
        // Isso depende de como sua função registerUser lança erros
        // Ajuste conforme necessário
        setNotification({ message: error.message || 'Erro no registro. Tente novamente.', type: 'error' });
      } else {
        setNotification({ message: 'Erro no registro. Tente novamente.', type: 'error' });
      }
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
        {/* Substituído <img> por <Image /> com dimensões especificadas */}
        <Image src="/image/editlawblack.svg" alt="EditLaw Logo" className={styles.logo} width={200} height={50} />
      </Link>

      <h1 className={styles.title}>Criar uma conta</h1>

      <button className={styles.googleButton} onClick={handleGoogleSignIn}>
        {/* Substituído <img> por <Image /> com dimensões especificadas */}
        <Image src="/image/google.svg" alt="Google Icon" className={styles.googleIcon} width={24} height={24} />
        Registrar-se com o Google
      </button>

      <div className={styles.separator}>
        <hr className={styles.line} />
        <span className={styles.or}>ou</span>
        <hr className={styles.line} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
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
        Ao clicar em &quot;Criar conta&quot;, você aceita os{' '}
        <Link href="/terms" className={styles.link}>Termos de Serviço</Link> e a{' '}
        <Link href="/privacy" className={styles.link}>Política de Privacidade</Link>.
      </p>

      <p className={styles.loginText}>
        Já tem uma conta?{' '}
        <Link href="/auth/login" className={styles.link}>Fazer login</Link>
      </p>

      {/* Substituído <img> por <Image /> com dimensões especificadas */}
      <Image src="/icon/checklogo.svg" alt="Check Logo" className={styles.logo1} width={100} height={100} />
      <Image src="/icon/checklogo.svg" alt="Check Logo" className={styles.logo2} width={100} height={100} />
    </div>
  );
};

export default RegisterPage;
