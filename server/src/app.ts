import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import paymentRoutes from "./routes/payment.routes";
import mentorRoutes from "./routes/mentor.routes";
import bookingRoutes from "./routes/booking.routes";
import courseRoutes from "./routes/course.routes";
import feedbackRoutes from "./routes/feedback.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import mentorAvailabilityRoutes from "./routes/mentorAvailability.routes";
import walletRoutes from "./routes/wallet.routes";
import dashBoardRoutes from "./routes/dashboard.routes";
import passport from "./config/passport";
import { errorHandler } from "./middlewares/errorMiddleware";
const rfs = require("rotating-file-stream");
import path from "path";
import rateLimit from "express-rate-limit";

dotenv.config();
connectDB();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;

// Rate limiter: 10 requests per 5 seconds per IP
const burstLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests in a short time, please wait a 5 seconds and try again",
});

app.use(burstLimiter);

app.use(passport.initialize());

app.use(express.json());
app.use(cookieParser());

const errorLogStream = rfs.createStream("error.log", {
  interval: "1d",
  maxFiles: 7,
  path: path.join(__dirname, "../logs"),
});

app.use(
  morgan("combined", {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400,
  })
);

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

console.log("serveril vannu");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/mentor-availability", mentorAvailabilityRoutes);
app.use("/api/wallet/", walletRoutes);
app.use("/api/dashboard", dashBoardRoutes);

app.use(errorHandler);

export default app;
