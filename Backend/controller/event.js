import Event from "../models/Event.js"
import Transaction from "../models/Transaction.js";
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
      const event = await Event.findById(req.params.id)
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new event
  createEvent: async (req, res) => {
    try {
      const { title, location, date, price, category, time, address, latitude, longitude, organiser, description, unit, paypalUsername,arts_and_crafts,
        cultural_dance } = req.body;

      // Convert uploaded image to Base64
      const image = req.file ? req.file.buffer.toString('base64') : null;

      const event = new Event({
        title,
        location,
        date,
        price,
        category,
        time,
        address,
        latitude,
        longitude,
        organiser,
        description,
        unit,
        image, 
        paypalUsername,
        arts_and_crafts,
cultural_dance
        // Store the image in Base64 format
        // createdBy: req.user.id
      });
      const savedEvent = await event.save();
    
      res.status(201).json(savedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  

  // Update event
  updateEvent: async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
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
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


   getEventBuyers : async (req, res) => {
    try {
      const { eventId } = req.params;
  
      // Check if event exists
      const eventExists = await Event.findById(eventId);
      if (!eventExists) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Fetch transactions for the specific event
      const transactions = await Transaction.find({ ticketId: eventId, status: "PENDING" })//CHANGE THIS TO COMPLETED
        .populate("userId", "username email");
  
      if (transactions.length === 0) {
        return res.status(404).json({ message: "No tickets sold for this event" });
      }
  
      // Format the response
      const buyers = transactions.map((transaction) => ({
        username: transaction.userId.username,
        email: transaction.userId.email,
        ticketCount: transaction.ticketCount,
        amount: transaction.amount,
        purchaseDate: transaction.createdAt,
      }));
  
      res.status(200).json(buyers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  }
}


export default eventController

