import  express from 'express';
import { createOrderController, completeOrderController,cancelOrderController } from '../controller/paymentController.js';
import { createStripePaymentIntentController, confirmStripePaymentController } from '../controller/StripePayment.js';

const router = express.Router();


router.post('/pay', createOrderController);
router.get('/complete-order', completeOrderController);
router.get('/cancel-order', cancelOrderController);
// stripe
router.post('/create-payment-intent', createStripePaymentIntentController);
router.post('/confirm-payment', confirmStripePaymentController);

export default router;

