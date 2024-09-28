import api from './api'; // Importa a instância do Axios

interface CategoryData {
  name: string;
  description: string;
  image1?: string;
  image2?: string;
  image3?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image1?: string; // URLs das imagens
  image2?: string;
  image3?: string;
}

// Função para criar categoria, agora aceita FormData
export const createCategory = async (categoryData: FormData) => {
  try {
    const response = await api.post('/categories', categoryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Função para atualizar categoria, agora aceita FormData
export const updateCategory = async (id: string, categoryData: FormData) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Deleta uma categoria
export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtém todas as categorias
export const getAllCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtém uma categoria específica por ID
export const getCategoryById = async (id: string) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
