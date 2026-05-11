// Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, Compass, Library, Mic2, LogOut, 
  Menu, X, Search, ChevronRight
} from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('user');
      navigate('/login/user');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/library', icon: Library, label: 'Library' },
  ];

  const artistNavItems = user?.role === 'artist' ? [
    { path: '/artist/dashboard', icon: Mic2, label: 'Dashboard' },
  ] : [];

  const isActive = (path) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout-container">
      {/* Mobile Header */}
      <header className={`mobile-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="mobile-header-content">
          <button className="menu-button" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="mobile-logo">
            <Mic2 size={28} color="#10b981" />
            <span>AuraMusic</span>
          </div>
          <div className="mobile-header-right">
            <button className="search-button">
              <Search size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      
      {/* Mobile Sidebar */}
      <aside className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <div className="mobile-sidebar-logo">
            <Mic2 size={32} color="#10b981" />
            <span>AuraMusic</span>
          </div>
          <button className="close-button" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="mobile-user-info">
          <div className="mobile-user-avatar">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="mobile-user-details">
            <span className="mobile-user-name">{user?.username || 'Guest'}</span>
            <span className="mobile-user-role">{user?.role || 'Listener'}</span>
          </div>
        </div>

        <nav className="mobile-nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={22} />
                <span>{item.label}</span>
                {isActive(item.path) && <ChevronRight size={18} className="active-indicator" />}
              </Link>
            );
          })}
          
          {artistNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={22} />
                <span>{item.label}</span>
                {isActive(item.path) && <ChevronRight size={18} className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="mobile-sidebar-footer">
          <button onClick={handleLogout} className="mobile-logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <Mic2 size={32} color="#10b981" />
            </div>
            <span className="logo-text">AuraMusic</span>
          </div>

          <div className="user-profile">
            <div className="user-avatar">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.username || 'Guest'}</span>
              <span className="user-role">{user?.role || 'Listener'}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isActive(item.path) && <div className="active-dot" />}
                </Link>
              );
            })}
            
            {artistNavItems.length > 0 && <div className="nav-divider" />}
            
            {artistNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isActive(item.path) && <div className="active-dot" />}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>

      {/* FIXED ORDER: Music Player THEN Bottom Navigation Bar */}
      {/* Music Player - Above bottom nav */}
      <MusicPlayer />

      {/* Bottom Navigation Bar for Mobile - Below music player */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        {user?.role === 'artist' && (
          <Link
            to="/artist/dashboard"
            className={`bottom-nav-item ${isActive('/artist/dashboard') ? 'active' : ''}`}
          >
            <Mic2 size={22} />
            <span>Studio</span>
          </Link>
        )}
        <button onClick={handleLogout} className="bottom-nav-item logout">
          <LogOut size={22} />
          <span>Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;