"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Importa o hook de navegação do Next.js
import { getAllCategories } from '../../services/categoryService'; // Assumindo que já existe
import styles from './CategorySection.module.css'; // Arquivo CSS

interface Category {
  id: string;
  name: string;
  description: string;
  image1: string;
  image2: string;
  image3: string;
}

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null); // Referência para o container com rolagem
  const router = useRouter(); // Hook para navegação

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  // Função para rolar para a esquerda
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  // Função para rolar para a direita
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  // Função para redirecionar ao clicar em um card de categoria
  const handleCategoryClick = (category: Category) => {
    // Armazena o ID da categoria no localStorage
    localStorage.setItem('selectedCategoryId', category.id);

    // Redireciona para a página da categoria usando o nome da categoria na URL
    router.push(`/category/${category.name}`);
  };

  return (
    <>
      <div className={styles.categorySectionWrapper}>
        <div className={styles.categorySection} ref={scrollRef}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={styles.categoryCard}
              onClick={() => handleCategoryClick(category)} // Adiciona o redirecionamento ao clicar
            >
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDescription}>{category.description}</p>
              </div>
              <div className={styles.categoryImages}>
                {category.image1 && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${category.image1}`}
                    alt={category.name}
                    className={styles.categoryImage1}
                    loading="lazy"
                  />
                )}
                {category.image2 && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${category.image2}`}
                    alt={category.name}
                    className={styles.categoryImage2}
                    loading="lazy"
                  />
                )}
                {category.image3 && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${category.image3}`}
                    alt={category.name}
                    className={styles.categoryImage3}
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.scrollButtons}>
        <button className={`${styles.scrollButton} ${styles.leftButton}`} onClick={scrollLeft}>
          <img src="/icon/left-arrow.svg" alt="Scroll Left" />
        </button>
        <button className={`${styles.scrollButton} ${styles.rightButton}`} onClick={scrollRight}>
          <img src="/icon/right-arrow.svg" alt="Scroll Right" />
        </button>
      </div>
    </>
  );
};

export default CategorySection;
