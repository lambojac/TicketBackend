import  express from 'express';
import { createOrderController, completeOrderController,cancelOrderController, getPaymentHistory } from '../controller/paymentController.js';
// import { createStripePaymentIntentController, confirmStripePaymentController } from '../controller/StripePayment.js';
import Secure from '../middleware/auth.js';
const router = express.Router();

router.post('/pay', Secure, createOrderController);
router.get('/complete-order', completeOrderController);
router.get('/cancel-order', Secure, cancelOrderController);
router.get("/payment-history",Secure,getPaymentHistory)
// stripe
// router.post('/create-payment-intent', createStripePaymentIntentController);
// router.post('/confirm-payment', confirmStripePaymentController);

export default router;

