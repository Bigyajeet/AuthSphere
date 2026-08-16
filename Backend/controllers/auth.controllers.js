import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import axios from "axios";
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
                provider:"google",
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

export const githubLogin=async(req,res)=>{
    const githubURL=
    `https://github.com/login/oauth/authorize`+
    `?client_id=${process.env.GITHUB_CLIENT_ID}`+
    `&scope=user:email`;
    res.redirect(githubURL);
};

// fallback route for github login

export const githubCallback=async(req,res)=>{
    try{
        const {code}=req.query;
        if(!code){
            res.status(400).json({
                message:"No code received from github",
            });
        }
        const tokenResponse=await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id:process.env.GITHUB_CLIENT_ID,
                client_secret:process.env.GITHUB_CLIENT_SECRET,
                code,

            },{
                headers:{
                    Accept:"application/json",
                },
            },
        );
      const accessToken=tokenResponse.data.access_token;  
      //user info fetch from github
      const userResponse=await axios.get("https://api.github.com/user",{
        headers:{
            Authorization:`Bearer ${accessToken}`,
        },
      });
       const githubUser=userResponse.data;
      //store 
       const emailResponse=await axios.get("https://api.github.com/user/emails",{
        headers:{
            Authorization:`Bearer ${accessToken}`,
        },
      });

      const primaryEmail=emailResponse.data.find((email)=>email.primary===true);
      const email=primaryEmail?.email;
      if(!email){
        res.status(400).json({
            message:"No email found for this github user",
        })
      }
     const user=await User.findOne({email});
     if(!user){
        user=await User.create({
            name:githubUser.name || githubUser.login,
            email,
            provider:"github",
            githubId:githubUser.id.toString(),
        })
     }
     else if (!user.githubId) {
  user.githubId = githubUser.id.toString();
  await user.save();
     }
     const token=jwt.sign({
        user:user._id,
     },
    process.env.JWT_SECRET,{
        expiresIn:'7d',
    });
     return res.redirect(`http://localhost:5173/github-success?token=${token}`);
         
    }catch(error){
        res.status(500).json({
            message:"Github login Failed",
            
        });
    }
}