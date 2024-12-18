import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import genToken from "./tokenGen.js"; // Utility to generate JWT

const registerUser = asyncHandler(async (req, res) => {
    const { full_name, email, password, confirm_password, phone_number = "+234" } = req.body;

    // Validate required fields
    if (!full_name || !email || !password || !confirm_password) {
        res.status(400);
        throw new Error("Please provide all required fields.");
    }

    // Password and confirm_password match check
    if (password !== confirm_password) {
        res.status(400);
        throw new Error("Passwords do not match.");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error("User with this email already exists.");
    }

    // Create a new user
    const user = await User.create({
        full_name,
        email,
        password, 
        phone_number,
    });

    if (user) {
        // Generate a JWT token
        const token = genToken(user._id);

        // Set the token in an HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expires in 1 day
            sameSite: "none",
            secure: true, // Set to true if using HTTPS
        });

        res.status(201).json({
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            createdAt: user.createdAt,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Failed to register user.");
    }
});

export default registerUser;
