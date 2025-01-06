import  express from 'express';
import { createOrderController, completeOrderController,cancelOrderController } from '../controller/paymentController.js';
const router = express.Router();


router.post('/pay', createOrderController);
router.get('/complete-order', completeOrderController);
router.get('/cancel-order', cancelOrderController);

export default router;
