import User from "../models/userModel.js";

const bookMarkController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('name phone_number interests image');

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
},
//update profile
updateProfile: async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters
    const { full_name, email, phone_number, interests } = req.body; // Extract other fields from request body

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields if provided
    if (full_name) user.full_name = full_name; // `name` will automatically be updated by the pre-save hook
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (interests) user.interests = interests; // Expecting an array

    // Handle image
    if (req.file) {
      user.image = req.file.buffer.toString("base64"); // Convert uploaded image to Base64
    }

    // Save the updated user
    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        interests: user.interests,
        image: user.image, // Explicitly include the image in the response
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
},


}

export  default bookMarkController
