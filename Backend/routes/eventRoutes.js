import  express from 'express';
import  eventController from '../controller/event.js';
import upload from "../middleware/multer.js"
import Secure from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/featured',Secure, eventController.getFeaturedEvents);
router.get('/:id', Secure,eventController.getEventDetails);
router.post('/createvent', Secure,upload.single('image'), eventController.createEvent);
router.put('/:id', Secure, eventController.updateEvent);
export default router; 