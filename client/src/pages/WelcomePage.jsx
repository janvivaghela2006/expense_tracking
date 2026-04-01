import { Link } from "react-router-dom";

export const WelcomePage = () => {
  return (
    <div className="welcome-shell">
      <div className="welcome-content">
        <div className="welcome-copy">
          <h1>Welcome to FinCtrl</h1>
          <p className="welcome-tagline">
            Simple tracking, smart budgeting, secure future.
          </p>
        </div>

        <div className="welcome-card">
          <h2>Select Login Type</h2>
          <div className="welcome-actions">
            <Link className="welcome-btn user-btn" to="/login?role=user">
              Login as User
            </Link>
            <Link className="welcome-btn admin-btn" to="/login?role=admin">
              Login as Admin
            </Link>
          </div>
          <p className="welcome-footer">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
