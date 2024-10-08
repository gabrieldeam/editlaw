// src/app/admin/users/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { getAllUsers } from '../../../services/authService';  // Importa o serviço que faz a chamada ao endpoint
import styles from './users.module.css';

interface User {
  email: string;
  name: string;
  role: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response);
        setLoading(false);
      } catch {
        setError("Erro ao carregar usuários.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de usuários</h1>
      <div className={styles.userList}>
        <div className={styles.userHeader}>
          <span>#</span>
          <span>Nome</span>
          <span>Email</span>
          <span>Role</span>
        </div>
        {users.map((user, index) => (
          <div key={index} className={`${styles.userItem} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}>
            <span>{index + 1}</span>
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{user.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
