

import express  from "express";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import connectDB  from "./config/db";
import morgan from 'morgan';
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import adminRoutes from './routes/admin.routes'
import passport from "./config/passport";

dotenv.config()
connectDB()


const app=express()
const CLIENT_URL = process.env.CLIENT_URL

app.use(passport.initialize())

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'));



app.use(cors({
    origin: CLIENT_URL, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
}))


console.log('serveril vannu');

app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes)
app.use("/api/admin",adminRoutes)





export default app