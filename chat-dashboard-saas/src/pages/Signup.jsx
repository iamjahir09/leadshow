import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api.js";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    chatwoot_url: "",
    account_id: "",
    access_token: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signup(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Chat<span>Desk</span></h1>
          <p>Create your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Min 6 characters"
              required
            />
          </div>

          <div className="form-divider"><span>Chatwoot Credentials</span></div>

          <div className="form-group">
            <label>Chatwoot URL</label>
            <input
              type="url"
              name="chatwoot_url"
              value={form.chatwoot_url}
              onChange={onChange}
              placeholder="https://app.chatwoot.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Account ID</label>
            <input
              type="text"
              name="account_id"
              value={form.account_id}
              onChange={onChange}
              placeholder="e.g. 155702"
              required
            />
          </div>

          <div className="form-group">
            <label>Access Token</label>
            <input
              type="text"
              name="access_token"
              value={form.access_token}
              onChange={onChange}
              placeholder="Your Chatwoot API access token"
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Verifying & Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{" "}
          <a onClick={() => navigate("/login")}>Login</a>
        </div>
      </div>
    </div>
  );
}
