import { useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { Action } from '../state/reducer.js';
import { loginRequest, setToken } from '../lib/api.js';
import './login.css';

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function Login() {
  const { state, dispatch } = useApp();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setLoading(true);
    try {
      const data = await loginRequest(email, password); // { token, user }
      setToken(data.token);
      dispatch({ type: Action.LOGIN, payload: {
        name: data.user.name,
        email: data.user.email,
        avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(data.user.email)}`,
      }});
      window.location.hash = '#/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-outer">
      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />
      <div className="login-card glass">
        <div className="login-head">
          <div className="logo">💸</div>
          <h2>Welcome back</h2>
          <p className="muted">Sign in to continue to Xpense Pilot</p>
        </div>
        <form className="login-form" onSubmit={onSubmit}>
          <label>Email
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••" required />
          </label>
          {error && (
            <div className="error" role="alert">
              {error}
              {error.includes('User not exists') && (
                <span> — <a href="#/signup">Create an account</a></span>
              )}
            </div>
          )}
          <button type="submit" className="primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
          <div className="tips muted">Don’t have an account? <a href="#/signup">Sign up</a></div>
        </form>
      </div>
    </div>
  );
}
