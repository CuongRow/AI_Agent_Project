import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook to manage lessons, quiz, and file uploads.
 */
export const useLessons = () => {
  const [lessonsMap, setLessonsMap] = useState({}); // { courseId: lessonsList }
  const [lessonsLoading, setLessonsLoading] = useState({});
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizDeleting, setQuizDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchLessons = useCallback(async (courseId) => {
    try {
      setLessonsLoading(prev => ({ ...prev, [courseId]: true }));
      const response = await api.get(`/api/courses/${courseId}/lessons?size=100`);
      setLessonsMap(prev => ({ ...prev, [courseId]: response.data.content || [] }));
      return response.data.content || [];
    } catch (err) {
      console.error('Error fetching lessons:', err);
      throw err;
    } finally {
      setLessonsLoading(prev => ({ ...prev, [courseId]: false }));
    }
  }, []);

  const createLesson = async (courseId, lessonData) => {
    try {
      const response = await api.post(`/api/admin/courses/${courseId}/lessons`, lessonData);
      setLessonsMap(prev => ({
        ...prev,
        [courseId]: [...(prev[courseId] || []), response.data]
      }));
      return response.data;
    } catch (err) {
      console.error('Error creating lesson:', err);
      throw err;
    }
  };

  const updateLesson = async (courseId, lessonId, lessonData) => {
    try {
      const response = await api.put(`/api/admin/lessons/${lessonId}`, lessonData);
      setLessonsMap(prev => ({
        ...prev,
        [courseId]: (prev[courseId] || []).map(l => (l.id === lessonId ? response.data : l))
      }));
      return response.data;
    } catch (err) {
      console.error('Error updating lesson:', err);
      throw err;
    }
  };

  const deleteLesson = async (courseId, lessonId) => {
    try {
      await api.delete(`/api/admin/lessons/${lessonId}`);
      setLessonsMap(prev => ({
        ...prev,
        [courseId]: (prev[courseId] || []).filter(l => l.id !== lessonId)
      }));
    } catch (err) {
      console.error('Error deleting lesson:', err);
      throw err;
    }
  };

  const uploadFile = async (file) => {
    const formDataFile = new FormData();
    formDataFile.append('file', file);
    try {
      setUploadingFile(true);
      setUploadProgress(0);
      const response = await api.post('/api/admin/lessons/upload', formDataFile, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });
      setUploadedFileUrl(response.data.fileUrl);
      return response.data.fileUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    } finally {
      setUploadingFile(false);
    }
  };

  const getQuiz = async (lessonId) => {
    try {
      const response = await api.get(`/api/admin/lessons/${lessonId}/quiz`);
      return response.data;
    } catch (err) {
      console.warn('No existing quiz or error fetching quiz:', err);
      throw err;
    }
  };

  const saveQuiz = async (lessonId, quizData) => {
    try {
      setQuizSubmitting(true);
      const response = await api.post(`/api/admin/lessons/${lessonId}/quiz`, quizData);
      
      // Update the quizId on the associated lesson in lessonsMap
      setLessonsMap(prev => {
        const updated = { ...prev };
        for (const cId in updated) {
          updated[cId] = updated[cId].map(l => 
            l.id === lessonId ? { ...l, quizId: response.data.id } : l
          );
        }
        return updated;
      });
      return response.data;
    } catch (err) {
      console.error('Error saving quiz:', err);
      throw err;
    } finally {
      setQuizSubmitting(false);
    }
  };

  const deleteQuiz = async (lessonId, quizId) => {
    try {
      setQuizDeleting(true);
      await api.delete(`/api/admin/quizzes/${quizId}`);
      
      // Update the quizId to null on the associated lesson in lessonsMap
      setLessonsMap(prev => {
        const updated = { ...prev };
        for (const cId in updated) {
          updated[cId] = updated[cId].map(l => 
            l.id === lessonId ? { ...l, quizId: null } : l
          );
        }
        return updated;
      });
    } catch (err) {
      console.error('Error deleting quiz:', err);
      throw err;
    } finally {
      setQuizDeleting(false);
    }
  };

  return {
    lessonsMap,
    lessonsLoading,
    setLessonsMap,
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
  };
};
