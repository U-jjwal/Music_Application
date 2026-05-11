// App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ArtistDashboard from './pages/ArtistDashboard';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import ArtistLogin from './pages/ArtistLogin';
import ArtistSignup from './pages/ArtistSignup';
import ProtectedRoute from './components/ProtectedRoute';
import { AudioProvider } from './contexts/AudioContext';

// Optional: Add page transition wrapper
const PageWrapper = ({ children, title }) => {
  useEffect(() => {
    document.title = title || 'AuraMusic';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title]);
  
  return children;
};

function App() {
  return (
    <AudioProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* ==================== AUTHENTICATION ROUTES ==================== */}
          <Route path="/auth">
            {/* User Authentication */}
            <Route path="user/login" element={<UserLogin />} />
            <Route path="user/signup" element={<UserSignup />} />
            
            {/* Artist Authentication */}
            <Route path="artist/login" element={<ArtistLogin />} />
            <Route path="artist/signup" element={<ArtistSignup />} />
          </Route>

          {/* Redirect legacy routes to new structure */}
          <Route path="/login/user" element={<Navigate to="/auth/user/login" replace />} />
          <Route path="/signup/user" element={<Navigate to="/auth/user/signup" replace />} />
          <Route path="/login/artist" element={<Navigate to="/auth/artist/login" replace />} />
          <Route path="/signup/artist" element={<Navigate to="/auth/artist/signup" replace />} />

          {/* ==================== PROTECTED APP ROUTES ==================== */}
          <Route element={<ProtectedRoute allowedRoles={['user', 'artist']} />}>
            <Route 
              path="/" 
              element={
                <PageWrapper title="AuraMusic - Home">
                  <Layout />
                </PageWrapper>
              }
            >
              {/* Main Navigation Routes */}
              <Route index element={<Home />} />
              <Route 
                path="explore" 
                element={
                  <PageWrapper title="Explore - AuraMusic">
                    <div className="page-content">
                      <div className="explore-container">
                        <h1 className="page-title">Explore</h1>
                        <p className="page-subtitle">Discover new music and artists</p>
                        <div className="coming-soon">
                          <div className="coming-soon-icon">🎵</div>
                          <h3>Coming Soon</h3>
                          <p>We're working on something amazing for you!</p>
                        </div>
                      </div>
                    </div>
                  </PageWrapper>
                } 
              />
              <Route 
                path="library" 
                element={
                  <PageWrapper title="Library - AuraMusic">
                    <div className="page-content">
                      <div className="library-container">
                        <h1 className="page-title">Your Library</h1>
                        <p className="page-subtitle">All your favorite tracks in one place</p>
                        <div className="coming-soon">
                          <div className="coming-soon-icon">📚</div>
                          <h3>Coming Soon</h3>
                          <p>Your saved songs and playlists will appear here</p>
                        </div>
                      </div>
                    </div>
                  </PageWrapper>
                } 
              />
              
              {/* Artist Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['artist']} />}>
                <Route 
                  path="artist/dashboard" 
                  element={
                    <PageWrapper title="Artist Dashboard - AuraMusic">
                      <ArtistDashboard />
                    </PageWrapper>
                  } 
                />
              </Route>
            </Route>
          </Route>

          {/* ==================== FALLBACK ROUTES ==================== */}
          <Route path="/404" element={
            <PageWrapper title="Page Not Found - AuraMusic">
              <div className="page-content">
                <div className="error-container">
                  <h1 className="error-code">404</h1>
                  <p className="error-message">Oops! Page not found</p>
                  <Navigate to="/" replace />
                </div>
              </div>
            </PageWrapper>
          } />
          
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </AudioProvider>
  );
}

export default App;