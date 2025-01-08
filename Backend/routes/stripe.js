import  express from 'express';
import { createStripePaymentIntentController, confirmStripePaymentController } from '../controller/StripePayment.js';

const router = express.Router();
// stripe
router.post('/create-payment-intent', createStripePaymentIntentController);
router.post('/confirm-payment', confirmStripePaymentController);

export default router;

