import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient'; // Prisma importado corretamente

// Função para gerar token JWT
const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;  // Certifique-se de que o campo 'name' está sendo enviado no corpo
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,  // Agora o campo 'name' existe e será inserido corretamente
      },
    });

    const token = generateToken(newUser.id);
    res.status(201).json({ message: 'Usuário registrado com sucesso!', token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se a senha não é nula
    if (!user.password) {
      return res.status(400).json({ message: 'Este usuário não possui uma senha definida.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = generateToken(user.id); // O ID é do tipo number no Prisma
    res.status(200).json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar login.' });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  // Aqui você enviaria um email com um link para redefinir a senha.
  res.status(200).json({ message: `Email de redefinição enviado para ${email}.` });
};


export const checkAuth = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).json({ message: 'Autenticado!', decoded });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};


export const deleteAccount = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ message: 'Conta excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir conta.' });
  }
};

export const editEmail = async (req: Request, res: Response) => {
  const { userId, newEmail } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
    res.status(200).json({ message: 'Email atualizado com sucesso!', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar email.' });
  }
};
