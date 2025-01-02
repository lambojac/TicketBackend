import  express from 'express';
import  bookMarkController from '../controller/eventBookmark.js';
const  router = express.Router();
router.get('/:id/profile', bookMarkController.getProfile);
router.get('/:id/bookmarks', bookMarkController.getBookmarkedEvents);
router.post('/:userId/bookmarks/:eventId', bookMarkController.bookmarkEvent);
export default router; 