// components/Home.jsx
import React, { useEffect, useState } from 'react';
import { Heart, Music } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';
import api from '../api';
import '../styles/music-player.css';

const fmtTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const getAvatarColor = (str = '') => {
  const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5E5CE6', '#AF52DE', '#FF2D55', '#64D2FF'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Waveform = ({ playing }) => (
  <span className="waveform" data-playing={playing}>
    {[1, 2, 3, 4].map(i => (
      <span key={i} className="bar" style={{ '--i': i }} />
    ))}
  </span>
);

const TrackRow = ({ track, index, isActive, isPlaying, onPlay, onLike, isLiked }) => (
  <div className={`track-row ${isActive ? 'active' : ''}`} onClick={() => onPlay(track)}>
    <div className="track-index">
      {isActive ? (
        <Waveform playing={isPlaying} />
      ) : (
        <span className="idx-num">{index + 1}</span>
      )}
    </div>
    <div className="track-thumb" style={{ background: getAvatarColor(track.title) }}>
      <Music size={14} />
    </div>
    <div className="track-info">
      <span className="track-name">{track.title}</span>
      <span className="track-sub">{track.artist?.username || 'Unknown Artist'}</span>
    </div>
    <button className="track-heart" onClick={(e) => { e.stopPropagation(); onLike(track); }}>
      <Heart size={14} fill={isLiked ? '#10b981' : 'none'} />
    </button>
  </div>
);

const AlbumCard = ({ album, onOpen }) => (
  <div className="album-card" onClick={() => onOpen(album)}>
    <div 
      className="album-art" 
      style={{ background: `linear-gradient(135deg, ${getAvatarColor(album.title)} 0%, color-mix(in srgb, ${getAvatarColor(album.title)} 40%, #000) 100%)` }}
    >
      <span className="album-initial">{album.title.charAt(0)}</span>
      <div className="album-art-glow" />
    </div>
    <div className="album-card-info">
      <span className="album-card-title">{album.title}</span>
      <span className="album-card-artist">{album.artist?.username || 'Unknown'}</span>
    </div>
  </div>
);

export default function Home() {
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const {
    currentTrack,
    isPlaying,
    playTrack,
    toggleLike,
    likedTracks,
    setQueue,
    setQueueIndex,
  } = useAudio();

  useEffect(() => {
    (async () => {
      try {
        const [mRes, aRes] = await Promise.all([
          api.get('/music'),
          api.get('/music/albums')
        ]);
        const fetchedMusics = mRes.data.musics || [];
        setMusics(fetchedMusics);
        setAlbums(aRes.data.albums || []);
      } catch (err) {
        console.error('Failed to fetch data', err);
        const mockMusics = [
          { _id: '1', title: 'Blinding Lights', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', artist: { username: 'The Weeknd' } },
          { _id: '2', title: 'Flowers', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', artist: { username: 'Miley Cyrus' } },
          { _id: '3', title: 'As It Was', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', artist: { username: 'Harry Styles' } },
          { _id: '4', title: 'Cruel Summer', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', artist: { username: 'Taylor Swift' } },
          { _id: '5', title: 'Die For You', uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', artist: { username: 'The Weeknd' } },
        ];
        setMusics(mockMusics);
        setAlbums([
          { _id: 'a1', title: 'Midnight Dreams', artist: { username: 'Luna Ray' } },
          { _id: 'a2', title: 'Golden Hour', artist: { username: 'Arlo Park' } },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePlayTrack = (track) => {
    // Play the selected track and set the entire music list as queue
    playTrack(track, musics);
  };

  const handleOpenAlbum = async (album) => {
    try {
      const res = await api.get(`/music/albums/${album._id}`);
      const tracks = res.data.album?.musics || [];
      if (tracks.length) {
        setQueue(tracks);
        setQueueIndex(0);
      }
    } catch (err) {
      console.error('Failed to load album', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-pulse">
          <Music size={32} />
        </div>
        <p>Loading Aura…</p>
      </div>
    );
  }

  return (
    <div className="home-root">
      <header className="home-header">
        <div>
          <h1 className="greeting">Good Evening</h1>
          <p className="sub-greeting">Your personal soundtrack</p>
        </div>
        <div className="header-avatar">AJ</div>
      </header>

      <section className="section">
        <h2 className="section-title">Popular Albums</h2>
        <div className="albums-row">
          {albums.length ? (
            albums.map(album => (
              <AlbumCard key={album._id} album={album} onOpen={handleOpenAlbum} />
            ))
          ) : (
            <p className="empty-state">No albums yet.</p>
          )}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Recent Tracks</h2>
        <div className="tracks-list">
          {musics.length ? (
            musics.map((track, index) => (
              <TrackRow
                key={track._id}
                track={track}
                index={index}
                isActive={currentTrack?._id === track._id}
                isPlaying={isPlaying}
                onPlay={handlePlayTrack}
                onLike={toggleLike}
                isLiked={likedTracks.has(track._id)}
              />
            ))
          ) : (
            <p className="empty-state">No tracks yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}