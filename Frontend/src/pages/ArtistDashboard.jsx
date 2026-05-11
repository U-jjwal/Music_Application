import React, { useState } from 'react';
import { Upload, Plus, Music, Mic, TrendingUp, Users, Calendar, X } from 'lucide-react';
import api from '../api';
import '../styles/ArtistDashboard.css';

const ArtistDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  
  const [musicTitle, setMusicTitle] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadStatusType, setUploadStatusType] = useState('');

  const [albumTitle, setAlbumTitle] = useState('');
  const [albumStatus, setAlbumStatus] = useState('');
  const [albumStatusType, setAlbumStatusType] = useState('');

  // Mock stats data
  const stats = [
    { icon: TrendingUp, value: '1,234', label: 'Total Plays' },
    { icon: Users, value: '567', label: 'Listeners' },
    { icon: Music, value: '12', label: 'Tracks' },
    { icon: Calendar, value: '3', label: 'Albums' },
  ];

  const handleUploadMusic = async (e) => {
    e.preventDefault();
    if (!musicTitle || !musicFile) return;
    
    setUploadStatus('Uploading...');
    setUploadStatusType('info');
    const formData = new FormData();
    formData.append('title', musicTitle);
    formData.append('music', musicFile);

    try {
      await api.post('/music/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('Upload successful!');
      setUploadStatusType('success');
      setMusicTitle('');
      setMusicFile(null);
      setTimeout(() => {
        setUploadStatus('');
        setUploadStatusType('');
      }, 3000);
    } catch (err) {
      setUploadStatus('Upload failed. ' + (err.response?.data?.message || ''));
      setUploadStatusType('error');
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle) return;
    
    setAlbumStatus('Creating...');
    setAlbumStatusType('info');
    try {
      await api.post('/music/album', { title: albumTitle, musics: [] });
      setAlbumStatus('Album created successfully!');
      setAlbumStatusType('success');
      setAlbumTitle('');
      setTimeout(() => {
        setAlbumStatus('');
        setAlbumStatusType('');
      }, 3000);
    } catch (err) {
      setAlbumStatus('Creation failed. ' + (err.response?.data?.message || ''));
      setAlbumStatusType('error');
    }
  };

  return (
    <div className="artist-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Artist Dashboard</h1>
        <p className="dashboard-subtitle">Manage your music, albums, and track your performance</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <Icon size={24} color="#10b981" />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
        >
          <Upload size={18} />
          Upload Track
        </button>
        <button 
          onClick={() => setActiveTab('album')}
          className={`tab-button ${activeTab === 'album' ? 'active' : ''}`}
        >
          <Plus size={18} />
          Create Album
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="content-card">
          <h2 className="card-title">Upload New Track</h2>
          <p className="card-subtitle">Share your music with the world</p>
          
          {uploadStatus && (
            <div className={`status-message status-${uploadStatusType}`}>
              {uploadStatus}
            </div>
          )}
          
          <form onSubmit={handleUploadMusic} className="dashboard-form">
            <div className="form-row">
              <label className="form-label">Track Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter track title"
                value={musicTitle}
                onChange={(e) => setMusicTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-row">
              <label className="form-label">Audio File</label>
              <div className="upload-area">
                <div className="upload-icon">
                  <Music size={32} color="#10b981" />
                </div>
                <div className="upload-text">Click or drag to upload audio file</div>
                <div className="upload-hint">MP3, WAV, or FLAC (max 50MB)</div>
                <input 
                  type="file" 
                  id="audio-file"
                  className="file-input" 
                  accept="audio/*" 
                  onChange={(e) => setMusicFile(e.target.files[0])}
                  required
                />
                <label htmlFor="audio-file" className="auth-button" style={{ display: 'inline-block', width: 'auto', marginTop: '16px' }}>
                  Choose File
                </label>
                {musicFile && (
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#10b981' }}>
                    Selected: {musicFile.name}
                  </div>
                )}
              </div>
            </div>
            
            <button type="submit" className="auth-button">Upload Track</button>
          </form>
        </div>
      )}

      {/* Album Tab */}
      {activeTab === 'album' && (
        <div className="content-card">
          <h2 className="card-title">Create New Album</h2>
          <p className="card-subtitle">Organize your tracks into albums</p>
          
          {albumStatus && (
            <div className={`status-message status-${albumStatusType}`}>
              {albumStatus}
            </div>
          )}
          
          <form onSubmit={handleCreateAlbum} className="dashboard-form">
            <div className="form-row">
              <label className="form-label">Album Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter album title"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="auth-button">Create Album</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;