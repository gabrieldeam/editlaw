// src/app/admin/documents/DocumentModal.tsx

import { useState } from 'react';
import { createDocument, updateDocument, Document } from '../../../services/documentApi';
import { Category } from '../../../services/categoryService'; // Importe a interface Category
import Input from '../../../components/input/Input';
import styles from './documentModal.module.css';

interface DocumentModalProps {
  document: Document | null;
  categories: Category[]; // Adiciona a lista de categorias como propriedade
  onClose: () => void;
  onDelete: (id: string) => void;
  onRefresh: () => void; // Função para atualizar a lista de documentos
}

const DocumentModal: React.FC<DocumentModalProps> = ({ document, categories, onClose, onDelete, onRefresh }) => {
  const [title, setTitle] = useState(document?.title || '');
  const [preco, setPreco] = useState<number>(document?.preco || 0);
  const [precoDesconto, setPrecoDesconto] = useState<number>(document?.precoDesconto || 0);
  const [descricao, setDescricao] = useState(document?.descricao || '');
  const [autor, setAutor] = useState(document?.autor || '');
  const [image1, setImage1] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>(document?.categoryId || '');

  const handleImageChange = (file: File | null) => {
    setImage1(file);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('preco', preco.toString());
      if (precoDesconto) formData.append('precoDesconto', precoDesconto.toString());
      formData.append('descricao', descricao);
      formData.append('autor', autor);
      if (image1) formData.append('image', image1);
      if (categoryId) formData.append('categoryId', categoryId); // Adiciona categoryId ao FormData

      if (document && document.id) {
        await updateDocument(document.id, formData);
      } else {
        await createDocument(formData);
      }
      onRefresh(); // Recarrega a lista de documentos após salvar
      onClose();
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      // Opcional: Adicione feedback para o usuário sobre o erro
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{document ? 'Editar Documento' : 'Criar Documento'}</h2>

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
          <Input
            label="Autor"
            name="autor"
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />

          <div className={styles.imageUpload}>
            <label>Imagem</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className={styles.fileInput}
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            />
          </div>

          {/* Campo de seleção de categoria */}
          <div className={styles.categorySelect}>
            <label htmlFor="category">Categoria</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
            {document && document.id && (
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => document.id && onDelete(document.id)}
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

export default DocumentModal;
