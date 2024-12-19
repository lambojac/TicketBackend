import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/emailSender.js";

//update password function
const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    const { current_password, new_password, confirm_password } = req.body;

    // Validate input
    if (!user) {
        res.status(400);
        throw new Error("User not found. Please sign in.");
    }

    if (!current_password || !new_password || !confirm_password) {
        res.status(400);
        throw new Error("Please provide current password, new password, and confirm password.");
    }

    // Validate old password
    const isMatch = await bcrypt.compare(current_password, user.password);

    if (!isMatch) {
        res.status(400);
        throw new Error("Current password is incorrect.");
    }

    // Validate new password and confirm password match
    if (new_password !== confirm_password) {
        res.status(400);
        throw new Error("New password and confirm password do not match.");
    }

    // Save new password
    user.password = new_password;
    await user.save();
    res.status(200).send({ message: "Password changed successfully" });
});

// Forgot password function
const forgotPassword = asyncHandler( async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    // Error handling: check if the user exists
    if(!user) {
        res.status(400);
        throw new Error("User does not exist");
    }

    // Generate a 6-digit random token (you can change it to 4 digits if needed)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
    console.log(resetToken);  // Used to send in email (you may remove this in production)

    // Hash token for security before storing it (optional, depending on your use case)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest("hex");

    // Save the hashed token and its expiration to the database
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000, // Token expires in 15 minutes
    }).save();

    // Send the token via email
    const message = `
    <h1>Hello ${user.name}</h1>
    <p>Your password reset token is: <strong>${resetToken}</strong></p>
    <p>This token is valid for only 15 minutes.</p>
    <p>Use this token on the password reset page to reset your password.</p>
    `;
    
    const subject = "Password Reset Token";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    // Error handling for email sending
    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({ success: true, message: "Reset Token Sent" });
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
