import express from 'express';
import upload from "../middleware/cloudinary.js";
const router = express.Router();

import{
    createBusiness,
    getBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness
} from "../controller/business.js"

/**
 * @swagger
 * /business:
 *   post:
 *     summary: Create a new business
 *     consumes:
 *       - multipart/form-data
 *     tags: [Business]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               businessTitle:
 *                 type: string
 *               businessDescription:
 *                 type: string
 *               businessLocation:
 *                 type: string
 *               businessAddress:
 *                 type: string
 *               businessCategory:
 *                 type: string
 *               twitter:
 *                 type: string
 *               facebook:
 *                 type: string
 *               linkedIn:
 *                 type: string
 *               instagram:
 *                 type: string
 *               webAddress:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Business created successfully
 *       400:
 *         description: Bad Request
 */

router.post(
    '/', 
    upload.fields([
      { name: "gallery", maxCount: 6 }
    ]), 
  createBusiness
  );
  /**
 * @swagger
 * /business/{id}:
 *   patch:
 *     summary: Update an existing business
 *     consumes:
 *       - multipart/form-data
 *     tags: [Business]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               businessTitle:
 *                 type: string
 *               businessDescription:
 *                 type: string
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       404:
 *         description: Business not found
 */

  router.patch(
    '/:id', 
    upload.fields([
      { name: "gallery", maxCount: 6 }
    ]), 
    updateBusiness
  );
  /**
 * @swagger
 * /business:
 *   get:
 *     summary: Get all businesses
 *     tags: [Business]
 *     responses:
 *       200:
 *         description: List of businesses
 */

router.get('/', getBusinesses);
/**
 * @swagger
 * /business/{id}:
 *   get:
 *     summary: Get a single business by ID
 *     tags: [Business]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     responses:
 *       200:
 *         description: Business found
 *       404:
 *         description: Business not found
 */

router.get('/:id', getBusinessById);
/**
 * @swagger
 * /business/{id}:
 *   delete:
 *     summary: Delete a business
 *     tags: [Business]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     responses:
 *       200:
 *         description: Business deleted successfully
 *       404:
 *         description: Business not found
 */

router.delete('/:id', deleteBusiness);

export default router;