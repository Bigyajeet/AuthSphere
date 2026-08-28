import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await API.post(`/api/auth/reset-password/${token}`, {
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
        <h1>New Password</h1>
        <p className="auth-subtitle">
          Enter your new password below to update your account credentials.
        </p>

        {status.message && (
          <div className={`alert-badge ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="auth-form">
          <div className="input-field-group">
            <label className="input-label">New Password</label>
            <div className="input-wrapper">
              <FaLock className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password (min 6 chars)"
                value={password}
                required
                minLength={6}
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
                <span className="spinner"></span> Resetting...
              </span>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/" className="forgot" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FaArrowLeft style={{ fontSize: '11px' }} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}