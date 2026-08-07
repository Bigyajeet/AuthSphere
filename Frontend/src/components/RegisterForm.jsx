import React from "react";

function RegisterForm() {
  return (
    <div>
      <h2>Register with OTP</h2>
      <input type="email" placeholder="Email" />
      <button>Send OTP</button>
      <input type="text" placeholder="Enter OTP" />
      <button>Verify OTP</button>
    </div>
  );
}

export default RegisterForm;