import { useState } from 'react';
import { registerRequest } from '../lib/api.js';
import './login.css';

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setOk('');
    if (!validateEmail(email)) { setError('Please enter a valid email.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (password.length < 4) { setError('Password must be at least 4 characters.'); return; }
    setLoading(true);
    try {
      await registerRequest(email, name, password);
      setOk('Account created! You can now sign in.');
      setTimeout(()=>{ window.location.hash = '#/login'; }, 1000);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="login-outer">
      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />
      <div className="login-card glass">
        <div className="login-head">
          <div className="logo">💸</div>
          <h2>Create your account</h2>
          <p className="muted">Sign up to start using Xpense Pilot</p>
        </div>
        <form className="login-form" onSubmit={onSubmit}>
          <label>Name
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" required />
          </label>
          <label>Email
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label>Password
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••" required />
          </label>
          {error && <div className="error">{error}</div>}
          {ok && <div className="" style={{color:'#10b981', fontWeight:600}}>{ok}</div>}
          <button type="submit" className="primary" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</button>
          <div className="tips muted">Already have an account? <a href="#/login">Sign in</a></div>
        </form>
      </div>
    </div>
  );
}