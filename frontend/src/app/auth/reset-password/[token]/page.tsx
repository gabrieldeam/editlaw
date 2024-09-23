"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { confirmResetPassword } from '../../../../services/authService';
import Input from '../../../../components/input/Input';
import Notification from '../../../../components/notification/Notification';
import styles from './resetPassword.module.css';
import { validatePassword } from '../../../../utils/passwordValidation'; // Importe a função de validação

interface ResetPasswordPageProps {
  params: { token: string }; // Parâmetro para capturar o token da URL
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ params }) => {
  const [newPassword, setNewPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // Função para redefinir a senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de senha
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setNotification({ message: passwordError, type: 'error' });
      return;
    }

    try {
      await confirmResetPassword(params.token, newPassword); // Passa o token e a nova senha
      setNotification({ message: 'Senha redefinida com sucesso!', type: 'success' });
      // Redireciona para a página de login após sucesso
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      setNotification({ message: 'Erro ao redefinir a senha. Tente novamente.', type: 'error' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Redefinir Senha</h1>

      <form className={styles.form} onSubmit={handleResetPassword}>
        <Input
          label="Nova Senha"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {notification && <Notification message={notification.message} type={notification.type} />}
        <button className={styles.button} type="submit">
          Redefinir Senha
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
