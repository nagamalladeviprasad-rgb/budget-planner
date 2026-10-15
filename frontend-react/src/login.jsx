
import { useState } from "react";
import { API_URLS } from "./api";

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URLS.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Check your details."
        );
      }

      if (!data.token) {
        throw new Error("The server did not return a login token.");
      }

      onLogin(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <header className="login-header">
        <div className="login-brand-icon">₹</div>
        <div>
          <h1>Budget Planner</h1>
          <p>Your money. Your goals. Your future.</p>
        </div>
      </header>

      <main className="login-layout">
        <section className="login-intro">
          <span className="login-badge">✦ SMART MONEY MANAGEMENT</span>

          <h2>
            Take control of your money.
            <span> Build a better future.</span>
          </h2>

          <p className="login-description">
            A simple and smart way to manage your personal finances.
            Track your spending, plan your savings, and make every
            rupee count.
          </p>

          <div className="login-feature-list">
            <div className="login-feature">
              <div className="feature-icon purple">↗</div>
              <div>
                <h3>Income & Expense Tracking</h3>
                <p>Know where your money goes.</p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon green">◎</div>
              <div>
                <h3>Savings Goals</h3>
                <p>Turn your dreams into achievable targets.</p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon orange">▥</div>
              <div>
                <h3>Reports & Insights</h3>
                <p>Understand monthly spending patterns.</p>
              </div>
            </div>
          </div>

          <div className="login-bottom-note">
            <span>✓</span> Your personal finances, organized in one place.
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-top-icon">👋</div>

          <h2>Welcome Back!</h2>
          <p className="login-card-subtitle">
            Sign in to continue your financial journey.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="loginEmail">Email Address</label>
            <div className="login-input-wrap">
              <span>✉</span>
              <input
                id="loginEmail"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="loginPassword">Password</label>
            <div className="login-input-wrap">
              <span>🔒</span>
              <input
                id="loginPassword"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}

            <button
              className="login-submit-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to Your Account →"}
            </button>
          </form>

          <div className="login-divider">
            <span>YOUR FINANCIAL JOURNEY STARTS HERE</span>
          </div>

          <p className="login-register-text">
            New to Budget Planner?
          </p>

          <button
            className="login-register-button"
            type="button"
            onClick={onShowRegister}
          >
            Create Your Account
          </button>

          <p className="login-card-footer">
            Spend wisely. Save consistently. Grow confidently.
          </p>
        </section>
      </main>

      <footer className="login-footer">
        © {new Date().getFullYear()} Budget Planner · Plan smarter, live better.
      </footer>
    </div>
  );
}

export default Login;
