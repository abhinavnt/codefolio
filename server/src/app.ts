
import "reflect-metadata";
import express  from "express";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import connectDB  from "./config/db";
import morgan from 'morgan';
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import adminRoutes from './routes/admin.routes'
import paymentRoutes from './routes/payment.routes'
import mentorRoutes from './routes/mentor.routes'
import bookingRoutes from './routes/booking.routes'
import courseRoutes from './routes/course.routes'
import passport from "./config/passport";
import { errorHandler } from "./middlewares/errorMiddleware";
const rfs = require('rotating-file-stream');
import path from "path"

dotenv.config()
connectDB()


const app=express()
const CLIENT_URL = process.env.CLIENT_URL

app.use(passport.initialize())

app.use(express.json())
app.use(cookieParser())


const errorLogStream = rfs.createStream("error.log", {
    interval: "1d", // Rotate daily
    maxFiles: 7, // Keep logs for 7 days
    path: path.join(__dirname, "../logs"), // Log files in Codefolio/server/logs/
  });

  app.use(
    morgan("combined", {
      stream: errorLogStream,
      skip: (req, res) => res.statusCode < 400, // Log only errors (status >= 400)
    })
  );




app.use(morgan('dev'));



app.use(cors({
    origin: CLIENT_URL, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
}))


console.log('serveril vannu');
app.get("/test-error", (req, res) => {
    res.status(500).send("Test error occurred");
  });
app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/payment",paymentRoutes)
app.use("/api/mentor",mentorRoutes)
app.use("/api/booking",bookingRoutes)
app.use('/api/course',courseRoutes)
app.use(errorHandler)



export default app