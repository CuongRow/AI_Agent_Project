import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  SunIcon, 
  MoonIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  UserIcon, 
  BookOpenIcon, 
  LogOutIcon,
  MenuIcon,
  XIcon
} from '../components/Icons';
import ThemeToggleSwitch from '../components/ThemeToggleSwitch';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const applyTheme = () => {
      const currentTheme = localStorage.getItem('theme') || 'dark';
      setTheme(currentTheme);
      if (currentTheme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    };
    
    applyTheme();
    window.addEventListener('theme-change', applyTheme);
    return () => window.removeEventListener('theme-change', applyTheme);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isInstructor = user?.roles?.includes('ROLE_INSTRUCTOR');
  
  const navLinks = [];
  if (isAdmin) {
    navLinks.push({ path: '/admin', label: 'Thống kê', icon: <ChartBarIcon size={20} /> });
    navLinks.push({ path: '/admin/users', label: 'Người dùng', icon: <UserIcon size={20} /> });
  }
  if (isAdmin || isInstructor) {
    navLinks.push({ path: '/admin/courses', label: 'Khóa học & Bài học', icon: <BookOpenIcon size={20} /> });
    navLinks.push({ path: '/admin/grades', label: 'Tiến độ & Điểm số', icon: <ChartBarIcon size={20} /> });
    navLinks.push({ path: '/admin/discussions', label: 'Hỏi đáp', icon: <AcademicCapIcon size={20} /> });
  }

  return (
    <div className="animated-gradient-bg" style={{ display: 'flex', minHeight: '100vh', color: 'var(--text-main)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow Bubble Effects */}
      <div className="glow-container">
        <div className="glow-bubble glow-bubble-1" />
        <div className="glow-bubble glow-bubble-2" />
        <div className="glow-bubble glow-bubble-3" />
      </div>

      {/* Mobile Header */}
      <header className="glass mobile-header-bar" style={{
        display: 'none',
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
      }}>
        <button onClick={() => setIsSidebarOpen(true)} className="btn btn-outline" style={{ padding: '6px', border: 'none' }}>
          <MenuIcon size={24} />
        </button>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--primary)' }}>
          <AcademicCapIcon size={24} />
          <span>JavaMastery (Admin)</span>
        </Link>
        <ThemeToggleSwitch style={{ transform: 'scale(0.5)', transformOrigin: 'right center' }} />
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
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
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
          <p style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>
            {isAdmin ? 'Quản trị viên' : isInstructor ? 'Giảng viên' : 'Học viên'}
          </p>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || 
              (link.path !== '/admin' && location.pathname.startsWith(link.path));
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
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          
          <ThemeToggleSwitch />

          <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', width: '100%' }}>
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
        marginLeft: 'var(--sidebar-width)',
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
            <Link to="/admin/profile" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>Hồ sơ</Link>
          </div>
        </header>

        {/* Content body */}
        <main style={{ flex: 1, padding: '32px', maxWidth: '1200px', width: '100%', margin: '0 auto' }} className="main-content-body">
          <Outlet />
        </main>
      </div>

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

export default AdminLayout;
