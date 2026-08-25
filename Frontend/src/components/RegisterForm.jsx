import React, { useState } from "react";
import axios from 'axios';

function RegisterForm() {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleRegister=async(req,res)=>{
        try{
        const res=await axios.post("http://localhost:5000/api/auth/register",{
            name,
            email,
            password
        });
        localStorage.setItem("token",res.data.token);
        window.location.href="/profile";
    }catch(error){
        const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Server might be down.";

      alert(errorMessage);
    }
    }
  return (
    <div>
      <h2>Register Form</h2>
      <input 
      type="text"
       placeholder="Name" 
       value={name}
       onChange={(e)=>setName(e.target.value)}
       />
      <input type="email"
      placeholder="Email" 
        value={email}
        onChange={(e)=>setEmail(e.target.value)}/>
      <input type="password" 
      placeholder="Password"
      value={password} 
      onChange={(e)=>setPassword(e.target.value)}/>
      <button onClick={handleRegister}>Register</button>
     
    </div>
  );
}

export default RegisterForm;