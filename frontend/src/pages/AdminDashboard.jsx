import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ChartBarIcon, UserIcon, BookOpenIcon, AcademicCapIcon, CheckIcon } from '../components/Icons';

/**
 * Admin Dashboard – glassmorphism design matching Dashboard.png template.
 * Uses TailwindCSS for styling, GlassCard for reusable cards, and Chart.js for charts.
 */
const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!loading && !error && analytics) {
      const entries = analytics.userRegistrationsOverTime
        ? Object.entries(analytics.userRegistrationsOverTime).sort(([a], [b]) =>
          a.localeCompare(b)
        )
        : [];

      const dates = entries.map(([date]) => date);
      const counts = entries.map(([, count]) => count);

      if (dates.length > 0 && window.Highcharts) {
        window.Highcharts.chart('registration-chart-container', {
          chart: {
            type: 'column',
            backgroundColor: 'transparent',
          },
          title: { text: '' },
          xAxis: {
            categories: dates,
          },
          yAxis: {
            title: { text: 'Số lượng' },
          },
          series: [
            {
              name: 'Người dùng mới',
              data: counts,
            },
          ],
          credits: {
            enabled: false,
          },
        });
      }
    }
  }, [loading, error, analytics]);
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/analytics');
      setAnalytics(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: '36px', width: '40%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '18px', width: '55%', marginBottom: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className="card" style={{ height: '120px' }}>
              <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '32px', width: '40%' }} />
            </div>
          ))}
        </div>
        <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <ChartBarIcon size={48} style={{ marginBottom: '16px', opacity: 0.5, color: 'var(--text-muted)' }} />
        <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>{error}</h3>
        <button className="btn btn-primary" onClick={fetchAnalytics} style={{ marginTop: '16px' }}>Thử lại</button>
      </div>
    );
  }

  const {
    totalUsers,
    totalCourses,
    totalLessons,
    totalQuizzes,
    totalQuestions,
    overallCompletionRate,
    userRegistrationsOverTime
  } = analytics || {};

  const statCards = [
    {
      label: 'Tổng người dùng',
      value: totalUsers || 0,
      icon: <UserIcon size={22} />,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    },
    {
      label: 'Tổng khóa học',
      value: totalCourses || 0,
      icon: <BookOpenIcon size={22} />,
      gradient: 'linear-gradient(135deg, #0d9488, #0f766e)',
    },
    {
      label: 'Tổng bài học',
      value: totalLessons || 0,
      icon: <AcademicCapIcon size={22} />,
      gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    },
    {
      label: 'Tổng Quiz',
      value: totalQuizzes || 0,
      icon: <CheckIcon size={22} />,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    {
      label: 'Tổng câu hỏi',
      value: totalQuestions || 0,
      icon: <ChartBarIcon size={22} />,
      gradient: 'linear-gradient(135deg, #db2777, #be185d)',
    },
  ];

  // Prepare chart data from userRegistrationsOverTime
  const registrationEntries = userRegistrationsOverTime ? Object.entries(userRegistrationsOverTime).sort(([a], [b]) => a.localeCompare(b)) : [];
  const maxRegistrationValue = registrationEntries.length > 0 ? Math.max(...registrationEntries.map(([, v]) => v), 1) : 1;

  const completionPct = Math.round(overallCompletionRate || 0);

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Bảng Quản Trị
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Tổng quan về hoạt động của nền tảng JavaMastery.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {statCards.map((stat, idx) => (
          <div key={idx} className="card" style={{
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: stat.gradient,
              opacity: 0.08,
            }} />

            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              background: stat.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '16px',
            }}>
              {stat.icon}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Completion Rate + Registrations Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 2fr)',
        gap: '24px',
        marginBottom: '40px'
      }} className="admin-grid-two-col">

        {/* Completion Rate Donut */}
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '28px' }}>
            Tỷ Lệ Hoàn Thành Chung
          </h3>

          <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 24px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              {/* Background ring */}
              <circle cx="90" cy="90" r="72" fill="none" stroke="var(--border)" strokeWidth="16" />
              {/* Progress ring */}
              <circle
                cx="90" cy="90" r="72"
                fill="none"
                stroke="url(#completionGradient)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${completionPct * 4.52} ${452 - completionPct * 4.52}`}
                strokeDashoffset="113"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
              <defs>
                <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <span style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {completionPct}%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>hoàn thành</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Tỷ lệ hoàn thành bài học trung bình của tất cả học viên trên nền tảng.
          </p>
        </div>

        {/* Registration Bar Chart */}
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '28px' }}>
            Đăng Ký Theo Thời Gian
          </h3>

          {registrationEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <ChartBarIcon size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
              <p style={{ fontSize: '0.9rem' }}>Chưa có dữ liệu đăng ký.</p>
            </div>
          ) : (
            <div id="registration-chart-container" style={{ width: '100%', height: '300px' }}></div>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .admin-grid-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
