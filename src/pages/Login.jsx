import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../api/auth";
import { useAuth } from "../context/authContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthed } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, don't show login page
  useEffect(() => {
    console.log('Login useEffect - isAuthed:', isAuthed);
    if (isAuthed) {
      console.log('Redirecting to profile from Login');
      navigate("/profile", { replace: true });
    }
  }, [isAuthed, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter username/email and password.");
      return;
    }

    try {
      setLoading(true);
      const jwt = await signin(identifier.trim(), password);
      login(jwt);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth-center">
      <div className="card auth-card" style={{ maxWidth: 420, width: '100%' }}>
        <h3 style={{ marginTop: 0 }}>Sign in</h3>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label className="small form-label">Username or Email</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="username or email"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="small form-label">Password</label>
            <div className="password-field">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="password"
                autoComplete="current-password"
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button className="primary" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
