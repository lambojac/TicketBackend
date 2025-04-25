import mongoose from "mongoose";
import cors from  "cors";
import http from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectDB } from "./config/DbConn.js";
import setupSwagger from './swagger.js';
import userRouter from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import eventRoutes from "./routes/eventRoutes.js"
import Countries from "./routes/Country.js"
import bookmark from "./routes/booKMark.js"
import payment from "./routes/payment.js"
import stripe from "./routes/stripe.js"
import getAllUser from "./controller/getAllUser.js";
import switchRole from "./routes/switchRole.js"
import chatRoutes from "./routes/chatRoutes.js";
import { chatSocket } from "./socket/chatSocket.js";
import notification from "./routes/notification.js"
import business from "./routes/business.js"
const app = express();
dotenv.config();
const PORT = process.env.PORT;

//connect to db
connectDB();
//socketio connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Attach Socket.IO to req
app.use((req, res, next) => {
    req.io = io;
    next();
  });
// Initialize Socket.IO
chatSocket(io);

//app middleware

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

// routes middleware
setupSwagger(app);
app.use("/api/chats", chatRoutes);
app.use("/api/notification",notification)
app.use("/api/users", userRouter);
app.use("/api/events",eventRoutes)
app.use("/api/country",Countries)
app.use("/api/bookmark",bookmark)
app.use("/api/paypal",payment)
app.use("/api/stripe",stripe)
app.use("/api/switch-role",switchRole)
app.use("/api/getusers",getAllUser)
app.use("/api/business",business)

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
