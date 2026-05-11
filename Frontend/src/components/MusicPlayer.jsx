// components/MusicPlayer.jsx
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart, Mic2 } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import '../styles/MusicPlayer.css';

const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffled,
    isRepeated,
    likedTracks,
    playTrack,
    togglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  } = useAudio();

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = formatTime((progress / 100) * duration);
  const totalTime = formatTime(duration);

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    handleSeek(percent);
  };

  const handleVolumeBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newVolume = ((e.clientX - rect.left) / rect.width);
    handleVolumeChange(Math.min(1, Math.max(0, newVolume)));
  };

  if (!currentTrack) {
    return (
      <div className="music-player">
        <div className="player-track-info">
          <div className="track-artwork">
            <div className="artwork-gradient">
              <Mic2 size={28} />
            </div>
          </div>
          <div className="track-details">
            <div className="track-title">No track playing</div>
            <div className="track-artist">Select a song to play</div>
          </div>
        </div>
      </div>
    );
  }

  const isLiked = likedTracks.has(currentTrack._id);

  return (
    <div className="music-player">
      {/* Track Info Section */}
      <div className="player-track-info">
        <div className="track-artwork">
          <div className="artwork-gradient">
            <Mic2 size={28} />
          </div>
          {isPlaying && <div className="playing-animation">
            <span></span><span></span><span></span>
          </div>}
        </div>
        <div className="track-details">
          <div className="track-title">{currentTrack.title}</div>
          <div className="track-artist">{currentTrack.artist?.username || currentTrack.artist || 'Unknown Artist'}</div>
        </div>
        <button 
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={() => toggleLike(currentTrack)}
        >
          <Heart size={18} fill={isLiked ? '#10b981' : 'none'} />
        </button>
      </div>

      {/* Controls Section */}
      <div className="player-controls-section">
        <div className="control-buttons">
          <button 
            className={`control-btn ${isShuffled ? 'active' : ''}`}
            onClick={toggleShuffle}
          >
            <Shuffle size={18} />
          </button>
          <button className="control-btn" onClick={handlePrev}>
            <SkipBack size={20} />
          </button>
          <button className="play-pause-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={22} fill="#000" /> : <Play size={22} fill="#000" style={{ marginLeft: '2px' }} />}
          </button>
          <button className="control-btn" onClick={handleNext}>
            <SkipForward size={20} />
          </button>
          <button 
            className={`control-btn ${isRepeated ? 'active' : ''}`}
            onClick={toggleRepeat}
          >
            <Repeat size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <span className="time-current">{currentTime}</span>
          <div 
            className="progress-bar-container"
            onClick={handleProgressClick}
          >
            <div className="progress-bar-bg">
              <div className="progress-fill" style={{ width: `${progress}%` }}>
                <div className="progress-handle"></div>
              </div>
            </div>
          </div>
          <span className="time-total">{totalTime}</span>
        </div>
      </div>

      {/* Volume & Extra Controls */}
      <div className="player-volume-section">
        <button className="volume-btn" onClick={toggleMute}>
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div 
          className="volume-bar-container"
          onClick={handleVolumeBarClick}
        >
          <div className="volume-bar-bg">
            <div className="volume-fill" style={{ width: `${isMuted ? 0 : volume * 100}%` }}>
              <div className="volume-handle"></div>
            </div>
          </div>
        </div>
        <div className="volume-percent">{isMuted ? 0 : Math.round(volume * 100)}%</div>
      </div>
    </div>
  );
};

export default MusicPlayer;