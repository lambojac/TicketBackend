import express from 'express';
import registerUser from '../controller/registerUser.js';
import { loginUser, logOut }  from '../controller/login.js';
import { updatePassword, forgotPassword, resetPassword } from '../controller/passwordController.js';
// import Secure from '../middleware/AuthMiddleware.js';
// import confirmEmail from '../controllers/confirmEmail.js';



const router = express.Router();

//Routes
router.post('/register', registerUser);
router.post("/login",loginUser)
router.get("/logout",logOut)
router.patch('/updatepassword', updatePassword);
router.post('/forgotpassword',  forgotPassword);
router.put('/resetpassword/:resetToken',  resetPassword);
export default router; 
