import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SunIcon, MoonIcon, AcademicCapIcon } from '../components/Icons';

const PublicLayout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
          <AcademicCapIcon size={28} />
          <span>JavaMastery</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '8px', borderRadius: '50%' }} aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to={isAdmin ? "/admin" : "/dashboard"} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Dashboard ({user?.username})
              </Link>
              <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Đăng ký</Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '0px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>Java Mastery Learning Platform</p>
          <p>© {new Date().getFullYear()} JavaMastery. Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
