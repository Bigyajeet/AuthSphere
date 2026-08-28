import { useState } from "react";
import API from "../services/api";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/profile";
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      {error && <div className="alert-badge error">{error}</div>}

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
        <div className="label-row">
          <label className="input-label">Password</label>
          <span
            className="forgot"
            style={{ marginBottom: 0, fontSize: "12px" }}
            onClick={() => (window.location.href = "/forgot-password")}
          >
            Forgot?
          </span>
        </div>
        <div className="input-wrapper">
          <FaLock className="field-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            required
            autoComplete="current-password"
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
            <span className="spinner"></span> Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

export default LoginForm;