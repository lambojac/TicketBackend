import express from "express";
import { getChatMessages, sendChatMessage} from "../controller/chatController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Chat messaging for events
 */

/**
 * @swagger
 * /chats/{eventId}:
 *   get:
 *     summary: Get chat messages for a specific event
 *     tags: [Chats]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: List of chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       full_name:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Event not found
 *       500:
 *         description: Failed to fetch messages
 */

router.get("/:eventId", getChatMessages);
/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Send a new chat message to an event
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - userId
 *               - message
 *             properties:
 *               eventId:
 *                 type: string
 *               userId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Event or user not found
 *       500:
 *         description: Failed to send message
 */
router.post("/", sendChatMessage);

export default router;





