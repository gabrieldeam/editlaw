// src/services/billingService.ts
import api from './api';

interface BillingData {
  country: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  cpf: string;
}

// Cria ou atualiza as informações de cobrança do usuário autenticado
export const createOrUpdateBillingInfo = async (data: BillingData) => {
  try {
    const response = await api.post('/billing', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtém as informações de cobrança do usuário autenticado
export const getBillingInfo = async () => {
  try {
    const response = await api.get('/billing');
    return response.data;
  } catch (error) {
    throw error;
  }
};
