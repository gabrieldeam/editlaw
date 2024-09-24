// src/app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from '../../../services/categoryService';
import styles from './categories.module.css';
import CategoryModal from './CategoryModal';

interface Category {
  id: string;
  name: string;
  description: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar categorias.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar esta categoria?");
    if (confirmDelete) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(category => category.id !== id));
      } catch (error) {
        setError("Erro ao deletar a categoria.");
      }
    }
  };

  if (loading) {
    return <div>Carregando categorias...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lista de Categorias</h1>
        <button className={styles.createButton} onClick={handleCreateCategory}>
          Criar Categoria
        </button>
      </div>

      <div className={styles.categoryList}>
        <div className={styles.categoryHeader}>
          <span>#</span>
          <span>Nome</span>
          <span>Descrição</span>
        </div>
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`${styles.categoryItem} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}
            onClick={() => handleEditCategory(category)}
          >
            <span>{index + 1}</span>
            <span>{category.name}</span>
            <span>{category.description}</span>
          </div>
        ))}
      </div>

      {modalOpen && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setModalOpen(false)}
          onDelete={handleDeleteCategory}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
