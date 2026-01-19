import  express from "express";
import dotenv from "dotenv";
dotenv.config();
const app=express()
app.listen(3030,()=>console.log("server is running on 3030"));

//database connection
import mongoose from "mongoose";
mongoose.connect(process.env.DB_URL)
.then(()=>console.log("Database connected !"))
.catch(()=>console.log("Database not connected !"));

import cookieParser from 'cookie-parser';
import cors from "cors";
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


//app level middleware
import morgan from "morgan";
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.get("/",(req,res)=>res.json({message:"setup success"}));

// route level middleware
import userRouter from "./user/user.router.js";
app.use("/api/user",userRouter);

