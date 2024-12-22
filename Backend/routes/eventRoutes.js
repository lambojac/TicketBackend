
import  express from 'express';
import  eventController from '../controller/event.js';
const router = express.Router();

router.get('/featured', eventController.getFeaturedEvents);
router.get('/:id', eventController.getEventDetails);
router.post('/createvent', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
export default router; 