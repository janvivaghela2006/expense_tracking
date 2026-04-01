import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setResetUrl("");

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
      setResetUrl(data.resetUrl || "");
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Forgot password</h1>
        <p>Enter your email to receive a reset link.</p>
        {message && <div className="alert success">{message}</div>}
        {resetUrl && (
          <div className="alert success">
            Development reset link: <a href={resetUrl}>{resetUrl}</a>
          </div>
        )}
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <button className="primary-btn">Send reset link</button>
        </form>
        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
};
