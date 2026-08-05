import React from 'react'
import { FaGoogle, FaGithub, FaFacebook, FaLinkedin } from 'react-icons/fa';

function SocialIcon() {
  return (
   <div className="social-container">
    <button className="social-btn-google">
        <FaGoogle/>
        Google Login
    </button>

     <button className="social-btn-github">
        <FaGithub/>
        Github Login
    </button>

        <button className="social-btn-facebook">
        <FaFacebook/>
        Facebook Login
    </button>

     <button className="social-btn-linkedin">
        <FaLinkedin/>
        LinkedIn Login
    </button>
   </div>
  )
}

export default SocialIcon