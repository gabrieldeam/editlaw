import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import jwt from 'jsonwebtoken';

/**
 * Cria um ou mais documentos comprados para o usuário autenticado.
 * A data de compra é automaticamente a data atual, e a data de exclusão será um ano após a compra.
 */
export const createPurchasedDocuments = async (req: Request, res: Response) => {
  const { documentIds } = req.body; // Recebe uma lista de documentIds
  const token = req.cookies.token; // Pegando o token do cookie

  try {
    // Verifica o token JWT para extrair o userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    // Verifica se o array de documentIds foi enviado corretamente
    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return res.status(400).json({ error: 'Lista de documentIds é obrigatória.' });
    }

    // Definir a data de compra como o momento atual
    const purchaseDate = new Date();

    // Definir a data de exclusão como 1 ano após a compra
    const exclusionDate = new Date(purchaseDate);
    exclusionDate.setFullYear(exclusionDate.getFullYear() + 1);

    // Cria um registro para cada documentId fornecido
    const purchasedDocuments = await Promise.all(
      documentIds.map(async (documentId: string) => {
        return await prisma.purchasedDocument.create({
          data: {
            userId: decoded.userId, // Obtido a partir do token
            documentId,
            purchaseDate,
            exclusionDate,
          },
        });
      })
    );

    return res.status(201).json({
      message: 'Documentos comprados com sucesso!',
      purchasedDocuments,
    });
  } catch (error) {
    console.error('Erro ao criar PurchasedDocuments:', error);
    return res.status(500).json({ error: 'Erro ao criar os documentos comprados' });
  }
};


/**
 * Pega os documentos comprados do usuário autenticado com paginação.
 */
export const getPurchasedDocuments = async (req: Request, res: Response) => {
  const token = req.cookies.token; // Pegando o token do cookie
  const page = parseInt(req.query.page as string) || 1; // Página padrão 1
  const limit = parseInt(req.query.limit as string) || 10; // Limite padrão de 10 registros

  try {
    // Verifica o token JWT para extrair o userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const offset = (page - 1) * limit;

    // Busca os documentos comprados do usuário autenticado com paginação
    const purchasedDocuments = await prisma.purchasedDocument.findMany({
      where: {
        userId: decoded.userId,
      },
      skip: offset,
      take: limit,
      include: {
        document: true, // Inclui detalhes do documento comprado
      },
    });

    // Conta o total de documentos comprados
    const totalDocuments = await prisma.purchasedDocument.count({
      where: {
        userId: decoded.userId,
      },
    });

    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      page,
      totalPages,
      limit,
      totalDocuments,
      purchasedDocuments,
    });
  } catch (error) {
    console.error('Erro ao pegar os documentos comprados:', error);
    return res.status(500).json({ error: 'Erro ao pegar os documentos comprados' });
  }
};