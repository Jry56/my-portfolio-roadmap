import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Seo from '../seo/Seo';
import BrandMark from '../components/BrandMark';
import '../styles/auth.css';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'We could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <Seo
        title="Create your account"
        description="Create a free Chatter account and start messaging in seconds."
        path="/register"
      />
      <div className="auth-panel">
        <div className="auth-brand">
          <BrandMark size={32} />
          <span>Chatter</span>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <h1>Create your account</h1>
          <p style={{ color: 'var(--slate)', marginBottom: 28 }}>
            It takes less than a minute.
          </p>

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={60}
              value={form.name}
              onChange={updateField('name')}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={updateField('email')}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={updateField('password')}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>At least 8 characters.</span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <div className="auth-hero" aria-hidden="true">
        <h1>Set up in seconds. Stay in sync everywhere.</h1>
        <p>
          One account, every device. Chatter picks up exactly where you left off, with delivery
          and read status you can actually trust.
        </p>
        <div className="auth-hero-mark">
          <BrandMark size={220} />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
