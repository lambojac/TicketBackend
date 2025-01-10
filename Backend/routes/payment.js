import  express from 'express';
import { createOrderController, completeOrderController,cancelOrderController, getPaymentHistory } from '../controller/paymentController.js';
import { createStripePaymentIntentController, confirmStripePaymentController } from '../controller/StripePayment.js';
const router = express.Router();


router.post('/pay',  createOrderController);
router.get('/complete-order', completeOrderController);
router.get('/cancel-order',  cancelOrderController);
router.get("/payment-history",getPaymentHistory)
// stripe
router.post('/create-payment-intent', createStripePaymentIntentController);
router.post('/confirm-payment', confirmStripePaymentController);

export default router;

