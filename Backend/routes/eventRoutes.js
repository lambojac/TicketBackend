import  express from 'express';
import  eventController from '../controller/event.js';
import upload from "../middleware/multer.js"
const router = express.Router();

router.get('/featured', eventController.getFeaturedEvents);
router.get('/:id', eventController.getEventDetails);
router.post('/createvent', upload.single('image'), eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete("/:id/delete",eventController.deleteEvent)
export default router; 