import User from "../models/userModel.js";
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
const bookMarkController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('full_name phone_number interests image');

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
// Update profile
updateProfile: async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters
    const {
      full_name,
      email,
      phone_number,
      interests,
      role,
      entityDescription,
      countryLocated,
      countryRepresented,
      mediaFiles
    } = req.body; // Extract all available fields from request body
   
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
   
    // Update the fields if provided
    if (full_name) user.full_name = full_name; // `name` will automatically be updated by the pre-save hook
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (interests) user.interests = interests; // Expecting an array
   
    // Handle additional fields from the schema
    if (role && ['admin', 'user', 'ambassador', 'artist', 'sub_admin'].includes(role)) {
      user.role = role;
    }
   
    if (entityDescription !== undefined) user.entityDescription = entityDescription;
    if (countryLocated !== undefined) user.countryLocated = countryLocated;
    if (countryRepresented !== undefined) user.countryRepresented = countryRepresented;
   
    // Handle mediaFiles if provided as URLs in the request body
    if (mediaFiles && Array.isArray(mediaFiles)) {
      user.mediaFiles = mediaFiles;
    }
   
    // Handle image upload to Cloudinary
    if (req.file) {
      const imageUpload = await uploadToCloudinary(
        req.file.buffer,
        'users/profile'
      );
      user.image = imageUpload.secure_url;
    }
   
    // Save the updated user
    await user.save();
   
    res.json({
      message: "Profile updated successfully",
      user: {
        full_name: user.full_name,
        name: user.name, // Include the automatically generated name
        email: user.email,
        phone_number: user.phone_number,
        interests: user.interests,
        role: user.role,
        entityDescription: user.entityDescription,
        countryLocated: user.countryLocated,
        countryRepresented: user.countryRepresented,
        mediaFiles: user.mediaFiles,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

}

export  default bookMarkController
