// src/app/admin/packages/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllPackages, deletePackage, Package } from '../../../services/packageService';
import { getAllDocuments, Document, PaginatedDocumentsResponse  } from '../../../services/documentApi';
import styles from './packages.module.css';
import PackageModal from './PackageModal';

const PackagesPage: React.FC = () => {
  const router = useRouter();

  const [packages, setPackages] = useState<Package[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllPackages();
        setPackages(response);
        // Ajuste conforme a resposta da API para paginação, se aplicável
        // Aqui assumimos que a API retorna todos os pacotes sem paginação
        setTotalPages(1);
        setPage(1);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar pacotes.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [page, size]);

  // Buscar documentos quando o componente montar
  useEffect(() => {
    const fetchDocuments = async () => {
        try {
          const response: PaginatedDocumentsResponse = await getAllDocuments();
          setDocuments(response.documents); // Use apenas a lista de documentos
        } catch (err) {
          console.error('Erro ao buscar documentos:', err);
        }
      };
      
      

    fetchDocuments();
  }, []);

  const handleCreatePackage = () => {
    setSelectedPackage(null);
    setModalOpen(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const handleDeletePackage = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este pacote?");
    if (confirmDelete) {
      try {
        await deletePackage(id);
        // Recarregar os pacotes após a deleção
        const updatedPackages = packages.filter(pkg => pkg.id !== id);
        setPackages(updatedPackages);
      } catch (error) {
        console.error(error);
        setError("Erro ao deletar o pacote.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lista de Pacotes</h1>
        <button className={styles.createButton} onClick={handleCreatePackage}>
          Criar Pacote
        </button>
      </div>

      {loading ? (
        <div>Carregando pacotes...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.packageList}>
          <div className={styles.packageHeader}>
            <span>#</span>
            <span>Título</span>
            <span>Preço</span>
            <span>Preço com Desconto</span>
            <span>Descrição</span>
            <span>Documentos</span>
            <span>Ações</span>
          </div>
          {packages.length > 0 ? (
            packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`${styles.packageItem} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}
              >
                <span>{index + 1}</span>
                <span>{pkg.title}</span>
                <span>{pkg.preco.toFixed(2)}</span>
                <span>{pkg.precoDesconto ? pkg.precoDesconto.toFixed(2) : 'N/A'}</span>
                <span>{pkg.descricao || 'N/A'}</span>
                <span>
                  {pkg.documentIds.length > 0
                    ? pkg.documentIds.map(docId => {
                        const doc = documents.find(d => d.id === docId);
                        return doc ? doc.title : 'Documento Desconhecido';
                      }).join(', ')
                    : 'Nenhum Documento'}
                </span>
                <span>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleEditPackage(pkg)}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    Deletar
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div>Nenhum pacote encontrado.</div>
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
        <PackageModal
          pkg={selectedPackage}
          documents={documents}
          onClose={() => setModalOpen(false)}
          onRefresh={() => {
            // Recarregar os pacotes após criação/atualização
            getAllPackages()
              .then(response => {
                setPackages(response);
              })
              .catch(err => {
                console.error(err);
                setError("Erro ao recarregar pacotes.");
              });
          }}
        />
      )}
    </div>
  );
};

export default PackagesPage;
