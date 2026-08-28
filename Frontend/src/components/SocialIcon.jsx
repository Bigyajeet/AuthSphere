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
      navigate("/profile");
    } catch (error) {
      console.error("Google login error:", error);
      alert(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="social-container">
      <div className="social-google-wrapper">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert("Google Login Failed")}
          theme="filled_blue"
          shape="pill"
          size="medium"
          width="100%"
        />
      </div>

      <div className="social-grid">
        <button
          type="button"
          className="social-btn github"
          onClick={() => (window.location.href = `${API_BASE_URL}/api/auth/github`)}
        >
          <FaGithub className="social-icon-img" />
          <span>GitHub</span>
        </button>

        <button
          type="button"
          className="social-btn facebook"
          onClick={() => (window.location.href = `${API_BASE_URL}/api/auth/facebook`)}
        >
          <FaFacebook className="social-icon-img" />
          <span>Facebook</span>
        </button>

        <button
          type="button"
          className="social-btn linkedin"
          onClick={() => (window.location.href = `${API_BASE_URL}/api/auth/linkedin`)}
        >
          <FaLinkedin className="social-icon-img" />
          <span>LinkedIn</span>
        </button>
      </div>
    </div>
  );
}

export default SocialIcon;