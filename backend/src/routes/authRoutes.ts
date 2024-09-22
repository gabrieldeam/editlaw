import { Router } from 'express';
import { registerUser, loginUser, resetPassword, checkAuth, deleteAccount, editEmail } from '../controllers/authController';
import passport from 'passport';
import { googleLoginSuccess } from '../controllers/authGoogle';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: Email já registrado.
 *       500:
 *         description: Erro ao registrar usuário.
 */
router.post('/register', registerUser);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza o login do usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *       401:
 *         description: Senha incorreta.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro ao realizar login.
 */
router.post('/login', loginUser);


/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Envia um email para redefinição de senha.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de redefinição enviado.
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/check-auth:
 *   get:
 *     summary: Verifica se o usuário está autenticado.
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Autenticado.
 *       401:
 *         description: Token inválido ou expirado.
 */
router.get('/check-auth', checkAuth);

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Exclui a conta do usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Conta excluída com sucesso.
 *       500:
 *         description: Erro ao excluir conta.
 */
router.delete('/delete-account', deleteAccount);

/**
 * @swagger
 * /api/auth/edit-email:
 *   put:
 *     summary: Atualiza o email do usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email atualizado com sucesso.
 *       500:
 *         description: Erro ao atualizar email.
 */
router.put('/edit-email', editEmail);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Autenticação via Google
 *     tags: [Autenticação]
 *     description: Redireciona para a página de login do Google.
 *     responses:
 *       302:
 *         description: Redireciona para o Google.
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback após autenticação com Google
 *     tags: [Autenticação]
 *     description: Callback chamado pelo Google após autenticação.
 *     responses:
 *       200:
 *         description: Autenticação via Google bem-sucedida.
 */
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleLoginSuccess);


export default router;
