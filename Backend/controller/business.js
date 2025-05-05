import asyncHandler from "express-async-handler";
import Business from '../models/business.js';
import cloudinary from '../config/cloudinary.js';
import path from 'path';

// CREATE
export const createBusiness = asyncHandler(async (req, res) => {
  try {
    const {
      businessTitle,
      businessDescription,
      businessLocation,
      businessAddress,
      businessCategory,
      twitter,
      facebook,
      linkedIn,
      instagram,
      webAddress,
      whatsapp
    } = req.body;

    // Validation for required fields
    if (!businessTitle || !businessDescription || !businessLocation || !businessAddress || !businessCategory) {
      res.status(400);
      throw new Error("Please provide all required fields.");
    }

    console.log("Request files:", req.files); // Debug uploaded files
    console.log("Request body:", req.body); // Debug request body

    // Handle media files upload - simple array of URLs
    let mediaFiles = [];
    if (req.files && req.files.gallery && req.files.gallery.length > 0) {
      try {
        const galleryFiles = req.files.gallery;
        for (const file of galleryFiles) {
          console.log("Processing gallery image:", file.originalname);
          const galleryUpload = await uploadToCloudinary(
            file.buffer,
            'business/gallery'
          );
          mediaFiles.push(galleryUpload.secure_url);
        }
        console.log("Created gallery with", mediaFiles.length, "images");
      } catch (galleryError) {
        console.error("Gallery upload error:", galleryError);
        return res.status(400).json({ message: "Gallery upload failed", error: galleryError.message });
      }
    }

    // Handle mediaFiles if provided as URLs in the request body
    if (req.body.mediaFiles && Array.isArray(req.body.mediaFiles)) {
      mediaFiles = req.body.mediaFiles;
    }

    const business = await Business.create({
      businessTitle,
      businessDescription,
      businessLocation,
      businessAddress,
      businessCategory,
      twitter,
      facebook,
      linkedIn,
      instagram,
      webAddress,
      whatsapp,
      mediaFiles
    });

    if (business) {
      res.status(201).json({
        message: "Business created successfully",
        business
      });
    } else {
      res.status(400);
      throw new Error("Failed to create business.");
    }
  } catch (error) {
    console.error("Business creation error:", error);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE
export const updateBusiness = asyncHandler(async (req, res) => {
  const businessId = req.params.id;
  const business = await Business.findById(businessId);

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  // Replace old mediaFiles with new ones
  let mediaFiles = [];

  if (req.files && req.files.gallery && req.files.gallery.length > 0) {
    const galleryFiles = req.files.gallery;
    for (const file of galleryFiles) {
      try {
        const result = await cloudinary.uploader.upload(file.path);
        mediaFiles.push({
          fileName: file.originalname || path.basename(file.path),
          fileUrl: result.secure_url
        });
      } catch (error) {
        console.error("Error uploading to cloudinary:", error);
        res.status(500);
        throw new Error("Error uploading files to cloud storage.");
      }
    }
  } else {
    // If no gallery files provided, clear existing images
    mediaFiles = [];
  }

  const updatedBusiness = await Business.findByIdAndUpdate(
    businessId,
    {
      ...req.body,
      mediaFiles, // overwrite the mediaFiles array
    },
    { new: true }
  );

  res.status(200).json(updatedBusiness);
});


// The rest of your controllers remain the same
export const getBusinesses = asyncHandler(async (req, res) => {
  const businesses = await Business.find();
  res.status(200).json(businesses);
});

export const getBusinessById = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  
  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }
  
  res.status(200).json(business);
});

export const deleteBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findByIdAndDelete(req.params.id);
  
  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }
  
  res.status(200).json({ message: 'Business deleted successfully' });
});