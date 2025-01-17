import Chat from "../models/chat.js";

export const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Join room for specific event
    socket.on("joinEvent", (eventId) => {
      socket.join(eventId);
      console.log(`User joined room: ${eventId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      const { eventId, user, message } = data;

      // Save message to DB
      const chat = new Chat({ eventId, user, message });
      await chat.save();

      // Broadcast message to all users in the room
      io.to(eventId).emit("receiveMessage", data);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
