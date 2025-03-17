import asyncHandler from "express-async-handler";
import Business from '../models/business.js';
import cloudinary from '../config/cloudinary.js';
import path from 'path';

// CREATE
export const createBusiness = asyncHandler(async (req, res) => {
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

  // Handle media files upload
  let mediaFiles = [];
  if (req.files && req.files.gallery) {
    const galleryFiles = req.files.gallery;
    for (const file of galleryFiles) {
      try {
        // The correct way to upload to cloudinary
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
    res.status(201).json(business);
  } else {
    res.status(400);
    throw new Error("Failed to create business.");
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

  // Handle media files upload for update
  let mediaFiles = [...business.mediaFiles]; // Start with existing files
  
  if (req.files && req.files.gallery) {
    const galleryFiles = req.files.gallery;
    for (const file of galleryFiles) {
      try {
        // The correct way to upload to cloudinary
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
  }

  const updatedBusiness = await Business.findByIdAndUpdate(
    businessId,
    {
      ...req.body,
      mediaFiles
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