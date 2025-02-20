 
import  express from 'express';
import getAllUser from '../controller/getAllUser.js';
import isAdmin from "../middleware/adminmiddleware.js"
import Secure from '../middleware/auth.js';
const router = express.Router();
router.get('/all-users', getAllUser);

export default router;

