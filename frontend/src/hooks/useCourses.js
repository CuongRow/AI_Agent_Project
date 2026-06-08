import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook to manage courses API interactions.
 * Provides fetching with pagination, create, update and delete helpers.
 */
export const useCourses = (initialPage = 0, pageSize = 10) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(initialPage);

  const fetchCourses = useCallback(async (pageNumber = page) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/courses?page=${pageNumber}&size=${pageSize}`);
      setCourses(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách khóa học.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const createCourse = async (data) => {
    const response = await api.post('/api/courses', data);
    setCourses(prev => [response.data, ...prev]);
    setTotalElements(prev => prev + 1);
    return response.data;
  };

  const updateCourse = async (id, data) => {
    const response = await api.put(`/api/courses/${id}`, data);
    setCourses(prev => prev.map(c => (c.id === id ? response.data : c)));
    return response.data;
  };

  const deleteCourse = async (id) => {
    await api.delete(`/api/courses/${id}`);
    setCourses(prev => prev.filter(c => c.id !== id));
    setTotalElements(prev => Math.max(0, prev - 1));
  };

  return {
    courses,
    loading,
    error,
    totalPages,
    totalElements,
    page,
    setPage,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
