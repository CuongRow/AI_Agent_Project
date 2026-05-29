import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  SunIcon, 
  MoonIcon, 
  AcademicCapIcon, 
  HomeIcon, 
  BookOpenIcon, 
  BookmarkIcon, 
  LogOutIcon,
  MenuIcon,
  XIcon,
  ChartBarIcon
} from '../components/Icons';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const navLinks = [
    { path: '/dashboard', label: 'Trang cá nhân', icon: <HomeIcon size={20} /> },
    { path: '/courses', label: 'Khóa học', icon: <BookOpenIcon size={20} /> },
    { path: '/bookmarks', label: 'Đã lưu', icon: <BookmarkIcon size={20} /> },
    { path: '/quiz-history', label: 'Lịch sử thi', icon: <ChartBarIcon size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--text-main)' }}>
      {/* Mobile Header */}
      <header className="glass mobile-header-bar" style={{
        display: 'none', // Shown on mobile via css media queries / JS
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        padding: '0 16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        zIndex: 40,
        // Responsive behavior using inline-js detection
      }}>
        <button onClick={() => setIsSidebarOpen(true)} className="btn btn-outline" style={{ padding: '6px', border: 'none' }}>
          <MenuIcon size={24} />
        </button>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--primary)' }}>
          <AcademicCapIcon size={24} />
          <span>JavaMastery</span>
        </Link>
        <button onClick={toggleTheme} className="btn btn-outline" style={{ padding: '6px', border: 'none' }}>
          {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 98,
        }} />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 99,
        transition: 'transform var(--transition-normal)',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)', // Default mobile
      }} className="responsive-sidebar">
        {/* Sidebar Header */}
        <div style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>
            <AcademicCapIcon size={28} />
            <span>JavaMastery</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="btn btn-outline close-sidebar-btn" style={{ display: 'none', padding: '4px', border: 'none' }}>
            <XIcon size={20} />
          </button>
        </div>

        {/* User Info Quick Card */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.username}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Học viên</p>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || 
              (link.path === '/courses' && location.pathname.startsWith('/courses/'));
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  transition: 'all var(--transition-fast)'
                }}
                className="sidebar-link"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={toggleTheme} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', gap: '8px', width: '100%' }}>
            {theme === 'light' ? (
              <>
                <MoonIcon size={18} />
                <span>Giao diện tối</span>
              </>
            ) : (
              <>
                <SunIcon size={18} />
                <span>Giao diện sáng</span>
              </>
            )}
          </button>

          <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <LogOutIcon size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        marginLeft: 'var(--sidebar-width)', // Offset for desktop sidebar
        transition: 'margin-left var(--transition-normal)'
      }} className="responsive-content-container">
        
        {/* Desktop Header */}
        <header className="glass desktop-header-bar" style={{
          height: '64px',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email: <strong>{user?.email}</strong></span>
            <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border)' }}></div>
            <Link to="/profile" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Hồ sơ</Link>
          </div>
        </header>

        {/* Content body */}
        <main style={{ flex: 1, padding: '32px', maxWidth: '1200px', width: '100%', margin: '0 auto' }} className="main-content-body">
          <Outlet />
        </main>
      </div>

      {/* Responsive Media Query Styles injected via simple style tag */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-sidebar {
            transform: translateX(-100%) !important;
          }
          .responsive-content-container {
            margin-left: 0 !important;
            padding-top: 60px !important;
          }
          .desktop-header-bar {
            display: none !important;
          }
          .mobile-header-bar {
            display: flex !important;
          }
          .close-sidebar-btn {
            display: inline-flex !important;
          }
          .main-content-body {
            padding: 20px !important;
          }
        }
        @media (min-width: 769px) {
          .responsive-sidebar {
            transform: translateX(0) !important;
          }
          .mobile-header-bar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
