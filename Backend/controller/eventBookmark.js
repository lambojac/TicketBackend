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
 updateProfile: async (req, res) => {
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
     
      // Find the user by ID
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
     
      console.log("Request files:", req.files); // Debug uploaded files
      console.log("Request body:", req.body); // Debug request body
     
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
     
      // Handle profile image upload - FIX: Check if image exists in req.files
      if (req.files && req.files.image && req.files.image[0]) {
        try {
          const imageFile = req.files.image[0];
          console.log("Processing profile image:", imageFile.originalname);
          
          const imageUpload = await uploadToCloudinary(
            imageFile.buffer,
            'users/profile'
          );
          
          console.log("Cloudinary upload result:", imageUpload);
          
          // Update user image with new URL
          user.image = imageUpload.secure_url;
          console.log("Updated user image to:", user.image);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          return res.status(400).json({ message: "Image upload failed", error: uploadError.message });
        }
      } else {
        console.log("No new profile image provided");
      }
     
      // Handle gallery uploads
      if (req.files && req.files.gallery && req.files.gallery.length > 0) {
        try {
          // Replace existing gallery with new uploads
          let mediaFiles = [];
          const galleryFiles = req.files.gallery.slice(0, 6); // Limit to 6 files
          
          for (const file of galleryFiles) {
            console.log("Processing gallery image:", file.originalname);
            const galleryUpload = await uploadToCloudinary(
              file.buffer,
              'users/gallery'
            );
            mediaFiles.push(galleryUpload.secure_url);
          }
          
          user.mediaFiles = mediaFiles;
          console.log("Updated gallery with", mediaFiles.length, "images");
        } catch (galleryError) {
          console.error("Gallery upload error:", galleryError);
          return res.status(400).json({ message: "Gallery upload failed", error: galleryError.message });
        }
      }
     
      // Save the updated user
      await user.save();
      console.log("User saved successfully with updated fields");
     
      // Fetch the user again to confirm changes were saved
      const updatedUser = await User.findById(id);
      console.log("Image URL after save:", updatedUser.image);
     
      res.json({
        message: "Profile updated successfully",
        user: {
          full_name: updatedUser.full_name,
          name: updatedUser.name,
          email: updatedUser.email,
          phone_number: updatedUser.phone_number,
          interests: updatedUser.interests,
          role: updatedUser.role,
          entityDescription: updatedUser.entityDescription,
          countryLocated: updatedUser.countryLocated,
          countryRepresented: updatedUser.countryRepresented,
          mediaFiles: updatedUser.mediaFiles,
          image: updatedUser.image,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(400).json({ message: error.message });
    }
  }
}

export  default bookMarkController
