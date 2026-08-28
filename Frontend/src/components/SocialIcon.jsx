import { GoogleLogin } from '@react-oauth/google';
import { FaGithub, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API, { API_BASE_URL } from '../services/api';

function SocialIcon() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/api/auth/google-login", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/profile");
    } catch (error) {
      console.error("Google login error:", error);
      alert(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="social-container">
      <div className="social-btn google">
        <div>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google Login Failed")}
          />
        </div>
      </div>

      <button
        type="button"
        className="social-btn github"
        onClick={() => (window.location.href = `${API_BASE_URL}/api/auth/github`)}
      >
        <FaGithub />
        Github Login
      </button>

      <button
        type="button"
        className="social-btn facebook"
        onClick={() => (window.location.href = `${API_BASE_URL}/api/auth/facebook`)}
      >
        <FaFacebook />
        Facebook Login
      </button>

      <button
        type="button"
        className="social-btn linkedin"
        onClick={() => (window.location.href = `${API_BASE_URL}/api/auth/linkedin`)}
      >
        <FaLinkedin />
        LinkedIn Login
      </button>
    </div>
  );
}

export default SocialIcon;