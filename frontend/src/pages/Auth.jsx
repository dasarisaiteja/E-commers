import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, LogIn, ArrowRight } from 'lucide-react';

export default function Auth() {
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Switch between 'login' and 'signup' modes
  const [mode, setMode] = useState('login');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract redirect target path (defaults to home)
  const from = location.state?.from || '/';

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    let result;
    if (mode === 'login') {
      result = await login(email, password);
    } else {
      result = await signup(name, email, password);
    }

    setLoading(false);
    if (result.success) {
      // Redirect back to page where checkout was triggered
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={styles.subtitle}>
            {mode === 'login' 
              ? 'Sign in to complete your purchase' 
              : 'Sign up for a secure frosted glass checkout'}
          </p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input"
                  style={styles.paddedInput}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                style={styles.paddedInput}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                style={styles.paddedInput}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="glass-btn" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              'Processing...'
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={styles.cardFooter}>
          <span style={styles.footerText}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={styles.switchBtn}
            disabled={loading}
          >
            {mode === 'login' ? 'Register here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '75vh',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '430px',
    padding: '40px 30px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.05) 100%)',
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff 40%, var(--primary-glow) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  errorAlert: {
    background: 'rgba(236, 72, 153, 0.1)',
    border: '1px solid rgba(236, 72, 153, 0.25)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#f472b6',
    fontSize: '0.9rem',
    marginBottom: '24px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.4)',
    pointerEvents: 'none',
  },
  paddedInput: {
    paddingLeft: '38px',
  },
  submitBtn: {
    marginTop: '10px',
    padding: '12px',
    fontSize: '1rem',
    width: '100%',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    marginTop: '30px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '20px',
    fontSize: '0.9rem',
  },
  footerText: {
    color: 'var(--text-muted)',
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-cyan)',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    padding: '0',
    outline: 'none',
  },
};
