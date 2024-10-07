import { useState, useEffect } from 'react';
import { createPackage, updatePackage, Package } from '../../../services/packageService';
import { Document } from '../../../services/documentApi';
import { getCategoryById } from '../../../services/categoryService'; // Importa a função para buscar categorias
import Input from '../../../components/input/Input';
import styles from './packageModal.module.css';

interface PackageModalProps {
  pkg: Package | null;
  documents: Document[];
  onClose: () => void;
  onRefresh: () => void;
}

const PackageModal: React.FC<PackageModalProps> = ({ pkg, documents, onClose, onRefresh }) => {
  const [title, setTitle] = useState(pkg?.title || '');
  const [preco, setPreco] = useState<number>(pkg?.preco || 0);
  const [precoDesconto, setPrecoDesconto] = useState<number>(pkg?.precoDesconto || 0);
  const [descricao, setDescricao] = useState(pkg?.descricao || '');
  const [documentIds, setDocumentIds] = useState<string[]>(pkg?.documentIds || []);
  const [documentCategories, setDocumentCategories] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Função para buscar o nome da categoria para cada documento
    const fetchCategoryNames = async () => {
      const categoriesMap: { [key: string]: string } = {};
      for (const doc of documents) {
        if (doc.categoryId && !categoriesMap[doc.categoryId]) {
          try {
            const category = await getCategoryById(doc.categoryId);
            categoriesMap[doc.categoryId] = category.name; // Armazena o nome da categoria pelo ID
          } catch (error) {
            console.error(`Erro ao buscar categoria para documento ${doc.id}:`, error);
            categoriesMap[doc.categoryId] = 'Categoria Desconhecida'; // Define um fallback em caso de erro
          }
        }
      }
      setDocumentCategories(categoriesMap); // Atualiza o estado com o mapa de categorias
    };

    fetchCategoryNames();
  }, [documents]);

  const handleDocumentSelection = (docId: string) => {
    if (documentIds.includes(docId)) {
      setDocumentIds(documentIds.filter(id => id !== docId));
    } else {
      setDocumentIds([...documentIds, docId]);
    }
  };

  const handleSave = async () => {
    try {
      const newPackage = {
        title,
        preco,
        precoDesconto,
        descricao,
        documentIds,
      };

      if (pkg && pkg.id) {
        await updatePackage(pkg.id, newPackage);
      } else {
        await createPackage(newPackage);
      }

      onRefresh(); // Recarrega a lista de pacotes após salvar
      onClose();
    } catch (error) {
      console.error('Erro ao salvar pacote:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{pkg ? 'Editar Pacote' : 'Criar Pacote'}</h2>

        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Input
            label="Título"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Preço"
            name="preco"
            type="number"
            value={preco.toString()}
            onChange={(e) => setPreco(parseFloat(e.target.value))}
          />
          <Input
            label="Preço com Desconto"
            name="precoDesconto"
            type="number"
            value={precoDesconto.toString()}
            onChange={(e) => setPrecoDesconto(e.target.value ? parseFloat(e.target.value) : 0)}
          />
          <Input
            label="Descrição"
            name="descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          {/* Seleção de Documentos */}
          <div className={styles.documentSelection}>
            <label>Selecionar Documentos</label>
            <div className={styles.documentsList}>
              {documents.map(doc => (
                doc.id && (  // Garante que o doc.id exista
                  <div key={doc.id} className={styles.documentItem}>
                    <input
                      type="checkbox"
                      id={`doc-${doc.id}`}
                      checked={documentIds.includes(doc.id)}
                      onChange={() => handleDocumentSelection(doc.id)}
                    />
                    <label htmlFor={`doc-${doc.id}`}>
                      {doc.title} (
                      {doc.categoryId ? `Categoria: ${documentCategories[doc.categoryId] || 'Carregando...'}` : 'Sem Categoria'})
                    </label>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
            {pkg && pkg.id && (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja deletar este pacote?")) {
                    // Implementar a função de deleção se necessário
                  }
                }}
              >
                Excluir
              </button>
            )}
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageModal;
