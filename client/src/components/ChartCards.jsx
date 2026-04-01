import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#1d4ed8", "#15803d", "#b91c1c", "#7c3aed", "#0f766e", "#f59e0b"];

export const OverviewChart = ({ rows }) => {
  const grouped = rows.reduce((acc, item) => {
    const bucket = acc[item.label] || { label: item.label, income: 0, expense: 0 };
    bucket[item.type] = item.total;
    acc[item.label] = bucket;
    return acc;
  }, {});

  const data = Object.values(grouped);

  return (
    <div className="panel-card chart-card">
      <div className="panel-header">
        <h3>Financial Overview</h3>
        <span>Monthly income and expense chart</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#15803d" radius={[10, 10, 0, 0]} />
          <Bar dataKey="expense" fill="#b91c1c" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ExpensePieChart = ({
  rows,
  title = "Expense Breakdown",
  subtitle = "Know where your money is going",
}) => (
  <div className="panel-card chart-card">
    <div className="panel-header">
      <h3>{title}</h3>
      <span>{subtitle}</span>
    </div>
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100}>
          {rows.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
