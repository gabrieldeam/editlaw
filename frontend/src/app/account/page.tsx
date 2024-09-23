// src/app/account/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { getUserInfo, editEmail, resetPassword, deleteAccount } from '../../services/authService';
import Input from '../../components/input/Input'; // Importa o componente Input
import Notification from '../../components/notification/Notification'; // Importa o componente de notificação
import styles from './account.module.css'; // Importa os estilos
import { useRouter } from 'next/navigation'; // Importa o hook useRouter

const AccountPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null); // Estado para armazenar o userId
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter(); // Hook para redirecionamento

  // Função para buscar o email e o ID do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserInfo();
        setEmail(data.email);
        setNewEmail(data.email);
        setUserId(data.userId); // Armazena o userId no estado
      } catch (error) {
        setNotification({ message: 'Erro ao buscar informações do usuário.', type: 'error' });
      }
    };

    fetchUserData();
  }, []);

  // Função para editar o email
  const handleEditEmail = async () => {
    try {
      if (userId !== null) {
        await editEmail({ userId, newEmail });
        setNotification({ message: 'Email atualizado com sucesso!', type: 'success' });
        setEmail(newEmail);
      }
    } catch (error) {
      setNotification({ message: 'Erro ao atualizar o email.', type: 'error' });
    }
  };

  // Função para enviar o link de redefinição de senha
  const handleResetPassword = async () => {
    try {
      await resetPassword(email); // Envia o email cadastrado para o endpoint de redefinição de senha
      setNotification({ message: 'Link de redefinição de senha enviado com sucesso!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Erro ao enviar o link de redefinição de senha.', type: 'error' });
    }
  };

  // Função para deletar a conta
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.');
    if (confirmDelete && userId !== null) { // Verifica se o userId está disponível
      try {
        await deleteAccount(userId); // Passa o userId ao chamar o endpoint
        setNotification({ message: 'Conta deletada com sucesso!', type: 'success' });
        // Redireciona para a página de login após a exclusão da conta
        router.push('/auth/login');
      } catch (error) {
        setNotification({ message: 'Erro ao deletar a conta.', type: 'error' });
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Minha Conta</h1>
  
      <div className={styles.contentWrapper}>
        {/* Lado esquerdo */}
        <div className={styles.leftContainer}>
          <div className={styles.emailBox}>
            <h2 className={styles.emailTitle}>Editar Email</h2>
            <Input
              label="E-mail"
              name="email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            {notification && <Notification message={notification.message} type={notification.type} />}
            <button className={styles.button} onClick={handleEditEmail}>
              Editar
            </button>
          </div>
  
          <div className={styles.emailBox}>
            <h2 className={styles.emailTitle}>Redefinir Senha</h2>
            <p>Um link de redefinição será enviado para o seu e-mail.</p>
            {notification && <Notification message={notification.message} type={notification.type} />}
            <button className={styles.button} onClick={handleResetPassword}>
              Enviar link de redefinição de senha
            </button>
          </div>
        </div>
  
        {/* Lado direito */}
        <div className={styles.rightContainer}>
          <div className={styles.deleteBox}>
            <h2 className={styles.deleteTitle}>Deletar Conta</h2>
            <p>Se você deletar sua conta, não poderá recuperá-la.</p>
            {notification && <Notification message={notification.message} type={notification.type} />}
            <button className={styles.deleteButton} onClick={handleDeleteAccount}>
              Deletar Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
