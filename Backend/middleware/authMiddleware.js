import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const Secure = asyncHandler( async (req, res, next) => {
    try {
        const token = req.cookies.token;
        //console.log(token);

        if (!token) {
            res.status(401);
            throw new Error("Not authorized, please login");
        }

        //verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        //console.log(verified);


        // get user Id from the token
        // find the user
        // .select("-password") this is to eliminate the password field.
        const user = await User.findById(verified.id).select("-password");
        //console.log(user);
         
        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }
        //provide user details to any one that uses this middleware.
        req.user = user;
        //console.log(req.user);
        next();

    } catch (error) {
        res.status(401);
        throw new Error("Not authourized, Please login");
    }
});

export default Secure;
