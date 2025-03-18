import Country from '../models/Country.js';
import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';
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

// Create a new country
export const createCountry = asyncHandler(async (req, res) => {
  const {
    title,
    president,
    independence_date,
    capital,
    currency,
    population,
    demonym,
    // latitude,
    // longitude,
    description,
    language,
    time_zone,
    link,
    // association_leader_name,
    // association_leader_email,
    // association_leader_phone,
    arts_and_crafts,
    cultural_dance,
    created_by_id,
  } = req.body;

  // Upload main image if provided
  let imageUrl = null;
  if (req.files?.image?.[0]) {
    const imageUpload = await uploadToCloudinary(
      req.files.image[0].buffer,
      'countries/images'
    );
    imageUrl = imageUpload.secure_url;
  }

  // Upload gallery images if provided
  // const galleryUrls = [];
  // if (req.files?.gallery) {
  //   const galleryFiles = req.files.gallery.slice(0, 6);
  //   for (const file of galleryFiles) {
  //     const galleryUpload = await uploadToCloudinary(
  //       file.buffer,
  //       'countries/gallery'
  //     );
  //     galleryUrls.push(galleryUpload.secure_url);
  //   }
  // }

  // Upload association leader photo if provided
  // let leaderPhotoUrl = null;
  // if (req.files?.association_leader_photo?.[0]) {
  //   const leaderPhotoUpload = await uploadToCloudinary(
  //     req.files.association_leader_photo[0].buffer,
  //     'countries/leaders'
  //   );
  //   leaderPhotoUrl = leaderPhotoUpload.secure_url;
  // }

  const country = new Country({
    image: imageUrl,
    gallery: galleryUrls,
    title,
    president,
    independence_date,
    capital,
    currency,
    population,
    demonym,
    // latitude,
    // longitude,
    description,
    language,
    time_zone,
    link,
    // association_leader_name,
    // association_leader_email,
    // association_leader_phone,
    // association_leader_photo: leaderPhotoUrl,
    arts_and_crafts,
    cultural_dance,
    created_by_id
  });

  const savedCountry = await country.save();

  // Create and save a notification
  const notification = new Notification({
    title: 'New Country Created',
    message: `A new country ${savedCountry.title} has been created!`,
    countryID: savedCountry._id,
    type: 'country',
    createdAt: new Date(),
  });
  await notification.save();

  // Emit notification to all clients
  req.io.emit("newCountryNotification", {
    notification: {
      _id: notification._id,
      title: notification.title,
      message: notification.message,
      countryID: notification.countryID,
      type: notification.type,
      createdAt: notification.createdAt,
    },
  });

  // Format the response to match the expected structure
  res.status(201).json({
    country: savedCountry,
    notification: {
      _id: notification._id,
      countryID: notification.countryID,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      createdAt: notification.createdAt,
    },
  });
});

// Get all countries (only title and image)
export const getAllCountries = asyncHandler(async (req, res) => {
  const countries = await Country.find({}, 'title image');
  res.status(200).json(countries);
});

// Get a particular country by ID
export const getCountryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const country = await Country.findById(id);

  if (!country) {
    res.status(404);
    throw new Error('Country not found');
  }

  res.status(200).json(country);
});

// Edit a country by ID
export const editCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the country first to get existing data
  const existingCountry = await Country.findById(id);
  if (!existingCountry) {
    res.status(404);
    throw new Error('Country not found');
  }

  // Extract fields from request body
  const {
    title,
    president,
    independence_date,
    capital,
    currency,
    population,
    demonym,
    // latitude,
    // longitude,
    description,
    language,
    time_zone,
    link,
    // association_leader_name,
    // association_leader_email,
    // association_leader_phone,
    arts_and_crafts,
    cultural_dance
  } = req.body;

  // Upload main image if provided
  let imageUrl = existingCountry.image;
  if (req.files?.image?.[0]) {
    const imageUpload = await uploadToCloudinary(
      req.files.image[0].buffer,
      'countries/images'
    );
    imageUrl = imageUpload.secure_url;
  }

  // Upload gallery images if provided
  // let galleryUrls = existingCountry.gallery || [];
  // if (req.files?.gallery?.length > 0) {
  //   // Replace existing gallery with new uploads
  //   galleryUrls = [];
  //   const galleryFiles = req.files.gallery.slice(0, 6);
  //   for (const file of galleryFiles) {
  //     const galleryUpload = await uploadToCloudinary(
  //       file.buffer,
  //       'countries/gallery'
  //     );
  //     galleryUrls.push(galleryUpload.secure_url);
  //   }
  // }

  // Upload association leader photo if provided
  // let leaderPhotoUrl = existingCountry.association_leader_photo;
  // if (req.files?.association_leader_photo?.[0]) {
  //   const leaderPhotoUpload = await uploadToCloudinary(
  //     req.files.association_leader_photo[0].buffer,
  //     'countries/leaders'
  //   );
  //   leaderPhotoUrl = leaderPhotoUpload.secure_url;
  // }

  // Update country
  const updatedCountry = await Country.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(arts_and_crafts && { arts_and_crafts }),
      ...(cultural_dance && { cultural_dance }),
      ...(president && { president }),
      ...(independence_date && { independence_date }),
      ...(capital && { capital }),
      ...(currency && { currency }),
      ...(population && { population }),
      ...(demonym && { demonym }),
      // ...(latitude && { latitude }),
      // ...(longitude && { longitude }),
      ...(description && { description }),
      ...(language && { language }),
      ...(time_zone && { time_zone }),
      ...(link && { link }),
      // ...(association_leader_name && { association_leader_name }),
      // ...(association_leader_email && { association_leader_email }),
      // ...(association_leader_phone && { association_leader_phone }),
      image: imageUrl,
      // gallery: galleryUrls,
      // association_leader_photo: leaderPhotoUrl,
    },
    { new: true } // Return the updated document
  );

  res.status(200).json(updatedCountry);
});

// Delete a country by ID
export const deleteCountry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const country = await Country.findByIdAndDelete(id);

  if (!country) {
    res.status(404);
    throw new Error('Country not found');
  }

  res.status(200).json({ message: 'Country deleted successfully' });
});