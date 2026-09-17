import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Seo from '../seo/Seo';
import BrandMark from '../components/BrandMark';
import '../styles/auth.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/app';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'We could not sign you in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <Seo
        title="Sign in"
        description="Sign in to Chatter to pick up your conversations right where you left off."
        path="/login"
      />
      <div className="auth-panel">
        <div className="auth-brand">
          <BrandMark size={32} />
          <span>Chatter</span>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <h1>Welcome back</h1>
          <p style={{ color: 'var(--slate)', marginBottom: 28 }}>
            Sign in to keep the conversation going.
          </p>

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="auth-switch">
          New to Chatter? <Link to="/register">Create an account</Link>
        </p>
      </div>

      <div className="auth-hero" aria-hidden="true">
        <h1>Every conversation, delivered the moment it happens.</h1>
        <p>
          Chatter keeps your messages in sync across devices, shows you who&rsquo;s online, and
          never makes you wonder if a message went through.
        </p>
        <div className="auth-hero-mark">
          <BrandMark size={220} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
