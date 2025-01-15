import mongoose from "mongoose";
import cors from  "cors";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectDB } from "./config/DbConn.js";
import userRouter from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import eventRoutes from "./routes/eventRoutes.js"
import Countries from "./routes/Country.js"
import bookmark from "./routes/booKMark.js"
import payment from "./routes/payment.js"
import stripe from "./routes/stripe.js"
import getAllUser from "./controller/getAllUser.js";
import Secure from "./middleware/authMiddleware.js";
import isAdmin from "./middleware/adminmiddleware.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT;

//connect to db
connectDB();

//app middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

// routes middleware
app.use("/api/users", userRouter);
app.use("/api/events",eventRoutes)
app.use("/api/country",Countries)
app.use("/api/bookmark",bookmark)
app.use("/api/paypal",payment)
app.use("/api/stripe",stripe)
app.use("/api/getusers",Secure,isAdmin,getAllUser)
//route
app.get("/", (req, res) => {
    res.send("Home Page!");
});

//error handler
app.use(errorHandler);


//start server
mongoose.connection.once('open', () => {
    console.log('DB connected');

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});
