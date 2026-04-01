const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const TransactionTable = ({ rows, onDelete }) => {
  if (!rows?.length) {
    return <div className="empty-card">No transactions yet. Add income or expense to see data here.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-head">
        <h3>All Transactions</h3>
        <span>Dataset updates after each entry</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id}>
                <td>{row.title}</td>
                <td>
                  <span className={`pill ${row.type}`}>{row.type}</span>
                </td>
                <td>{row.categoryLabel}</td>
                <td>{new Date(row.date).toLocaleDateString()}</td>
                <td className={row.type === "income" ? "positive" : "negative"}>
                  {row.type === "income" ? "+" : "-"} {formatCurrency(row.amount)}
                </td>
                <td>
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => onDelete(row)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
