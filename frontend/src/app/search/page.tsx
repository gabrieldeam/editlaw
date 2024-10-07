"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchDocuments, DocumentData } from '@/services/documentApi'; // Importe a função searchDocuments
import styles from './search.module.css';
import { useCart } from '@/context/CartContext';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const category = searchParams.get('category');

  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Função para adicionar ao carrinho

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      try {
        const { documents } = await searchDocuments(query, category || undefined);
        setDocuments(documents);
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, category]);

  const handleDocumentClick = (documentId?: string) => {
    if (documentId) {
      window.location.href = `/document/${documentId}`;
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
      window.location.href = '/cart';
    } else {
      console.error('Document ID is undefined');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img className={styles.checkIcon} src="/icon/checklogo.svg" alt="Check logo" />
        <h1 className={styles.searchTitle}>Resultados da busca</h1>
      </div>
      {documents.length > 0 ? (
        <div className={styles.documentList}>
          {documents.map((document) => (
            <div
              key={document.id}
              className={styles.documentCard}
              onClick={() => handleDocumentClick(document.id)}
              style={{ cursor: 'pointer' }}
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
                      <span className={styles.precoDesconto}>R$ {document.precoDesconto}</span>
                      <span className={styles.precoOriginal}>R$ {document.preco}</span>
                    </>
                  ) : (
                    <span>R$ {document.preco}</span>
                  )}
                </p>
                <p className={styles.documentAuthor}>{document.autor}</p>
                <button
                  className={styles.buyButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(document.id);
                  }}
                >
                  Comprar
                </button>
                <button
                  className={styles.cartButton}
                  onClick={(e) => {
                    e.stopPropagation();
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
        <p>Nenhum resultado encontrado para a sua pesquisa.</p>
      )}
    </div>
  );
};

export default SearchPage;
