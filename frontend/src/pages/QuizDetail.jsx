import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  AcademicCapIcon,
  CheckIcon,
  ChevronLeftIcon,
  BookOpenIcon,
  XIcon,
  TrophyIcon
} from '../components/Icons';
import Confetti from '../components/Confetti';

const QuizDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selections, setSelections] = useState({}); // { questionId: Set<answerId> }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Timer state for Final Exams
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes = 2400 seconds
  const isFinalExam = activeQuiz?.questions?.length >= 30;

  // Time tracking
  const [startTime, setStartTime] = useState(null);
  const startTimeRef = React.useRef(null);
  useEffect(() => {
    startTimeRef.current = startTime;
  }, [startTime]);

  // Keep a reference to selections to avoid stale closures in the timer interval
  const selectionsRef = React.useRef(selections);
  useEffect(() => {
    selectionsRef.current = selections;
  }, [selections]);

  useEffect(() => {
    fetchQuizzes();
  }, [lessonId]);

  // Score count-up animation
  useEffect(() => {
    if (result) {
      let current = 0;
      const target = Math.round(result.score);
      if (target === 0) {
        setAnimatedScore(0);
        return;
      }
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(timer);
        } else {
          setAnimatedScore(current);
        }
      }, 25);
      return () => clearInterval(timer);
    } else {
      setAnimatedScore(0);
    }
  }, [result]);



  // Timer Effect
  useEffect(() => {
    if (!activeQuiz || result || loading || !isFinalExam) return;

    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [activeQuiz, result, loading, isFinalExam]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/lessons/${lessonId}/quizzes`);
      const data = response.data || [];
      setQuizzes(data);
      if (data.length > 0) {
        setActiveQuiz(data[0]);
        setStartTime(Date.now());
      }
    } catch (err) {
      console.error(err);
      setError('Không thể tải bài quiz. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const questions = activeQuiz?.questions || [];
  const currentQuestion = questions[currentQuestionIdx] || null;
  const totalQuestions = questions.length;

  const answeredCount = useMemo(() => {
    return Object.keys(selections).filter(qId => {
      const s = selections[qId];
      return s && s.size > 0;
    }).length;
  }, [selections]);

  const handleSelectAnswer = (questionId, answerId, isMultiple) => {
    setSelections(prev => {
      const copy = { ...prev };
      if (!copy[questionId]) {
        copy[questionId] = new Set();
      } else {
        copy[questionId] = new Set(copy[questionId]);
      }

      if (isMultiple) {
        if (copy[questionId].has(answerId)) {
          copy[questionId].delete(answerId);
        } else {
          copy[questionId].add(answerId);
        }
      } else {
        // Single choice: replace
        copy[questionId] = new Set([answerId]);
      }
      return copy;
    });
  };

  const handleAutoSubmit = async () => {
    if (!activeQuiz) return;

    const selectionsPayload = (activeQuiz.questions || []).map(q => ({
      questionId: q.id,
      selectedAnswerIds: selectionsRef.current[q.id] ? Array.from(selectionsRef.current[q.id]) : [],
    }));

    const timeSpentSeconds = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 2400;

    try {
      setSubmitting(true);
      const response = await api.post('/api/quizzes/submit', {
        quizId: activeQuiz.id,
        selections: selectionsPayload,
        timeSpentSeconds: timeSpentSeconds
      });
      setResult(response.data);
      alert('Hết giờ làm bài! Hệ thống đã tự động nộp bài thi của bạn.');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tự động nộp bài. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!activeQuiz) return;

    const selectionsPayload = questions.map(q => ({
      questionId: q.id,
      selectedAnswerIds: selections[q.id] ? Array.from(selections[q.id]) : [],
    }));

    const timeSpentSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    try {
      setSubmitting(true);
      const response = await api.post('/api/quizzes/submit', {
        quizId: activeQuiz.id,
        selections: selectionsPayload,
        timeSpentSeconds: timeSpentSeconds
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi nộp bài quiz. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setSelections({});
    setCurrentQuestionIdx(0);
    setTimeLeft(2400); // Reset timer
    setStartTime(Date.now());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Result View ---
  if (result) {
    const scoreColor = result.passed ? 'var(--success)' : 'var(--danger)';
    const scoreBg = result.passed ? 'var(--success-light)' : 'var(--danger-light)';
    const resultQuestions = result.questions || [];
    const isExcellent = result.score >= 80;

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in-up">
        {/* Celebration Confetti */}
        {isExcellent && <Confetti />}

        {/* Score Card */}
        <div className="card" style={{
          textAlign: 'center',
          padding: '48px 32px',
          marginBottom: '32px',
          border: `2px solid ${scoreColor}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative background */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            background: scoreBg,
            borderRadius: '50%',
            opacity: 0.5,
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-30px',
            width: '150px',
            height: '150px',
            background: scoreBg,
            borderRadius: '50%',
            opacity: 0.3,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Performance Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              {isExcellent ? (
                <span className="badge badge-excellent animate-float">
                  <TrophyIcon size={16} />
                  Xuất sắc
                </span>
              ) : result.passed ? (
                <span className="badge badge-passed">
                  <CheckIcon size={16} />
                  Đạt yêu cầu
                </span>
              ) : (
                <span className="badge badge-failed">
                  <XIcon size={16} />
                  Chưa đạt
                </span>
              )}
            </div>

            {/* Large score display with animated ring */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `conic-gradient(${scoreColor} ${animatedScore * 3.6}deg, var(--border) 0deg)`,
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'var(--shadow-md)',
              transition: 'background 0.1s ease'
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: scoreColor }}>
                  {animatedScore}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>điểm</span>
              </div>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: scoreColor,
              marginBottom: '12px'
            }}>
              {isExcellent 
                ? '🎉 Tuyệt vời! Bạn đã hoàn thành xuất sắc!' 
                : result.passed 
                  ? '🎉 Chúc mừng! Bạn đã vượt qua bài thi!' 
                  : '😔 Tiếc quá! Bạn chưa đủ điểm đạt.'}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '6px', fontSize: '0.95rem' }}>
              Điểm cần đạt: <strong>{result.passingScore}%</strong> • Điểm số của bạn: <strong>{Math.round(result.score)}%</strong>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Trả lời đúng <strong>{resultQuestions.filter(q => q.correct).length}</strong> trên <strong>{resultQuestions.length}</strong> câu hỏi
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
              <button onClick={handleRetry} className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Làm lại
              </button>
              <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '12px 28px' }}>
                <ChevronLeftIcon size={16} />
                <span>Quay lại bài học</span>
              </button>
            </div>
          </div>
        </div>

        {/* Question-by-question review */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          fontWeight: 700,
          marginBottom: '20px'
        }}>
          Chi tiết kết quả
        </h3>

        {resultQuestions.map((qr, idx) => {
          const question = questions.find(q => q.id === qr.questionId);
          if (!question) return null;

          return (
            <div key={qr.questionId} className="card" style={{
              marginBottom: '16px',
              borderLeft: `4px solid ${qr.correct ? 'var(--success)' : 'var(--danger)'}`,
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: qr.correct ? 'var(--success)' : 'var(--danger)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {qr.correct ? <CheckIcon size={14} /> : <XIcon size={14} />}
                </span>
                <div>
                  <p style={{ fontWeight: 600, lineHeight: 1.5 }}>
                    Câu {idx + 1}: {question.content}
                  </p>
                  {question.questionType === 'MULTIPLE_CHOICE' && (
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      backgroundColor: 'var(--info-light)',
                      color: 'var(--info)',
                      borderRadius: '4px',
                      fontWeight: 600,
                      marginTop: '4px',
                      display: 'inline-block'
                    }}>Nhiều đáp án</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '40px' }}>
                {question.answers.map(ans => {
                  const isSelected = qr.selectedAnswerIds && qr.selectedAnswerIds.includes(ans.id);
                  const isCorrect = qr.correctAnswerIds && qr.correctAnswerIds.includes(ans.id);

                  let bg = 'transparent';
                  let borderColor = 'var(--border)';
                  let textColor = 'var(--text-main)';
                  let icon = null;

                  if (isCorrect) {
                    bg = 'var(--success-light)';
                    borderColor = 'var(--success)';
                    textColor = 'var(--success)';
                    icon = <CheckIcon size={14} color="var(--success)" />;
                  }
                  if (isSelected && !isCorrect) {
                    bg = 'var(--danger-light)';
                    borderColor = 'var(--danger)';
                    textColor = 'var(--danger)';
                    icon = <XIcon size={14} color="var(--danger)" />;
                  }

                  return (
                    <div key={ans.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${borderColor}`,
                      backgroundColor: bg,
                      color: textColor,
                      fontSize: '0.9rem',
                    }}>
                      {icon && <span style={{ flexShrink: 0, display: 'flex' }}>{icon}</span>}
                      <span>{ans.answerText}</span>
                    </div>
                  );
                })}
              </div>

              {qr.explanation && (
                <div style={{
                  marginTop: '12px',
                  marginLeft: '40px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--info-light)',
                  color: 'var(--info)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  borderLeft: '3px solid var(--info)'
                }}>
                  <strong>Giải thích:</strong> {qr.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // --- Loading State ---
  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="skeleton" style={{ height: '36px', width: '50%', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '20px', width: '30%', marginBottom: '32px' }} />
        <div className="card" style={{ padding: '32px' }}>
          <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '24px' }} />
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="skeleton" style={{ height: '48px', width: '100%', marginBottom: '12px', borderRadius: 'var(--radius-sm)' }} />
          ))}
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <AcademicCapIcon size={48} style={{ marginBottom: '16px', opacity: 0.5, color: 'var(--text-muted)' }} />
        <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>{error}</h3>
        <button className="btn btn-primary" onClick={fetchQuizzes} style={{ marginTop: '16px' }}>Thử lại</button>
      </div>
    );
  }

  // --- No quiz available ---
  if (!activeQuiz || questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <AcademicCapIcon size={48} style={{ marginBottom: '16px', opacity: 0.5, color: 'var(--text-muted)' }} />
        <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Bài học này chưa có quiz</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Hãy quay lại và tiếp tục học.</p>
        <button onClick={() => navigate(-1)} className="btn btn-outline">
          <ChevronLeftIcon size={16} />
          <span>Quay lại bài học</span>
        </button>
      </div>
    );
  }

  // --- Quiz Taking View ---
  const isMultiple = currentQuestion?.questionType === 'MULTIPLE_CHOICE';
  const currentSelections = selections[currentQuestion?.id] || new Set();
  const progressPct = totalQuestions > 0 ? Math.round(((currentQuestionIdx + 1) / totalQuestions) * 100) : 0;
  const allAnswered = answeredCount === totalQuestions;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Premium Floating Countdown Timer for Final Exams */}
      {isFinalExam && !result && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1.5px solid ${timeLeft < 300 ? '#ef4444' : 'var(--primary)'}`,
          borderRadius: '16px',
          padding: '12px 20px',
          boxShadow: timeLeft < 300 
            ? '0 8px 32px 0 rgba(239, 68, 68, 0.15), 0 0 12px 0 rgba(239, 68, 68, 0.1)'
            : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.3s ease',
          color: timeLeft < 300 ? '#ef4444' : 'var(--text-main)',
          animation: timeLeft < 300 ? 'pulse-border 1.5s infinite alternate' : 'none'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '20px', height: '20px', animation: 'spin-slow 8s linear infinite' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 700 }}>Thời gian còn lại</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', lineHeight: 1.1 }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}
      {/* Styles for animations */}
      {isFinalExam && (
        <style>{`
          @keyframes pulse-border {
            from { box-shadow: 0 0 4px rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5); }
            to { box-shadow: 0 0 16px rgba(239, 68, 68, 0.6); border-color: rgba(239, 68, 68, 1); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      )}
      {/* Quiz Header */}
      <div style={{ marginBottom: '32px' }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--primary)',
          fontWeight: 600,
          fontSize: '0.85rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '12px',
          padding: 0
        }}>
          <ChevronLeftIcon size={14} />
          <span>Quay lại bài học</span>
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
          {activeQuiz.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span>{totalQuestions} câu hỏi</span>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--border)' }} />
          <span>Đã trả lời {answeredCount}/{totalQuestions}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          fontWeight: 500,
          marginBottom: '6px'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Câu {currentQuestionIdx + 1}/{totalQuestions}</span>
          <span style={{ color: 'var(--primary)' }}>{progressPct}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressPct}%`,
            height: '100%',
            backgroundColor: 'var(--primary)',
            borderRadius: '3px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Question Navigation Dots */}
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        marginBottom: '24px',
        padding: '12px 16px',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)'
      }}>
        {questions.map((q, idx) => {
          const isAnswered = selections[q.id] && selections[q.id].size > 0;
          const isCurrent = idx === currentQuestionIdx;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIdx(idx)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: isAnswered
                  ? (isCurrent ? 'var(--primary)' : 'var(--primary-light)')
                  : (isCurrent ? 'var(--surface-hover)' : 'transparent'),
                color: isAnswered && isCurrent ? '#fff' : isAnswered ? 'var(--primary)' : 'var(--text-main)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={`Câu ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          {/* Question Text */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                {currentQuestionIdx + 1}
              </span>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5, flex: 1 }}>
                {currentQuestion.content}
              </h2>
            </div>

            {isMultiple && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--info-light)',
                color: 'var(--info)',
                fontSize: '0.78rem',
                fontWeight: 600
              }}>
                <CheckIcon size={12} />
                Chọn nhiều đáp án
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQuestion.answers.map((answer, aIdx) => {
              const isSelected = currentSelections.has(answer.id);
              const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

              return (
                <button
                  key={answer.id}
                  onClick={() => handleSelectAnswer(currentQuestion.id, answer.id, isMultiple)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all var(--transition-fast)',
                    color: 'var(--text-main)',
                  }}
                >
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30px',
                    height: '30px',
                    borderRadius: isMultiple ? '6px' : '50%',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? '#fff' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                    transition: 'all var(--transition-fast)'
                  }}>
                    {isSelected ? <CheckIcon size={14} /> : optionLetters[aIdx] || (aIdx + 1)}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: isSelected ? 600 : 400, lineHeight: 1.4 }}>
                    {answer.answerText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '40px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            disabled={currentQuestionIdx === 0}
            onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
            className="btn btn-outline"
            style={{ padding: '10px 18px', opacity: currentQuestionIdx === 0 ? 0.4 : 1 }}
          >
            <ChevronLeftIcon size={16} />
            <span>Câu trước</span>
          </button>
          {currentQuestionIdx < totalQuestions - 1 && (
            <button
              onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
              className="btn btn-outline"
              style={{ padding: '10px 18px' }}
            >
              <span>Câu tiếp</span>
              <span style={{ display: 'flex', transform: 'rotate(180deg)' }}><ChevronLeftIcon size={16} /></span>
            </button>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className="btn btn-primary"
          style={{
            padding: '12px 28px',
            opacity: allAnswered ? 1 : 0.5,
            position: 'relative',
            boxShadow: allAnswered ? '0 4px 12px var(--primary-glow)' : 'none'
          }}
        >
          {submitting ? (
            <>
              <span style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                animation: 'spin 0.8s linear infinite',
                display: 'inline-block'
              }} />
              <span>Đang nộp...</span>
            </>
          ) : (
            <>
              <AcademicCapIcon size={18} />
              <span>Nộp bài ({answeredCount}/{totalQuestions})</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QuizDetail;
