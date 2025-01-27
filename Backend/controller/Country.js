import  Country from '../models/Country.js'; 
import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';

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
      latitude,
      longitude,
      description,
      language,
      time_zone,
      link,
      association_leader_name,
      association_leader_email,
      association_leader_phone,
      arts_and_crafts,
       cultural_dance,
      created_by_id,
    } = req.body;
  
    const image = req.files?.image?.[0]?.buffer.toString('base64') || null;
    const gallery=
    req.files?.gallery?.slice(0, 6).map(file => file.buffer.toString('base64')) || [];

    const association_leader_photo =
      req.files?.association_leader_photo?.[0]?.buffer.toString('base64') || null;
  
    const country = new Country({
      image,
      gallery,
      title,
      president,
      independence_date,
      capital,
      currency,
      population,
      demonym,
      latitude,
      longitude,
      description,
      language,
      time_zone,
      link,
      association_leader_name,
      association_leader_email,
      association_leader_phone,
      association_leader_photo,
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
  
    // Extract fields from request body
    const {
      title,
      president,
      independence_date,
      capital,
      currency,
      population,
      demonym,
      latitude,
      longitude,
      description,
      language,
      time_zone,
      link,
      association_leader_name,
      association_leader_email,
      association_leader_phone,
      arts_and_crafts,
    cultural_dance
    } = req.body;
  
    // Process image updates if available
    const image = req.files?.image?.[0]?.buffer.toString('base64') || undefined;
    const association_leader_photo =
      req.files?.association_leader_photo?.[0]?.buffer.toString('base64') || undefined;
      const gallery=
    req.files?.gallery?.slice(0, 6).map(file => file.buffer.toString('base64')) || [];
  
    // Update country
    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(arts_and_crafts && { arts_and_crafts }),
        ...(cultural_dance && { cultural_dance }),
        ...(gallery && { gallery}),
        ...(president && { president }),
        ...(independence_date && { independence_date }),
        ...(capital && { capital }),
        ...(currency && { currency }),
        ...(population && { population }),
        ...(demonym && { demonym }),
        ...(latitude && { latitude }),
        ...(longitude && { longitude }),
        ...(description && { description }),
        ...(language && { language }),
        ...(time_zone && { time_zone }),
        ...(link && { link }),
        ...(association_leader_name && { association_leader_name }),
        ...(association_leader_email && { association_leader_email }),
        ...(association_leader_phone && { association_leader_phone }),
        ...(image && { image }),
        ...(association_leader_photo && { association_leader_photo }),
      },
      { new: true } // Return the updated document
    );
  
    if (!updatedCountry) {
      res.status(404);
      throw new Error('Country not found');
    }
  
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
  

