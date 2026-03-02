import axios from 'axios';

// Create an instance with your .NET API defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7201/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handle global errors (e.g., Token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If .NET returns 401 Unauthorized, clear local storage and redirect
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Handle .NET validation errors (ProblemDetails)
    const message = error.response?.data?.msg || error.message || 'Something went wrong';
    return Promise.reject({ ...error, message });
  }
);

export default api;