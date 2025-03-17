import  express from 'express';
import  eventController from '../controller/event.js';
import upload from "../middleware/multer.js"
const router = express.Router();

router.get('/featured', eventController.getFeaturedEvents);
router.get('/:id', eventController.getEventDetails);
router.get("/:eventId/buyers", eventController.getEventBuyers);
router.post('/createvent', upload.single('image'), eventController.createEvent);
router.patch('/:id', eventController.updateEvent);
router.delete("/:id/delete",eventController.deleteEvent)
export default router; 