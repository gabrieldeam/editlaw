// controllers/creditCardController.ts

import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Certifique-se de que a chave de criptografia possui 32 bytes
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const IV_LENGTH = 16;

// Função para criptografar dados
function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Função para descriptografar dados
function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() as string, 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Função para extrair userId do token JWT
const getUserIdFromToken = (req: Request): string | null => {
  try {
    const token = req.cookies.token;
    console.log('Token recebido:', token);
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    console.log('Decoded token:', decoded);
    return decoded.userId;
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    return null;
  }
};


// Criar cartão de crédito
export const createCreditCard = async (req: Request, res: Response) => {
  try {
    const { name, cardNumber, expirationDate } = req.body;
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    // Criptografar o número do cartão
    const encryptedCardNumber = encrypt(cardNumber);

    await prisma.creditCard.create({
      data: {
        name,
        cardNumber: encryptedCardNumber,
        expirationDate: new Date(expirationDate),
        userId,
      },
    });

    res.status(201).json({ message: 'Cartão de crédito cadastrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao cadastrar cartão de crédito:', error);
    res.status(500).json({ message: 'Erro ao cadastrar cartão de crédito.' });
  }
};


// Obter cartões de crédito do usuário
export const getCreditCards = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const cards = await prisma.creditCard.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        cardNumber: true,
        expirationDate: true,
      },
    });

    // Descriptografar números de cartão
    const decryptedCards = cards.map((card) => ({
      ...card,
      cardNumber: decrypt(card.cardNumber),
    }));

    res.json(decryptedCards);
  } catch (error) {
    console.error('Erro ao obter cartões de crédito:', error);
    res.status(500).json({ message: 'Erro ao obter cartões de crédito.' });
  }
};

// Obter cartão de crédito por ID
export const getCreditCardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const card = await prisma.creditCard.findFirst({
      where: { id, userId },
      select: {
        id: true,
        name: true,
        cardNumber: true,
        expirationDate: true,
      },
    });

    if (!card) {
      return res.status(404).json({ message: 'Cartão não encontrado.' });
    }

    // Descriptografar número do cartão
    card.cardNumber = decrypt(card.cardNumber);

    res.json(card);
  } catch (error) {
    console.error('Erro ao obter cartão de crédito:', error);
    res.status(500).json({ message: 'Erro ao obter cartão de crédito.' });
  }
};

// Atualizar cartão de crédito
export const updateCreditCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, cardNumber, expirationDate } = req.body;
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const card = await prisma.creditCard.findFirst({
      where: { id, userId },
    });

    if (!card) {
      return res.status(404).json({ message: 'Cartão não encontrado.' });
    }

    const data: any = {};
    if (name) data.name = name;
    if (cardNumber) data.cardNumber = encrypt(cardNumber);
    if (expirationDate) data.expirationDate = new Date(expirationDate);

    await prisma.creditCard.update({
      where: { id },
      data,
    });

    res.json({ message: 'Cartão de crédito atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar cartão de crédito:', error);
    res.status(500).json({ message: 'Erro ao atualizar cartão de crédito.' });
  }
};

// Deletar cartão de crédito
export const deleteCreditCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    const card = await prisma.creditCard.findFirst({
      where: { id, userId },
    });

    if (!card) {
      return res.status(404).json({ message: 'Cartão não encontrado.' });
    }

    await prisma.creditCard.delete({
      where: { id },
    });

    res.json({ message: 'Cartão de crédito deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar cartão de crédito:', error);
    res.status(500).json({ message: 'Erro ao deletar cartão de crédito.' });
  }
};
