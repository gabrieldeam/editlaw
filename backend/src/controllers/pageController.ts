// src/controllers/pageController.ts

import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

// Obter todas as páginas pelo ID do documento
export const getPagesByDocumentId = async (req: Request, res: Response) => {
  const { documentId } = req.params;

  try {
    const pages = await prisma.page.findMany({
      where: { documentId },
      orderBy: {
        pageNumber: 'asc', // Ordena por número da página
      },
      include: {
        elements: true, // Inclui os elementos da página, se necessário
      },
    });

    if (pages.length === 0) {
      return res.status(404).json({ message: 'Nenhuma página encontrada para o documento especificado' });
    }

    res.status(200).json(pages);
  } catch (error) {
    console.error('Erro ao buscar páginas pelo documentId:', error instanceof Error ? error.message : error);
    res.status(500).json({
      message: 'Erro ao buscar páginas pelo documentId',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
};

// Obter todas as páginas pelo ID do documento comprado (purchasedDocumentId)
export const getPagesByPurchasedDocumentId = async (req: Request, res: Response) => {
  const { purchasedDocumentId } = req.params;

  try {
    const pages = await prisma.page.findMany({
      where: { purchasedDocumentId },
      orderBy: {
        pageNumber: 'asc', // Ordena por número da página
      },
      include: {
        elements: true, // Inclui os elementos da página, se necessário
      },
    });

    if (pages.length === 0) {
      return res.status(404).json({ message: 'Nenhuma página encontrada para o documento comprado especificado' });
    }

    res.status(200).json(pages);
  } catch (error) {
    console.error('Erro ao buscar páginas pelo purchasedDocumentId:', error instanceof Error ? error.message : error);
    res.status(500).json({
      message: 'Erro ao buscar páginas pelo purchasedDocumentId',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
};

// Criar uma nova página
export const createPage = async (req: Request, res: Response) => {
  const { documentId, pageNumber } = req.body;

  // Validação básica
  if (!documentId || pageNumber === undefined) {
    return res.status(400).json({ message: 'documentId e pageNumber são obrigatórios' });
  }

  try {
    // Verifica se o documento existe
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return res.status(400).json({ message: 'documentId inválido' });
    }

    // Verifica se já existe uma página com o mesmo número no mesmo documento
    const existingPage = await prisma.page.findFirst({
      where: {
        documentId,
        pageNumber,
      },
    });

    if (existingPage) {
      return res.status(400).json({ message: 'Já existe uma página com este número no documento especificado' });
    }

    const newPage = await prisma.page.create({
      data: {
        documentId,
        pageNumber,
      },
      include: {
        document: true,
        elements: true,
      },
    });

    res.status(201).json(newPage);
  } catch (error) {
    console.error('Erro ao criar página:', error instanceof Error ? error.message : error);
    res.status(500).json({
      message: 'Erro ao criar página',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
};

// Atualizar uma página existente
export const updatePage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { documentId, pageNumber } = req.body;

  try {
    // Verifica se a página existe
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    // Se documentId for fornecido, verifica se o documento existe
    if (documentId) {
      const document = await prisma.document.findUnique({
        where: { id: documentId },
      });

      if (!document) {
        return res.status(400).json({ message: 'documentId inválido' });
      }
    }

    // Se pageNumber ou documentId forem atualizados, verifica duplicidade
    if (pageNumber !== undefined || documentId) {
      const newDocumentId = documentId || page.documentId;
      const newPageNumber = pageNumber !== undefined ? pageNumber : page.pageNumber;

      const existingPage = await prisma.page.findFirst({
        where: {
          documentId: newDocumentId,
          pageNumber: newPageNumber,
          NOT: { id },
        },
      });

      if (existingPage) {
        return res.status(400).json({ message: 'Já existe uma página com este número no documento especificado' });
      }
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        documentId: documentId || page.documentId,
        pageNumber: pageNumber !== undefined ? pageNumber : page.pageNumber,
      },
      include: {
        document: true,
        elements: true,
      },
    });

    res.status(200).json(updatedPage);
  } catch (error) {
    console.error('Erro ao atualizar página:', error instanceof Error ? error.message : error);
    res.status(500).json({
      message: 'Erro ao atualizar página',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
};

// Deletar uma página
export const deletePage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verifica se a página existe
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        elements: true, // Inclui elementos para possível deleção em cascata
      },
    });

    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    // Opcional: Deletar todos os elementos associados à página
    if (page.elements.length > 0) {
      await prisma.element.deleteMany({
        where: { pageId: id },
      });
    }

    // Deleta a página
    await prisma.page.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar página:', error instanceof Error ? error.message : error);
    res.status(500).json({
      message: 'Erro ao deletar página',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
};
