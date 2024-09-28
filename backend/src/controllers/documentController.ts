// src/controllers/documentController.ts

import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';


// Configurando multer para salvar arquivos na pasta /upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'upload'); // Usa 'src/upload'
    fs.ensureDirSync(uploadPath); // Garante que a pasta exista
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

export const upload = multer({ storage }).single('image');

// Função para remover a imagem antiga
const removeOldImage = async (oldImagePath: string) => {
  const imagePath = path.resolve(__dirname, '../../', oldImagePath); // Caminho absoluto
  if (await fs.pathExists(imagePath)) {
    await fs.remove(imagePath);
  }
};

// Get all documents with pagination and include category
export const getAllDocuments = async (req: Request, res: Response) => {
  const { page = 1, size = 10 } = req.query; // Pega os parâmetros de paginação
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(size as string, 10);

  try {
    const documents = await prisma.document.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        category: true, // Inclui os dados da categoria
      },
    });

    const totalDocuments = await prisma.document.count(); // Conta o total de documentos
    const totalPages = Math.ceil(totalDocuments / pageSize); // Calcula o número total de páginas

    res.status(200).json({
      documents,
      totalPages,
      currentPage: pageNumber,
      totalDocuments,
    });
  } catch (error) {
    console.error('Erro ao buscar documentos:', error instanceof Error ? error.message : error);
    res.status(500).json({ message: 'Error fetching documents', error: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
};

// Get document by ID and include category
export const getDocumentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        category: true, // Inclui os dados da categoria
      },
    });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document);
  } catch (error) {
    console.error('Erro ao buscar documento:', error instanceof Error ? error.message : error);
    res.status(500).json({ message: 'Error fetching document', error: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
};

// Create a new document with categoryId
export const createDocument = async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      return res.status(500).json({ message: 'Error uploading image', error: err.message });
    }

    const { title, preco, precoDesconto, descricao, autor, categoryId } = req.body; // Inclui categoryId
    const image = req.file ? `/upload/${req.file.filename}` : null;

    // Conversão e Validação do Campo 'preco'
    const precoNumber = parseFloat(preco);
    if (isNaN(precoNumber)) {
      return res.status(400).json({ message: 'Preço inválido' });
    }

    // Conversão e Validação do Campo 'precoDesconto'
    let precoDescontoNumber: number | null = null;
    if (precoDesconto) {
      const parsed = parseFloat(precoDesconto);
      if (isNaN(parsed)) {
        return res.status(400).json({ message: 'Preço com desconto inválido' });
      }
      precoDescontoNumber = parsed;
    }

    // Validação opcional do categoryId
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category ID inválido' });
      }
    }

    try {
      const newDocument = await prisma.document.create({
        data: {
          title,
          preco: precoNumber,
          precoDesconto: precoDescontoNumber, // number | null
          descricao,
          autor,
          image,
          categoryId: categoryId || null, // Inclui categoryId
        },
        include: {
          category: true, // Inclui os dados da categoria na resposta
        },
      });
      res.status(201).json(newDocument);
    } catch (error) {
      console.error('Erro ao criar documento:', error instanceof Error ? error.message : error);
      res.status(500).json({ message: 'Error creating document', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  });
};

// Update an existing document with categoryId
export const updateDocument = async (req: Request, res: Response) => {
  const { id } = req.params;

  upload(req, res, async (err) => {
    if (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      return res.status(500).json({ message: 'Error uploading image', error: err.message });
    }

    const { title, preco, precoDesconto, descricao, autor, categoryId } = req.body; // Inclui categoryId
    const newImage = req.file ? `/upload/${req.file.filename}` : null;

    // Conversão e Validação do Campo 'preco'
    const precoNumber = parseFloat(preco);
    if (isNaN(precoNumber)) {
      return res.status(400).json({ message: 'Preço inválido' });
    }

    // Conversão e Validação do Campo 'precoDesconto'
    let precoDescontoNumber: number | null = null;
    if (precoDesconto) {
      const parsed = parseFloat(precoDesconto);
      if (isNaN(parsed)) {
        return res.status(400).json({ message: 'Preço com desconto inválido' });
      }
      precoDescontoNumber = parsed;
    }

    // Validação opcional do categoryId
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category ID inválido' });
      }
    }

    try {
      // Verificar o documento atual
      const document = await prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Remover imagem antiga se uma nova for enviada
      if (newImage && document.image) {
        await removeOldImage(document.image);
      }

      const updatedDocument = await prisma.document.update({
        where: { id },
        data: {
          title,
          preco: precoNumber,
          precoDesconto: precoDescontoNumber, // number | null
          descricao,
          autor,
          image: newImage || document.image, // Atualizar a imagem apenas se uma nova for enviada
          categoryId: categoryId !== undefined ? categoryId : document.categoryId, // Atualiza categoryId se fornecido
        },
        include: {
          category: true, // Inclui os dados da categoria na resposta
        },
      });

      res.status(200).json(updatedDocument);
    } catch (error) {
      console.error('Erro ao atualizar documento:', error instanceof Error ? error.message : error);
      res.status(500).json({ message: 'Error updating document', error: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  });
};

// Delete a document (remove associated image as well)
export const deleteDocument = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Remover imagem associada se existir
    if (document.image) {
      await removeOldImage(document.image);
    }

    await prisma.document.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar documento:', error instanceof Error ? error.message : error);
    res.status(500).json({ message: 'Error deleting document', error: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
};

// Função para obter documentos sem páginas
export const getDocumentsWithoutPages = async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        pages: {
          none: {}, // Seleciona documentos onde não existem páginas relacionadas
        },
      },
      include: {
        category: true, // Inclui os dados da categoria, se necessário
      },
    });

    res.status(200).json({
      documents,
      total: documents.length,
    });
  } catch (error) {
    console.error('Erro ao buscar documentos sem páginas:', error instanceof Error ? error.message : error);
    res.status(500).json({ message: 'Erro ao buscar documentos sem páginas', error: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
};