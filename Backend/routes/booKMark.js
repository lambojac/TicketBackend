import  express from 'express';
import  bookMarkController from '../controller/eventBookmark.js';
import upload from "../middleware/multer.js"
const  router = express.Router();
/**
 * @swagger
 * /bookmark/{id}/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.get('/:id/profile', bookMarkController.getProfile);

/**
 * @swagger
 * /bookmark/{id}/bookmarks:
 *   get:
 *     summary: Get user's bookmarked events
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bookmarked events
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.get('/:id/bookmarks', bookMarkController.getBookmarkedEvents);
/**
 * @swagger
 * /bookmark/{userId}/bookmarks/{eventId}:
 *   post:
 *     summary: Bookmark an event for a user
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event bookmarked successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */

router.post('/:userId/bookmarks/:eventId', bookMarkController.bookmarkEvent);
/**
 * @swagger
 * /bookmark/{userId}/bookmarks/{eventId}:
 *   delete:
 *     summary: Remove a bookmarked event from user
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event removed from bookmarks
 *       404:
 *         description: User or event not found
 *       400:
 *         description: Bad request
 */
router.delete('/:userId/bookmarks/:eventId', bookMarkController.removeBookmarkedEvent);

export default router; 




