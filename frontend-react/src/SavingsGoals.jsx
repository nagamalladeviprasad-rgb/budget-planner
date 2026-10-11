import { useEffect, useState, useCallback } from "react";

const API_URL = "http://localhost:5000/api/savings-goals";

function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  
  // Status Management
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);       // Submission loader
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Initial fetch loader

  // Helper function to auto-clear success alerts
  const showFlashMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  // Get the login token securely
  function getToken() {
    return localStorage.getItem("budgetToken");
  }

  // Load the logged-in user's savings goals
  const loadGoals = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setGoals([]);
      setError("Please log in to view your savings goals.");
      setIsInitialLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load savings goals.");
      }

      setGoals(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Cannot connect to the backend.");
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // Add a savings goal
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const token = getToken();
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }

    const target = Number(targetAmount);
    const saved = Number(savedAmount);

    // Validation matching backend strict thresholds
    if (
      !name.trim() ||
      !Number.isFinite(target) ||
      !Number.isFinite(saved) ||
      target <= 0 ||
      saved < 0 ||
      saved > target
    ) {
      setError(
        "Enter a goal name, a positive target amount, and savings between zero and the target."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          targetAmount: target,
          savedAmount: saved,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add savings goal.");
      }

      showFlashMessage("Savings goal added successfully!");
      setName("");
      setTargetAmount("");
      setSavedAmount("");

      await loadGoals();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add savings goal.");
    } finally {
      setLoading(false);
    }
  }

  // Delete a savings goal belonging to the logged-in user
  async function deleteGoal(id) {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) {
      return;
    }

    setMessage("");
    setError("");

    const token = getToken();
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete savings goal.");
      }

      showFlashMessage("Savings goal deleted successfully!");
      await loadGoals();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete savings goal.");
    }
  }

  return (
    <section className="panel">
      <h2>🎯 Savings Goals</h2>
      <p>Set a target and track your savings progress.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="goalName">Goal Name</label>
        <input
          id="goalName"
          type="text"
          placeholder="Example: Buy a Laptop"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="targetAmount">Target Amount (₹)</label>
        <input
          id="targetAmount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Enter target amount"
          value={targetAmount}
          onChange={(event) => setTargetAmount(event.target.value)}
          required
        />

        <label htmlFor="savedAmount">Already Saved (₹)</label>
        <input
          id="savedAmount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter amount saved"
          value={savedAmount}
          onChange={(event) => setSavedAmount(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Savings Goal"}
        </button>
      </form>

      {message && <p role="status" className="success-message">{message}</p>}
      {error && <p className="error-message" role="alert">{error}</p>}

      <h3>Your Savings Goals</h3>

      {/* Added loading guard to prevent flashing empty arrays prematurely */}
      {isInitialLoading ? (
        <p>Loading savings goals...</p>
      ) : goals.length === 0 && !error ? (
        <p>No savings goals yet. Add your first goal above.</p>
      ) : (
        goals.map((goal) => {
          const target = Number(goal.targetAmount);
          const saved = Number(goal.savedAmount);
          const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
          const remaining = Math.max(target - saved, 0);

          return (
            <div className="transaction" key={goal._id}>
              <strong>{goal.name}</strong>
              <p>Target: ₹{target.toLocaleString("en-IN")}</p>
              <p>Saved: ₹{saved.toLocaleString("en-IN")}</p>
              <p>Remaining: ₹{remaining.toLocaleString("en-IN")}</p>
              <p>Progress: {progress.toFixed(1)}%</p>

              <progress
                value={progress}
                max="100"
                style={{ width: "100%", height: "18px", marginBottom: "10px" }}
              />

              <button
                type="button"
                className="delete-button"
                onClick={() => deleteGoal(goal._id)}
              >
                Delete Goal
              </button>
            </div>
          );
        })
      )}
    </section>
  );
}

export default SavingsGoals;
