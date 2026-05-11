import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/Auth.css';

const ArtistSignup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { username, email, password, role: 'artist' });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/artist/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Join as an Artist</h1>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Artist/Band Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Choose an artist name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary">Sign Up as Artist</button>
        </form>
        <div className="form-footer">
          Already have an account? <Link to="/login/artist">Log in</Link>
          <br /><br />
          Are you a listener? <Link to="/signup/user">User Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default ArtistSignup;
