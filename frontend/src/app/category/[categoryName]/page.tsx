// src/app/category/[categoryName]/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getDocumentsByCategory, DocumentData } from '@/services/documentApi';
import styles from './category.module.css';
import { useCart } from '../../../context/CartContext';

const CategoryPage: React.FC = () => {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const router = useRouter();
  const pathname = usePathname(); // Used to get the category name from the URL
  const { addToCart } = useCart(); // Function to add to cart

  // Getting the category name from the URL and decoding it
  const categoryName = decodeURIComponent(pathname.split('/').pop() || 'Categoria');

  useEffect(() => {
    const fetchCategoryAndDocuments = async () => {
      try {
        // Fetch the category by name
        const categoryResponse = await fetch(`/api/categories?name=${categoryName}`);
        if (!categoryResponse.ok) {
          throw new Error('Categoria não encontrada');
        }
        const categoryData = await categoryResponse.json();
        const fetchedCategoryId = categoryData.id;
        setCategoryId(fetchedCategoryId);

        // Fetch documents by category
        const { documents } = await getDocumentsByCategory(fetchedCategoryId);
        setDocuments(documents);
      } catch (error) {
        console.error('Erro ao buscar categoria ou documentos:', error);
        // Redirect to the homepage or display an error message
        router.push('/');
      }
    };

    fetchCategoryAndDocuments();
  }, [categoryName, router]);

  const handleDocumentClick = (documentId: string) => {
    router.push(`/document/${documentId}`);
  };

  const handleAddToCart = (documentId: string) => {
    addToCart({ type: 'document', id: documentId });
  };

  const handleBuyNow = (documentId: string) => {
    addToCart({ type: 'document', id: documentId });
    router.push('/cart');
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
              onClick={() => {
                if (document.id) handleDocumentClick(document.id); // Redireciona ao clicar no documento, verificando se id existe
              }}
              style={{ cursor: 'pointer' }} // Adiciona cursor de ponteiro ao passar sobre o documento
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
                    e.stopPropagation(); // Evita que o clique no botão também acione o clique do documento
                    if (document.id) handleBuyNow(document.id); // Verificando se id existe
                  }}
                >
                  Comprar
                </button>

                <button
                  className={styles.cartButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que o clique no botão também acione o clique do documento
                    if (document.id) handleAddToCart(document.id); // Verificando se id existe
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
