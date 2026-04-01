import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.jsx";
import { AdminUsersPage } from "./pages/AdminUsersPage.jsx";
import { CategoriesPage } from "./pages/CategoriesPage.jsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { ResetPasswordPage } from "./pages/ResetPasswordPage.jsx";
import { UserDashboardPage } from "./pages/UserDashboardPage.jsx";
import { WelcomePage } from "./pages/WelcomePage.jsx";

export default function App() {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          auth?.token ? (
            <Navigate to={auth.role === "admin" ? "/admin" : "/dashboard"} replace />
          ) : (
            <WelcomePage />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
}
