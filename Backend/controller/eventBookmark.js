import User from "../models/userModel.js";

const bookMarkController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate('bookmarkedEvents');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get bookmarked events
  getBookmarkedEvents: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate('bookmarkedEvents');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.bookmarkedEvents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Bookmark an event
  bookmarkEvent: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (!user.bookmarkedEvents.includes(req.params.eventId)) {
        user.bookmarkedEvents.push(req.params.eventId);
        await user.save();
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },


//remove bookmarked event
removeBookmarkedEvent: async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const eventIndex = user.bookmarkedEvents.indexOf(req.params.eventId);
    if (eventIndex > -1) {
      user.bookmarkedEvents.splice(eventIndex, 1);
      await user.save();
      res.json({ message: 'Event removed from bookmarks', user });
    } else {
      res.status(404).json({ message: 'Event not found in bookmarks' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
}

export  default bookMarkController
