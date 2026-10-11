import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import SavingsGoals from "./SavingsGoals";
import Reports from "./Reports";
import "./App.css";

const API_URL = "http://localhost:5000/api/transactions";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("budgetUser")) || null;
    } catch {
      return null;
    }
  });

  const [showRegister, setShowRegister] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function handleLogin(data) {
    if (data?.token && data?.user) {
      localStorage.setItem("budgetToken", data.token);
      localStorage.setItem("budgetUser", JSON.stringify(data.user));
      setUser(data.user);
    }
  }

  function handleLogout() {
    localStorage.removeItem("budgetToken");
    localStorage.removeItem("budgetUser");
    setUser(null);
    setTransactions([]);
    setMessage("");
    setError("");
  }

  async function loadTransactions() {
    const token = localStorage.getItem("budgetToken");
    if (!token) return;

    try {
      const response = await fetch(API_URL, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Could not load transactions.");
      }

      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not connect to the backend.");
    }
  }

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !description.trim() ||
      !category.trim() ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      setError("Please enter valid transaction details.");
      return;
    }

    const token = localStorage.getItem("budgetToken");
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          description: description.trim(),
          amount: Number(amount),
          type,
          category: category.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add transaction.");
      }

      setMessage("Transaction added successfully!");
      setDescription("");
      setAmount("");
      setType("income");
      setCategory("");

      await loadTransactions();
    } catch (err) {
      setError(err.message || "Failed to add transaction.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTransaction(id) {
    if (!window.confirm("Delete this transaction?")) return;

    setMessage("");
    setError("");

    const token = localStorage.getItem("budgetToken");
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete transaction.");
      }

      setMessage("Transaction deleted successfully!");
      await loadTransactions();
    } catch (err) {
      setError(err.message || "Failed to delete transaction.");
    }
  }

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegister={(data) => {
            handleLogin(data);
            setShowRegister(false);
          }}
          onShowLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="app">
      <header className="header">
        <h1>💰 Budget Planner</h1>
        <p>Welcome, {user.name || user.email || "User"}!</p>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="container">
        {error && <p className="error-message" role="alert">{error}</p>}
        {message && <p className="success-message" role="status">{message}</p>}

        <section className="dashboard">
          <div className="card">
            <h3>Total Income</h3>
            <p>₹{totalIncome.toLocaleString("en-IN")}</p>
          </div>

          <div className="card">
            <h3>Total Expenses</h3>
            <p>₹{totalExpenses.toLocaleString("en-IN")}</p>
          </div>

          <div className="card">
            <h3>Balance</h3>
            <p>₹{balance.toLocaleString("en-IN")}</p>
          </div>
        </section>

        <section className="panel">
          <h2>➕ Add Transaction</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Example: Salary or Food"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <label htmlFor="type">Transaction Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              placeholder="Example: Salary, Food, Travel"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Transaction"}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>📋 Transactions</h2>

          {transactions.length === 0 && (
            <p>No transactions yet. Add your first transaction above.</p>
          )}

          {transactions.map((item) => (
            <div className="transaction" key={item._id || item.id}>
              <strong>{item.description}</strong>
              <p>Amount: ₹{Number(item.amount).toLocaleString("en-IN")}</p>
              <p>Type: {item.type}</p>
              <p>Category: {item.category}</p>

              <button
                type="button"
                className="delete-button"
                onClick={() => deleteTransaction(item._id || item.id)}
              >
                Delete Transaction
              </button>
            </div>
          ))}
        </section>

        {/* Pass down required variables if your child components need them */}
        <SavingsGoals token={localStorage.getItem("budgetToken")} />
        <Reports transactions={transactions} />
      </main>
    </div>
  );
}

export default App;
