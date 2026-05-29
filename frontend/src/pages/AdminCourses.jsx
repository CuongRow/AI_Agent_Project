import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BookOpenIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  AcademicCapIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from '../components/Icons';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Course expansion for viewing lessons
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [lessonsMap, setLessonsMap] = useState({}); // { courseId: lessonsList }
  const [lessonsLoading, setLessonsLoading] = useState({});

  // Pagination for courses
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Modals / Forms state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchCourses();
  }, [page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/courses?page=${page}&size=${pageSize}`);
      setCourses(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách khóa học.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedCourseId(null);
    setFormData({ title: '', description: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setModalMode('edit');
    setSelectedCourseId(course.id);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      imageUrl: course.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setSubmitting(true);
      if (modalMode === 'create') {
        const response = await api.post('/api/courses', formData);
        setCourses(prev => [response.data, ...prev]);
        setTotalElements(prev => prev + 1);
      } else {
        const response = await api.put(`/api/courses/${selectedCourseId}`, formData);
        setCourses(prev => prev.map(c => c.id === selectedCourseId ? response.data : c));
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Không thể lưu thông tin khóa học. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseTitle}"? Thao tác này không thể hoàn tác.`);
    if (!isConfirmed) return;

    try {
      await api.delete(`/api/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setTotalElements(prev => Math.max(0, prev - 1));
      if (expandedCourseId === courseId) {
        setExpandedCourseId(null);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể xóa khóa học. Vui lòng thử lại.');
    }
  };

  const toggleExpandCourse = async (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }

    setExpandedCourseId(courseId);

    // If lessons already loaded, don't load again unless needed
    if (lessonsMap[courseId]) return;

    try {
      setLessonsLoading(prev => ({ ...prev, [courseId]: true }));
      const response = await api.get(`/api/courses/${courseId}/lessons?size=100`);
      setLessonsMap(prev => ({ ...prev, [courseId]: response.data.content || [] }));
    } catch (err) {
      console.error(err);
    } finally {
      setLessonsLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            Quản Lý Khóa Học
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Hệ thống quản lý tài liệu và phân phối chương trình giảng dạy.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary" style={{ padding: '12px 20px' }}>
          <PlusIcon size={18} />
          <span>Tạo Khóa Học</span>
        </button>
      </div>

      {/* Controls: Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <SearchIcon size={18} />
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Tìm thấy <strong>{filteredCourses.length}</strong> khóa học
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--danger-light)',
          color: 'var(--danger)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} className="card" style={{ height: '140px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="skeleton" style={{ height: '24px', width: '30%' }} />
              <div className="skeleton" style={{ height: '40px', width: '100%' }} />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <BookOpenIcon size={48} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '16px' }} />
          <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Chưa có khóa học nào</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Hãy bắt đầu bằng cách tạo một khóa học mới.</p>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">Tạo ngay</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredCourses.map(course => {
            const isExpanded = expandedCourseId === course.id;
            const courseLessons = lessonsMap[course.id] || [];
            const courseLessonsLoading = lessonsLoading[course.id];

            return (
              <div key={course.id} className="card" style={{
                padding: 0,
                overflow: 'hidden',
                borderColor: isExpanded ? 'var(--primary)' : 'var(--border)',
                transition: 'all var(--transition-fast)'
              }}>
                {/* Course Header Bar */}
                <div style={{
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '24px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ flex: 1, minWidth: '280px', cursor: 'pointer' }} onClick={() => toggleExpandCourse(course.id)}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{ color: isExpanded ? 'var(--primary)' : 'inherit' }}>{course.title}</span>
                      <span style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        borderRadius: '12px',
                        fontWeight: 600
                      }}>
                        {course.lessonCount || 0} bài học
                      </span>
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {course.description}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>Ngày tạo: <strong>{formatDate(course.createdAt)}</strong></span>
                      {course.lastModifiedAt && (
                        <>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--border)', alignSelf: 'center' }} />
                          <span>Cập nhật: <strong>{formatDate(course.lastModifiedAt)}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => toggleExpandCourse(course.id)}
                      className="btn btn-outline"
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    >
                      {isExpanded ? 'Thu gọn' : 'Xem bài học'}
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(course)}
                      className="btn btn-outline"
                      style={{ padding: '8px 10px', color: 'var(--primary)', borderColor: 'rgba(37,99,235,0.2)' }}
                      title="Sửa khóa học"
                    >
                      <EditIcon size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      className="btn btn-outline"
                      style={{ padding: '8px 10px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                      title="Xóa khóa học"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>

                {/* Lessons Expanded Detail Section */}
                {isExpanded && (
                  <div style={{
                    backgroundColor: 'var(--surface-hover)',
                    borderTop: '1px solid var(--border)',
                    padding: '24px'
                  }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-main)' }}>
                      Danh sách bài học
                    </h4>

                    {courseLessonsLoading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[1, 2, 3].map(n => (
                          <div key={n} className="skeleton" style={{ height: '44px', borderRadius: 'var(--radius-sm)' }} />
                        ))}
                      </div>
                    ) : courseLessons.length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Chưa có bài học nào trong khóa này.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {courseLessons.map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              backgroundColor: 'var(--surface)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border)',
                              fontSize: '0.9rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', width: '20px' }}>
                                {idx + 1}.
                              </span>
                              <span style={{
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {lesson.title}
                              </span>
                              {lesson.difficulty && (
                                <span style={{
                                  fontSize: '0.68rem',
                                  padding: '1px 6px',
                                  borderRadius: '3px',
                                  backgroundColor: 'var(--primary-light)',
                                  color: 'var(--primary)',
                                  fontWeight: 600,
                                  marginLeft: '8px',
                                  flexShrink: 0
                                }}>
                                  {lesson.difficulty}
                                </span>
                              )}
                            </div>
                            
                            {lesson.quizId ? (
                              <span style={{
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                backgroundColor: 'var(--accent-light)',
                                color: 'var(--accent)',
                                borderRadius: '4px',
                                fontWeight: 600,
                                flexShrink: 0
                              }}>
                                Có Quiz
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                                Không có Quiz
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '28px',
        }}>
          <button
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="btn btn-outline"
            style={{ padding: '8px 14px', opacity: page === 0 ? 0.4 : 1 }}
          >
            <ChevronLeftIcon size={16} />
          </button>

          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  border: i === page ? '2px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: i === page ? 'var(--primary-light)' : 'transparent',
                  color: i === page ? 'var(--primary)' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: i === page ? 700 : 500,
                  fontSize: '0.85rem',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={page >= totalPages - 1}
            className="btn btn-outline"
            style={{ padding: '8px 14px', opacity: page >= totalPages - 1 ? 0.4 : 1 }}
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      )}

      {/* Create/Edit Glass Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          {/* Backdrop */}
          <div onClick={handleCloseModal} style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }} />

          {/* Modal Container */}
          <div className="glass" style={{
            width: '100%',
            maxWidth: '550px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
                {modalMode === 'create' ? 'Tạo Khóa Học Mới' : 'Cập Nhật Khóa Học'}
              </h3>
              <button onClick={handleCloseModal} className="btn btn-outline" style={{ padding: '6px', border: 'none' }}>
                <XIcon size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div className="form-group">
                <label className="form-label">Tên khóa học *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Nhập tên khóa học (ví dụ: Java Core Master)"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mô tả khóa học</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  placeholder="Mô tả tóm tắt về nội dung và lộ trình khóa học..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Đường dẫn ảnh đại diện (Image URL)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
              </div>

              {/* Actions Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '32px'
              }}>
                <button type="button" onClick={handleCloseModal} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px' }}
                >
                  {submitting ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
