import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/SendEmail.js";
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
};

export const facebookLogin=async(req,res)=>{
    const redirectUri='http://localhost:5000/api/auth/facebook/callback';
    const facebookURL=`https://www.facebook.com/dialog/oauth`+
    `?client_id=${process.env.FACEBOOK_APP_ID}`
    +`&redirect_uri=${redirectUri}`
    + `&scope=email,public_profile`;
    res.redirect(facebookURL);
}

export const facebookCallBack=async(req,res)=>{
    try{
    const {code}=req.query;
      const redirectUri='http://localhost:5000/api/auth/facebook/callback';
      const tokenResponse=await axios.get("https://graph.facebook.com/v23.0/oauth/access_token",
        {
            params:{
                client_id:process.env.FACEBOOK_APP_ID,
                client_secret:process.env.FACEBOOK_APP_SECRET,
                redirect_uri:redirectUri,
                code
            }
        },
    );
    
const accessToken=tokenResponse.data.access_token;

    const profileResponse=await axios.get("https://graph.facebook.com/me",
        {
        params:{
            fields:"id,name,email",
        access_token:accessToken
        },
    });

    const facebookUser=profileResponse.data;
    let user=await User.findOne({
        email:facebookUser.email
    });
    if(!user){
        user=await User.create({
            name:facebookUser.name,
            email:facebookUser.email,
            provider:"facebook",
            facebookId:facebookUser.id
        })
    }else if (!user.facebookId) {
  user.facebookId = facebookUser.id.toString();
  await user.save();
     }

     const token=jwt.sign({
        user:user._id
     },
    process.env.JWT_SECRET,
{expiresIn:"7d"})
res.redirect(`http://localhost:5173/facebook-success?token=${token}`)
    }catch(error){
        res.status(500).json({
            message:"Facebook Login Failed",
        });
    }
}

export const linkedinlogin=async(req,res)=>{
    const linkedinUrl=
    `https://www.linkedin.com/oauth/v2/authorization`+
    `?response_type=code` +
    `&client_id=${process.env.Linkedin_Client_ID}` +
    `&redirect_uri=http://localhost:5000/api/auth/linkedin/callback`+
    `&scope=openid profile email`;
    res.redirect(linkedinUrl);
};

export const linkedinCallback=async(req,res)=>{
  try{
      const {code}=req.query;
      if(!code){
        return res.status(400).json({
            message:'No code received from LinkedIn',
        });
      }
      const tokenResponse=await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",new URLSearchParams({
            grant_type:"authorization_code",
            code,
            redirect_uri:"http://localhost:5000/api/auth/linkedin/callback",
            client_id:process.env.Linkedin_Client_ID,
            client_secret:process.env.Linkedin_Client_Secret

        }),{
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
            },
        },
      );
      const accessToken=tokenResponse.data.access_token;
      const profileResponse=await axios.get(
        "https://api.linkedin.com/v2/userinfo",{
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        }
      )
      const linkedinUser=profileResponse.data;
     let user=await User.findOne({
        email:linkedinUser.email,
     });
     const {name,email,sub}=linkedinUser;
     if(!user){
        user=await User.create({
            name,
            email,
            provider:"LinkedIn",
            LinkedinId:sub,
        });
    }
        const token=jwt.sign({
            user:user._id
        },
    process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
    res.redirect(`http://localhost:5173/linkedin-success?token=${token}`);
     
  } catch(error){
    return res.status(500).json({
        messsage:"LinkedIn Login Failed",
    })
  }
};


export const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({
            email,
        });
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }
         const hashedPassword=await bcrypt.hash(password,10);
         const user=await User.create({
            name,
            email,
            password:hashedPassword,
            provider:"local",
         });
         const token=jwt.sign({
            user:user._id
         },
        process.env.JWT_SECRET,
    {expiresIn:"7d",

    });

    res.status(201).json({
        token,
        user
    })
    }catch(error){
      return res.status(500).json({
        message:"Registration Failed",
      });
    }
};

export const loginUser=async(req,res)=>{
    try{
     const {email,password}=req.body;
     const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"Invalid Credentials",
        });
    } 
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({
            message:"Invalid Credentials",
        })
    }
          const token=jwt.sign({
            user:user._id
         },
        process.env.JWT_SECRET,
    {expiresIn:"7d",

    });
    res.status(200).json({
        token,
        user
    }) 
}catch(error){
        return res.status(500).json({
            message:"Login Failed",
        });
    }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(rawResetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${rawResetToken}`;

    const message = `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 15 minutes.\nIf you did not request this, please ignore this email.`;

    try {
      //  Send email
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      return res.status(200).json({
        success: true,
        message: `Reset token sent to ${user.email}`,
      });
    } catch (emailError) {
    
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again later.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password',
      });
    }

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);


    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};