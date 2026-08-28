import { useState } from "react";
import API from "../services/api";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/auth/register", {
        name,
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/profile";
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="auth-form">
      {error && <div className="alert-badge error">{error}</div>}

      <div className="input-field-group">
        <label className="input-label">Full Name</label>
        <div className="input-wrapper">
          <FaUser className="field-icon" />
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            required
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div className="input-field-group">
        <label className="input-label">Email Address</label>
        <div className="input-wrapper">
          <FaEnvelope className="field-icon" />
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            required
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="input-field-group">
        <label className="input-label">Password</label>
        <div className="input-wrapper">
          <FaLock className="field-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            required
            minLength={6}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? (
          <span className="btn-spinner-container">
            <span className="spinner"></span> Creating Account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}

export default RegisterForm;