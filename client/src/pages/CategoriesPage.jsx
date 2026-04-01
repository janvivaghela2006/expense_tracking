import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { CategoryForm } from "../components/CategoryForm.jsx";
import { Layout } from "../components/Layout.jsx";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data);
  };

  useEffect(() => {
    loadCategories().catch(() => setError("Failed to load categories"));
  }, []);

  const handleCreate = async (payload) => {
    setMessage("");
    setError("");

    try {
      await api.post("/categories", payload);
      await loadCategories();
      setMessage("Category created");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create category");
    }
  };

  return (
    <Layout title="Categories" subtitle="Manage expense and income categories, including custom ones.">
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <section className="dashboard-grid wide">
        <CategoryForm onSubmit={handleCreate} />
        <div className="panel-card">
          <div className="panel-header">
            <h3>Category List</h3>
            <span>Default and custom categories for this user</span>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <div key={category._id} className="category-item">
                <strong>{category.name}</strong>
                <span>{category.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};
