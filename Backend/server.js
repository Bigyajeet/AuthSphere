import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();            
const app=express();

app.get('/',(req,res)=>{
    res.send("Backend is running")
});
const port=process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})