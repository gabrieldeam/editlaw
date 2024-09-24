import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';

// Configurando multer para salvar arquivos na pasta /upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

export const upload = multer({ storage }).fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
]);

// Função para remover imagens antigas
const removeOldImages = async (images: string[]) => {
  for (const image of images) {
    const imagePath = path.join(__dirname, '..', image);
    if (await fs.pathExists(imagePath)) {
      await fs.remove(imagePath);
    }
  }
};

// Criar uma nova categoria
export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  try {
    const category = await prisma.category.create({
      data: {
        name,
        description,
        image1: files.image1 ? `/upload/${files.image1[0].filename}` : null,
        image2: files.image2 ? `/upload/${files.image2[0].filename}` : null,
        image3: files.image3 ? `/upload/${files.image3[0].filename}` : null,
      },
    });

    res.status(201).json({ message: 'Categoria criada com sucesso!', category });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro ao criar categoria.' });
  }
};

// Editar uma categoria existente
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  try {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    // Remover imagens antigas se forem substituídas
    const oldImages: string[] = [];
    if (files.image1 && category.image1) oldImages.push(category.image1);
    if (files.image2 && category.image2) oldImages.push(category.image2);
    if (files.image3 && category.image3) oldImages.push(category.image3);
    await removeOldImages(oldImages);

    // Atualizar a categoria
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        image1: files.image1 ? `/upload/${files.image1[0].filename}` : category.image1,
        image2: files.image2 ? `/upload/${files.image2[0].filename}` : category.image2,
        image3: files.image3 ? `/upload/${files.image3[0].filename}` : category.image3,
      },
    });

    res.status(200).json({ message: 'Categoria atualizada com sucesso!', updatedCategory });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ message: 'Erro ao atualizar categoria.' });
  }
};

// Deletar uma categoria
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    // Remover as imagens da pasta upload
    const imagesToRemove = [category.image1, category.image2, category.image3].filter(Boolean) as string[];
    await removeOldImages(imagesToRemove);

    // Deletar a categoria
    await prisma.category.delete({ where: { id } });

    res.status(200).json({ message: 'Categoria deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ message: 'Erro ao deletar categoria.' });
  }
};

// Ver todas as categorias
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro ao buscar categorias.' });
  }
};

// Ver uma categoria específica
export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ message: 'Erro ao buscar categoria.' });
  }
};
