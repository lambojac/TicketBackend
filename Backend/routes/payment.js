import  express from 'express';
import { createOrderController, completeOrderController,cancelOrderController, getPaymentHistory } from '../controller/paymentController.js';
import { createStripePaymentIntentController, confirmStripePaymentController } from '../controller/StripePayment.js';
import Secure from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/pay', Secure, createOrderController);
<<<<<<< HEAD
router.get('/complete-order', completeOrderController);
=======
router.get('/complete-order',completeOrderController);
>>>>>>> 9a0ce706e84e7b37d70933e8d4af11343413bac7
router.get('/cancel-order', Secure, cancelOrderController);
router.get("/payment-history",Secure,getPaymentHistory)
// stripe
router.post('/create-payment-intent', createStripePaymentIntentController);
router.post('/confirm-payment', confirmStripePaymentController);

export default router;

