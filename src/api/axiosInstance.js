import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper: Check if current path is a protected route that requires redirection on auth failure
const isProtectedRoute = () => {
  if (typeof window === 'undefined') return false;
  const currentPath = window.location.pathname;
  return (
    currentPath.startsWith('/admin') ||
    currentPath.startsWith('/super-admin') ||
    currentPath.startsWith('/teacher') ||
    currentPath.startsWith('/student') ||
    currentPath.startsWith('/guardian') ||
    currentPath.startsWith('/talimat') ||
    currentPath.startsWith('/accounting') ||
    currentPath.startsWith('/staff') ||
    currentPath.startsWith('/students')
  );
};

// Response Interceptor: Global Error Handling and Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Attempt to refresh the token
          // Note: using axios directly to avoid interceptor loop if refresh-token returns 401
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/v1/refresh-token`, {
            refreshToken,
          });

          if (response.data.success && response.data.accessToken) {
            const newAccessToken = response.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            // Update the original request's authorization header and retry
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh fails, clear tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          if (isProtectedRoute()) {
            window.location.href = '/login';
          }
        }
      } else {
        // No refresh token available, clear any stale auth
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // Only redirect to login if user is attempting to browse a protected route
        // Public pages (Home, Packages, Free Demo, Madrasa Portal, etc.) must stay accessible!
        if (isProtectedRoute()) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
