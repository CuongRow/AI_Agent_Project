import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './Icons';

const ThemeToggleSwitch = ({ className = '', style = {} }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const applyTheme = () => {
      const currentTheme = localStorage.getItem('theme') || 'dark';
      setTheme(currentTheme);
    };
    
    applyTheme(); // Sync on mount
    window.addEventListener('theme-change', applyTheme);
    return () => window.removeEventListener('theme-change', applyTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    window.dispatchEvent(new Event('theme-change'));
  };

  const isLight = theme === 'light';

  return (
    <div 
      onClick={toggleTheme}
      className={className}
      style={{
        width: '50px',
        height: '90px',
        borderRadius: '45px',
        backgroundColor: isLight ? '#ffffff' : '#000000',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
        border: isLight ? '1px solid #e5e7eb' : '1px solid #374151',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        flexShrink: 0,
        ...style
      }}
    >
      {/* Slider */}
      <div 
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: isLight ? '#f3f4f6' : '#1f2937',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), background-color 0.3s ease',
          transform: isLight ? 'translateY(0)' : 'translateY(40px)', // from 4px to 44px
          zIndex: 1
        }}
      />
      
      {/* Sun Icon (Top) */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      }}>
        <SunIcon size={20} style={{ color: isLight ? '#22c55e' : '#9ca3af', transition: 'color 0.3s ease' }} />
      </div>

      {/* Moon Icon (Bottom) */}
      <div style={{
        position: 'absolute',
        bottom: '4px',
        left: '4px',
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      }}>
        <MoonIcon size={20} style={{ color: isLight ? '#9ca3af' : '#22c55e', transition: 'color 0.3s ease' }} />
      </div>
    </div>
  );
};

export default ThemeToggleSwitch;
