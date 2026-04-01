import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export const ProtectedRoute = ({ role }) => {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (role && auth.role !== role) {
    return <Navigate to={auth.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <Outlet />;
};
