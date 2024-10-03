// routes/creditCardRoutes.ts

import express from 'express';
import {
  createCreditCard,
  getCreditCards,
  getCreditCardById,
  updateCreditCard,
  deleteCreditCard,
} from '../controllers/creditCardController';

const router = express.Router();

router.post('/creditcards', createCreditCard);
router.get('/creditcards', getCreditCards);
router.get('/creditcards/:id', getCreditCardById);
router.put('/creditcards/:id', updateCreditCard);
router.delete('/creditcards/:id', deleteCreditCard);

export default router;
