import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  CheckIcon,
  XIcon
} from '../components/Icons';

const QuizHistory = () => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/student/quiz-history');
      setHistoryData(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải lịch sử thi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (seconds == null) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up">
        <div className="skeleton" style={{ height: '36px', width: '30%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '18px', width: '50%', marginBottom: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="card" style={{ height: '120px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="skeleton" style={{ height: '18px', width: '60%' }} />
              <div className="skeleton" style={{ height: '32px', width: '40%' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div className="card" style={{ height: '280px' }} />
          <div className="card" style={{ height: '280px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card animate-scale-in" style={{ textAlign: 'center', padding: '60px 24px', maxWidth: '500px', margin: '40px auto' }}>
        <TrophyIcon size={48} style={{ color: 'var(--danger)', marginBottom: '16px', margin: '0 auto' }} />
        <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Lỗi xảy ra</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error}</p>
        <button className="btn btn-primary" onClick={fetchHistory} style={{ margin: '0 auto' }}>Thử lại</button>
      </div>
    );
  }

  const { totalAttempts = 0, averageScore = 0, highestScore = 0, passRate = 0, recentAttempts = [], scoreDistribution = {} } = historyData || {};

  // Empty state
  if (recentAttempts.length === 0) {
    return (
      <div className="animate-fade-in-up" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <TrophyIcon size={40} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>
          Chưa Có Lịch Sử Thi Quiz
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
          Bạn chưa làm bài kiểm tra hoặc câu hỏi quiz nào. Hãy tham gia học các bài học và thử sức với các câu hỏi quiz để theo dõi sự tiến bộ của mình tại đây!
        </p>
        <Link to="/courses" className="btn btn-primary">
          Khám phá bài học ngay
          <ChevronRightIcon size={16} />
        </Link>
      </div>
    );
  }

  // Draw trend line chart
  const scores = recentAttempts.slice().reverse().map(a => a.score);
  const trendLabels = recentAttempts.slice().reverse().map((a, i) => `Lần ${i + 1}`);

  // Chart coordinate parameters
  const svgWidth = 500;
  const svgHeight = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate points
  const points = scores.map((score, index) => {
    const x = paddingLeft + (index / Math.max(1, scores.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (score / 100) * chartHeight;
    return { x, y, score, index };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = points.length > 0 
    ? `${points[0].x},${paddingTop + chartHeight} ${polylinePoints} ${points[points.length - 1].x},${paddingTop + chartHeight}` 
    : '';

  // Distribute distribution values
  const distributionData = [
    { label: '0-40', value: scoreDistribution['0-40'] || 0 },
    { label: '40-60', value: scoreDistribution['40-60'] || 0 },
    { label: '60-80', value: scoreDistribution['60-80'] || 0 },
    { label: '80-100', value: scoreDistribution['80-100'] || 0 },
  ];
  const maxDistValue = Math.max(...distributionData.map(d => d.value), 1);

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Lịch Sử Thi & Thống Kê 📊
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Đánh giá chi tiết năng lực học tập và tiến trình vượt qua các bài thi.
        </p>
      </div>

      {/* Hero Stats Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Total Attempts */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AcademicCapIcon size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Tổng số lần làm</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{totalAttempts} lần</p>
          </div>
        </div>

        {/* Average Score */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--info-light)',
            color: 'var(--info)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ChartBarIcon size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Điểm trung bình</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--info)' }}>
              {averageScore.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Highest Score */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <TrophyIcon size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Điểm cao nhất</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
              {highestScore.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CheckIcon size={20} />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>Tỷ lệ đỗ (≥80%)</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--success)' }}>
              {passRate.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Graphs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '36px'
      }}>
        {/* Trend line chart card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
            Biểu Đồ Xu Hướng Điểm Số (%)
          </h3>
          <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {points.length > 1 ? (
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="220" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Guide Lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const yVal = paddingTop + chartHeight - (val / 100) * chartHeight;
                  return (
                    <g key={val}>
                      <line
                        x1={paddingLeft}
                        y1={yVal}
                        x2={svgWidth - paddingRight}
                        y2={yVal}
                        stroke="var(--border)"
                        strokeDasharray="4,4"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingLeft - 10}
                        y={yVal + 4}
                        textAnchor="end"
                        fontSize="10"
                        fontWeight="500"
                        fill="var(--text-muted)"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Area Gradient */}
                {areaPoints && (
                  <polygon points={areaPoints} fill="url(#chartGradient)" />
                )}

                {/* Connected Line */}
                {polylinePoints && (
                  <polyline
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylinePoints}
                  />
                )}

                {/* Data Points */}
                {points.map((p) => (
                  <g key={p.id} className="chart-node" style={{ cursor: 'pointer' }}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="6"
                      fill="var(--surface)"
                      stroke="var(--primary)"
                      strokeWidth="3"
                      style={{ transition: 'transform 0.2s' }}
                    />
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="var(--primary)"
                    >
                      {p.score.toFixed(0)}%
                    </text>
                    <text
                      x={p.x}
                      y={svgHeight - 10}
                      textAnchor="middle"
                      fontSize="9"
                      fill="var(--text-muted)"
                      fontWeight="500"
                    >
                      {trendLabels[p.index]}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center', fontSize: '0.9rem' }}>
                Cần làm thêm quiz để vẽ biểu đồ xu hướng.
              </div>
            )}
          </div>
        </div>

        {/* Distribution bar chart card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
            Phân Bố Điểm Số (Số Lần)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', flex: 1 }}>
            {distributionData.map((d, index) => {
              const pct = (d.value / maxDistValue) * 100;
              let barColor = 'var(--danger)';
              if (d.label === '40-60') barColor = 'var(--accent)';
              else if (d.label === '60-80') barColor = 'var(--info)';
              else if (d.label === '80-100') barColor = 'var(--success)';

              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '56px', color: 'var(--text-muted)' }}>
                    {d.label}%
                  </span>
                  <div style={{ flex: 1, height: '16px', backgroundColor: 'var(--surface-hover)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.max(pct, d.value > 0 ? 5 : 0)}%`,
                      height: '100%',
                      backgroundColor: barColor,
                      borderRadius: '9999px',
                      transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, width: '32px', textAlign: 'right' }}>
                    {d.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attempts History List */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>
          Lịch Sử Làm Bài Gần Đây
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentAttempts.map((attempt) => (
            <div
              key={attempt.id}
              className="card"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                gap: '16px',
                borderLeft: `5px solid ${attempt.passed ? 'var(--success)' : 'var(--danger)'}`
              }}
            >
              <div style={{ flex: 1, minWidth: '220px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {attempt.courseName}
                </p>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>{attempt.quizTitle}</h4>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ClockIcon size={14} />
                    {formatDate(attempt.attemptedAt)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ClockIcon size={14} />
                    Thời gian: {formatDuration(attempt.timeSpentSeconds)}
                  </span>
                </div>
              </div>

              {/* Score Display & Status Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 500 }}>Kết quả</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    {attempt.correctAnswers}/{attempt.totalQuestions} đúng
                  </p>
                </div>
                <div style={{ minWidth: '100px', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', display: 'block', color: attempt.passed ? 'var(--success)' : 'var(--danger)', lineHeight: 1 }}>
                    {attempt.score.toFixed(0)}%
                  </span>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: attempt.passed ? 'var(--success)' : 'var(--danger)',
                    marginTop: '4px',
                    letterSpacing: '0.05em'
                  }}>
                    {attempt.passed ? 'ĐẠT YÊU CẦU' : 'CHƯA ĐẠT'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {attempt.passed ? (
                    <span className="badge badge-passed" style={{ padding: '8px' }}>
                      <CheckIcon size={16} />
                    </span>
                  ) : (
                    <span className="badge badge-failed" style={{ padding: '8px' }}>
                      <XIcon size={16} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;
