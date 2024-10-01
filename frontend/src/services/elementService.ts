// src/services/elementService.ts
import api from './api';

// Interface do Elemento
export interface Element {
  id: string;
  pageId: string;
  type: 'text' | 'image' | 'rectangle' | 'square' | 'circle' | 'triangle' | 'icon' | 'elementImage';
  x: number;
  y: number;
  content?: string;
  src?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fill?: string;
  width?: number;
  height?: number;
  rotation?: number;
  radius?: number;
  textType?: 'text' | 'paragraph';
  highlightColor?: string;
}

// Obter todos os elementos por PageId
export const getElementsByPageId = async (pageId: string): Promise<Element[]> => {
  try {
    const response = await api.get<Element[]>(`/elements/page/${pageId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao buscar elementos da página ${pageId}: ${error}`);
  }
};

// Criar um novo elemento
export interface CreateElementData {
  pageId: string;
  type: 'text' | 'image' | 'rectangle' | 'square' | 'circle' | 'triangle' | 'icon' | 'elementImage';
  x: number;
  y: number;
  content?: string;
  src?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fill?: string;
  width?: number;
  height?: number;
  rotation?: number;
  radius?: number;
  textType?: 'text' | 'paragraph';
  highlightColor?: string;
}

export const createElement = async (elementData: CreateElementData): Promise<Element> => {
  try {
    const response = await api.post<Element>('/elements', elementData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar elemento: ${error}`);
  }
};

// Atualizar um elemento por ID
export interface UpdateElementData {
  type?: 'text' | 'image' | 'rectangle' | 'square' | 'circle' | 'triangle' | 'icon' | 'elementImage';
  x?: number;
  y?: number;
  rotation?: number;
  content?: string;
  src?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fill?: string;
  width?: number;
  height?: number;
  radius?: number;
  textType?: 'text' | 'paragraph';
  highlightColor?: string;
}

export const updateElement = async (id: string, elementData: UpdateElementData): Promise<Element> => {
  try {
    const response = await api.put<Element>(`/elements/${id}`, elementData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao atualizar elemento ${id}: ${error}`);
  }
};

// Deletar um elemento por ID
export const deleteElement = async (id: string): Promise<void> => {
  try {
    await api.delete(`/elements/${id}`);
  } catch (error) {
    throw new Error(`Erro ao deletar elemento ${id}: ${error}`);
  }
};
