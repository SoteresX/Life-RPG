import React, { useEffect, useState } from 'react';
import './Notification.css';

function Notification({ message, type, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. Start the fade-out animation after 3 seconds
    const animationTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    // 2. Physically remove the component from React state 500ms later (once animation finishes)
    const removeTimer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  const getIcon = () => {
    if (type === 'success') return '🏆';
    if (type === 'error') return '❌';
    return '🔔';
  };

  // If isExiting is true, we swap out the 'fade-in-toast' class for 'fade-out-toast'
  return (
    <div className={`toast-notification ${type} ${isExiting ? 'fade-out-toast' : 'fade-in-toast'}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-text">{message}</span>
      <button className="toast-close" onClick={() => setIsExiting(true)}>×</button>
    </div>
  );
}

export default Notification;