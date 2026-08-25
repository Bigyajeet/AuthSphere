import React from 'react'
import SocialIcon from '../components/SocialIcon';
import LoginForm from '../components/LoginForm';
import RegisterOTP from '../components/RegisterOTP';
import '../index.css';
import RegisterForm from '../components/RegisterForm';
function AuthPage() {
  return (
   <div className="container">
    <div className="card">
        <h1>Authentication</h1>
        <SocialIcon/>
        <hr/>
        <RegisterForm/>
        <hr/>
        <LoginForm/>
        <hr />
        <RegisterOTP/>

        
    </div>
   </div>
  )
}

export default AuthPage