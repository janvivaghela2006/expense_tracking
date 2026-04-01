import { useState } from "react";

export const TransactionForm = ({ categories, onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    categoryId: "",
    categoryName: "",
    notes: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const selectedCategory = categories.find((item) => item._id === form.categoryId);
  const showOtherBox =
    selectedCategory?.name === "Other" || (!form.categoryId && form.categoryName);

  const filteredCategories = categories.filter(
    (item) => item.type === form.type || item.type === "both"
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    const category = categories.find((item) => item._id === value);
    setForm((prev) => ({
      ...prev,
      categoryId: value,
      categoryName: category?.name === "Other" ? prev.categoryName : "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm((prev) => ({
      ...prev,
      title: "",
      amount: "",
      categoryId: "",
      categoryName: "",
      notes: "",
    }));
  };

  return (
    <form className="panel-card form-card" onSubmit={handleSubmit}>
      <div className="panel-header">
        <h3>Add Income / Expense</h3>
        <span>The dashboard dataset refreshes instantly</span>
      </div>
      <div className="form-grid">
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Amount
          <input
            name="amount"
            type="number"
            min="0"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label>
          Category
          <select name="categoryId" value={form.categoryId} onChange={handleCategoryChange}>
            <option value="">Select category</option>
            {filteredCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        {showOtherBox && (
          <label>
            Other category name
            <input
              name="categoryName"
              placeholder="Example: Medicine or Travel"
              value={form.categoryName}
              onChange={handleChange}
              required={showOtherBox}
            />
          </label>
        )}
        <label>
          Date
          <input name="date" type="date" value={form.date} onChange={handleChange} />
        </label>
        <label className="full-width">
          Notes
          <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" />
        </label>
      </div>
      <button className="primary-btn" disabled={loading}>
        {loading ? "Saving..." : "Save Transaction"}
      </button>
    </form>
  );
};
