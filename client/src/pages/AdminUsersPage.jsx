import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { Layout } from "../components/Layout.jsx";

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    const { data } = await api.get("/admin/users");
    setUsers(data);
  };

  useEffect(() => {
    loadUsers().catch(() => setError("Failed to load users"));
  }, []);

  const handleUpdate = async (user) => {
    setMessage("");
    setError("");

    try {
      await api.put(`/admin/users/${user._id}`, user);
      setMessage("User updated");
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const handleFieldChange = (id, key, value) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === id ? { ...user, [key]: value } : user))
    );
  };

  return (
    <Layout title="Manage Users" subtitle="Admin can view user details and edit role or status.">
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <div className="table-card">
        <div className="table-head">
          <h3>User Details</h3>
          <span>Edit and save each user row</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <span>{user.name}</span>
                  </td>
                  <td>
                    <span>{user.email}</span>
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleFieldChange(user._id, "role", e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={String(user.isActive)}
                      onChange={(e) =>
                        handleFieldChange(user._id, "isActive", e.target.value === "true")
                      }
                    >
                      <option value="true">active</option>
                      <option value="false">inactive</option>
                    </select>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="secondary-btn" onClick={() => handleUpdate(user)}>
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
