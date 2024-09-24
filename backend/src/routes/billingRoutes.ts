import { Router } from 'express';
import { createOrUpdateBillingInfo, getBillingInfo } from '../controllers/billingController';
import { verifyToken } from '../middlewares/authMiddleware'; // Middleware para verificar o token

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: Endpoints relacionados às informações de cobrança
 */

/**
 * @swagger
 * /api/billing:
 *   post:
 *     summary: Cria ou atualiza as informações de cobrança do usuário autenticado
 *     tags: [Billing]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 example: "Brasil"
 *               phone:
 *                 type: string
 *                 example: "123456789"
 *               street:
 *                 type: string
 *                 example: "Rua das Flores"
 *               district:
 *                 type: string
 *                 example: "Centro"
 *               city:
 *                 type: string
 *                 example: "São Paulo"
 *               state:
 *                 type: string
 *                 example: "SP"
 *               postalCode:
 *                 type: string
 *                 example: "12345-678"
 *               cpf:
 *                 type: string
 *                 example: "12345678900"
 *     responses:
 *       200:
 *         description: Informações de cobrança criadas ou atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Informações de cobrança salvas com sucesso!"
 *                 billingInfo:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "uuid-do-usuario"
 *                     country:
 *                       type: string
 *                       example: "Brasil"
 *                     phone:
 *                       type: string
 *                       example: "123456789"
 *                     street:
 *                       type: string
 *                       example: "Rua das Flores"
 *                     district:
 *                       type: string
 *                       example: "Centro"
 *                     city:
 *                       type: string
 *                       example: "São Paulo"
 *                     state:
 *                       type: string
 *                       example: "SP"
 *                     postalCode:
 *                       type: string
 *                       example: "12345-678"
 *                     cpf:
 *                       type: string
 *                       example: "12345678900"
 *       400:
 *         description: Usuário não autenticado ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não autenticado."
 *       500:
 *         description: Erro ao salvar as informações de cobrança
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao salvar informações de cobrança."
 */
router.post('/billing', verifyToken, createOrUpdateBillingInfo);

/**
 * @swagger
 * /api/billing:
 *   get:
 *     summary: Obtém as informações de cobrança do usuário autenticado
 *     tags: [Billing]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Informações de cobrança retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "uuid-do-usuario"
 *                 country:
 *                   type: string
 *                   example: "Brasil"
 *                 phone:
 *                   type: string
 *                   example: "123456789"
 *                 street:
 *                   type: string
 *                   example: "Rua das Flores"
 *                 district:
 *                   type: string
 *                   example: "Centro"
 *                 city:
 *                   type: string
 *                   example: "São Paulo"
 *                 state:
 *                   type: string
 *                   example: "SP"
 *                 postalCode:
 *                   type: string
 *                   example: "12345-678"
 *                 cpf:
 *                   type: string
 *                   example: "12345678900"
 *       404:
 *         description: Informações de cobrança não encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Informações de cobrança não encontradas."
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token não fornecido."
 *       500:
 *         description: Erro ao buscar as informações de cobrança
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar informações de cobrança."
 */
router.get('/billing', verifyToken, getBillingInfo);

export default router;
