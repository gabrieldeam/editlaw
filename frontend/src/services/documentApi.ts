// src/services/documentApi.ts

import api from './api';


export interface Document {
  id: string;
  title: string;
  preco: number;
  precoDesconto?: number;
  descricao: string;
  autor: string;
  image?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentData {
  id?: string;
  title: string;
  preco: number;
  precoDesconto?: number;
  descricao: string;
  autor: string;
  image?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentDataCategory {
  id: string;
  title: string;
  preco: number;
  precoDesconto: number;
  descricao: string;
  autor: string;
  image: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    description: string;
    image1: string;
    image2: string;
    image3: string;
  }; // Adiciona a categoria aqui
  createdAt: string;
  updatedAt: string;
}



export interface PaginatedDocumentsResponse {
  documents: Document[];
  totalDocuments: number;
  totalPages: number;
  currentPage: number;
}

// Nova interface para a resposta do endpoint /documents/no-pages
export interface DocumentsWithoutPagesResponse {
  documents: Document[];
  total: number;
}

// Função para buscar todos os documentos com paginação
export const getAllDocuments = async (page = 1, size = 10): Promise<PaginatedDocumentsResponse> => {
  try {
    const response = await api.get<PaginatedDocumentsResponse>('/documents', {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    // Lidar com o erro conforme necessário
    console.error('Erro ao buscar documentos:', error);
    throw error;
  }
};

// Função para buscar um documento por ID
// Modifique o tipo de retorno da função getDocumentById
export const getDocumentById = async (id: string): Promise<DocumentDataCategory> => {
  try {
    const response = await api.get<DocumentDataCategory>(`/documents/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar o documento com ID ${id}:`, error);
    throw error;
  }
};


// Função para criar um novo documento usando FormData
export const createDocument = async (formData: FormData): Promise<Document> => {
  try {
    const response = await api.post<Document>('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    throw error;
  }
};

// Função para atualizar um documento por ID usando FormData
export const updateDocument = async (id: string, formData: FormData): Promise<Document> => {
  try {
    const response = await api.put<Document>(`/documents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar o documento com ID ${id}:`, error);
    throw error;
  }
};

// Função para deletar um documento por ID
export const deleteDocument = async (id: string): Promise<void> => {
  try {
    await api.delete(`/documents/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar o documento com ID ${id}:`, error);
    throw error;
  }
};

export const getDocumentsByCategory = async (categoryId: string, page = 1, size = 10): Promise<PaginatedDocumentsResponse> => {
  try {
    const response = await api.get<PaginatedDocumentsResponse>(`/documents/category/${categoryId}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar documentos da categoria com ID ${categoryId}:`, error);
    throw error;
  }
};


// Nova função para pesquisar documentos pelo nome e, opcionalmente, pelo ID da categoria
export const searchDocuments = async (name: string, categoryId?: string, page = 1, size = 10): Promise<PaginatedDocumentsResponse> => {
  try {
    const params: any = { name, page, size }; // Parâmetros obrigatórios e opcionais

    if (categoryId) {
      params.categoryId = categoryId; // Adiciona o filtro por categoria se presente
    }

    const response = await api.get<PaginatedDocumentsResponse>('/documents/search', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    throw error;
  }
};