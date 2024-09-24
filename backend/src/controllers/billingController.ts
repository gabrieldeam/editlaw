import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import jwt from 'jsonwebtoken';

// Criar ou atualizar informações de cobrança
export const createOrUpdateBillingInfo = async (req: Request, res: Response) => {
  const { country, phone, street, district, city, state, postalCode, cpf } = req.body;
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const billingInfo = await prisma.billingInfo.upsert({
      where: { userId: decoded.userId },
      update: {
        country,
        phone,
        street,
        district,
        city,
        state,
        postalCode,
        cpf,
      },
      create: {
        userId: decoded.userId,
        country,
        phone,
        street,
        district,
        city,
        state,
        postalCode,
        cpf,
      },
    });

    res.status(200).json({ message: 'Informações de cobrança salvas com sucesso!', billingInfo });
  } catch (error) {
    console.error('Erro ao salvar informações de cobrança:', error);
    res.status(500).json({ message: 'Erro ao salvar informações de cobrança.' });
  }
};

// Obter informações de cobrança do usuário
export const getBillingInfo = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const billingInfo = await prisma.billingInfo.findUnique({
      where: { userId: decoded.userId }, // Extrai o userId do token diretamente
    });

    if (!billingInfo) {
      return res.status(404).json({ message: 'Informações de cobrança não encontradas.' });
    }

    res.status(200).json(billingInfo);
  } catch (error) {
    console.error('Erro ao buscar informações de cobrança:', error);
    res.status(500).json({ message: 'Erro ao buscar informações de cobrança.' });
  }
};
