import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Limit to the latest 50 notifications
  
    res.status(200).json(notifications);
  });
  