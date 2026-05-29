import React, { useEffect, useState } from 'react';

export const Confetti = ({ duration = 4500 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = [
      '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#a855f7'
    ];
    const particleCount = 120;
    const initialParticles = Array.from({ length: particleCount }).map((_, index) => {
      const sizeWidth = Math.random() * 8 + 6;
      const sizeHeight = Math.random() * 12 + 6;
      return {
        id: index,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: `${sizeWidth}px`,
        height: `${sizeHeight}px`,
        delay: `${Math.random() * 1.5}s`,
        duration: `${Math.random() * 2 + 2}s`,
        opacity: Math.random() * 0.6 + 0.4,
      };
    });

    setParticles(initialParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.width,
            height: p.height,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
