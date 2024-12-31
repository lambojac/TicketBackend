import  Country from '../models/Country.js'; 
import asyncHandler from 'express-async-handler';


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
      created_by_id,
    } = req.body;
  
    const image = req.files?.image?.[0]?.buffer.toString('base64') || null;
    const association_leader_photo =
      req.files?.association_leader_photo?.[0]?.buffer.toString('base64') || null;
  
    const country = new Country({
      image,
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
      created_by_id,
    });
  
    const savedCountry = await country.save();
    res.status(201).json(savedCountry);
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


