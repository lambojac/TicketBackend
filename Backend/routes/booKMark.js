import  express from 'express';
import  bookMarkController from '../controller/eventBookmark.js';
import upload from "../middleware/multer.js"
import Secure from '../middleware/authMiddleware.js';
const  router = express.Router();
router.get('/:id/profile', Secure,bookMarkController.getProfile);
router.get('/:id/bookmarks',Secure, bookMarkController.getBookmarkedEvents);
router.post('/:userId/bookmarks/:eventId',Secure, bookMarkController.bookmarkEvent);
router.delete('/:userId/bookmarks/:eventId',Secure, bookMarkController.removeBookmarkedEvent);


export default router; 