// src/controllers/pageController.ts

import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

// Obter todas as páginas com paginação e opção de filtrar por documentId
export const getAllPages = async (req: Request, res: Response) => {
  const { page = 1, size = 10, documentId } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(size as string, 10);

  const filter: any = {};
  if (documentId) {
    filter.documentId = documentId;
  }

  try {
    const pages = await prisma.page.findMany({
      where: filter,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        document: true, // Inclui os dados do documento relacionado
        elements: true, // Inclui os elementos da página
      },
      orderBy: {
        pageNumber: 'asc', // Ordena por número da página
      },
    });

    const totalPages = await prisma.page.count({
      where: filter,
    });

    const totalPageCount = Math.ceil(totalPages / pageSize);

    res.status(200).json({
      pages,
      totalPages: totalPageCount,
      currentPage: pageNumber,
      totalDocuments: totalPages,
    });
  } catch (error) {
    console.error('Erro ao buscar páginas:', error instanceof Error ? error.message : error);
    res.status(500).json({
      message: 'Erro ao buscar páginas',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
};

// Obter uma página por ID
export const getPageById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        document: true, // Inclui os dados do documento relacionado
        elements: true, // Inclui os elementos da página
      },
    });

    if (!page) {
      return res.status(404).json({ message: 'Página não encontrada' });
    }

    res.status(200).json(page);
  } catch (error) {
    console.error('Erro ao buscar página:', error instanceof Error ? error.message : error);
    res.status(500).json({
      message: 'Erro ao buscar página',
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
