export const StatCard = ({ label, value, tone }) => (
  <div className={`stat-card ${tone || ""}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);
