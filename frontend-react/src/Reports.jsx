import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { API_URLS } from "./api";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#9333ea",
  "#dc2626",
  "#0891b2",
  "#ca8a04",
];

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Added to fix flash-shifts

  useEffect(() => {
    async function loadTransactions() {
      const token = localStorage.getItem("budgetToken");

      if (!token) {
        setTransactions([]);
        setError("Please log in to view your reports.");
        setIsInitialLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URLS.transactions, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load report data.");
        }

        setTransactions(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Could not load reports. Check your backend.");
      } finally {
        setIsInitialLoading(false);
      }
    }

    loadTransactions();
  }, []);

  // Calculate expenses by category
  const categoryTotals = transactions
    .filter((item) => item.type === "expense")
    .reduce((result, item) => {
      const category = item.category || "Other";
      result[category] = (result[category] || 0) + Number(item.amount || 0);
      return result;
    }, {});

  const expenseData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // Find transactions from the current month using local calendar parameters
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = transactions.filter((item) => {
    const rawDate = item.date || item.createdAt || item.timestamp;
    if (!rawDate) return false;

    // Fix: Replace ISO string date separator dashes with slashes or append timezone to avoid UTC step-back
    let cleanDateStr = rawDate;
    if (typeof rawDate === "string" && rawDate.includes("-") && !rawDate.includes("T")) {
      cleanDateStr = rawDate.replace(/-/g, "/"); // Forces local timezone parsing initialization
    }

    const date = new Date(cleanDateStr);
    if (Number.isNaN(date.getTime())) return false;

    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyIncome = currentMonthTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const monthlyExpenses = currentMonthTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const monthlyData = [
    { name: "Income", amount: monthlyIncome },
    { name: "Expenses", amount: monthlyExpenses },
  ];

  return (
    <section className="panel">
      <h2>📊 Reports and Charts</h2>

      {error && <p className="error-message" role="alert">{error}</p>}

      {isInitialLoading && !error && <p>Loading dashboard metrics...</p>}

      {!isInitialLoading && !error && (
        <>
          <h3>Expenses by Category</h3>
          {expenseData.length === 0 ? (
            <p>No expense data available. Add an expense to see the chart.</p>
          ) : (
            <div style={{ width: "100%", height: 320, marginBottom: "20px" }}>
              <ResponsiveContainer>
                <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {expenseData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <h3>Current Month: Income vs Expenses</h3>
          <div style={{ width: "100%", height: 320, marginBottom: "25px" }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
                />
                <Legend />
                <Bar
                  dataKey="amount"
                  name="Amount (₹)"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                >
                  {/* Dynamic coloring for Income (Green) vs Expenses (Red) bars */}
                  <Cell fill="#16a34a" />
                  <Cell fill="#dc2626" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="summary-card" style={{ padding: "15px", borderRadius: "8px", background: "#f8fafc" }}>
            <h3>Monthly Summary</h3>
            <p>Total Income: <strong>₹{monthlyIncome.toLocaleString("en-IN")}</strong></p>
            <p>Total Expenses: <strong>₹{monthlyExpenses.toLocaleString("en-IN")}</strong></p>
            <p style={{ color: monthlyIncome - monthlyExpenses >= 0 ? "#16a34a" : "#dc2626" }}>
              Monthly Balance: <strong>₹{(monthlyIncome - monthlyExpenses).toLocaleString("en-IN")}</strong>
            </p>

            {monthlyExpenses > monthlyIncome && (
              <p className="error-message" style={{ color: "#dc2626", marginTop: "10px" }} role="alert">
                ⚠️ Alert: Your expenses are higher than your income this month.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default Reports;
