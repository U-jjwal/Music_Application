import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Mic } from 'lucide-react';
import api from '../api';
import '../styles/Auth.css';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.user.role === 'user') {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      } else {
        setError('Please use the artist login page.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="role-badge">
          <User size={14} /> Listener
        </div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue listening</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="form-input-wrapper">
              {/* <Mail size={18} className="form-input-icon" /> */}
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              {/* <Lock size={18} className="form-input-icon" /> */}
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <button type="submit" className={`auth-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/signup/user">Sign up</Link>
          <span className="divider">•</span>
          <Link to="/login/artist">Artist Login</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;