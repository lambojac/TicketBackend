import  express from 'express';
import { createTicketCheckoutSession, completeTicketPayment,cancelTicketPayment,getPaymentStatus, getalltransaction,deleteTransaction } from '../controller/StripePayment.js';

const router = express.Router();

router.post('/create-payment-intent', createTicketCheckoutSession);
router.get('/complete-payment/:session_id', completeTicketPayment);
router.get('/cancel-payment', cancelTicketPayment);
router.get('/get-payment-status/:transactionId', getPaymentStatus);
router.get("/get-all-transaction",getalltransaction)
router.delete("/:id",deleteTransaction)
export default router;

