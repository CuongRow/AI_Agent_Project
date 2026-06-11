import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ChartBarIcon, UserIcon, BookOpenIcon, AcademicCapIcon, CheckIcon } from '../components/Icons';
import CountUp from '../components/CountUp';
import ScrollReveal from '../components/ScrollReveal';
import './AdminDashboard.css';


/**
 * Admin Dashboard - Beautiful Glassmorphism UI.
 * Integrates visual concepts from the HTML mockup (glowing bubbles, glass cards, semi-circular progress)
 * with the real analytics data of JavaMastery, dynamic theme configs, and performant motion transitions.
 */
const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark'));
  const [gaugeOffset, setGaugeOffset] = useState(125.65); // Set initial state to 125.65 (50% filled) to demonstrate sweep animation


  // Track system theme changes to update Highcharts dynamically
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.body.classList.contains('dark'));
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Update animated SVG gauge progress on analytics load
  useEffect(() => {
    if (analytics) {
      const completionPct = Math.round(analytics.overallCompletionRate || 0);
      const targetOffset = Math.max(0, Math.min(251.3, 251.3 - (251.3 * completionPct) / 100));
      
      const timer = setTimeout(() => {
        setGaugeOffset(targetOffset);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [analytics]);

  // Configure and draw Highcharts when analytics data or theme changes
  useEffect(() => {
    if (!loading && !error && analytics) {
      const entries = analytics.userRegistrationsOverTime
        ? Object.entries(analytics.userRegistrationsOverTime).sort(([a], [b]) =>
          a.localeCompare(b)
        )
        : [];

      const dates = entries.map(([date]) => {
        // format yyyy-mm-dd to dd/mm for cleaner chart look
        const parts = date.split('-');
        return parts.length === 3 ? `${parts[2]}/${parts[1]}` : date;
      });
      const counts = entries.map(([, count]) => count);

      if (dates.length > 0 && window.Highcharts) {
        window.Highcharts.chart('registration-chart-container', {
          chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: {
              fontFamily: 'Inter, system-ui, sans-serif'
            }
          },
          title: { text: '' },
          xAxis: {
            categories: dates,
            gridLineColor: 'transparent',
            lineColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            tickColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            labels: {
              style: {
                color: isDark ? '#94a3b8' : '#64748b',
                fontSize: '11px',
                fontWeight: '500'
              }
            }
          },
          yAxis: {
            title: {
              text: 'Số lượng đăng ký',
              style: {
                color: isDark ? '#94a3b8' : '#64748b',
                fontWeight: '500'
              }
            },
            gridLineColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            labels: {
              style: {
                color: isDark ? '#94a3b8' : '#64748b'
              }
            }
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(19, 27, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            borderRadius: 16,
            shadow: true,
            useHTML: true,
            style: {
              color: isDark ? '#f8fafc' : '#0f172a'
            },
            headerFormat: '<div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px; font-weight: 500;">Ngày {point.key}</div>',
            pointFormat: '<div style="display: flex; align-items: center; gap: 6px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #3b82f6;"></span><strong>{point.y}</strong> học viên mới</div>'
          },
          plotOptions: {
            column: {
              borderRadius: 5,
              borderWidth: 0,
              maxPointWidth: 32,
              dataLabels: {
                enabled: true,
                style: {
                  fontSize: '10px',
                  fontWeight: '700',
                  color: isDark ? '#ffffff' : '#0f172a',
                  textOutline: 'none'
                }
              }
            }
          },
          series: [
            {
              name: 'Người dùng mới',
              data: counts,
              color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                  [0, '#3b82f6'],
                  [1, '#10b981']
                ]
              }
            }
          ],
          legend: {
            enabled: false
          },
          credits: {
            enabled: false
          }
        });
      }
    }
  }, [loading, error, analytics, isDark]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/analytics');
      setAnalytics(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu thống kê hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Reset gauge stroke offset to trigger sweep transition again
    setGaugeOffset(251.3);
    await fetchAnalytics();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        {/* Page Header Skeleton */}
        <div style={{ marginBottom: '40px', position: 'relative', zIndex: 1 }}>
          <div className="glass-skeleton-shimmer" style={{ height: '38px', width: '30%', marginBottom: '8px' }} />
          <div className="glass-skeleton-shimmer" style={{ height: '18px', width: '45%' }} />
        </div>

        {/* Stat Cards Skeleton Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 1
        }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className="glass-skeleton-card">
              <div className="glass-skeleton-shimmer" style={{ height: '40px', width: '40px', borderRadius: '12px' }} />
              <div>
                <div className="glass-skeleton-shimmer" style={{ height: '14px', width: '60%', marginBottom: '8px' }} />
                <div className="glass-skeleton-shimmer" style={{ height: '28px', width: '40%' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Section Skeleton */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="glass-skeleton-card" style={{ height: '360px' }}>
            <div className="glass-skeleton-shimmer" style={{ height: '20px', width: '50%', margin: '0 auto 20px' }} />
            <div className="glass-skeleton-shimmer" style={{ height: '160px', width: '160px', borderRadius: '50%', margin: '0 auto' }} />
            <div className="glass-skeleton-shimmer" style={{ height: '60px', width: '80%', borderRadius: '16px', margin: '20px auto 0' }} />
          </div>
          <div className="glass-skeleton-card" style={{ height: '360px' }}>
            <div className="glass-skeleton-shimmer" style={{ height: '20px', width: '40%', marginBottom: '8px' }} />
            <div className="glass-skeleton-shimmer" style={{ height: '14px', width: '60%', marginBottom: '30px' }} />
            <div className="glass-skeleton-shimmer" style={{ height: '200px', width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <ChartBarIcon size={56} style={{ marginBottom: '20px', opacity: 0.4, color: 'var(--text-muted)' }} />
        <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '12px' }}>{error}</h3>
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
    overallCompletionRate
  } = analytics || {};

  const statCards = [
    {
      label: 'Tổng người dùng',
      value: totalUsers || 0,
      icon: <UserIcon size={22} />,
      glowClass: 'card-glow-blue',
      iconBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    },
    {
      label: 'Tổng khóa học',
      value: totalCourses || 0,
      icon: <BookOpenIcon size={22} />,
      glowClass: 'card-glow-emerald',
      iconBg: 'linear-gradient(135deg, #10b981, #047857)',
    },
    {
      label: 'Tổng bài học',
      value: totalLessons || 0,
      icon: <AcademicCapIcon size={22} />,
      glowClass: 'card-glow-violet',
      iconBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    },
    {
      label: 'Tổng Quiz',
      value: totalQuizzes || 0,
      icon: <CheckIcon size={22} />,
      glowClass: 'card-glow-amber',
      iconBg: 'linear-gradient(135deg, #f59e0b, #b45309)',
    },
    {
      label: 'Tổng câu hỏi',
      value: totalQuestions || 0,
      icon: <ChartBarIcon size={22} />,
      glowClass: 'card-glow-rose',
      iconBg: 'linear-gradient(135deg, #f43f5e, #be123c)',
    },
  ];

  const completionPct = Math.round(overallCompletionRate || 0);

  return (
    <div className="relative min-h-screen" style={{ overflow: 'visible' }}>
      
      {/* Page Header (Smooth Fade In on Load) */}
      <div className="fade-in-up-load stagger-delay-0" style={{ marginBottom: '36px', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="dashboard-title text-3xl font-extrabold tracking-tight">
              Bảng Quản Trị
            </h1>
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl text-slate-400 hover:text-white transition-colors duration-200 sub-glass ${isRefreshing ? 'spin-anim' : ''}`}
              title="Làm mới dữ liệu"
              style={{ padding: '6px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '6px', fontWeight: 500 }}>
            Hệ thống quản trị hoạt động và thống kê học tập JavaMastery.
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid (Staggered Fade In on Load) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        {statCards.map((stat, idx) => (
          <div key={idx} className={`admin-glass-card ${stat.glowClass} fade-in-up-load stagger-delay-${idx + 1}`} style={{ padding: '24px' }}>
            <div className="card-content-wrap">
              {/* Icon Box */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '16px',
                background: stat.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                marginBottom: '20px',
                boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)'
              }}>
                {stat.icon}
              </div>
              <div>
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">
                  <CountUp end={stat.value} />
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphical Insights Section (Revealed when scrolled into viewport) */}
      <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-[1] mb-[40px]" delay={100}>
        
        {/* Semicircular Completion Gauge Card */}
        <div className="admin-glass-card card-glow-emerald" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              Tỷ Lệ Hoàn Thành Chung
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>Tiến độ bài học trung bình của toàn học viên</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
            <div className="gauge-svg-wrapper">
              <svg width="200" height="120" viewBox="0 0 200 120">
                {/* Background Semicircle Arc */}
                <path
                  className="gauge-path-bg"
                  d="M 20 110 A 80 80 0 0 1 180 110"
                  fill="none"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                {/* Active Semicircle Arc with Gradient (Sweeps dynamically on render) */}
                <path
                  className="gauge-progress"
                  d="M 20 110 A 80 80 0 0 1 180 110"
                  fill="none"
                  stroke="url(#gaugeEmeraldGradient)"
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeDasharray="251.3"
                  strokeDashoffset={gaugeOffset}
                />
                <defs>
                  <linearGradient id="gaugeEmeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#a3e635" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Inner Text Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: 0,
                right: 0,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  lineHeight: '1',
                  background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  <CountUp end={completionPct} />%
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>hoàn thành</span>
              </div>
            </div>
          </div>

          <div className="sub-glass" style={{ padding: '14px 18px', textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              margin: '0 auto 8px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckIcon size={16} />
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.4', fontWeight: 500 }}>
              Chỉ số phản ánh tỷ lệ hoàn thành trung bình tất cả các học viên tham gia học tập trên nền tảng.
            </p>
          </div>
        </div>

        {/* Highcharts Registrations Card */}
        <div className="admin-glass-card card-glow-blue" style={{ padding: '30px', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              Đăng Ký Theo Thời Gian
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>Biểu đồ thống kê số lượng tài khoản đăng ký mới</p>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {(!analytics?.userRegistrationsOverTime || Object.keys(analytics.userRegistrationsOverTime).length === 0) ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <ChartBarIcon size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Chưa thu thập đủ dữ liệu đăng ký mới.</p>
              </div>
            ) : (
              <div id="registration-chart-container" className="w-full" style={{ height: '240px' }} />
            )}
          </div>
        </div>

      </ScrollReveal>
    </div>
  );
};

export default AdminDashboard;
