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

 updateProfile :async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      email,
      phone_number,
      interests,
      role,
      entityDescription,
      countryLocated,
      countryRepresented,
    } = req.body;
   
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
   
    // Update the fields if provided
    if (full_name) user.full_name = full_name;
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (interests) user.interests = interests;
   
    // Handle additional fields from the schema
    if (role && ['admin', 'user', 'ambassador', 'artist', 'sub_admin'].includes(role)) {
      user.role = role;
    }
   
    if (entityDescription !== undefined) user.entityDescription = entityDescription;
    if (countryLocated !== undefined) user.countryLocated = countryLocated;
    if (countryRepresented !== undefined) user.countryRepresented = countryRepresented;
   
    // Handle mediaFiles if provided as URLs in the request body
    if (req.body.mediaFiles && Array.isArray(req.body.mediaFiles)) {
      user.mediaFiles = req.body.mediaFiles;
    }
   
    // Handle profile image upload
    if (req.file) {
      const imageUpload = await uploadToCloudinary(
        req.file.buffer,
        'users/profile'
      );
      user.image = imageUpload.secure_url;
    }
   
    // Handle gallery uploads
    if (req.files?.gallery?.length > 0) {
      // Replace existing gallery with new uploads
      let mediaFiles = [];
      const galleryFiles = req.files.gallery.slice(0, 6); // Limit to 6 files
      for (const file of galleryFiles) {
        const galleryUpload = await uploadToCloudinary(
          file.buffer,
          'users/gallery'
        );
        mediaFiles.push(galleryUpload.secure_url);
      }
      user.mediaFiles = mediaFiles;
    }
   
    // Save the updated user
    await user.save();
   
    res.json({
      message: "Profile updated successfully",
      user: {
        full_name: user.full_name,
        name: user.name,
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
