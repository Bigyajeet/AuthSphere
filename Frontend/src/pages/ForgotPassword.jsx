import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!email) {
      return setStatus({ type: 'error', message: 'Please enter your email address.' });
    }

    setLoading(true);
    try {
      const res = await API.post('/api/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });

      setStatus({
        type: 'success',
        message: res.data.message || 'Password reset link sent! Check your inbox.',
      });

      setEmail('');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Failed to send reset email. Please try again.';

      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>

        {status.message && (
          <div className={`alert-badge ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="auth-form">
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-spinner-container">
                <span className="spinner"></span> Sending Link...
              </span>
            ) : (
              'Send Reset Link'
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