import React ,{useState}from "react";
import axios from "axios";

function LoginForm() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const handleLogin=async(req,res)=>{
    try{
    const res=await axios.post("http://localhost:5000/api/auth/login",{
      email,
      password
    });
    localStorage.setItem("token",res.data.token);
    window.location.href="/profile"
  }
catch(error){
        const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed";

      alert(errorMessage);
    }
  }
  return (
    <div>
      <h2>Login</h2>
      <input type="email" 
      placeholder="Email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" 
      value={password}
      onChange={(e)=>setPassword(e.target.value)}/>
      <button
      onClick={handleLogin}>Login</button>
      <p className="forgot">Forgot Password</p>
    </div>
  );
}

export default LoginForm;