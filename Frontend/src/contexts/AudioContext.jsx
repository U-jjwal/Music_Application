// contexts/AudioContext.jsx
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [likedTracks, setLikedTracks] = useState(new Set());

  const audioRef = useRef(new Audio());
  const currentTrackData = queue[queueIndex] || currentTrack;

  // Keyboard controls handler
  const handleKeyPress = useCallback((event) => {
    // Don't trigger if user is typing in an input or textarea
    const target = event.target;
    const isTyping = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' || 
                     target.isContentEditable;
    
    if (isTyping) return;

    switch(event.code) {
      case 'Space':
        event.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        handleSeekBack();
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleSeekForward();
        break;
      case 'ArrowUp':
        event.preventDefault();
        handleVolumeUp();
        break;
      case 'ArrowDown':
        event.preventDefault();
        handleVolumeDown();
        break;
      case 'KeyM':
        event.preventDefault();
        toggleMute();
        break;
      case 'KeyN':
        event.preventDefault();
        handleNext();
        break;
      case 'KeyP':
        event.preventDefault();
        handlePrev();
        break;
      case 'KeyS':
        event.preventDefault();
        toggleShuffle();
        break;
      case 'KeyR':
        event.preventDefault();
        toggleRepeat();
        break;
      default:
        break;
    }
  }, [isPlaying, volume]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const onEnded = () => {
      if (isRepeated) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isRepeated]);

  // Volume control
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Load track when queue changes
  useEffect(() => {
    if (queue.length && queue[queueIndex]) {
      const track = queue[queueIndex];
      audioRef.current.src = track.uri || track.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
      setCurrentTrack(track);
    }
  }, [queueIndex, queue]);

  const playTrack = (track, tracksList = null) => {
    if (tracksList) {
      const trackIndex = tracksList.findIndex(t => t._id === track._id);
      setQueue(tracksList);
      setQueueIndex(trackIndex);
      setIsPlaying(true);
    } else {
      const existingIndex = queue.findIndex(t => t._id === track._id);
      if (existingIndex !== -1) {
        setQueueIndex(existingIndex);
      } else {
        setQueue([track, ...queue]);
        setQueueIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (queue.length === 0) return;
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
    }
    setQueueIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (queue.length === 0) return;
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
      setQueueIndex(prevIndex);
      setIsPlaying(true);
    }
  };

  const handleSeek = (value) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = (value / 100) * audio.duration;
      setProgress(value);
    }
  };

  const handleSeekForward = () => {
    const audio = audioRef.current;
    if (audio.duration) {
      const newTime = Math.min(audio.currentTime + 10, audio.duration);
      audio.currentTime = newTime;
      setProgress((newTime / audio.duration) * 100);
    }
  };

  const handleSeekBack = () => {
    const audio = audioRef.current;
    if (audio.duration) {
      const newTime = Math.max(audio.currentTime - 10, 0);
      audio.currentTime = newTime;
      setProgress((newTime / audio.duration) * 100);
    }
  };

  const handleVolumeUp = () => {
    const newVolume = Math.min(volume + 0.1, 1);
    setVolume(newVolume);
    setIsMuted(false);
  };

  const handleVolumeDown = () => {
    const newVolume = Math.max(volume - 0.1, 0);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setIsRepeated(!isRepeated);
  };

  const toggleLike = (track) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(track._id)) {
        newSet.delete(track._id);
      } else {
        newSet.add(track._id);
      }
      return newSet;
    });
  };

  const value = {
    currentTrack: currentTrackData,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffled,
    isRepeated,
    likedTracks,
    queue,
    queueIndex,
    playTrack,
    togglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    handleSeekForward,
    handleSeekBack,
    handleVolumeChange,
    handleVolumeUp,
    handleVolumeDown,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    setQueue,
    setQueueIndex,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};