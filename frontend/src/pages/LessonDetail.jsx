import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { 
  BookmarkIcon, 
  CheckIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  AcademicCapIcon 
} from '../components/Icons';

const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [courseLessons, setCourseLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId]);

  useEffect(() => {
    fetchLessonDetails();
  }, [lessonId]);

  const fetchCourseAndLessons = async () => {
    try {
      setLoading(true);
      // Fetch course details for title
      const courseResponse = await api.get(`/api/courses/${courseId}`);
      setCourseTitle(courseResponse.data.title);

      // Fetch all lessons of the course
      const lessonsResponse = await api.get(`/api/courses/${courseId}/lessons?size=100`);
      setCourseLessons(lessonsResponse.data.content || []);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách bài học của khóa học.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonDetails = async () => {
    try {
      setLessonLoading(true);
      const response = await api.get(`/api/lessons/${lessonId}`);
      setCurrentLesson(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải nội dung bài học.');
    } finally {
      setLessonLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!currentLesson) return;
    try {
      const response = await api.post(`/api/student/lessons/${lessonId}/bookmark`);
      const updatedBookmark = response.data;
      
      // Update local state for bookmark status
      setCurrentLesson(prev => ({
        ...prev,
        bookmarked: !prev.bookmarked
      }));

      // Update sidebar list state
      setCourseLessons(prev => prev.map(l => 
        l.id === parseInt(lessonId) ? { ...l, bookmarked: !l.bookmarked } : l
      ));
    } catch (err) {
      alert('Không thể cập nhật trạng thái lưu trữ.');
    }
  };

  const toggleCompletion = async () => {
    if (!currentLesson) return;
    try {
      const isCurrentlyCompleted = currentLesson.completed;
      if (isCurrentlyCompleted) {
        // Mark incomplete
        await api.delete(`/api/student/lessons/${lessonId}/complete`);
      } else {
        // Mark complete
        await api.post(`/api/student/lessons/${lessonId}/complete`);
      }

      // Update states
      setCurrentLesson(prev => ({
        ...prev,
        completed: !prev.completed
      }));

      setCourseLessons(prev => prev.map(l => 
        l.id === parseInt(lessonId) ? { ...l, completed: !l.completed } : l
      ));
    } catch (err) {
      alert('Không thể cập nhật tiến trình học tập.');
    }
  };

  // Find index of current lesson to handle Next/Previous
  const currentIdx = courseLessons.findIndex(l => l.id === parseInt(lessonId));
  const prevLesson = currentIdx > 0 ? courseLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < courseLessons.length - 1 ? courseLessons[currentIdx + 1] : null;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 128px)', margin: '-32px' }} className="lesson-split-layout">
      {/* Left pane: Lessons list */}
      <aside style={{
        width: '300px',
        borderRight: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }} className="lessons-sidebar">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <Link to="/courses" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <ChevronLeftIcon size={14} />
            <span>Tất cả khóa học</span>
          </Link>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {courseTitle || 'Đang tải...'}
          </h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }} className="lessons-list">
          {loading ? (
            [1, 2, 3, 4].map(n => (
              <div key={n} className="skeleton" style={{ height: '48px', margin: '8px 0', borderRadius: 'var(--radius-sm)' }}></div>
            ))
          ) : (
            courseLessons.map((lesson, idx) => {
              const isActive = lesson.id === parseInt(lessonId);
              return (
                <Link
                  key={lesson.id}
                  to={`/courses/${courseId}/lessons/${lesson.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '6px',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9rem',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="lesson-list-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '16px' }}>{idx + 1}.</span>
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>{lesson.title}</span>
                  </div>
                  
                  {lesson.completed && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--success)',
                      color: '#ffffff',
                      flexShrink: 0
                    }}>
                      <CheckIcon size={12} />
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </aside>

      {/* Right/Main pane: Lesson content reader */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--background)',
        minWidth: 0
      }} className="lesson-main-content">
        
        {lessonLoading ? (
          <div style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton" style={{ height: '36px', width: '50%' }}></div>
            <div className="skeleton" style={{ height: '20px', width: '30%' }}></div>
            <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
            <div className="skeleton" style={{ height: '150px', width: '100%' }}></div>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>
            <button className="btn btn-primary" onClick={fetchLessonDetails}>Thử lại</button>
          </div>
        ) : (
          <>
            {/* Lesson Title Area */}
            <div style={{
              padding: '32px 40px',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '16px'
            }} className="lesson-header">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
                  {currentLesson.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>Độ khó: <strong style={{ color: 'var(--primary)' }}>{currentLesson.difficulty}</strong></span>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--border)' }}></div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {currentLesson.completed ? (
                      <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <CheckIcon size={14} /> Đã hoàn thành
                      </span>
                    ) : (
                      'Chưa hoàn thành'
                    )}
                  </span>
                </div>
              </div>

              {/* Top controls */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={toggleBookmark}
                  className="btn btn-outline"
                  style={{
                    padding: '10px 16px',
                    borderColor: currentLesson.bookmarked ? 'var(--accent)' : 'var(--border)',
                    color: currentLesson.bookmarked ? 'var(--accent)' : 'var(--text-main)',
                    backgroundColor: currentLesson.bookmarked ? 'var(--accent-light)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <BookmarkIcon size={16} fill={currentLesson.bookmarked ? 'currentColor' : 'none'} />
                  <span>{currentLesson.bookmarked ? 'Đã lưu' : 'Lưu bài viết'}</span>
                </button>

                <button
                  onClick={toggleCompletion}
                  className={`btn ${currentLesson.completed ? 'btn-outline' : 'btn-primary'}`}
                  style={{
                    padding: '10px 16px',
                    borderColor: currentLesson.completed ? 'var(--success)' : 'var(--primary)',
                    color: currentLesson.completed ? 'var(--success)' : '#ffffff',
                    backgroundColor: currentLesson.completed ? 'var(--success-light)' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckIcon size={16} />
                  <span>{currentLesson.completed ? 'Đã học (Hủy)' : 'Đánh dấu đã học'}</span>
                </button>
              </div>
            </div>

            {/* Markdown Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '40px',
              maxWidth: '850px',
              width: '100%',
              margin: '0 auto',
              backgroundColor: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              borderRight: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }} className="lesson-body-container">
              <article className="markdown-body">
                <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
              </article>
            </div>

            {/* Bottom sticky navigation and Quiz launcher */}
            <div style={{
              padding: '20px 40px',
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              bottom: 0,
              zIndex: 10
            }} className="lesson-footer">
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  disabled={!prevLesson}
                  onClick={() => navigate(`/courses/${courseId}/lessons/${prevLesson.id}`)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', opacity: prevLesson ? 1 : 0.4 }}
                >
                  <ChevronLeftIcon size={16} />
                  <span>Bài trước</span>
                </button>
                
                <button
                  disabled={!nextLesson}
                  onClick={() => navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', opacity: nextLesson ? 1 : 0.4 }}
                >
                  <span>Bài tiếp theo</span>
                  <ChevronRightIcon size={16} />
                </button>
              </div>

              {/* Quiz Link */}
              {currentLesson.quizId ? (
                <Link
                  to={`/lessons/${lessonId}/quizzes`}
                  className="btn btn-secondary"
                  style={{
                    padding: '10px 24px',
                    boxShadow: '0 4px 10px rgba(13, 148, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600
                  }}
                >
                  <AcademicCapIcon size={18} />
                  <span>Làm Quiz Kiểm Tra</span>
                </Link>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bài học này không có Quiz</span>
              )}
            </div>
          </>
        )}
      </section>

      {/* Sidebar responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          .lesson-split-layout {
            flex-direction: column !important;
            margin: 0 !important;
          }
          .lessons-sidebar {
            width: 100% !important;
            height: 200px !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }
          .lessons-list {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            gap: 10px !important;
            padding: 12px !important;
          }
          .lesson-list-item {
            margin-bottom: 0 !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
          }
          .lesson-main-content {
            min-height: calc(100vh - 328px) !important;
          }
          .lesson-header, .lesson-footer {
            padding: 16px 20px !important;
          }
          .lesson-body-container {
            padding: 20px !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonDetail;
