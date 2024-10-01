import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export const getAllCoupons = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, size = 10 } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(size as string, 10);

  try {
    const [coupons, totalCount] = await Promise.all([
      prisma.coupon.findMany({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      prisma.coupon.count(), // Total de cupons para cálculo da paginação
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    res.json({
      currentPage: pageNumber,
      totalPages,
      totalCount,
      pageSize,
      coupons,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

export const getCouponById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      res.status(404).json({ error: 'Coupon not found' });
      return;
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coupon' });
  }
};

export const getActiveCouponByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.params;

  try {
    // Busca o cupom pelo nome
    const coupon = await prisma.coupon.findUnique({ 
      where: { name }
    });

    // Verifica se o cupom foi encontrado
    if (!coupon) {
      res.status(404).json({ message: "Cupom não encontrado. Verifique a digitação." });
      return; // Adicionado return para finalizar a função corretamente
    }

    // Verifica se o cupom está ativo
    if (!coupon.isActive) {
      res.status(400).json({ message: "O cupom não está ativo." });
      return; // Adicionado return para finalizar a função corretamente
    }

    // Retorna a porcentagem de desconto se o cupom estiver ativo
    res.status(200).json({ discountRate: coupon.discountRate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar o cupom." });
  }
};

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  const { name, discountRate, isActive, validUntil } = req.body;

  try {
    const newCoupon = await prisma.coupon.create({
      data: {
        name,
        discountRate,
        isActive: isActive ?? true,
        validUntil: validUntil ? new Date(validUntil) : null, // Converter string para Date
      },
    });
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};



export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, discountRate, isActive, validUntil } = req.body;
  try {
    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        name,
        discountRate,
        isActive,
        validUntil,
      },
    });
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};

export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.coupon.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
};
