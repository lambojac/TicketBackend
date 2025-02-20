import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const Secure = asyncHandler(async (req, res, next) => {
    try {
        // Get the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401);
            throw new Error("Not authorized, token missing or invalid");
        }

        // Extract the token from the header
        const token = authHeader.split(" ")[1];

        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });

        // Find the user by the ID in the token and exclude the password field
        const user = await User.findById(verified.id).select("-password");

        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }

        // Attach the user to the request object
        req.user = user;

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, please login");
    }
});

export default Secure;
