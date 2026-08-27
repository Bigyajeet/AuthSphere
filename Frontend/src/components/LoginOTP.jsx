import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Send OTP
  const handleSentotp = async (e) => {
    e.preventDefault();
    if (!email) {
      return alert("Please enter your email");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/sent-otp", {
        email,
      });
      alert(res.data.message || "OTP sent successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyotp = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      return alert("Please enter both email and OTP");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      alert(res.data.message || "OTP verification successful!");
      
      
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Verifying OTP failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login with OTP</h2>
      
      {/* Email Section */}
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button 
        type="button" 
        onClick={handleSentotp} 
        disabled={loading}
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>

      {/* OTP Section */}
      <input
        type="text"
        maxLength="6"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button 
        type="button" 
        onClick={handleVerifyotp} 
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}

export default LoginOTP;