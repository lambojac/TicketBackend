import  express from 'express';
import { getNotifications } from '../controller/Notification.js';
const router = express.Router();

router.get("/notifications", getNotifications); 
export default router; 
