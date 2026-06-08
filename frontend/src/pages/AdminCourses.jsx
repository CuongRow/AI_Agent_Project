import { useState, useEffect } from 'react';
import { useCourses } from '../hooks/useCourses';
import { useLessons } from '../hooks/useLessons';
import {
  BookOpenIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from '../components/Icons';

const AdminCourses = () => {
  const {
    courses,
    loading,
    error: errorMsg,
    totalPages,
    page,
    setPage,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourses(0, 10);

  const {
    lessonsMap,
    lessonsLoading,
    uploadingFile,
    uploadProgress,
    uploadedFileUrl,
    setUploadedFileUrl,
    quizSubmitting,
    quizDeleting,
    fetchLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    uploadFile,
    getQuiz,
    saveQuiz,
    deleteQuiz,
  } = useLessons();

  const error = errorMsg; // Keep variable compatibility for JSX
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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

  // Lesson modal states
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonModalMode, setLessonModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [lessonSubmitting, setLessonSubmitting] = useState(false);
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    difficulty: 'BEGINNER',
    content: ''
  });

  // Quiz modal states
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedQuizLessonId, setSelectedQuizLessonId] = useState(null);
  const [quizData, setQuizData] = useState({
    id: null,
    title: '',
    questions: []
  });

  useEffect(() => {
    fetchCourses(page);
  }, [page, fetchCourses]);

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
        await createCourse(formData);
        showToast('Tạo khóa học thành công!', 'success');
      } else {
        await updateCourse(selectedCourseId, formData);
        showToast('Cập nhật khóa học thành công!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        showToast('Lỗi: ' + err.response.data.message, 'danger');
      } else {
        showToast('Không thể lưu thông tin khóa học. Vui lòng kiểm tra lại.', 'danger');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseTitle}"? Thao tác này không thể hoàn tác.`);
    if (!isConfirmed) return;

    try {
      await deleteCourse(courseId);
      showToast('Xóa khóa học thành công!', 'success');
      if (expandedCourseId === courseId) {
        setExpandedCourseId(null);
      }
    } catch (err) {
      console.error(err);
      showToast('Không thể xóa khóa học. Vui lòng thử lại.', 'danger');
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
      await fetchLessons(courseId);
    } catch (err) {
      console.error(err);
      showToast('Không thể tải danh sách bài học.', 'danger');
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

  // Lesson actions
  const handleOpenLessonCreateModal = (courseId) => {
    setSelectedCourseId(courseId);
    setLessonModalMode('create');
    setSelectedLessonId(null);
    setLessonFormData({
      title: '',
      difficulty: 'BEGINNER',
      content: ''
    });
    setUploadedFileUrl('');
    setIsLessonModalOpen(true);
  };

  const handleOpenLessonEditModal = (courseId, lesson) => {
    setSelectedCourseId(courseId);
    setLessonModalMode('edit');
    setSelectedLessonId(lesson.id);
    setLessonFormData({
      title: lesson.title || '',
      difficulty: lesson.difficulty || 'BEGINNER',
      content: lesson.content || ''
    });
    setUploadedFileUrl('');
    setIsLessonModalOpen(true);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonFormData.title.trim()) return;

    try {
      setLessonSubmitting(true);
      if (lessonModalMode === 'create') {
        await createLesson(selectedCourseId, lessonFormData);
        showToast('Thêm bài học thành công!', 'success');
      } else {
        await updateLesson(selectedCourseId, selectedLessonId, lessonFormData);
        showToast('Cập nhật bài học thành công!', 'success');
      }
      setIsLessonModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Không thể lưu thông tin bài học.', 'danger');
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleDeleteLesson = async (courseId, lessonId, lessonTitle) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa bài học "${lessonTitle}"? Thao tác này không thể hoàn tác.`);
    if (!isConfirmed) return;

    try {
      await deleteLesson(courseId, lessonId);
      showToast('Xóa bài học thành công!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Không thể xóa bài học.', 'danger');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadFile(file);
      showToast('Tải tệp lên thành công!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Không thể tải tệp lên.', 'danger');
    }
  };

  const insertMaterialLink = () => {
    if (!uploadedFileUrl) return;
    const isVideo = uploadedFileUrl.endsWith('.mp4');
    const linkText = isVideo 
      ? `\n\n<video controls src="${uploadedFileUrl}" style="width:100%; max-height:400px; border-radius:8px;"></video>\n\n`
      : `\n\n[Tải tài liệu đính kèm](${uploadedFileUrl})\n\n`;
      
    setLessonFormData(prev => ({
      ...prev,
      content: prev.content + linkText
    }));
  };

  // Quiz actions
  const handleOpenQuizModal = async (lessonId) => {
    setSelectedQuizLessonId(lessonId);
    setIsQuizModalOpen(true);
    setQuizData({ id: null, title: 'Trắc nghiệm bài học', questions: [] });
    
    try {
      const data = await getQuiz(lessonId);
      if (data) {
        setQuizData(data);
      }
    } catch {
      setQuizData({
        id: null,
        title: 'Trắc nghiệm bài học',
        questions: []
      });
    }
  };

  const handleAddQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [
        ...(prev.questions || []),
        {
          content: '',
          explanation: '',
          questionType: 'SINGLE_CHOICE',
          answers: [
            { answerText: '', correct: false },
            { answerText: '', correct: false }
          ]
        }
      ]
    }));
  };

  const handleRemoveQuestion = (qIdx) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== qIdx)
    }));
  };

  const handleQuestionChange = (qIdx, field, value) => {
    setQuizData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx] = {
        ...updatedQuestions[qIdx],
        [field]: value
      };
      
      if (field === 'questionType' && value === 'SINGLE_CHOICE') {
        let hasCorrect = false;
        updatedQuestions[qIdx].answers = updatedQuestions[qIdx].answers.map(ans => {
          if (ans.correct && !hasCorrect) {
            hasCorrect = true;
            return ans;
          }
          return { ...ans, correct: false };
        });
      }
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAddAnswer = (qIdx) => {
    setQuizData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx].answers = [
        ...updatedQuestions[qIdx].answers,
        { answerText: '', correct: false }
      ];
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleRemoveAnswer = (qIdx, aIdx) => {
    setQuizData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIdx].answers = updatedQuestions[qIdx].answers.filter((_, idx) => idx !== aIdx);
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAnswerChange = (qIdx, aIdx, field, value) => {
    setQuizData(prev => {
      const updatedQuestions = [...prev.questions];
      const q = updatedQuestions[qIdx];
      
      if (field === 'correct') {
        if (q.questionType === 'SINGLE_CHOICE') {
          q.answers = q.answers.map((ans, idx) => ({
            ...ans,
            correct: idx === aIdx ? value : false
          }));
        } else {
          q.answers[aIdx] = { ...q.answers[aIdx], correct: value };
        }
      } else {
        q.answers[aIdx] = { ...q.answers[aIdx], [field]: value };
      }
      
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!quizData.title.trim()) return;

    for (let i = 0; i < (quizData.questions?.length || 0); i++) {
      const q = quizData.questions[i];
      if (!q.content.trim()) {
        showToast(`Vui lòng nhập nội dung cho câu hỏi số ${i + 1}`, 'warning');
        return;
      }
      if (q.answers.length < 2) {
        showToast(`Mỗi câu hỏi phải có ít nhất 2 đáp án lựa chọn (Câu hỏi số ${i + 1})`, 'warning');
        return;
      }
      const hasCorrect = q.answers.some(ans => ans.correct);
      if (!hasCorrect) {
        showToast(`Vui lòng chọn ít nhất một đáp án đúng cho câu hỏi số ${i + 1}`, 'warning');
        return;
      }
    }

    try {
      await saveQuiz(selectedQuizLessonId, quizData);
      showToast('Đã lưu bộ câu hỏi Quiz thành công!', 'success');
      setIsQuizModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Không thể lưu bộ câu hỏi Quiz.', 'danger');
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quizData.id) return;
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa bộ câu hỏi trắc nghiệm này?');
    if (!isConfirmed) return;

    try {
      await deleteQuiz(selectedQuizLessonId, quizData.id);
      showToast('Đã xóa bộ câu hỏi Quiz thành công!', 'success');
      setIsQuizModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Không thể xóa bộ câu hỏi Quiz.', 'danger');
    }
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
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                        Danh sách bài học
                      </h4>
                      <button
                        onClick={() => handleOpenLessonCreateModal(course.id)}
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                      >
                        <PlusIcon size={14} />
                        <span>Thêm bài học</span>
                      </button>
                    </div>

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
                            
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                              {lesson.quizId ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenQuizModal(lesson.id)}
                                  className="btn btn-outline"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--success)', borderColor: 'rgba(16,185,129,0.2)' }}
                                >
                                  Sửa Quiz
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenQuizModal(lesson.id)}
                                  className="btn btn-outline"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--primary)', borderColor: 'rgba(37,99,235,0.2)' }}
                                >
                                  + Quiz
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleOpenLessonEditModal(course.id, lesson)}
                                className="btn btn-outline"
                                style={{ padding: '6px', color: 'var(--primary)', borderColor: 'rgba(37,99,235,0.2)' }}
                                title="Sửa bài học"
                              >
                                <EditIcon size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(course.id, lesson.id, lesson.title)}
                                className="btn btn-outline"
                                style={{ padding: '6px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                                title="Xóa bài học"
                              >
                                <TrashIcon size={14} />
                              </button>
                            </div>
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
          <div onClick={handleCloseModal} style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }} />

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
                <label className="form-label">Mô tả khóa học (Tối thiểu 200 từ) *</label>
                <textarea
                  required
                  className="form-input"
                  style={{ minHeight: '150px', resize: 'vertical' }}
                  placeholder="Mô tả chi tiết nội dung khóa học..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <div style={{ marginTop: '6px', fontSize: '0.8rem', textAlign: 'right', color: (formData.description.trim().split(/\s+/).filter(w => w.length > 0).length < 200) ? 'var(--danger)' : 'var(--success)' }}>
                  Số từ: {formData.description.trim().split(/\s+/).filter(w => w.length > 0).length} / 200
                </div>
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
                {formData.imageUrl && (
                  <div style={{ marginTop: '12px', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '150px', border: '1px solid var(--border)' }}>
                    <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} onLoad={(e) => { e.target.style.display = 'block'; }} />
                  </div>
                )}
              </div>

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
                  disabled={submitting || (formData.description.trim().split(/\s+/).filter(w => w.length > 0).length < 200)}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', opacity: (submitting || (formData.description.trim().split(/\s+/).filter(w => w.length > 0).length < 200)) ? 0.6 : 1 }}
                >
                  {submitting ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Glass Modal */}
      {isLessonModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div onClick={() => setIsLessonModalOpen(false)} style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }} />

          <div className="glass" style={{
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            borderRadius: 'var(--radius-lg)',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
                {lessonModalMode === 'create' ? 'Thêm Bài Học Mới' : 'Cập Nhật Bài Học'}
              </h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="btn btn-outline" style={{ padding: '6px', border: 'none' }}>
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleLessonSubmit} style={{ padding: '24px' }}>
              <div className="form-group">
                <label className="form-label">Tiêu đề bài học *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Nhập tiêu đề bài học"
                  value={lessonFormData.title}
                  onChange={(e) => setLessonFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Độ khó *</label>
                <select
                  className="form-input"
                  value={lessonFormData.difficulty}
                  onChange={(e) => setLessonFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-main)' }}
                >
                  <option value="BEGINNER">BEGINNER (Cơ bản)</option>
                  <option value="INTERMEDIATE">INTERMEDIATE (Trung cấp)</option>
                  <option value="ADVANCED">ADVANCED (Nâng cao)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tài liệu & Video đính kèm (Upload)</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {uploadingFile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '150px' }}>
                      <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s ease-in-out' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '36px' }}>{uploadProgress}%</span>
                    </div>
                  )}
                </div>
                {uploadedFileUrl && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'var(--surface-hover)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {uploadedFileUrl}
                    </span>
                    <button
                      type="button"
                      onClick={insertMaterialLink}
                      className="btn btn-outline"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    >
                      Chèn vào nội dung
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Nội dung bài học (Hỗ trợ Markdown) *</label>
                <textarea
                  required
                  className="form-input"
                  style={{ minHeight: '200px', fontFamily: 'monospace', fontSize: '0.9rem', resize: 'vertical' }}
                  placeholder="Nhập nội dung bài học bằng Markdown..."
                  value={lessonFormData.content}
                  onChange={(e) => setLessonFormData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '32px'
              }}>
                <button type="button" onClick={() => setIsLessonModalOpen(false)} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={lessonSubmitting}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', opacity: lessonSubmitting ? 0.6 : 1 }}
                >
                  {lessonSubmitting ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quiz Editor Glass Modal */}
      {isQuizModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div onClick={() => setIsQuizModalOpen(false)} style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          }} />

          <div className="glass" style={{
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            borderRadius: 'var(--radius-lg)',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
                Thiết Lập Câu Hỏi Trắc Nghiệm (Quiz)
              </h3>
              <button onClick={() => setIsQuizModalOpen(false)} className="btn btn-outline" style={{ padding: '6px', border: 'none' }}>
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleQuizSubmit} style={{ padding: '24px' }}>
              <div className="form-group">
                <label className="form-label">Tiêu đề Quiz *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Nhập tiêu đề bộ câu hỏi (ví dụ: Trắc nghiệm chương 1)"
                  value={quizData.title}
                  onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Danh sách câu hỏi ({quizData.questions?.length || 0})</label>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                  >
                    + Thêm câu hỏi
                  </button>
                </div>

                {quizSubmitting && (!quizData.questions || quizData.questions.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Đang tải dữ liệu Quiz...</div>
                ) : !quizData.questions || quizData.questions.length === 0 ? (
                  <div style={{ padding: '30px', border: '2px dashed var(--border)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Chưa có câu hỏi nào. Nhấp "+ Thêm câu hỏi" để bắt đầu thiết kế bộ câu hỏi trắc nghiệm.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {quizData.questions.map((q, qIdx) => (
                      <div key={qIdx} style={{
                        padding: '20px',
                        backgroundColor: 'var(--surface-hover)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        position: 'relative'
                      }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="btn btn-outline"
                          style={{
                            position: 'absolute',
                            right: '16px',
                            top: '16px',
                            padding: '4px',
                            color: 'var(--danger)',
                            borderColor: 'transparent'
                          }}
                          title="Xóa câu hỏi"
                        >
                          <TrashIcon size={16} />
                        </button>

                        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '16px', color: 'var(--primary)' }}>
                          Câu hỏi {qIdx + 1}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Nội dung câu hỏi *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            style={{ backgroundColor: 'var(--surface)' }}
                            placeholder="Nhập câu hỏi..."
                            value={q.content}
                            onChange={(e) => handleQuestionChange(qIdx, 'content', e.target.value)}
                          />
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label className="form-label">Loại câu hỏi *</label>
                            <select
                              className="form-input"
                              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-main)' }}
                              value={q.questionType}
                              onChange={(e) => handleQuestionChange(qIdx, 'questionType', e.target.value)}
                            >
                              <option value="SINGLE_CHOICE">Một đáp án đúng (Single Choice)</option>
                              <option value="MULTIPLE_CHOICE">Nhiều đáp án đúng (Multiple Choice)</option>
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Giải thích (Explanation)</label>
                            <input
                              type="text"
                              className="form-input"
                              style={{ backgroundColor: 'var(--surface)' }}
                              placeholder="Giải thích lý do đáp án đúng..."
                              value={q.explanation || ''}
                              onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Answers List */}
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Các lựa chọn trả lời *</span>
                            <button
                              type="button"
                              onClick={() => handleAddAnswer(qIdx)}
                              className="btn btn-outline"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                            >
                              + Thêm đáp án
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {q.answers.map((ans, aIdx) => (
                              <div key={aIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                  type={q.questionType === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                                  name={`correct-question-${qIdx}`}
                                  checked={ans.correct}
                                  onChange={(e) => handleAnswerChange(qIdx, aIdx, 'correct', e.target.checked)}
                                  style={{ cursor: 'pointer' }}
                                />
                                <input
                                  type="text"
                                  required
                                  className="form-input"
                                  style={{ backgroundColor: 'var(--surface)', flex: 1 }}
                                  placeholder={`Đáp án ${String.fromCharCode(65 + aIdx)}`}
                                  value={ans.answerText}
                                  onChange={(e) => handleAnswerChange(qIdx, aIdx, 'answerText', e.target.value)}
                                />
                                {q.answers.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAnswer(qIdx, aIdx)}
                                    className="btn btn-outline"
                                    style={{ padding: '6px', color: 'var(--danger)', borderColor: 'transparent' }}
                                  >
                                    <TrashIcon size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quiz Actions Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '32px',
                borderTop: '1px solid var(--border)',
                paddingTop: '20px'
              }}>
                <div>
                  {quizData.id && (
                    <button
                      type="button"
                      onClick={handleDeleteQuiz}
                      disabled={quizDeleting}
                      className="btn btn-outline"
                      style={{ padding: '10px 20px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    >
                      {quizDeleting ? 'Đang xóa...' : 'Xóa Quiz này'}
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setIsQuizModalOpen(false)} className="btn btn-outline" style={{ padding: '10px 20px' }}>
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={quizSubmitting || !quizData.questions || quizData.questions.length === 0}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', opacity: (quizSubmitting || !quizData.questions || quizData.questions.length === 0) ? 0.6 : 1 }}
                  >
                    {quizSubmitting ? 'Đang lưu...' : 'Lưu bộ câu hỏi'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div 
          className="animate-slide-in-right glass"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            borderRadius: 'var(--radius-md)',
            borderLeft: `4px solid var(--${toast.type})`,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-main)',
          }}
        >
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: `var(--${toast.type})` 
          }} />
          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              padding: '0 0 0 8px'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
