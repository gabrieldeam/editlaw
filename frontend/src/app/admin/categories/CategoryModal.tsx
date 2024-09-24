interface Category {
  id?: string;
  name: string;
  description: string;
  image1: File | null;
  image2: File | null;
  image3: File | null;
}

import { useState } from 'react';
import { createCategory, updateCategory } from '../../../services/categoryService';
import Input from '../../../components/input/Input'; // Componente de input reutilizável
import styles from './categoryModal.module.css';

interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ category, onClose, onDelete }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);

  const handleImageChange = (setImage: React.Dispatch<React.SetStateAction<File | null>>, file: File | null) => {
    setImage(file);
  };

  const handleSave = async () => {
    try {
      // Cria o FormData para envio
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);

      if (category && category.id) {
        // Atualizar categoria existente
        await updateCategory(category.id, formData);
      } else {
        // Criar nova categoria
        await createCategory(formData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{category ? 'Editar Categoria' : 'Criar Categoria'}</h2>

        <Input
          label="Nome"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Descrição"
          name="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={styles.imageUpload}>
          <label>Imagem 1</label>
          <input
            type="file"
            name="image1"
            accept="image/*"
            onChange={(e) => handleImageChange(setImage1, e.target.files?.[0] || null)}
          />
        </div>

        <div className={styles.imageUpload}>
          <label>Imagem 2</label>
          <input
            type="file"
            name="image2"
            accept="image/*"
            onChange={(e) => handleImageChange(setImage2, e.target.files?.[0] || null)}
          />
        </div>

        <div className={styles.imageUpload}>
          <label>Imagem 3</label>
          <input
            type="file"
            name="image3"
            accept="image/*"
            onChange={(e) => handleImageChange(setImage3, e.target.files?.[0] || null)}
          />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.saveButton} onClick={handleSave}>
            Salvar
          </button>
          {category && category.id && (
            <button
              className={styles.deleteButton}
              onClick={() => category?.id && onDelete(category.id)}
            >
              Excluir
            </button>
          )}
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
