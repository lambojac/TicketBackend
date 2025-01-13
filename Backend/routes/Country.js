import express from 'express';
import multer from 'multer';
import { createCountry, deleteCountry, editCountry, getAllCountries, getCountryById } from '../controller/Country.js';


const router = express.Router();
const upload = multer(); 

// Route to create a new country
router.post(
    '/countries',
    upload.fields([
      { name: 'image', maxCount: 1 }, 
      { name: 'association_leader_photo', maxCount: 1 }
    ]),
    createCountry
  );

// Route to get all countries (only title and image)
router.get('/countries', getAllCountries);

// Route to get a particular country by ID
router.get('/countries/:id', getCountryById);
//edit country
router.put('/countries/:id', editCountry);
//delete country
router.delete('/countries/:id', deleteCountry);

export default router;
