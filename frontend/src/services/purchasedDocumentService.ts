import api from './api';

interface PurchasedDocumentsInput {
  documentIds: string[];
}

interface PurchasedDocument {
  id: string;
  userId: string;
  documentId: string;
  purchaseDate: string;
  exclusionDate?: string;
  document: {
    title: string;
    price: number;
    image: string;
  };
}

interface PaginatedPurchasedDocuments {
  page: number;
  totalPages: number;
  limit: number;
  totalDocuments: number;
  purchasedDocuments: PurchasedDocument[];
}

// Função para criar documentos comprados
export const createPurchasedDocuments = async (data: PurchasedDocumentsInput): Promise<PurchasedDocument[]> => {
  try {
    const response = await api.post<PurchasedDocument[]>('/purchased-documents', data);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar documentos comprados: ${error}`);
  }
};

// Função para listar documentos comprados com paginação
export const getPurchasedDocuments = async (page = 1, limit = 10): Promise<PaginatedPurchasedDocuments> => {
  try {
    const response = await api.get<PaginatedPurchasedDocuments>('/purchased-documents/list', {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao pegar documentos comprados: ${error}`);
  }
};
