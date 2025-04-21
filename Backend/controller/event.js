import Event from "../models/Event.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    
    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

const eventController = {
  // Get featured and upcoming events
  getFeaturedEvents: async (req, res) => {
    try {
      const events = await Event.find()
        .sort({ date: 1 })
        .limit(10);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get event details
  getEventDetails: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createEvent: async (req, res) => {
    try {
      const { 
        title, location, date, price, category, time, address, latitude, longitude, 
        organiser, description, unit, paypalUsername, geoTag
      } = req.body;

      // Upload image to Cloudinary if provided
      let imageUrl = null;
      if (req.file) {
        const imageUpload = await uploadToCloudinary(
          req.file.buffer,
          'events/images'
        );
        imageUrl = imageUpload.secure_url;
      }

      const event = new Event({
        title, location, date, price, category, time, address, latitude, longitude, 
        organiser, description, unit, paypalUsername, geoTag,
        image: imageUrl  // Store Cloudinary URL instead of base64
      });

      const savedEvent = await event.save();

      // Create and save a notification
      const notification = new Notification({
        title: 'New Event Created',
        message: `A new event ${savedEvent.title} has been created!`,
        eventID: savedEvent._id,
        type: 'event',
        createdAt: new Date(),
      });
      await notification.save();

      // Emit notification to all clients
      req.io.emit("newEventNotification", {
        notification: {
          _id: notification._id,
          title: notification.title,
          message: notification.message,
          eventID: notification.eventID,
          type: notification.type,
          createdAt: notification.createdAt,
        },
      });

      res.status(201).json({ event: savedEvent, notification });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update event
  updateEvent: async (req, res) => {
    try {
      const eventId = req.params.id;
      
      // Find the existing event
      const existingEvent = await Event.findById(eventId);
      if (!existingEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Prepare update data
      const updateData = { ...req.body };
      
      // Upload new image to Cloudinary if provided
      if (req.file) {
        const imageUpload = await uploadToCloudinary(
          req.file.buffer,
          'events/images'
        );
        updateData.image = imageUpload.secure_url;
      }
      
      // Update the event
      const event = await Event.findByIdAndUpdate(
        eventId,
        updateData,
        { new: true }
      );
      
      // Emit event update notification
      req.io.emit("eventUpdated", {
        message: "An event has been updated!",
        event,
      });
      
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  // Delete event
  deleteEvent: async (req, res) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Optional: Delete the image from Cloudinary
      // If you store the Cloudinary public_id, you can delete the image:
      // if (event.imagePublicId) {
      //   await cloudinary.uploader.destroy(event.imagePublicId);
      // }
      
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get event buyers
  getEventBuyers: async (req, res) => {
    try {
      const { eventId } = req.params;
    
      // Check if event exists
      const eventExists = await Event.findById(eventId);
      if (!eventExists) {
        return res.status(404).json({ message: "Event not found" });
      }
    
      // Fetch transactions for the specific event
      const transactions = await Transaction.find({ ticketId: eventId, paymentStatus: "paid" }) 
        .populate("userId", "email full_name");
    
      if (transactions.length === 0) {
        return res.status(404).json({ message: "No tickets sold for this event" });
      }
    
      // Calculate total tickets sold
      const totalTicketsSold = transactions.reduce((total, transaction) => total + transaction.ticketCount, 0);
    
      // Format the buyers' details
      const buyers = transactions.map((transaction) => ({
        username: transaction.userId.username,
        full_name: transaction.userId.full_name,
        ticketCount: transaction.ticketCount,
        amount: transaction.amount,
        purchaseDate: transaction.createdAt,
      }));
    
      // Return response with buyers and total tickets sold
      res.status(200).json({
        totalTicketsSold,
        buyers,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default eventController;