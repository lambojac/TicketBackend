import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/emailSender.js";

//update password function
const updatePassword = asyncHandler( async (req, res) => {

    const user = await User.findById(req.user._id);
    const { oldpassword, password } = req.body;

    //validate password
    if(!user) {
        res.status(400);
        throw new Error("User not found, Please sign in");
    }

    if(!oldpassword || !password) {
        res.status(400);
        throw new Error("Please provide old password and new password");
    
    }    
    //validate old password
    const isMatch = await bcrypt.compare(oldpassword, user.password);

    // Save new Password
    if(user && isMatch) {
        user.password = password;
        await user.save();
        res.status(200).send({ message: "Password changed"});
    } else{
    res.status(400);
    throw new Error("Old password is incorrect");
}
});

// Forgot password function
const forgotPassword = asyncHandler( async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
 
    //error handling
    if(!user) {
        res.status(400);
        throw new Error("User does not exist");
    }

    // Delete token if found in db after validating user
    let token = await Token.findOne({ userId: user._id });
    if(token) {
        await token.deleteOne();
    }

    // create fresh reset token if user email is found
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    console.log(resetToken);//Used to reset password if mail service is available
   

    // Hash token before saving to DB
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest("hex");// This is crypto method of hashing token

    // Save hashed token to DB
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 20 * (60 * 1000),//20 mins
    }).save(); 

const resetUrl = `{process.env.CLIENT_URL}/resetpassword/${resetToken}`;


// Reset Email
const message = `
<h1>Hello ${user.name}</h1>
<p>Please use the url below to reset your password</p>  
<p>This reset link is valid for only 20minutes.</p>

<a href=${resetUrl} clicktracking=off>${resetUrl}</a>

<p>Regards...</p>
<p>Jay App Team</p>
`;
const subject = "Password Reset Request";
const send_to = user.email;
const sent_from = process.env.EMAIL_USER;

// error handling
try {

    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
} catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
}
});



// Reset Password
const resetPassword = asyncHandler( async(req, res) => {
    const password  = req.body.password;
    const { resetToken } = req.params;// grab the token from the url
    
    //hash token, then compare with token in db 
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest("hex");

    //find token in db
    const userToken = await Token.findOne({ 
        token: hashedToken,
        expiresAt: { $gt: Date.now() },// gt means greater than
    });

    //error handling
    if(!userToken) {
        res.status(404);
        throw new Error("Token is invalid or has expired");
    }

    //find user
    const user = await User.findOne({ _id: userToken.userId });
    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password Reset Sucessfull, Please Log In"});

});

export { updatePassword, forgotPassword, resetPassword };
