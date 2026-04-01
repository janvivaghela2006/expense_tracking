import { useState } from "react";

export const CategoryForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ name, type });
    setName("");
    setType("expense");
  };

  return (
    <form className="panel-card form-card" onSubmit={handleSubmit}>
      <div className="panel-header">
        <h3>Create Category</h3>
        <span>Add your own custom income or expense group</span>
      </div>
      <div className="form-grid">
        <label>
          Category name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Type
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="both">Both</option>
          </select>
        </label>
      </div>
      <button className="primary-btn">Add Category</button>
    </form>
  );
};
