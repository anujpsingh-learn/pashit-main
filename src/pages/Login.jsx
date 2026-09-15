import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupRegNo, setSignupRegNo] = useState('');
  const [signupHostel, setSignupHostel] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMsg('Please provide your email/reg number and password.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await signIn({ identifier: loginIdentifier, password: loginPassword });
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();
    if (!signupEmail.trim() || !signupPassword || !signupName.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { data, error } = await signUp({
        email: signupEmail.trim(),
        password: signupPassword,
        fullName: signupName.trim(),
        regNo: signupRegNo.trim(),
        hostel: signupHostel.trim()
      });

      if (error) throw error;

      if (data?.session) {
        navigate('/');
      } else {
        setSuccessMsg('Account created! Please check your email to confirm, then log in.');
        setActiveTab('login');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Sign up failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page section-pad">
      <div style={{ maxWidth: '460px', margin: '0 auto', background: 'white', padding: '36px', borderRadius: '28px', boxShadow: 'var(--shadow)' }}>
        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f8f9fa', padding: '6px', borderRadius: '16px', marginBottom: '28px' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            style={{
              padding: '12px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '900',
              fontFamily: 'Anton, sans-serif',
              fontSize: '1.2rem',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              background: activeTab === 'login' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'login' ? 'white' : '#495057',
              transition: 'background 0.2s ease'
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
            style={{
              padding: '12px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '900',
              fontFamily: 'Anton, sans-serif',
              fontSize: '1.2rem',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              background: activeTab === 'signup' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'signup' ? 'white' : '#495057',
              transition: 'background 0.2s ease'
            }}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: '#ffe3ee', color: '#d42d70', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', marginBottom: '18px', fontSize: '0.9rem' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#e8f8d8', color: '#2b8a3e', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', marginBottom: '18px', fontSize: '0.9rem' }}>
            {successMsg}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>
                Email or Registration No.
              </label>
              <input
                type="text"
                placeholder="name@lpu.in or 12204567"
                value={loginIdentifier}
                onChange={e => setLoginIdentifier(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #dee2e6', fontWeight: '700', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontWeight: '800', fontSize: '0.9rem' }}>Password</label>
                <Link to="/reset-password" style={{ color: '#8d66e8', fontWeight: '800', fontSize: '0.85rem', textDecoration: 'none' }}>
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #dee2e6', fontWeight: '700', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', height: '52px', marginTop: '10px' }}
            >
              {submitting ? 'Signing in...' : 'Sign In ->'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '4px', fontSize: '0.85rem' }}>Full Name *</label>
              <input
                type="text"
                placeholder="Anuj Pratap Singh"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #dee2e6', fontWeight: '700' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '800', marginBottom: '4px', fontSize: '0.85rem' }}>Reg No.</label>
                <input
                  type="text"
                  placeholder="12204567"
                  value={signupRegNo}
                  onChange={e => setSignupRegNo(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #dee2e6', fontWeight: '700' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '800', marginBottom: '4px', fontSize: '0.85rem' }}>Hostel / Block</label>
                <input
                  type="text"
                  placeholder="BH-1, Room 102"
                  value={signupHostel}
                  onChange={e => setSignupHostel(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #dee2e6', fontWeight: '700' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '4px', fontSize: '0.85rem' }}>Student Email *</label>
              <input
                type="email"
                placeholder="yourname@lpu.in"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #dee2e6', fontWeight: '700' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '4px', fontSize: '0.85rem' }}>Password *</label>
              <input
                type="password"
                placeholder="Create secure password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                required
                minLength="6"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #dee2e6', fontWeight: '700' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', height: '52px', marginTop: '10px' }}
            >
              {submitting ? 'Creating account...' : 'Create Account ->'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
