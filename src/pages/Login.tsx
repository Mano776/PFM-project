import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Please enter your details to sign in.</p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            {error.replace('Firebase: ', '').replace(/ \(auth.*\)\.?/, '')}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, styles.input)}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>PASSWORD</label>
              <Link to="/forgot-password" style={styles.forgot}>Forgot?</Link>
            </div>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.currentTarget.style, styles.input)}
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.primaryBtn, opacity: 0.75 } : styles.primaryBtn}
            onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, styles.primaryBtnHover)}
            onMouseLeave={(e) => !loading && Object.assign(e.currentTarget.style, styles.primaryBtn)}
          >
            {loading ? 'Signing in…' : (
              <>Sign In &nbsp;<span style={{ fontSize: '1.1rem' }}>→</span></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>OR CONTINUE WITH</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Google */}
        <button
          id="login-google"
          type="button"
          onClick={handleGoogle}
          style={styles.googleBtn}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.googleBtnHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.googleBtn)}
        >
          <GoogleIcon />
          <span style={{ fontWeight: 600, color: '#1a1a2e' }}>Google Account</span>
        </button>

        {/* Footer */}
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.footerLink}>Sign Up Instead</Link>
        </p>
      </div>
    </div>
  );
};

/* ── Google SVG Icon ────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.2 0 5.9 1.1 8.1 2.9l6-6C34.5 3.1 29.6 1 24 1 14.7 1 6.7 6.7 3.2 14.8l7 5.4C12 14.2 17.5 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z"/>
    <path fill="#FBBC05" d="M10.2 28.7A14.4 14.4 0 0 1 9.5 24c0-1.6.3-3.2.7-4.7l-7-5.4A23.8 23.8 0 0 0 0 24c0 3.9.9 7.6 2.5 10.9l7.7-6.2z"/>
    <path fill="#34A853" d="M24 47c6 0 11-2 14.7-5.3l-7.4-5.7c-2 1.4-4.6 2.2-7.3 2.2-6.5 0-12-4.7-13.9-11l-7.7 6.2C6.5 41.2 14.7 47 24 47z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

/* ── Styles ──────────────────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0f2ff 0%, #fafaff 50%, #eef0ff 100%)',
    padding: '24px 16px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 8px 48px rgba(99, 82, 255, 0.10), 0 2px 12px rgba(0,0,0,0.06)',
    padding: '48px 44px 40px',
    width: '100%',
    maxWidth: '460px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#0f1324',
    margin: '0 0 8px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: 0,
  },
  errorBox: {
    background: '#fff0f0',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '0.85rem',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#374151',
    textTransform: 'uppercase' as const,
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgot: {
    fontSize: '0.83rem',
    fontWeight: 600,
    color: '#5b4ef8',
    textDecoration: 'none',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#f3f4f8',
    border: '1.5px solid transparent',
    borderRadius: '12px',
    padding: '0 16px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  icon: {
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '0.95rem',
    color: '#1a1a2e',
    padding: '14px 0',
    minWidth: 0,
  } as React.CSSProperties,
  inputFocus: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '0.95rem',
    color: '#1a1a2e',
    padding: '14px 0',
    minWidth: 0,
  } as React.CSSProperties,
  primaryBtn: {
    marginTop: '8px',
    width: '100%',
    padding: '15px 24px',
    background: 'linear-gradient(135deg, #5b4ef8 0%, #7c6df8 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 6px 24px rgba(91, 78, 248, 0.35)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    letterSpacing: '0.01em',
  },
  primaryBtnHover: {
    marginTop: '8px',
    width: '100%',
    padding: '15px 24px',
    background: 'linear-gradient(135deg, #4a3de0 0%, #6a5cf8 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 8px 32px rgba(91, 78, 248, 0.50)',
    transform: 'translateY(-1px)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    letterSpacing: '0.01em',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '28px 0 20px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#e5e7eb',
    display: 'block',
  },
  dividerText: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#9ca3af',
    whiteSpace: 'nowrap' as const,
  },
  googleBtn: {
    width: '100%',
    padding: '13px 24px',
    background: '#f9fafb',
    border: '1.5px solid #e5e7eb',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: '#1a1a2e',
    transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
    boxShadow: 'none',
  },
  googleBtnHover: {
    width: '100%',
    padding: '13px 24px',
    background: '#fff',
    border: '1.5px solid #c4b8ff',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: '#1a1a2e',
    transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
    boxShadow: '0 2px 12px rgba(91, 78, 248, 0.12)',
  },
  footer: {
    textAlign: 'center' as const,
    fontSize: '0.9rem',
    color: '#6b7280',
    marginTop: '24px',
  },
  footerLink: {
    color: '#5b4ef8',
    fontWeight: 700,
    textDecoration: 'none',
  },
};

export default Login;
