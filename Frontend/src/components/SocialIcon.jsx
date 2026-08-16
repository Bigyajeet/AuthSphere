import { GoogleLogin } from '@react-oauth/google';
import React from 'react';
import axios from 'axios';
import { FaGoogle, FaGithub, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


function SocialIcon() {
   const navigate=useNavigate();
    const handleGoogleSuccess=async(credentialResponse)=>{
         
        try{
            const res=await axios.post("http://localhost:5000/api/auth/google-login",{
                token:credentialResponse.credential
            })
            console.log(res);
            
            // console.log(credentialResponse);
            localStorage.setItem("token",res.data.token);
            alert("login successfully");
            navigate("/profile");
        }catch(error){
            console.log(error);
            alert("login failed");
        }
    }
  return (
   <div className="social-container">
   <div className="social-btn google">
    <div>
        <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={()=>alert("Login Failed")}
        />
    </div>
   </div>
  
   

     <button className="social-btn github"
     onClick={
        ()=>(window.location.href = "http://localhost:5000/api/auth/github")
     }>
        <FaGithub/>
        Github Login
    </button>

        <button className="social-btn facebook">
        <FaFacebook/>
        Facebook Login
    </button>

     <button className="social-btn linkedin">
        <FaLinkedin/>
        LinkedIn Login
    </button>
   </div>
  )
}

export default SocialIcon