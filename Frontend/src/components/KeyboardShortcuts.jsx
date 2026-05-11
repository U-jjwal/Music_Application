// components/KeyboardShortcuts.jsx
import React, { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';
import '../styles/KeyboardShortcuts.css';

const KeyboardShortcuts = () => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.code === 'KeyK') {
        event.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!showShortcuts) {
    return (
      <button 
        className="keyboard-shortcuts-trigger"
        onClick={() => setShowShortcuts(true)}
        title="Keyboard Shortcuts (Ctrl+K)"
      >
        <Keyboard size={18} />
      </button>
    );
  }

  return (
    <div className="keyboard-shortcuts-modal" onClick={() => setShowShortcuts(false)}>
      <div className="keyboard-shortcuts-content" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h3>Keyboard Shortcuts</h3>
          <button onClick={() => setShowShortcuts(false)}>✕</button>
        </div>
        <div className="shortcuts-grid">
          <div className="shortcut-item">
            <kbd>Space</kbd>
            <span>Play / Pause</span>
          </div>
          <div className="shortcut-item">
            <kbd>←</kbd>
            <span>Seek backward 10 seconds</span>
          </div>
          <div className="shortcut-item">
            <kbd>→</kbd>
            <span>Seek forward 10 seconds</span>
          </div>
          <div className="shortcut-item">
            <kbd>↑</kbd>
            <span>Volume up</span>
          </div>
          <div className="shortcut-item">
            <kbd>↓</kbd>
            <span>Volume down</span>
          </div>
          <div className="shortcut-item">
            <kbd>M</kbd>
            <span>Mute / Unmute</span>
          </div>
          <div className="shortcut-item">
            <kbd>N</kbd>
            <span>Next track</span>
          </div>
          <div className="shortcut-item">
            <kbd>P</kbd>
            <span>Previous track</span>
          </div>
          <div className="shortcut-item">
            <kbd>S</kbd>
            <span>Toggle Shuffle</span>
          </div>
          <div className="shortcut-item">
            <kbd>R</kbd>
            <span>Toggle Repeat</span>
          </div>
          <div className="shortcut-item">
            <kbd>Ctrl + K</kbd>
            <span>Show / Hide shortcuts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;