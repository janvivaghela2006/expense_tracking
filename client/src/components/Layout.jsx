import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Sidebar } from "./Sidebar.jsx";

export const Layout = ({ title, subtitle, children }) => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <Sidebar isAdmin={auth?.role === "admin"} />
      <main className="main-panel">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="topbar-actions">
            <div className="user-pill">
              <span>{auth?.name?.[0] || "U"}</span>
              <div>
                <strong>{auth?.name}</strong>
                <small>{auth?.role}</small>
              </div>
            </div>
            <button className="secondary-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};
