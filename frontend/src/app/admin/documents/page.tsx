// src/app/admin/documents/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importação adicionada
import { getAllDocuments, deleteDocument, PaginatedDocumentsResponse, Document } from '../../../services/documentApi';
import { getAllCategories, Category } from '../../../services/categoryService';
import styles from './documents.module.css';
import DocumentModal from './DocumentModal';

const DocumentsPage: React.FC = () => {
  const router = useRouter(); // Inicialize o useRouter
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10);

  // Estado para armazenar categorias
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: PaginatedDocumentsResponse = await getAllDocuments(page, size);
        console.log('API Response:', response); // Para depuração
        setDocuments(response.documents || []);
        setTotalPages(response.totalPages || 1);
        setPage(response.currentPage || 1);
      } catch (err) {
        console.error(err); // Para depuração
        setError("Erro ao carregar documentos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [page, size]);

  // Buscar categorias quando o componente montar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        // Opcional: Defina um estado de erro para categorias se necessário
      }
    };

    fetchCategories();
  }, []);

  const handleCreateDocument = () => {
    setSelectedDocument(null);
    setModalOpen(true);
  };

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setModalOpen(true);
  };

  const handleDeleteDocument = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este documento?");
    if (confirmDelete) {
      try {
        await deleteDocument(id);
        // Recarregar os documentos após a deleção
        const response: PaginatedDocumentsResponse = await getAllDocuments(page, size);
        setDocuments(response.documents || []);
        setTotalPages(response.totalPages || 1);
        setPage(response.currentPage || 1);
      } catch (error) {
        console.error(error); // Para depuração
        setError("Erro ao deletar o documento.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lista de Documentos</h1>
        <button className={styles.createButton} onClick={handleCreateDocument}>
          Criar Documento
        </button>
      </div>

      {loading ? (
        <div>Carregando documentos...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.documentList}>
          <div className={styles.documentHeader}>
            <span>#</span>
            <span>Título</span>
            <span>Descrição</span>
            <span>Categoria</span>
            <span>Ações</span> {/* Nova coluna para ações */}
          </div>
          {documents.length > 0 ? (
            documents.map((document, index) => (
              <div
                key={document.id}
                className={`${styles.documentItem} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}
                onClick={() => handleEditDocument(document)}
              >
                <span>{(page - 1) * size + index + 1}</span>
                <span>{document.title}</span>
                <span>{document.descricao ? document.descricao : 'N/A'}</span>
                <span>
                  {document.categoryId
                    ? categories.find(cat => cat.id === document.categoryId)?.name || 'Categoria Desconhecida'
                    : 'Sem Categoria'}
                </span>
                <span>
                  <button
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que o clique dispare o onClick do item
                      router.push(`/admin/creations/${document.id}`);
                    }}
                  >
                    Ir para Criação
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div>Nenhum documento encontrado.</div>
          )}
        </div>
      )}

      <div className={styles.pagination}>
        <button 
          onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
          disabled={page === 1}
        >
          Página Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button 
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={page === totalPages}
        >
          Próxima Página
        </button>
      </div>

      {modalOpen && (
        <DocumentModal
          document={selectedDocument}
          categories={categories} // Passe as categorias para o modal
          onClose={() => setModalOpen(false)}
          onDelete={handleDeleteDocument}
          onRefresh={() => {
            // Função para recarregar documentos após criação/atualização
            getAllDocuments(page, size)
              .then(response => {
                setDocuments(response.documents || []);
                setTotalPages(response.totalPages || 1);
                setPage(response.currentPage || 1);
              })
              .catch(err => {
                console.error(err);
                setError("Erro ao recarregar documentos.");
              });
          }}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
