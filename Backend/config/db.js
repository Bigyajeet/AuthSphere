import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected:${mongoose.connection.host}`);
    }catch(error){
        console.log(`Database Error:${error.message}`);
        process.exit();
    }
}

export default connectDB;