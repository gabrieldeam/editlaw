// src/app/admin/page.tsx
"use client";

import Link from 'next/link';
import styles from './admin.module.css';

const AdminPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Painel de administração</h1> {/* Usando a classe 'title' */}
      <div className={styles.buttonGroup}>
        <Link href="/admin/users">
          <button className={styles.button}>Gerenciar Usuários</button>
        </Link>
        <Link href="/admin/categories">
          <button className={styles.button}>Gerenciar Categorias</button>
        </Link>
        <Link href="/admin/documents">
          <button className={styles.button}>Documentos</button>
        </Link>
        <Link href="/admin/creations">
          <button className={styles.button}>Criação</button>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
