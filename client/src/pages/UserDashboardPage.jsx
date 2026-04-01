import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { Layout } from "../components/Layout.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { ExpensePieChart, OverviewChart } from "../components/ChartCards.jsx";
import { TransactionForm } from "../components/TransactionForm.jsx";
import { TransactionTable } from "../components/TransactionTable.jsx";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const UserDashboardPage = () => {
  const [summary, setSummary] = useState({
    totals: { totalIncome: 0, totalExpense: 0, balance: 0 },
    recentTransactions: [],
    allTransactions: [],
    monthlyData: [],
    categoryBreakdown: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    const [summaryRes, categoriesRes] = await Promise.all([
      api.get("/transactions/summary/dashboard"),
      api.get("/categories"),
    ]);

    setSummary(summaryRes.data);
    setCategories(categoriesRes.data);
  };

  useEffect(() => {
    loadData().catch(() => setError("Failed to load dashboard"));
  }, []);

  const handleDelete = async (transaction) => {
    const confirmed = window.confirm(`Delete "${transaction.title}"?`);

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await api.delete(`/transactions/${transaction._id}`);
      await loadData();
      setMessage("Transaction deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete transaction");
    }
  };

  const handleSubmit = async (payload) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.post("/transactions", payload);
      await loadData();
      setMessage("Transaction saved successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Dashboard"
      subtitle="Track balance, income, expense, categories, tables, and charts in one place."
    >
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <section className="stats-grid">
        <StatCard label="Total Balance" value={formatCurrency(summary.totals.balance)} tone="blue" />
        <StatCard label="Total Income" value={formatCurrency(summary.totals.totalIncome)} tone="green" />
        <StatCard label="Total Expense" value={formatCurrency(summary.totals.totalExpense)} tone="red" />
      </section>

      <section className="dashboard-grid">
        <div className="panel-card recent-card">
          <div className="panel-header">
            <h3>Recent Transactions</h3>
            <span>Latest entries from your dataset</span>
          </div>
          <div className="recent-list">
            {summary.recentTransactions.length ? (
              summary.recentTransactions.map((item) => (
                <div key={item._id} className="recent-item">
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      {item.categoryLabel} | {new Date(item.date).toLocaleDateString()}
                    </small>
                  </div>
                  <span className={item.type === "income" ? "positive" : "negative"}>
                    {item.type === "income" ? "+" : "-"} {formatCurrency(item.amount)}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-inline">No recent transactions yet.</div>
            )}
          </div>
        </div>
        <ExpensePieChart rows={summary.categoryBreakdown} />
      </section>

      <section className="dashboard-grid wide">
        <TransactionForm categories={categories} onSubmit={handleSubmit} loading={loading} />
        <OverviewChart rows={summary.monthlyData} />
      </section>

      <TransactionTable rows={summary.allTransactions} onDelete={handleDelete} />
    </Layout>
  );
};
