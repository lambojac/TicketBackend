import Business from '../models/business.js';
import cloudinary from '../config/cloudinary.js';

// CREATE
export const createBusiness = async (req, res) => {
    try {
        const files = req.files;
        const mediaFiles = [];

        if (files) {
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path);
                mediaFiles.push({ fileName: file.originalname, fileUrl: result.secure_url });
            }
        }

        const business = await Business.create({ ...req.body, mediaFiles });
        res.status(201).json(business);
    } catch (error) {
        res.status(500).json({ message: 'Error creating business', error });
    }
};

// READ ALL
export const getBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find();
        res.status(200).json(businesses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching businesses', error });
    }
};

// READ BY ID
export const getBusinessById = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);
        if (!business) return res.status(404).json({ message: 'Business not found' });
        res.status(200).json(business);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching business', error });
    }
};

// UPDATE
export const updateBusiness = async (req, res) => {
    try {
        const business = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!business) return res.status(404).json({ message: 'Business not found' });
        res.status(200).json(business);
    } catch (error) {
        res.status(500).json({ message: 'Error updating business', error });
    }
};

// DELETE
export const deleteBusiness = async (req, res) => {
    try {
        const business = await Business.findByIdAndDelete(req.params.id);
        if (!business) return res.status(404).json({ message: 'Business not found' });
        res.status(200).json({ message: 'Business deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting business', error });
    }
};
