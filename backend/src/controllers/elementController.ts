import { Request, Response } from 'express';
import { prisma } from '../prismaClient';


// GET: Buscar todos os elementos por pageId
export const getElementsByPageId = async (req: Request, res: Response) => {
  const { pageId } = req.params;
  try {
    const elements = await prisma.element.findMany({
      where: { pageId },
    });
    res.json(elements);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar elementos' });
  }
};

// POST: Criar um novo elemento
export const createElement = async (req: Request, res: Response) => {
  const {
    pageId,
    type,
    x,
    y,
    rotation,
    content,
    src,
    fontSize,
    bold,
    italic,
    underline,
    fill,
    width,
    height,
    radius,
    textType,
    highlightColor,
  } = req.body;

  try {
    const newElement = await prisma.element.create({
      data: {
        pageId,
        type,
        x,
        y,
        rotation,
        content,
        src,
        fontSize,
        bold,
        italic,
        underline,
        fill,
        width,
        height,
        radius,
        textType,
        highlightColor,
      },
    });
    res.status(201).json(newElement);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar elemento' });
  }
};

// PUT: Atualizar um elemento por id
export const updateElement = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    type,
    x,
    y,
    rotation,
    content,
    src,
    fontSize,
    bold,
    italic,
    underline,
    fill,
    width,
    height,
    radius,
    textType,
    highlightColor,
  } = req.body;

  try {
    const updatedElement = await prisma.element.update({
      where: { id },
      data: {
        type,
        x,
        y,
        rotation,
        content,
        src,
        fontSize,
        bold,
        italic,
        underline,
        fill,
        width,
        height,
        radius,
        textType,
        highlightColor,
      },
    });
    res.json(updatedElement);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar elemento' });
  }
};

// DELETE: Deletar um elemento por id
export const deleteElement = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.element.delete({
      where: { id },
    });
    res.json({ message: 'Elemento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar elemento' });
  }
};
