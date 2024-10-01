// src/services/pageService.ts
import api from './api'; 

// Interface da Página
interface Page {
  id: string;
  documentId: string;
  pageNumber: number;
  createdAt: string;
  updatedAt: string;
}

// Obter todas as páginas pelo ID do documento
export const getPagesByDocumentId = async (documentId: string): Promise<Page[]> => {
  try {
    const response = await api.get<Page[]>(`/pages/document/${documentId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar páginas');
  }
};

// Criar uma nova página
interface CreatePageData {
  documentId: string;
  pageNumber: number;
}

export const createPage = async (data: CreatePageData): Promise<Page> => {
  try {
    const response = await api.post<Page>('/pages', data);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar página');
  }
};

// Atualizar uma página existente
interface UpdatePageData {
  documentId?: string;
  pageNumber?: number;
}

export const updatePage = async (id: string, data: UpdatePageData): Promise<Page> => {
  try {
    const response = await api.put<Page>(`/pages/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar página');
  }
};

// Deletar uma página
export const deletePage = async (id: string): Promise<void> => {
  try {
    await api.delete(`/pages/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar página');
  }
};
