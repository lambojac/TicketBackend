import  express from 'express';
import { createOrderController, completeOrderController,cancelOrderController } from '../controller/paymentController';
const router = express.Router();


router.post('/pay', createOrderController);
router.get('/complete-order', completeOrderController);
router.get('/cancel-order', cancelOrderController);

module.exports = router;
