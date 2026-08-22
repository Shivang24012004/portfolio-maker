import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api/http";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || loading) {
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Failed to create account. Please check your details."));
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-background-glow" />
      <div className="auth-card auth-card--wide">
        <div className="auth-header">
          <div className="auth-brand-icon">✨</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Portfolio Studio to build beautiful digital portfolios</p>
        </div>

        {error && (
          <div className="alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-message">{error}</div>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="first-name-input">
                First Name
              </label>
              <input
                id="first-name-input"
                type="text"
                className="form-input"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoFocus
                autoComplete="given-name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="last-name-input">
                Last Name
              </label>
              <input
                id="last-name-input"
                type="text"
                className="form-input"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password (min. 6 characters)
            </label>
            <div className="password-input-wrapper">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone-input">
              Phone Number <span className="label-optional">(optional)</span>
            </label>
            <input
              id="phone-input"
              type="tel"
              className="form-input"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-content">
                <span className="spinner-sm" /> Creating account…
              </span>
            ) : (
              "Get Started"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-switch-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

