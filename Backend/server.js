import express from "express";
import dotenv from "dotenv";
import googleRoute from "./routes/auth.routes.js";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();            
const app=express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Backend is running")
});
app.use('/api/auth', googleRoute);


const port=process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})