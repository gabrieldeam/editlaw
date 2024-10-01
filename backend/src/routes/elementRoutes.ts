import express from 'express';
import {
  getElementsByPageId,
  createElement,
  updateElement,
  deleteElement,
} from '../controllers/elementController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Element:
 *       type: object
 *       required:
 *         - pageId
 *         - type
 *         - x
 *         - y
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente
 *         pageId:
 *           type: string
 *           description: ID da página a que o elemento pertence
 *         type:
 *           type: string
 *           description: Tipo do elemento (texto, imagem, forma)
 *         x:
 *           type: number
 *           description: Posição X do elemento na página
 *         y:
 *           type: number
 *           description: Posição Y do elemento na página
 *         rotation:
 *           type: number
 *           description: Rotação do elemento (opcional)
 *         content:
 *           type: string
 *           description: Conteúdo textual do elemento (para textos)
 *         src:
 *           type: string
 *           description: Fonte da imagem ou ícone (para imagens)
 *         fontSize:
 *           type: integer
 *           description: Tamanho da fonte (para textos)
 *         bold:
 *           type: boolean
 *           description: Negrito (para textos)
 *         italic:
 *           type: boolean
 *           description: Itálico (para textos)
 *         underline:
 *           type: boolean
 *           description: Sublinhado (para textos)
 *         fill:
 *           type: string
 *           description: Cor de preenchimento (para textos e formas)
 *         width:
 *           type: number
 *           description: Largura (para imagens e formas)
 *         height:
 *           type: number
 *           description: Altura (para imagens e formas)
 *         radius:
 *           type: number
 *           description: Raio (para formas circulares)
 *         textType:
 *           type: string
 *           description: Tipo de texto (opcional)
 *         highlightColor:
 *           type: string
 *           description: Cor de destaque para textos
 */


/**
 * @swagger
 * /elements/page/{pageId}:
 *   get:
 *     summary: Retorna todos os elementos de uma página
 *     tags: [Element]
 *     parameters:
 *       - in: path
 *         name: pageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da página
 *     responses:
 *       200:
 *         description: Lista de elementos da página
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Element'
 *       500:
 *         description: Erro ao buscar elementos
 */
router.get('/elements/page/:pageId', getElementsByPageId);

/**
 * @swagger
 * /elements:
 *   post:
 *     summary: Cria um novo elemento
 *     tags: [Element]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Element'
 *     responses:
 *       201:
 *         description: Elemento criado com sucesso
 *       500:
 *         description: Erro ao criar o elemento
 */
router.post('/elements', createElement);

/**
 * @swagger
 * /elements/{id}:
 *   put:
 *     summary: Atualiza um elemento por ID
 *     tags: [Element]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do elemento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Element'
 *     responses:
 *       200:
 *         description: Elemento atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar o elemento
 */
router.put('/elements/:id', updateElement);

/**
 * @swagger
 * /elements/{id}:
 *   delete:
 *     summary: Deleta um elemento por ID
 *     tags: [Element]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do elemento
 *     responses:
 *       200:
 *         description: Elemento deletado com sucesso
 *       500:
 *         description: Erro ao deletar o elemento
 */
router.delete('/elements/:id', deleteElement);

export default router;
