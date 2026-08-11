import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try{
        const {token}=req.body;
        const ticket=await client.verifyIdToken({
            idToken:token,
            audience:process.env.GOOGLE_CLIENT_ID
        });
        const payload=ticket.getPayload();
        const {sub,email,name}=payload;
        let user=await User.findOne({email});
        if(!user){
            user=await User.create({
                name,
                email,
                googleId:sub,
            });
        }
        const jwtToken=jwt.sign({user:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"

        });
        return res.status(200).json({
            success:true,
            user,
            token:jwtToken,
            message:"Google Token verified successfully"
           
        });

    }catch(error){
      return  res.status(500).json({
        message:" Google login Failed",
        error:error.message
    });
    }
}
export const getProfile=async(req,res)=>{
    res.status(200).json(req.user);

};