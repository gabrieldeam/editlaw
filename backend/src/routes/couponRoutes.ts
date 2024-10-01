import { Router } from 'express';
import { getAllCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon, getActiveCouponByName } from '../controllers/couponController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       required:
 *         - name
 *         - discountRate
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do cupom de desconto.
 *         name:
 *           type: string
 *           description: O nome do cupom de desconto.
 *         discountRate:
 *           type: number
 *           description: A porcentagem de desconto aplicada pelo cupom.
 *         isActive:
 *           type: boolean
 *           description: Define se o cupom está ativo ou não.
 *         validUntil:
 *           type: string
 *           format: date-time
 *           description: Data até quando o cupom é válido.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do cupom.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização do cupom.
 */


/**
 * @swagger
 * /coupons/active/{name}:
 *   get:
 *     summary: Retorna a porcentagem de desconto de um cupom ativo.
 *     tags: [Coupon]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: O nome do cupom.
 *     responses:
 *       200:
 *         description: Retorna a porcentagem de desconto se o cupom estiver ativo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 discountRate:
 *                   type: number
 *                   description: A porcentagem de desconto do cupom.
 *       400:
 *         description: O cupom não está ativo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "O cupom não está ativo."
 *       404:
 *         description: O cupom não foi encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cupom não encontrado. Verifique a digitação."
 */
router.get('/coupons/active/:name', getActiveCouponByName);

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Retorna todos os cupons de desconto com paginação.
 *     tags: [Coupon]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: O número da página que deseja buscar.
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: O número de cupons por página.
 *     responses:
 *       200:
 *         description: A lista paginada de cupons de desconto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   description: O número da página atual.
 *                 totalPages:
 *                   type: integer
 *                   description: O número total de páginas.
 *                 totalCount:
 *                   type: integer
 *                   description: O número total de cupons.
 *                 pageSize:
 *                   type: integer
 *                   description: O número de cupons por página.
 *                 coupons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 */
router.get('/coupons', getAllCoupons);


/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Retorna um cupom de desconto por ID.
 *     tags: [Coupon]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do cupom de desconto.
 *     responses:
 *       200:
 *         description: Detalhes de um cupom específico.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       404:
 *         description: Cupom não encontrado.
 */
router.get('/coupons/:id', getCouponById);

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Cria um novo cupom de desconto.
 *     tags: [Coupon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       201:
 *         description: Cupom criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       500:
 *         description: Falha ao criar o cupom.
 */
router.post('/coupons', createCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   put:
 *     summary: Atualiza um cupom de desconto existente.
 *     tags: [Coupon]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do cupom de desconto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coupon'
 *     responses:
 *       200:
 *         description: Cupom atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       500:
 *         description: Falha ao atualizar o cupom.
 */
router.put('/coupons/:id', updateCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Exclui um cupom de desconto existente.
 *     tags: [Coupon]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do cupom de desconto.
 *     responses:
 *       204:
 *         description: Cupom excluído com sucesso.
 *       500:
 *         description: Falha ao excluir o cupom.
 */
router.delete('/coupons/:id', deleteCoupon);

export default router;
