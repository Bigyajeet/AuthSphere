import mongoose from "mongoose";
const userSchema = new mongoose.Schema(

    {
        name:{
            type:String,
            required:true
        },
        email:{
             type:String,
            required:true,
            unique:true
        },
        provider:{
            type:String,
            enum:["google", "github","facebook","LinkedIn"]
        },
        googleId:{
            type:String,
        },
          githubId:{
            type:String,
        },
            facebook:{
            type:String,
        },
            LinkedinId:{
            type:String,
        },
      
    },
      {timestamps:true},
);
const User=mongoose.model("User",userSchema);
export default User;