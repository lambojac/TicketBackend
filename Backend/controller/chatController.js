import Chat from "../models/chat.js";
import Event from "../models/Event.js";
import User from "../models/userModel.js";

// Get chat messages for an event
export const getChatMessages = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Fetch chat messages
    const messages = await Chat.find({ eventId })
      .populate("user", "full_name") // Populate the user field with the username
      .select("-eventId") // Exclude eventId from the response
      .sort({ createdAt: 1 }); // Sort messages by creation time

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};

// Send a chat message
export const sendChatMessage = async (req, res) => {
  try {
    const { eventId, userId, message } = req.body;

    // Check if event exists
    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save the chat message
    const chat = new Chat({ eventId, user: userId, message });
    const savedChat = await chat.save();

    // Populate the saved chat with the username
    const populatedChat = await Chat.findById(savedChat._id).populate("user", "full_name");

    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};
