"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa o hook de navegação do Next.js

const CategoryPage: React.FC = () => {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Recupera o ID da categoria do localStorage
    const storedCategoryId = localStorage.getItem('selectedCategoryId');

    if (storedCategoryId) {
      setCategoryId(storedCategoryId);
    } else {
      // Se o ID não estiver no localStorage, redireciona o usuário de volta para a home
      router.push('/');
    }
  }, [router]);

  return (
    <div style={{ padding: '70px' }}>
      <h1>Página da Categoria</h1>
      {categoryId ? (
        <p>ID da Categoria: {categoryId}</p>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default CategoryPage;
