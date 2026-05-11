  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import api from '../api';
  import '../styles/Auth.css';

  const ArtistLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.user.role === 'artist') {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate('/artist/dashboard');
        } else {
          setError('Please use the listener login page.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      }
    };

    return (
      <div className="form-container">
        <div className="form-card">
          <h1 className="form-title">Artist Login</h1>
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="btn-primary">Log In</button>
          </form>
          <div className="form-footer">
            Don't have an account? <Link to="/signup/artist">Sign up</Link>
            <br /><br />
            Are you a listener? <Link to="/login/user">User Login</Link>
          </div>
        </div>
      </div>
    );
  };

  export default ArtistLogin;
