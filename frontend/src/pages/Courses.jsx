import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { BookOpenIcon, SearchIcon, AcademicCapIcon } from '../components/Icons';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courseProgress, setCourseProgress] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch all courses (paginated, but we can display the first page or set a larger size if needed)
      const response = await api.get('/api/courses?size=50');
      const coursesList = response.data.content || [];
      setCourses(coursesList);
      
      // Fetch progress for each course to calculate the completion rate
      const progressMap = {};
      await Promise.all(coursesList.map(async (course) => {
        try {
          const res = await api.get(`/api/courses/${course.id}/lessons?size=100`);
          const lessons = res.data.content || [];
          const total = lessons.length;
          const completed = lessons.filter(l => l.completed).length;
          progressMap[course.id] = {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            firstLessonId: lessons[0]?.id || null,
            firstIncompleteLessonId: lessons.find(l => !l.completed)?.id || lessons[0]?.id || null
          };
        } catch (err) {
          console.error(`Failed to fetch lessons for course ${course.id}`, err);
        }
      }));
      setCourseProgress(progressMap);
    } catch (err) {
      setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = (courseId) => {
    const progress = courseProgress[courseId];
    if (progress) {
      const targetLessonId = progress.firstIncompleteLessonId || progress.firstLessonId;
      if (targetLessonId) {
        navigate(`/courses/${courseId}/lessons/${targetLessonId}`);
      } else {
        alert('Khóa học này hiện chưa có bài học nào.');
      }
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '6px' }}>
            Khóa Học Java
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Lựa chọn khóa học phù hợp với trình độ của bạn</p>
        </div>

        {/* Search Box */}
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
        // Skeleton Loader
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-md)' }}></div>
              <div className="skeleton" style={{ height: '24px', width: '60%' }}></div>
              <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
              <div className="skeleton" style={{ height: '36px', width: '40%', marginTop: 'auto' }}></div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}>
          <BookOpenIcon size={48} className="text-muted" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Không tìm thấy khóa học</h3>
          <p style={{ color: 'var(--text-muted)' }}>Hãy thử tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {filteredCourses.map((course) => {
            const progress = courseProgress[course.id] || { percentage: 0, completed: 0, total: 0 };
            const hasStarted = progress.completed > 0;
            const isCompleted = progress.completed === progress.total && progress.total > 0;

            // Generate a premium dynamic color background gradient based on ID
            const gradients = [
              'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              'linear-gradient(135deg, #db2777 0%, #be185d 100%)'
            ];
            const headerGradient = gradients[course.id % gradients.length];

            return (
              <div key={course.id} className="card interactive" style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: 0
              }}>
                <div style={{
                  background: course.imageUrl ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${course.imageUrl}) center/cover no-repeat` : headerGradient,
                  height: '120px',
                  padding: '20px 24px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'flex-end',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {progress.total} Bài học
                  </div>
                  <AcademicCapIcon size={32} style={{ opacity: 0.15, position: 'absolute', right: '16px', bottom: '8px', transform: 'scale(2.5)' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {course.title}
                  </h3>
                </div>

                {/* Course Details Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    marginBottom: '24px',
                    flex: 1
                  }}>
                    {course.description}
                  </p>

                  {/* Progress Section */}
                  {progress.total > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 500, marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Tiến độ học tập</span>
                        <span style={{ color: isCompleted ? 'var(--success)' : 'var(--text-main)' }}>
                          {isCompleted ? 'Đã hoàn thành' : `${progress.percentage}%`}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${progress.percentage}%`,
                          height: '100%',
                          backgroundColor: isCompleted ? 'var(--success)' : 'var(--primary)',
                          borderRadius: '3px',
                          transition: 'width 0.5s ease'
                        }}></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartCourse(course.id)}
                    className={`btn ${isCompleted ? 'btn-outline' : 'btn-primary'}`}
                    style={{ width: '100%', padding: '12px' }}
                  >
                    {isCompleted ? 'Học lại' : hasStarted ? 'Tiếp tục học' : 'Bắt đầu học'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;
