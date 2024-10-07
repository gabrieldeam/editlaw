import api from './api';

export interface Package {
  id: string;
  title: string;
  preco: number;
  precoDesconto?: number;
  descricao: string;
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const getAllPackages = async (): Promise<Package[]> => {
  try {
    const response = await api.get<Package[]>('/packages');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar pacotes.');
  }
};

export const getPackageById = async (id: string): Promise<Package> => {
  try {
    const response = await api.get<Package>(`/packages/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar o pacote.');
  }
};

export const createPackage = async (newPackage: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Promise<Package> => {
  try {
    const response = await api.post<Package>('/packages', newPackage);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar o pacote.');
  }
};

export const updatePackage = async (id: string, updatedPackage: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Promise<Package> => {
  try {
    const response = await api.put<Package>(`/packages/${id}`, updatedPackage);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar o pacote.');
  }
};

export const deletePackage = async (id: string): Promise<void> => {
  try {
    await api.delete(`/packages/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar o pacote.');
  }
};
