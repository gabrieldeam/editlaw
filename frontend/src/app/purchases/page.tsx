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

interface PurchasedDocument {
  purchaseId: string; // ID único da compra
  document: DocumentDataCategory; // Dados do documento
}

const PurchasedDocumentsPage: React.FC = () => {
  const [purchasedDocuments, setPurchasedDocuments] = useState<PurchasedDocument[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<PurchasedDocument[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPurchasedDocuments = async () => {
      try {
        console.log('Fetching purchased documents...'); // Debugging
        const { purchasedDocuments: fetchedPurchases } = await getPurchasedDocuments();
        console.log('Purchased Documents:', fetchedPurchases); // Debugging

        const documentDetailsPromises = fetchedPurchases.map(async (purchase) => {
          const document = await getDocumentById(purchase.documentId);
          return {
            purchaseId: purchase.id, // Supondo que a compra tem um campo `id`
            document,
          };
        });

        const purchasedDocumentDetails: PurchasedDocument[] = await Promise.all(documentDetailsPromises);
        console.log('Purchased Document Details:', purchasedDocumentDetails); // Debugging

        setPurchasedDocuments(purchasedDocumentDetails);
        setFilteredDocuments(purchasedDocumentDetails);

        // Extrair categorias únicas dos documentos
        const uniqueCategoriesMap = new Map<string, Category>();
        purchasedDocumentDetails.forEach(({ document }) => {
          if (document.category && !uniqueCategoriesMap.has(document.category.id)) {
            uniqueCategoriesMap.set(document.category.id, document.category);
          }
        });
        setCategories(Array.from(uniqueCategoriesMap.values()));
      } catch (error) {
        console.error('Erro ao buscar documentos comprados:', error);
      }
    };

    fetchPurchasedDocuments();
  }, []);

  const handleCategoryFilter = (categoryId: string | null) => {
    if (categoryId) {
      const filtered = purchasedDocuments.filter(
        ({ document }) => document.categoryId === categoryId
      );
      setFilteredDocuments(filtered);
      setActiveCategory(categoryId);
    } else {
      setFilteredDocuments([...purchasedDocuments]);
      setActiveCategory(null);
    }
  };

  const handleDocumentClick = (purchaseId?: string) => {
    if (purchaseId) {
      router.push(`/purchase-document/${purchaseId}`);
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
          {filteredDocuments.map(({ purchaseId, document }) => (
            <div
              key={purchaseId} // Usando purchaseId como key
              className={styles.documentCard}
              onClick={() => handleDocumentClick(purchaseId)}
              style={{ cursor: 'pointer' }}
            >
              <img
                className={styles.documentImage}
                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${document.image}`}
                alt={document.title}
              />
              <div className={styles.documentInfo}>
                <h2 className={styles.documentTitle}>{document.title}</h2>

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
