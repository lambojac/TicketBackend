import express from "express";
import { getChatMessages, sendChatMessage} from "../controller/chatController.js";

const router = express.Router();

// Get chat messages for an event
router.get("/:eventId", getChatMessages);
router.post("/", sendChatMessage);

export default router;
