// src/components/categoryCarousel/CategoryCarousel.tsx

"use client";

import { useEffect, useState, useRef } from 'react';
import { getDocumentsByCategory, DocumentData } from '@/services/documentApi';
import { getCategoryById, Category } from '@/services/categoryService'; // Importe o serviço de categorias
import styles from './CategoryCarousel.module.css';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface CategoryCarouselProps {
  categoryId: string;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categoryId }) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [category, setCategory] = useState<Category | null>(null); // Estado para armazenar a categoria
  const [currentIndex, setCurrentIndex] = useState(0); // Controla o índice atual do carrossel
  const carouselRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { documents } = await getDocumentsByCategory(categoryId);
        setDocuments(documents);
      } catch (error) {
        console.error('Erro ao buscar documentos:', error);
      }
    };

    const fetchCategory = async () => {
      try {
        const fetchedCategory: Category = await getCategoryById(categoryId); // Obtém a categoria pelo ID
        setCategory(fetchedCategory); // Define a categoria no estado
      } catch (error) {
        console.error('Erro ao buscar categoria:', error);
      }
    };

    fetchDocuments();
    fetchCategory();
  }, [categoryId]);

  const handleNext = () => {
    if (currentIndex < documents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    if (carouselRef.current && carouselRef.current.children[currentIndex]) {
      const currentChild = carouselRef.current.children[currentIndex];
      if (currentChild instanceof HTMLElement) {
        const scrollTo = currentChild.offsetLeft;
        carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  const handleDocumentClick = (documentId?: string) => {
    if (documentId) {
      router.push(`/document/${documentId}`);
    } else {
      console.error('Document ID is undefined');
    }
  };

  const handleAddToCart = (documentId?: string) => {
    if (documentId) {
      addToCart({ type: 'document', id: documentId });
    } else {
      console.error('Document ID is undefined');
    }
  };

  const handleBuyNow = (documentId?: string) => {
    if (documentId) {
      addToCart({ type: 'document', id: documentId });
      router.push('/cart');
    } else {
      console.error('Document ID is undefined');
    }
  };

  const handleCategoryClick = () => {
    if (category) {
      // Armazena o ID da categoria no localStorage
      localStorage.setItem('selectedCategoryId', category.id);

      // Redireciona para a página da categoria usando o nome da categoria na URL
      router.push(`/category/${category.name}`);
    } else {
      console.error('Category not found');
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.categoryName}>{category?.name || 'Carregando...'}</h1>
        <div className={styles.scrollButtons}>
          <button className={`${styles.scrollButton} ${styles.leftButton}`} onClick={scrollLeft}>
            <img src="/icon/left-arrow.svg" alt="Scroll Left" />
          </button>
          <button className={`${styles.scrollButton} ${styles.rightButton}`} onClick={scrollRight}>
            <img src="/icon/right-arrow.svg" alt="Scroll Right" />
          </button>
        </div>
        <button className={styles.viewCategoryButton} onClick={handleCategoryClick}>
          Ver categoria
        </button>
      </div>
      {categoryId ? (
        <div className={styles.documentList} ref={scrollRef}>
          {documents.map((document) => (
            <div
              key={document.id}
              className={styles.documentCard}
              onClick={() => handleDocumentClick(document.id)} // Redireciona ao clicar no documento
              style={{ cursor: 'pointer' }} // Adiciona um cursor de ponteiro ao passar sobre o documento
            >
              <img
                className={styles.documentImage}
                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${document.image}`}
                alt={document.title}
              />
              <div className={styles.documentInfo}>
                <h2 className={styles.documentTitle}>{document.title}</h2>
                <p className={styles.documentPrice}>
                  {document.precoDesconto ? (
                    <>
                      <span className={styles.precoDesconto}>
                        R$ {document.precoDesconto}
                      </span>
                      <span className={styles.precoOriginal}>
                        R$ {document.preco}
                      </span>
                    </>
                  ) : (
                    <span>R$ {document.preco}</span>
                  )}
                </p>
                <p className={styles.documentAuthor}>{document.autor}</p>
                <button
                  className={styles.buyButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Para evitar que o clique no botão também acione o clique do documento
                    if (document.id) { // Verificação adicionada
                      handleBuyNow(document.id);
                    } else {
                      console.error('Document ID is undefined.');
                    }
                  }}
                >
                  Comprar
                </button>

                <button
                  className={styles.cartButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Para evitar que o clique no botão também acione o clique do documento
                    if (document.id) { // Verificação adicionada
                      handleAddToCart(document.id);
                    } else {
                      console.error('Document ID is undefined.');
                    }
                  }}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default CategoryCarousel;
