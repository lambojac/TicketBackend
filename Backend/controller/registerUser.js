import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import genToken from "./tokenGen.js"; // Utility to generate JWT

const registerUser = asyncHandler(async (req, res) => {
    const { 
        full_name, 
        role, 
        email, 
        password, 
        confirm_password, 
        phone_number = "+234",
        entityDescription = "",
        countryLocated = "",
        countryRepresented = "",
        mediaFiles = []
    } = req.body;

    if (!full_name || !email || !password || !confirm_password || !role) {
        res.status(400);
        throw new Error("Please provide all required fields.");
    }

    if (password !== confirm_password) {
        res.status(400);
        throw new Error("Passwords do not match.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error("User with this email already exists.");
    }

    const user = await User.create({
        full_name,
        email,
        password, 
        phone_number,
        role,
        entityDescription,
        countryLocated,
        countryRepresented,
        mediaFiles
    });

    if (user) {
        const token = genToken(user._id);

        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24), 
            sameSite: "none",
            secure: true, 
        });

        res.status(201).json({
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            entityDescription: user.entityDescription,
            countryLocated: user.countryLocated,
            countryRepresented: user.countryRepresented,
            mediaFiles: user.mediaFiles,
            createdAt: user.createdAt,
            token,
            role
        });
    } else {
        res.status(400);
        throw new Error("Failed to register user.");
    }
});

export default registerUser;

