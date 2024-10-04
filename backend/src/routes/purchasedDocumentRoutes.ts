import { Router } from 'express';
import { createPurchasedDocuments, getPurchasedDocuments  } from '../controllers/purchasedDocumentController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchasedDocumentsInput:
 *       type: object
 *       required:
 *         - documentIds
 *       properties:
 *         documentIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs dos documentos a serem comprados
 * 
 * /purchased-documents:
 *   post:
 *     summary: Cria um ou mais documentos comprados para o usuário autenticado
 *     description: Cria um ou mais documentos comprados, associando-os ao usuário autenticado. A data de compra e a data de exclusão são definidas automaticamente pelo sistema.
 *     tags: [PurchasedDocument]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchasedDocumentsInput'
 *     responses:
 *       201:
 *         description: Documentos comprados criados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchasedDocument'
 *       400:
 *         description: Requisição inválida, documentIds ausentes ou inválidos
 *       500:
 *         description: Erro ao criar os documentos comprados
 */
router.post('/purchased-documents', createPurchasedDocuments);

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchasedDocument:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do registro de documento comprado
 *         userId:
 *           type: string
 *           description: ID do usuário que comprou o documento
 *         documentId:
 *           type: string
 *           description: ID do documento comprado
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *           description: Data da compra do documento
 *         exclusionDate:
 *           type: string
 *           format: date-time
 *           description: Data de exclusão automática do documento
 *         document:
 *           type: object
 *           description: Detalhes do documento comprado
 * 
 * /purchased-documents:
 *   post:
 *     summary: Cria um ou mais documentos comprados para o usuário autenticado
 *     description: Cria um ou mais documentos comprados, associando-os ao usuário autenticado. A data de compra e a data de exclusão são definidas automaticamente pelo sistema.
 *     tags: [PurchasedDocument]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentIds
 *             properties:
 *               documentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array de IDs dos documentos a serem comprados
 *     responses:
 *       201:
 *         description: Documentos comprados criados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchasedDocument'
 *       400:
 *         description: Requisição inválida, documentIds ausentes ou inválidos
 *       500:
 *         description: Erro ao criar os documentos comprados
 *
 * /purchased-documents/list:
 *   get:
 *     summary: Retorna os documentos comprados do usuário autenticado com paginação
 *     description: Retorna uma lista paginada dos documentos comprados pelo usuário autenticado, incluindo detalhes do documento.
 *     tags: [PurchasedDocument]
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Número da página, valor padrão é 1
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Quantidade de documentos por página, valor padrão é 10
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retorna os documentos comprados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: Página atual
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas
 *                 limit:
 *                   type: integer
 *                   description: Limite de documentos por página
 *                 totalDocuments:
 *                   type: integer
 *                   description: Total de documentos comprados pelo usuário
 *                 purchasedDocuments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PurchasedDocument'
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao pegar os documentos comprados
 */
router.get('/purchased-documents/list', getPurchasedDocuments);

export default router;