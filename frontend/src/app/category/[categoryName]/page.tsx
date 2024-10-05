// src/app/category/[categoryName]/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getDocumentsByCategory, DocumentData } from '@/services/documentApi'; // Interface renomeada
import styles from './category.module.css';
import { useCart } from '../../../context/CartContext';

const CategoryPage: React.FC = () => {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const router = useRouter();
  const pathname = usePathname(); // Usado para pegar o nome da categoria da URL
  const { addToCart } = useCart(); // Função para adicionar ao carrinho

  // Pegando o nome da categoria da URL e decodificando
  const categoryName = decodeURIComponent(pathname.split('/').pop() || 'Categoria');

  useEffect(() => {
    const storedCategoryId = localStorage.getItem('selectedCategoryId');
    if (storedCategoryId) {
      setCategoryId(storedCategoryId);
      fetchDocuments(storedCategoryId);
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchDocuments = async (categoryId: string) => {
    try {
      const { documents } = await getDocumentsByCategory(categoryId);
      setDocuments(documents);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  const handleDocumentClick = (documentId?: string) => {
    if (documentId) {
      router.push(`/document/${documentId}`);
    } else {
      console.error('Document ID is undefined');
    }
  };

  const handleAddToCart = (documentId?: string) => {
    if (documentId) {
      addToCart(documentId);
    } else {
      console.error('Document ID is undefined');
    }
  };

  const handleBuyNow = (documentId?: string) => {
    if (documentId) {
      addToCart(documentId);
      router.push('/cart');
    } else {
      console.error('Document ID is undefined');
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.header}>        
        <img
          className={styles.checkIcon}
          src="/icon/checklogo.svg"
          alt="Check logo"
        />
        <h1 className={styles.categoryName}>{categoryName}</h1>
      </div>
      {categoryId ? (
        <div className={styles.documentList}>
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
                    handleBuyNow(document.id);
                  }}
                >
                  Comprar
                </button>

                <button
                  className={styles.cartButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Para evitar que o clique no botão também acione o clique do documento
                    handleAddToCart(document.id);
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

export default CategoryPage;
