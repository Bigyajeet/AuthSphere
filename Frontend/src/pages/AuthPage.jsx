import React, { useState } from 'react';
import SocialIcon from '../components/SocialIcon';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import LoginOTP from '../components/LoginOTP';
import '../index.css';

const AUTH_CONFIG = {
  login: {
    title: 'Welcome Back',
    subtitle: 'Sign in to access your profile.',
    toggleText: "Don't have an account?",
    toggleAction: 'Create one',
  },
  register: {
    title: 'Create Account',
    subtitle: 'Enter your details to register a new workspace.',
    toggleText: 'Already have an account?',
    toggleAction: 'Sign in',
  },
  otp: {
    title: 'Verify & Sign In',
    subtitle: (email) => `Enter the OTP sent to ${email || 'your email'}.`,
  },
};

export default function AuthPage() {
  const [authMode, setAuthMode] = useState('login'); 
  const [targetEmail, setTargetEmail] = useState('');

  const handleRegistrationSuccess = (email) => {
    setTargetEmail(email);
    setAuthMode('otp');
  };

  const isOtp = authMode === 'otp';
  const config = AUTH_CONFIG[authMode];

  return (
    <div className="container">
      <div className="card">
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1>{config.title}</h1>
          <p className="auth-subtitle">
            {typeof config.subtitle === 'function'
              ? config.subtitle(targetEmail)
              : config.subtitle}
          </p>
        </div>

        
        {!isOtp && (
          <div className="auth-tab-group">
            {['login', 'register'].map((mode) => (
              <button
                key={mode}
                type="button"
                className={`auth-tab ${authMode === mode ? 'active' : ''}`}
                onClick={() => setAuthMode(mode)}
              >
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        {/* Active Forms */}
        <div className="auth-form-container">
          {authMode === 'login' && (
            <div>
              <LoginForm />
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button
                  type="button"
                  className="forgot"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    width: 'auto',
                    boxShadow: 'none',
                    display: 'inline',
                    transform: 'none',
                  }}
                  onClick={() => setAuthMode('otp')}
                >
                  🔑 Sign in with OTP instead
                </button>
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <RegisterForm onRegisterSuccess={handleRegistrationSuccess} />
          )}

          {isOtp && (
            <div>
              <LoginOTP 
                email={targetEmail} 
                setEmail={setTargetEmail} 
              />
              <div className="auth-footer" style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="forgot"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    width: 'auto',
                    boxShadow: 'none',
                    display: 'inline',
                    transform: 'none',
                  }}
                  onClick={() => setAuthMode('login')}
                >
                  ← Back to Password Login
                </button>
              </div>
            </div>
          )}
        </div>

      
        {!isOtp && (
          <>
            <div className="auth-divider">
              <span>or continue with</span>
            </div>
            <SocialIcon />
            <div className="auth-footer">
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                {config.toggleText}{' '}
              </span>
              <button
                type="button"
                className="forgot"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  width: 'auto',
                  boxShadow: 'none',
                  display: 'inline',
                  transform: 'none',
                }}
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              >
                {config.toggleAction}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}