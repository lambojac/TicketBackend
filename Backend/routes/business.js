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

// Routes
router.post(
    '/', 
    upload.fields([
      { name: "gallery", maxCount: 6 }
    ]), 
  createBusiness
  );
  
  router.patch(
    '/:id', 
    upload.fields([
      { name: "gallery", maxCount: 6 }
    ]), 
    updateBusiness
  );
router.get('/', getBusinesses);
router.get('/:id', getBusinessById);
router.delete('/:id', deleteBusiness);

export default router;