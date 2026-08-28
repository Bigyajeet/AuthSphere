import React, { useState } from "react";
import API from "../services/api";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/profile";
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed";

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p
        className="forgot"
        style={{ cursor: "pointer" }}
        onClick={() => (window.location.href = "/forgot-password")}
      >
        Forgot Password
      </p>
    </div>
  );
}

export default LoginForm;