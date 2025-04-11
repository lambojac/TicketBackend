import  express from 'express';
import { createTicketCheckoutSession, completeTicketPayment,cancelTicketPayment,getPaymentStatus } from '../controller/StripePayment.js';

const router = express.Router();

router.post('/create-payment-intent', createTicketCheckoutSession);
router.post('/complete-payment', completeTicketPayment);
router.post('/cancel-payment', cancelTicketPayment);
router.post('/get-payment-status', getPaymentStatus);

export default router;

