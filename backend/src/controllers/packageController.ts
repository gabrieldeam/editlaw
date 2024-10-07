import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export const getAllPackages = async (req: Request, res: Response) => {
  try {
    const packages = await prisma.package.findMany();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pacotes.' });
  }
};

export const getPackageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const packageData = await prisma.package.findUnique({ where: { id } });
    if (!packageData) {
      return res.status(404).json({ error: 'Pacote não encontrado.' });
    }
    res.status(200).json(packageData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o pacote.' });
  }
};

export const createPackage = async (req: Request, res: Response) => {
  const { title, preco, precoDesconto, descricao, documentIds } = req.body;
  try {
    const newPackage = await prisma.package.create({
      data: {
        title,
        preco,
        precoDesconto,
        descricao,
        documentIds,
      },
    });
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o pacote.' });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, preco, precoDesconto, descricao, documentIds } = req.body;
  try {
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: { title, preco, precoDesconto, descricao, documentIds },
    });
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o pacote.' });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.package.delete({ where: { id } });
    res.status(204).json({ message: 'Pacote deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o pacote.' });
  }
};
