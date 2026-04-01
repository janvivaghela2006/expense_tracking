import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { Layout } from "../components/Layout.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { ExpensePieChart } from "../components/ChartCards.jsx";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    activeUserCount: 0,
    transactionCount: 0,
    totalIncome: 0,
    totalExpense: 0,
    platformBalance: 0,
    roleDistribution: [],
    monthlyUsers: [],
  });

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <Layout
      title="Admin Dashboard"
      subtitle="Monitor users, activity, total transactions, and platform-level finance data."
    >
      <section className="stats-grid">
        <StatCard label="Users" value={stats.userCount} tone="blue" />
        <StatCard label="Active Users" value={stats.activeUserCount} tone="green" />
        <StatCard label="Transactions" value={stats.transactionCount} tone="gold" />
        <StatCard label="Income" value={formatCurrency(stats.totalIncome)} tone="green" />
        <StatCard label="Expense" value={formatCurrency(stats.totalExpense)} tone="red" />
        <StatCard label="Net Balance" value={formatCurrency(stats.platformBalance)} tone="blue" />
      </section>

      <section className="dashboard-grid">
        <div className="panel-card chart-card">
          <div className="panel-header">
            <h3>User Growth</h3>
            <span>Monthly registered users</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.monthlyUsers}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#1d4ed8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ExpensePieChart
          rows={stats.roleDistribution}
          title="Role Distribution"
          subtitle="User vs admin account split"
        />
      </section>
    </Layout>
  );
};
