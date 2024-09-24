// src/app/account/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { getUserInfo, editEmail, resetPassword, deleteAccount } from '../../services/authService';
import { getBillingInfo, createOrUpdateBillingInfo } from '../../services/billingService'; // Importa os serviços de cobrança
import Input from '../../components/input/Input'; // Importa o componente Input
import Notification from '../../components/notification/Notification'; // Importa o componente de notificação
import styles from './account.module.css'; // Importa os estilos
import { useRouter } from 'next/navigation'; // Importa o hook useRouter

const AccountPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null); // Estado para armazenar o userId
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [billingInfo, setBillingInfo] = useState({
    country: '',
    phone: '',
    street: '',
    district: '',
    city: '',
    state: '',
    postalCode: '',
    cpf: '',
  });
  const [hasBillingData, setHasBillingData] = useState(false); // Estado para verificar se existem dados de cobrança
  const router = useRouter(); // Hook para redirecionamento

  // Função para buscar o email, ID do usuário e informações de cobrança
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await getUserInfo();
        setEmail(userInfo.email);
        setNewEmail(userInfo.email);
        setUserId(userInfo.userId); // Armazena o userId no estado

        const billing = await getBillingInfo();
        if (billing) {
          setBillingInfo(billing);
          setHasBillingData(true); // Define que existem dados de cobrança
        }
      } catch (error) {
        // Evita mostrar a mensagem de erro quando não há dados de cobrança
        setHasBillingData(false);
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
          {/* Box para mostrar as informações de cobrança */}
          {hasBillingData && (
            <div className={styles.billingBox}>
              <h2 className={styles.billingTitle}>Informações de Cobrança</h2>

                <Input
                  label="País"
                  name="country"
                  type="text"
                  value={billingInfo.country}
                  onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                />
                <Input
                  label="CEP"
                  name="postalCode"
                  type="text"
                  value={billingInfo.postalCode}
                  onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                />
                <Input
                  label="Rua"
                  name="street"
                  type="text"
                  value={billingInfo.street}
                  onChange={(e) => setBillingInfo({ ...billingInfo, street: e.target.value })}
                />

              <div className={styles.inputRow}>              
                <Input
                  label="Bairro"
                  name="district"
                  type="text"
                  value={billingInfo.district}
                  onChange={(e) => setBillingInfo({ ...billingInfo, district: e.target.value })}
                />
                <Input
                  label="Cidade"
                  name="city"
                  type="text"
                  value={billingInfo.city}
                  onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                />
                <Input
                  label="Estado"
                  name="state"
                  type="text"
                  value={billingInfo.state}
                  onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                />
              </div>

              <div className={styles.inputRow}>
                <Input
                  label="Telefone"
                  name="phone"
                  type="text"
                  value={billingInfo.phone}
                  onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                />
                <Input
                  label="CPF"
                  name="cpf"
                  type="text"
                  value={billingInfo.cpf}
                  onChange={(e) => setBillingInfo({ ...billingInfo, cpf: e.target.value })}
                />
              </div>
            </div>
          )}

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
