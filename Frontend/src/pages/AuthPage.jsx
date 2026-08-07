import React from 'react'
import SocialIcon from '../components/SocialIcon';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../index.css';

function AuthPage() {
  return (
   <div className="container">
    <div className="card">
        <h1>Authentication</h1>
        <SocialIcon/>
        <hr/>
        <LoginForm/>
        <hr />
        <RegisterForm/>

        
    </div>
   </div>
  )
}

export default AuthPage