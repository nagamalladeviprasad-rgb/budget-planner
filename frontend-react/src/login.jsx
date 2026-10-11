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
        throw new Error(data.message || "Login failed. Check your details.");
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
    <div className="app">
      <header className="header">
        <h1>💰 Budget Planner</h1>
        <p>Sign in to manage your money.</p>
      </header>
      <main className="container">
        <section className="panel">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="loginEmail">Email Address</label>
            <input
              id="loginEmail"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <p>
            Don't have an account?{" "}
            <button type="button" onClick={onShowRegister}>
              Register here
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;
