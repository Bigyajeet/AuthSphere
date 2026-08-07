import React from "react";

function LoginForm() {
  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Login</button>
      <p className="forgot">Forgot Password</p>
    </div>
  );
}

export default LoginForm;