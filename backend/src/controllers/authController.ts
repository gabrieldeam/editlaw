import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';
import nodemailer from 'nodemailer';

// Função para gerar token JWT (userId agora é string)
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};


export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;  

  // Validar a senha
  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'A senha deve conter pelo menos 8 caracteres, sem espaços, com pelo menos um número e uma letra maiúscula.' });
  }

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
        name,
        role: role || 'USER',
      },
    });

    const token = generateToken(newUser.id);  // newUser.id é string (UUID)

    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 2592000000, 
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
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

    if (!user.password) {
      return res.status(400).json({ message: 'Este usuário não possui uma senha definida.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = generateToken(user.id);  // user.id é string (UUID)

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2592000000,
    });

    res.status(200).json({ message: 'Login bem-sucedido!' });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ message: 'Erro ao realizar login.' });
  }
};




export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Verificar se o email existe no banco de dados
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Gerar um token JWT para redefinição de senha (expira em 1 hora)
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // Criar o link de redefinição de senha
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;

    // Configurar o Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configurar o conteúdo do email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Redefinir sua senha',
      html: `<p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>Se você não solicitou essa ação, ignore este email.</p>`,
    };

    // Enviar o email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Email de redefinição enviado para ${email}.` });
  } catch (error) {
    console.error('Erro ao enviar email de redefinição:', error);
    res.status(500).json({ message: 'Erro ao enviar email de redefinição de senha.' });
  }
};


export const checkAuth = async (req: Request, res: Response) => {
  try {
    // Recuperar o token do cookie em vez de dos cabeçalhos
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Retornar status 200 se o token for válido e o usuário estiver autenticado
    res.status(200).json({ message: 'Autenticado!', decoded });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};


export const deleteAccount = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    // Excluir a conta do usuário no banco de dados
    await prisma.user.delete({ where: { id: userId } });

    // Limpar o token do cookie após a exclusão da conta
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Conta excluída com sucesso e token removido.' });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
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


export const getUserInfo = async (req: Request, res: Response) => {
  try {
    // Recuperar o token do cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // Verificar e decodificar o token, garantindo que userId seja uma string
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    // Buscar o usuário no banco de dados com userId como string
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Retornar o userId, name e email
    res.status(200).json({ userId: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar informações do usuário.' });
  }
};

export const confirmResetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  // Validar a nova senha
  if (!validatePassword(newPassword)) {
    return res.status(400).json({ message: 'A senha deve conter pelo menos 8 caracteres, sem espaços, com pelo menos um número e uma letra maiúscula.' });
  }

  try {
    // Verificar o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, email: string };

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar a senha do usuário
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido ou expirado.' });
  }
};


export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logout realizado com sucesso!' });
};

export const isAdmin = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o usuário tem o papel ADMIN
    if (user.role === 'ADMIN') {
      return res.status(200).json({ isAdmin: true, message: 'O usuário é um administrador.' });
    } else {
      return res.status(403).json({ isAdmin: false, message: 'Acesso negado. O usuário não é um administrador.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao verificar o papel do usuário.' });
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Buscar todos os usuários no banco de dados, retornando apenas os campos email, name e role
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
      },
    });

    // Retornar a lista de usuários
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
};

// Função para validar senha
const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[^\s]{8,}$/;
  return passwordRegex.test(password);
};

