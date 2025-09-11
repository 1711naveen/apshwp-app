import { API_ENDPOINTS, HTTP_CONFIG } from '../constants/API';

/**
 * API utility functions for making HTTP requests
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * Generic API request function
 */
export const apiRequest = async <T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = HTTP_CONFIG.TIMEOUT,
  } = options;

  const config: RequestInit = {
    method,
    headers: {
      ...HTTP_CONFIG.HEADERS,
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Specific API functions
 */
export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: credentials,
      }),
    
    register: (userData: any) =>
      apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: userData,
      }),
  },

  // Courses
  courses: {
    getList: () => apiRequest(API_ENDPOINTS.COURSES.LIST),
    
    getDetail: (id: string | number, userId?: string | number) => {
      const url = userId 
        ? API_ENDPOINTS.COURSES.DETAIL_WITH_USER(id, userId)
        : API_ENDPOINTS.COURSES.DETAIL(id);
      return apiRequest(url);
    },
    
    markVideoComplete: (data: any) =>
      apiRequest(API_ENDPOINTS.COURSES.MARK_VIDEO_COMPLETE, {
        method: 'POST',
        body: data,
      }),
  },

  // Quiz
  quiz: {
    getList: () => apiRequest(API_ENDPOINTS.QUIZ.LIST),
    
    getDetail: (id: string | number) =>
      apiRequest(API_ENDPOINTS.QUIZ.DETAIL(id)),
    
    submit: (data: any) =>
      apiRequest(API_ENDPOINTS.QUIZ.SUBMIT, {
        method: 'POST',
        body: data,
      }),
  },

  // User
  user: {
    getProfile: () => apiRequest(API_ENDPOINTS.USER.PROFILE),
    
    updateProfile: (data: any) =>
      apiRequest(API_ENDPOINTS.USER.UPDATE_PROFILE, {
        method: 'PUT',
        body: data,
      }),
  },
};

export default api;
