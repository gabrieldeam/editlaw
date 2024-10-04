"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPurchasedDocuments } from '@/services/purchasedDocumentService';
import { getDocumentById, DocumentDataCategory } from '@/services/documentApi';
import styles from './category.module.css';

interface Category {
  id: string;
  name: string;
}

const PurchasedDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentDataCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentDataCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPurchasedDocuments = async () => {
      try {
        const { purchasedDocuments } = await getPurchasedDocuments();
        const documentDetailsPromises = purchasedDocuments.map(async (purchasedDocument) => {
          const document = await getDocumentById(purchasedDocument.documentId);
          return document;
        });

        const documentDetails = await Promise.all(documentDetailsPromises);
        setDocuments(documentDetails);
        setFilteredDocuments(documentDetails);

        // Extraindo categorias únicas dos documentos
        const uniqueCategories = documentDetails
          .map((document) => document.category)
          .filter((category, index, self) => self.findIndex((cat) => cat.id === category.id) === index);

        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Erro ao buscar documentos comprados:', error);
      }
    };

    fetchPurchasedDocuments();
  }, []);

  const handleCategoryFilter = (categoryId: string | null) => {
    if (categoryId) {
      const filtered = documents.filter((document) => document.categoryId === categoryId); // Use categoryId aqui
      setFilteredDocuments(filtered);
      setActiveCategory(categoryId);
    } else {
      setFilteredDocuments(documents);
      setActiveCategory(null);
    }
  };

  const handleDocumentClick = (documentId?: string) => {
    if (documentId) {
      router.push(`/document/${documentId}`);
    } else {
      console.error('Document ID is undefined');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img className={styles.checkIcon} src="/icon/checklogo.svg" alt="Check logo" />
        <h1 className={styles.categoryName}>Documentos Comprados</h1>
      </div>

      {/* Filtros de Categorias */}
      <div className={styles.filterContainer}>
        <button
          className={`${styles.filterButton} ${!activeCategory ? styles.active : ''}`}
          onClick={() => handleCategoryFilter(null)}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.filterButton} ${activeCategory === category.id ? styles.active : ''}`}
            onClick={() => handleCategoryFilter(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filteredDocuments.length > 0 ? (
        <div className={styles.documentList}>
          {filteredDocuments.map((document) => (
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
                <p className={styles.documentAuthor}>{document.autor}</p>
                
                {/* Mostrar apenas os primeiros 100 caracteres da descrição */}
                <p className={styles.documentDescription}>
                  {document.descricao.length > 100 
                    ? `${document.descricao.slice(0, 100)}...` 
                    : document.descricao}
                </p>
                
                <p className={styles.documentCategory}>{document.category.name}</p>
                <button className={styles.buyButton}>Editar</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Carregando documentos comprados...</p>
      )}
    </div>
  );
};

export default PurchasedDocumentsPage;
