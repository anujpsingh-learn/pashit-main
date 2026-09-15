import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Check if arriving with recovery access token in hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setIsUpdating(true);
    }
  }, []);

  async function handleResetRequest(e) {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setErrorMsg('');
    setMessage('');
    try {
      await requestPasswordReset(email.trim());
      setMessage('Password reset link sent! Check your email inbox.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reset email.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section-pad">
      <div style={{ maxWidth: '440px', margin: '40px auto', background: 'white', padding: '36px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
        <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '2.2rem', margin: '0 0 10px' }}>
          {isUpdating ? 'Set New Password' : 'Reset Password'}
        </h1>
        <p style={{ color: 'rgba(20,0,31,0.6)', marginBottom: '24px' }}>
          {isUpdating
            ? 'Enter your new password below.'
            : 'Enter your student email and we will send you a link to reset your password.'}
        </p>

        {errorMsg && (
          <div style={{ background: '#ffe3ee', color: '#d42d70', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', marginBottom: '18px' }}>
            {errorMsg}
          </div>
        )}

        {message && (
          <div style={{ background: '#e8f8d8', color: '#2b8a3e', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', marginBottom: '18px' }}>
            {message}
          </div>
        )}

        {!isUpdating ? (
          <form onSubmit={handleResetRequest} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>Student Email</label>
              <input
                type="email"
                placeholder="yourname@lpu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #dee2e6', fontWeight: '700' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', height: '50px' }}>
              {submitting ? 'Sending link...' : 'Send Reset Link ->'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Link to="/login" style={{ color: '#8d66e8', fontWeight: '800', textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordUpdate} style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '6px', fontSize: '0.9rem' }}>New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength="6"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #dee2e6', fontWeight: '700' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', height: '50px' }}>
              {submitting ? 'Updating...' : 'Update Password ->'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
