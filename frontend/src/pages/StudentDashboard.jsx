import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BookOpenIcon,
  AcademicCapIcon,
  BookmarkIcon,
  CheckIcon,
  ChartBarIcon,
  ChevronRightIcon,
} from '../components/Icons';
import CountUp from '../components/CountUp';
import ScrollReveal from '../components/ScrollReveal';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      const pct = Math.round(dashboardData.progressPercentage || 0);
      const timer = setTimeout(() => {
        setProgressPct(pct);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [dashboardData]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/student/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fade-in-up-load stagger-delay-0">
        <div className="skeleton" style={{ height: '36px', width: '40%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '18px', width: '55%', marginBottom: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="card" style={{ height: '140px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="skeleton" style={{ height: '24px', width: '50%' }} />
              <div className="skeleton" style={{ height: '36px', width: '30%' }} />
              <div className="skeleton" style={{ height: '6px', width: '100%', marginTop: 'auto' }} />
            </div>
          ))}
        </div>
        <div className="skeleton" style={{ height: '24px', width: '25%', marginBottom: '16px' }} />
        {[1, 2, 3].map(n => (
          <div key={n} className="skeleton" style={{ height: '72px', width: '100%', marginBottom: '12px', borderRadius: 'var(--radius-md)' }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }} className="fade-in-up-load stagger-delay-0">
        <ChartBarIcon size={48} style={{ marginBottom: '16px', opacity: 0.5, color: 'var(--text-muted)' }} />
        <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>{error}</h3>
        <button className="btn btn-primary" onClick={fetchDashboard} style={{ marginTop: '16px' }}>Thử lại</button>
      </div>
    );
  }

  const { completedLessonsCount, totalLessonsCount, progressPercentage, bookmarkedLessons } = dashboardData || {};
  const remaining = (totalLessonsCount || 0) - (completedLessonsCount || 0);
  const pct = Math.round(progressPercentage || 0);
  const CIRCLE_RADIUS = 56;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
  const circleOffset = CIRCLE_CIRCUMFERENCE - (progressPct / 100) * CIRCLE_CIRCUMFERENCE;

  // Determine greeting
  const hours = new Date().getHours();
  let greeting = 'Chào buổi sáng';
  if (hours >= 12 && hours < 18) greeting = 'Chào buổi chiều';
  else if (hours >= 18) greeting = 'Chào buổi tối';

  const statCards = [
    {
      label: 'Bài đã hoàn thành',
      value: completedLessonsCount || 0,
      total: totalLessonsCount || 0,
      icon: <CheckIcon size={22} />,
      color: 'var(--success)',
      bgColor: 'var(--success-light)',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
    },
    {
      label: 'Bài chưa hoàn thành',
      value: remaining,
      total: totalLessonsCount || 0,
      icon: <BookOpenIcon size={22} />,
      color: 'var(--primary)',
      bgColor: 'var(--primary-light)',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    },
    {
      label: 'Bài đã lưu',
      value: bookmarkedLessons?.length || 0,
      icon: <BookmarkIcon size={22} />,
      color: 'var(--accent)',
      bgColor: 'var(--accent-light)',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
  ];

  return (
    <div>
      {/* Page Header (Smooth Fade In on Load) */}
      <div className="fade-in-up-load stagger-delay-0" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          {greeting}, {user?.username}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Tiếp tục hành trình chinh phục Java của bạn.
        </p>
      </div>

      {/* Hero Progress Banner (Stagger Delay 1) */}
      <div className="card fade-in-up-load stagger-delay-1" style={{
        padding: 0,
        overflow: 'hidden',
        marginBottom: '32px',
        border: 'none',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)',
        color: '#ffffff',
        position: 'relative',
      }}>
        {/* Decorative dots */}
        <div style={{ position: 'absolute', top: '20px', right: '30px', opacity: 0.1 }}>
          <AcademicCapIcon size={120} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, padding: '36px 32px', display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {/* Circular Progress (Animates dynamically on mount) */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="65" cy="65" r={CIRCLE_RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
              <circle
                cx="65" cy="65" r={CIRCLE_RADIUS}
                fill="none"
                stroke="#ffffff"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                style={{
                  strokeDashoffset: circleOffset,
                  transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                <CountUp end={pct} />%
              </span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>Hoàn thành</span>
            </div>
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
              Tiến Trình Học Tập
            </h2>
            <p style={{ opacity: 0.85, lineHeight: 1.6, marginBottom: '16px' }}>
              Bạn đã hoàn thành <strong><CountUp end={completedLessonsCount} /></strong> trên <strong>{totalLessonsCount || 0}</strong> bài học.
              {remaining > 0 ? ` Còn ${remaining} bài nữa, hãy cố gắng nhé!` : ' Tuyệt vời, bạn đã hoàn thành tất cả! 🎉'}
            </p>
            <Link to="/courses" className="btn" style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 24px',
              fontWeight: 600,
            }}>
              {remaining > 0 ? 'Tiếp tục học' : 'Xem khóa học'}
              <ChevronRightIcon size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards (Stagger Delay 2, 3, 4) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {statCards.map((stat, idx) => (
          <div key={idx} className={`card fade-in-up-load stagger-delay-${idx + 2}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '24px',
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: 'var(--radius-md)',
              background: stat.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>
                {stat.label}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: stat.color }}>
                <CountUp end={stat.value} />
                {stat.total != null && (
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    /{stat.total}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bookmarked Lessons (Revealed dynamically on Viewport entry) */}
      <ScrollReveal className="relative z-[1] mb-[40px]" delay={100}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
            <BookmarkIcon size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px', color: 'var(--accent)' }} />
            Bài Học Đã Lưu
          </h2>
        </div>

        {(!bookmarkedLessons || bookmarkedLessons.length === 0) ? (
          <div className="card" style={{
            textAlign: 'center',
            padding: '48px 24px',
          }}>
            <BookmarkIcon size={36} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '12px' }} />
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Chưa có bài học nào được lưu</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Nhấn biểu tượng bookmark khi đọc bài để lưu lại.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookmarkedLessons.map((bm) => (
              <Link
                key={bm.id}
                to={`/courses/${bm.courseId}/lessons/${bm.lessonId}`}
                className="card interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--accent)'
                  }}>
                    <BookmarkIcon size={18} fill="currentColor" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {bm.lessonTitle}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {bm.courseTitle}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        )}
      </ScrollReveal>
    </div>
  );
};

export default StudentDashboard;
