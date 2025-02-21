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
router.post('/', upload.array('mediaFiles', 5), createBusiness);
router.get('/', getBusinesses);
router.get('/:id', getBusinessById);
router.put('/:id',upload.array('mediaFiles', 5), updateBusiness);
router.delete('/:id', deleteBusiness);

export default router;