import express from 'express';
import registerUser from '../controller/registerUser.js';
import { loginUser, logOut }  from '../controller/login.js';
import { updatePassword, forgotPassword, resetPassword } from '../controller/passwordController.js';
import { deleteAccount } from '../controller/deleteAccount.js';
import bookMarkController from '../controller/eventBookmark.js';
import upload from "../middleware/multer.js"
import Secure from '../middleware/auth.js';
// import confirmEmail from '../controllers/confirmEmail.js';



const router = express.Router();

//Routes
router.post('/register',  upload.fields([{ name: "gallery", maxCount: 6 }]), registerUser);

router.post("/login",loginUser)
router.get("/logout",logOut)
router.patch('/updatepassword', Secure,updatePassword);
router.post('/forgotpassword',  forgotPassword);
router.put('/resetpassword/:resetToken',  resetPassword);
router.delete("/delete-account/:email?/:userId?",deleteAccount);
router.patch("/profile/:id", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 6 }
  ]), bookMarkController.updateProfile)
export default router; 
