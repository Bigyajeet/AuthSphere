import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FaEnvelope, FaKey } from "react-icons/fa";

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

  const handleSentotp = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!email) {
      return setMessage({ text: "Please enter your email address.", type: "error" });
    }

    setSendingOtp(true);
    try {
      const res = await API.post("/api/auth/sent-otp", { email: email.trim().toLowerCase() });
      setMessage({
        text: res.data.message || "OTP code sent to your email!",
        type: "success",
      });
      setOtpSent(true);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to send OTP email.",
        type: "error",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyotp = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!email || !otp) {
      return setMessage({ text: "Please enter both email and 6-digit OTP code.", type: "error" });
    }

    setVerifyingOtp(true);
    try {
      const res = await API.post("/api/auth/verify-otp", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      navigate("/profile", { replace: true });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "OTP verification failed.",
        type: "error",
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="otp-container">
      {message.text && (
        <div className={`alert-badge ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="input-field-group">
        <label className="input-label">Registered Email</label>
        <div className="input-wrapper">
          <FaEnvelope className="field-icon" />
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            disabled={sendingOtp}
          />
        </div>
        <button
          type="button"
          onClick={handleSentotp}
          disabled={sendingOtp || !email}
          className="secondary-btn"
          style={{ marginTop: "6px" }}
        >
          {sendingOtp ? "Sending OTP..." : otpSent ? "Resend OTP Code" : "Request OTP Code"}
        </button>
      </div>

      <div className="input-field-group" style={{ marginTop: "18px" }}>
        <label className="input-label">6-Digit Verification OTP Code</label>
        <div className="input-wrapper">
          <FaKey className="field-icon" />
          <input
            type="text"
            maxLength="6"
            placeholder="123456"
            value={otp}
            className="otp-input"
            onChange={(e) => setOtp(e.target.value.trim())}
            disabled={verifyingOtp}
          />
        </div>
        <button
          type="button"
          onClick={handleVerifyotp}
          disabled={verifyingOtp || otp.length !== 6}
          className="submit-btn"
          style={{ marginTop: "10px" }}
        >
          {verifyingOtp ? (
            <span className="btn-spinner-container">
              <span className="spinner"></span> Verifying...
            </span>
          ) : (
            "Verify & Sign In"
          )}
        </button>
      </div>
    </div>
  );
}

export default LoginOTP;