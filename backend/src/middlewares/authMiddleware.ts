import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';
import { User } from '@prisma/client';

export const verifyRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
      }

      // Agora o userId no token é uma string (UUID)
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      
      prisma.user.findUnique({ where: { id: decoded.userId } })
        .then((user: User | null) => {  // Defina o tipo do usuário explicitamente
          if (!user || user.role !== role) {
            return res.status(403).json({ message: 'Acesso negado.' });
          }
          next();
        })
        .catch(() => {
          res.status(500).json({ message: 'Erro ao verificar papel do usuário.' });
        });
    } catch (error) {
      res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  };
};
