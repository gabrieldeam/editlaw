// src/services/creditCardService.ts

import api from './api';
import { CreditCard } from '../types/creditCard';

// Interface para os dados do cartão de crédito sem o ID (para criação)
interface CreditCardInput {
  name: string;
  cardNumber: string;
  expirationDate: string; // Pode ser Date, dependendo de como você lida com datas
}

// Criar um novo cartão de crédito
export const createCreditCard = async (creditCardData: CreditCardInput): Promise<void> => {
  try {
    await api.post('/creditcards', creditCardData);
  } catch (error) {
    // Lidar com o erro apropriadamente
    throw error;
  }
};

// Obter todos os cartões de crédito do usuário
export const getCreditCards = async (): Promise<CreditCard[]> => {
  try {
    const response = await api.get<CreditCard[]>('/creditcards');
    return response.data;
  } catch (error) {
    // Lidar com o erro apropriadamente
    throw error;
  }
};

// Obter um cartão de crédito pelo ID
export const getCreditCardById = async (id: string): Promise<CreditCard> => {
  try {
    const response = await api.get<CreditCard>(`/creditcards/${id}`);
    return response.data;
  } catch (error) {
    // Lidar com o erro apropriadamente
    throw error;
  }
};

// Atualizar um cartão de crédito
export const updateCreditCard = async (id: string, updatedData: Partial<CreditCardInput>): Promise<void> => {
  try {
    await api.put(`/creditcards/${id}`, updatedData);
  } catch (error) {
    // Lidar com o erro apropriadamente
    throw error;
  }
};

// Deletar um cartão de crédito
export const deleteCreditCard = async (id: string): Promise<void> => {
  try {
    await api.delete(`/creditcards/${id}`);
  } catch (error) {
    // Lidar com o erro apropriadamente
    throw error;
  }
};
