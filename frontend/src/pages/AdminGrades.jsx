import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserIcon, XIcon, CheckIcon, BookOpenIcon, ClockIcon } from '../components/Icons';

const AdminGrades = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStudentsProgress();
  }, []);

  const fetchStudentsProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/students/progress');
      setStudents(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Không thể tải tiến độ học viên.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeSpent = (seconds) => {
    if (!seconds) return '—';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} phút ${secs} giây`;
    }
    return `${secs} giây`;
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Tiến Độ & Điểm Số
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Theo dõi tiến độ học tập và kết quả làm bài trắc nghiệm của học viên.
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--danger-light)',
          color: 'var(--danger)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          border: '1px solid rgba(239, 68, 68, 0.15)'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)'
            }}>
              <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: '16px', width: '30%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '12px', width: '50%' }} />
              </div>
              <div className="skeleton" style={{ width: '100px', height: '32px', borderRadius: 'var(--radius-sm)' }} />
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="card glass" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <UserIcon size={36} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '12px' }} />
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>Chưa có dữ liệu học viên</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Học viên cần tham gia lớp hoặc làm quiz để hiển thị tiến trình.</p>
        </div>
      ) : (
        <div className="card glass" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr 1fr',
            gap: '12px',
            padding: '14px 24px',
            backgroundColor: 'var(--surface-hover)',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }} className="grades-table-header">
            <span>Học viên</span>
            <span>Email</span>
            <span style={{ textAlign: 'center' }}>Bài học hoàn thành</span>
            <span style={{ textAlign: 'center' }}>Điểm Quiz trung bình</span>
            <span style={{ textAlign: 'center' }}>Chi tiết</span>
          </div>

          {/* Table Rows */}
          {students.map((student) => {
            const initials = student.username ? student.username.charAt(0).toUpperCase() : '?';
            return (
              <div
                key={student.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr 1fr',
                  gap: '12px',
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  transition: 'background-color var(--transition-fast)',
                }}
                className="grades-table-row"
              >
                {/* Username with avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  {student.avatarUrl ? (
                    <img 
                      src={student.avatarUrl} 
                      alt={student.username} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} 
                    />
                  ) : (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                  )}
                  <span style={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {student.username}
                  </span>
                </div>

                {/* Email */}
                <span style={{
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {student.email}
                </span>

                {/* Completed Lessons */}
                <div style={{ textAlign: 'center', fontWeight: 600 }}>
                  {student.completedLessonsCount}
                </div>

                {/* Avg Quiz Score */}
                <div style={{ textAlign: 'center', fontWeight: 600 }}>
                  {student.averageQuizScore > 0 ? (
                    <span style={{
                      color: student.averageQuizScore >= 70 ? 'var(--success)' : 'var(--danger)',
                      backgroundColor: student.averageQuizScore >= 70 ? 'var(--success-light)' : 'var(--danger-light)',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}>
                      {student.averageQuizScore.toFixed(1)}%
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa làm</span>
                  )}
                </div>

                {/* Action button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => handleOpenDetails(student)}
                    className="btn btn-outline"
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quiz History Details Modal */}
      {isModalOpen && selectedStudent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="card glass animate-scale-in" style={{
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                  Lịch Sử Làm Quiz: {selectedStudent.username}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                  {selectedStudent.email}
                </p>
              </div>
              <button onClick={handleCloseDetails} className="btn btn-outline" style={{ padding: '6px', border: 'none' }}>
                <XIcon size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {!selectedStudent.quizAttempts || selectedStudent.quizAttempts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  Học viên này chưa thực hiện bài kiểm tra nào.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedStudent.quizAttempts.map((attempt) => (
                    <div key={attempt.id} style={{
                      padding: '16px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}>
                      <div>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.5px'
                        }}>
                          {attempt.courseName}
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0 6px 0' }}>
                          {attempt.quizTitle}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ClockIcon size={14} />
                            {formatTimeSpent(attempt.timeSpentSeconds)}
                          </span>
                          <span>|</span>
                          <span>Đã làm: {formatDateTime(attempt.attemptedAt)}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: attempt.passed ? 'var(--success)' : 'var(--danger)' }}>
                            {attempt.score.toFixed(0)}%
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Đúng {attempt.correctAnswers}/{attempt.totalQuestions} câu
                          </div>
                        </div>

                        <span className={`badge ${attempt.passed ? 'badge-passed' : 'badge-failed'}`} style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                          {attempt.passed ? 'Đạt' : 'Trượt'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS details */}
      <style>{`
        .grades-table-row:hover {
          background-color: var(--surface-hover);
        }
        @media (max-width: 768px) {
          .grades-table-header,
          .grades-table-row {
            grid-template-columns: 1fr 1fr !important;
          }
          .grades-table-header span:nth-child(n+3),
          .grades-table-row > *:nth-child(n+3) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminGrades;
