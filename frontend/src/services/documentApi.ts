// src/services/documentApi.ts

import api from './api';


export interface Document {
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
export const getDocumentById = async (id: string): Promise<Document> => {
  try {
    const response = await api.get<Document>(`/documents/${id}`);
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

// Função para buscar todos os documentos sem páginas cadastradas
export const getDocumentsWithoutPages = async (): Promise<DocumentsWithoutPagesResponse> => {
  try {
    const response = await api.get<DocumentsWithoutPagesResponse>('/documents/no-pages');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar documentos sem páginas:', error);
    throw error;
  }
};
