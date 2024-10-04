import express from 'express';
import { processPayment } from '../controllers/process_payment';

const router = express.Router();

router.post('/process_payment', processPayment);

export default router;
