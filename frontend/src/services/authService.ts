import api from './api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface EditEmailData {
  userId: number;
  newEmail: string;
}

// Registra um novo usuário
export const registerUser = async (data: RegisterData) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Faz o login do usuário
export const loginUser = async (data: LoginData) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Solicita redefinição de senha
export const resetPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Redefine a senha utilizando o token JWT
export const confirmResetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await api.post('/auth/confirm-reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verifica a autenticação do usuário com base no token de sessão
export const checkAuth = async () => {
  try {
    const response = await api.get('/auth/check-auth');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Exclui a conta de um usuário com base no ID
export const deleteAccount = async (userId: number) => {
  try {
    const response = await api.delete('/auth/delete-account', { data: { userId } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Edita o email de um usuário
export const editEmail = async (data: EditEmailData) => {
  try {
    const response = await api.put('/auth/edit-email', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Retorna os dados do usuário autenticado
export const getUserInfo = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Faz o logout do usuário
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verifica se o usuário é um administrador
export const isAdmin = async () => {
  try {
    const response = await api.get('/auth/is-admin');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Retorna todos os usuários cadastrados
export const getAllUsers = async () => {
  try {
    const response = await api.get('/auth/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};