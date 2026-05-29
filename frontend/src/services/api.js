import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is 401 (Unauthorized) and we haven't retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Perform refreshing token call directly via axios to avoid triggering this interceptor again
          const response = await axios.post('/api/auth/refresh', { refreshToken });
          
          if (response.data && response.data.token) {
            const { token, refreshToken: newRefreshToken } = response.data;
            
            // Save new tokens
            localStorage.setItem('token', token);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            // Update authorization header for the original request
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            
            // Re-execute original request
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token failed or is invalid/expired -> logout user
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth-logout'));
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token -> logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-logout'));
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
