import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!password) {
      return setStatus({ type: 'error', message: 'Please enter a new password.' });
    }

    if (password.length < 6) {
      return setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
    }

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password,
      });

      setStatus({
        type: 'success',
        message: res.data.message || 'Password reset successfully! Redirecting...',
      });

      setPassword("");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password. The link may be invalid or expired.";

      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">
          Enter your new password below to update your account credentials.
        </p>

        {status.message && (
          <div className={`alert-badge ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <label className="input-label">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/" className="forgot">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}