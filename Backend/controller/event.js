import Event from "../models/Event.js"

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

  // Create new event
  createEvent: async (req, res) => {
    try {
      const { title, location, date, price, category, time, address, latitude, longitude, organiser, description, unit } = req.body;

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
        image, // Store the image in Base64 format
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
  }
};

export default eventController

