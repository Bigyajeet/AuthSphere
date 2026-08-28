import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function LoginOTP({ email: propEmail = "", setEmail: propSetEmail } = {}) {
  const [email, setEmailState] = useState(propEmail);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleEmailChange = (val) => {
    setEmailState(val);
    if (propSetEmail) propSetEmail(val);
    if (otpSent) setOtpSent(false);
  };

  // Send OTP
  const handleSentotp = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!email) {
      return setMessage({ text: "Please enter your email", type: "error" });
    }

    setSendingOtp(true);
    try {
      const res = await API.post("/api/auth/sent-otp", { email: email.trim().toLowerCase() });
      setMessage({
        text: res.data.message || "OTP sent successfully to your email!",
        type: "success",
      });
      setOtpSent(true);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to send OTP",
        type: "error",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP
  const handleVerifyotp = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!email || !otp) {
      return setMessage({ text: "Please enter both email and OTP", type: "error" });
    }

    setVerifyingOtp(true);
    try {
      const res = await API.post("/api/auth/verify-otp", { email: email.trim().toLowerCase(), otp: otp.trim() });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/profile", { replace: true });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Verifying OTP failed",
        type: "error",
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Verify & Sign In</h2>
      <p className="auth-subtitle">Enter the OTP sent to your email.</p>

      {message.text && (
        <div
          style={{
            padding: "10px",
            marginBottom: "16px",
            borderRadius: "6px",
            fontSize: "14px",
            textAlign: "center",
            backgroundColor: message.type === "error" ? "#ef444422" : "#22c55e22",
            color: message.type === "error" ? "#f87171" : "#4ade80",
            border: `1px solid ${message.type === "error" ? "#ef4444" : "#22c55e"}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Email Input */}
      <div className="input-group">
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={sendingOtp}
          className="auth-input"
        />
        <button
          type="button"
          onClick={handleSentotp}
          disabled={sendingOtp || !email}
          className="auth-btn"
          style={{ marginTop: "8px" }}
        >
          {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
        </button>
      </div>

      {/* OTP Section */}
      <div className="input-group" style={{ marginTop: "16px" }}>
        <input
          type="text"
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.trim())}
          disabled={verifyingOtp}
          className="auth-input"
        />
        <button
          type="button"
          onClick={handleVerifyotp}
          disabled={verifyingOtp || otp.length !== 6}
          className="auth-btn"
          style={{ marginTop: "8px" }}
        >
          {verifyingOtp ? "Verifying..." : "Verify & Login"}
        </button>
      </div>

      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <Link to="/" style={{ color: "#818cf8", fontSize: "14px", textDecoration: "none" }}>
          ← Back to Password Login
        </Link>
      </div>
    </div>
  );
}

export default LoginOTP;