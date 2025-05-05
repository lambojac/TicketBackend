import  express from 'express';
import  eventController from '../controller/event.js';
import upload from "../middleware/multer.js"
const router = express.Router();


/**
 * @swagger
 * /events/featured:
 *   get:
 *     summary: Get featured and upcoming events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of featured events
 */
router.get('/featured', eventController.getFeaturedEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event details by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get('/:id', eventController.getEventDetails);

/**
 * @swagger
 * /events/{eventId}/buyers:
 *   get:
 *     summary: Get buyers for an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of event buyers
 *       404:
 *         description: No tickets sold or event not found
 */
router.get("/:eventId/buyers", eventController.getEventBuyers);

/**
 * @swagger
 * /events/createvent:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               time:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               organiser:
 *                 type: string
 *               description:
 *                 type: string
 *               unit:
 *                 type: string
 *               paypalUsername:
 *                 type: string
 *               geoTag:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post('/createvent', upload.single('image'), eventController.createEvent);

/**
 * @swagger
 * /events/{id}:
 *   patch:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               time:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               organiser:
 *                 type: string
 *               description:
 *                 type: string
 *               unit:
 *                 type: string
 *               paypalUsername:
 *                 type: string
 *               geoTag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.patch('/:id',upload.single('image'), eventController.updateEvent);

/**
 * @swagger
 * /events/{id}/delete:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */
router.delete("/:id/delete", eventController.deleteEvent);
export default router; 