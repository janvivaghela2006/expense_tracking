import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const roleHint = new URLSearchParams(location.search).get("role");
  const isAdminLogin = roleHint === "admin";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await login(form);
      if (isAdminLogin && user.role !== "admin") {
        setError("This account is not an admin account");
        return;
      }
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-shell login-shell">
      <div className="login-backdrop">
        <div className="login-rupee">₹</div>
      </div>
      <div className="auth-card">
        <h1>{isAdminLogin ? "Admin Login" : "Welcome Back"}</h1>
        <p>
          {isAdminLogin
            ? "Please enter your admin details to login."
            : "Please enter your details to login."}
        </p>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email Address
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="primary-btn">Login</button>
        </form>
        <div className="auth-links">
          <Link to="/">Back to home</Link>
          <Link to="/register">Create account</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};
