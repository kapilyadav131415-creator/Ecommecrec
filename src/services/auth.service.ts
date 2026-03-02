// src/services/auth.service.ts
import api from './api';

// We only need the relative path because baseURL is set in api.ts
const ENDPOINT = '/Member';

export const authService = {
  /**
   * authenticates a user and stores credentials
   * @param data { emailId, password }
   */
  async login(data: any) {
    // Uses the 'api' instance which already knows the localhost:7201 base URL
    const response = await api.post(`${ENDPOINT}/Login`, data);
    
    const { status, token, user } = response.data;

    if (status === 1) {
      // Store credentials for the interceptor to pick up on future requests
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  },

  /**
   * registers a new member
   * @param data { name, mobileNo, emailId, password }
   */
  async register(data: any) {
    const response = await api.post(`${ENDPOINT}/Register`, data);
    return response.data;
  },

getCurrentUser() {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optional: Redirect to login or home
    window.location.href = '/login';
  }
};