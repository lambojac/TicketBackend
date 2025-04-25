import express from 'express';
import multer from 'multer';
import { createCountry, deleteCountry, editCountry, getAllCountries, getCountryById } from '../controller/Country.js';


const router = express.Router();
const upload = multer(); 

/**
 * @swagger
 * /country/countries:
 *   post:
 *     summary: Create a new country
 *     description: Creates a new country with optional image upload.
 *     consumes:
 *       - multipart/form-data
 *     tags:
 *       - Countries
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               president:
 *                 type: string
 *               independence_date:
 *                 type: string
 *                 format: date
 *               capital:
 *                 type: string
 *               currency:
 *                 type: string
 *               population:
 *                 type: number
 *               demonym:
 *                 type: string
 *               description:
 *                 type: string
 *               language:
 *                 type: string
 *               time_zone:
 *                 type: string
 *               link:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Country created successfully
 */
router.post(
    '/countries',
    upload.fields([
      { name: 'image', maxCount: 1 }, 
     
    ]),
    createCountry
  );

/**
 * @swagger
 * /country/countries:
 *   get:
 *     summary: Get all countries
 *     description: Returns all countries with title and image only.
 *     tags:
 *       - Countries
 *     responses:
 *       200:
 *         description: A list of countries
 */
router.get('/countries', getAllCountries);

/**
 * @swagger
 * /country/countries/{id}:
 *   get:
 *     summary: Get country by ID
 *     description: Returns a single country's details by ID.
 *     tags:
 *       - Countries
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The country ID
 *     responses:
 *       200:
 *         description: Country found
 *       404:
 *         description: Country not found
 */

router.get('/countries/:id', getCountryById);

/**
 * @swagger
 * /country/countries/{id}:
 *   patch:
 *     summary: Update a country
 *     description: Updates a country's information and optionally its image or gallery.
 *     consumes:
 *       - multipart/form-data
 *     tags:
 *       - Countries
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the country to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Country updated successfully
 *       404:
 *         description: Country not found
 */

router.patch('/countries/:id', upload.fields([
 
  { name: "gallery", maxCount: 6 },
]), editCountry);

/**
 * @swagger
 * /country/countries/{id}:
 *   delete:
 *     summary: Delete a country
 *     description: Deletes a country by ID.
 *     tags:
 *       - Countries
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Country ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Country deleted successfully
 *       404:
 *         description: Country not found
 */
router.delete('/countries/:id', deleteCountry);

export default router;













