import { NavLink } from "react-router-dom";

export const Sidebar = ({ isAdmin }) => {
  const userLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/categories", label: "Categories" },
  ];

  const adminLinks = [
    { to: "/admin", label: "Admin Dashboard" },
    { to: "/admin/users", label: "Users" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">Money Manager</div>
        <p className="sidebar-caption">{isAdmin ? "Admin panel" : "User panel"}</p>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
