import express from 'express';
import multer from 'multer';
import { createCountry, getAllCountries, getCountryById } from '../controller/Country.js';
import Secure from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer(); 

// Route to create a new country
router.post(
    '/countries',
    upload.fields([
      { name: 'image', maxCount: 1 }, 
      { name: 'association_leader_photo', maxCount: 1 }
    ]),Secure,
    createCountry
  );

// Route to get all countries (only title and image)
router.get('/countries',Secure, getAllCountries);

// Route to get a particular country by ID
router.get('/countries/:id',Secure, getCountryById);

export default router;
