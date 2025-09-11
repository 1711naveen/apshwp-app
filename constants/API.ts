/**
 * API configuration and endpoints
 */

// Base API URL
export const BASE_URL = 'https://apshwp.ap.gov.in';

// API endpoints
export const API_ENDPOINTS = {
  // Base API path
  BASE: `${BASE_URL}/api`,
  
  // Authentication endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/api/login`,
    REGISTER: `${BASE_URL}/api/register`,
    LOGOUT: `${BASE_URL}/api/logout`,
    REFRESH: `${BASE_URL}/api/refresh`,
    FORGOT_PASSWORD: `${BASE_URL}/api/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/api/reset-password`,
  },
  
  // Course endpoints
  COURSES: {
    LIST: `${BASE_URL}/api/courses`,
    DETAIL: (id: string | number) => `${BASE_URL}/api/courses/${id}`,
    DETAIL_WITH_USER: (id: string | number, userId: string | number) => 
      `${BASE_URL}/api/courses/${id}?user_id=${userId}`,
    MARK_VIDEO_COMPLETE: `${BASE_URL}/api/courses/mark-video-complete`,
    PROGRESS: (userId: string | number) => `${BASE_URL}/api/courses/progress/${userId}`,
  },
  
  // Quiz endpoints
  QUIZ: {
    LIST: `${BASE_URL}/api/quizzes`,
    DETAIL: (id: string | number) => `${BASE_URL}/api/quizzes/${id}`,
    SUBMIT: `${BASE_URL}/api/quizzes/submit`,
    RESULTS: (id: string | number) => `${BASE_URL}/api/quizzes/${id}/results`,
  },
  
  // User endpoints
  USER: {
    PROFILE: `${BASE_URL}/api/user/profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/user/update`,
    CHANGE_PASSWORD: `${BASE_URL}/api/user/change-password`,
    DELETE_ACCOUNT: `${BASE_URL}/api/user/delete`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: `${BASE_URL}/api/notifications`,
    MARK_READ: (id: string | number) => `${BASE_URL}/api/notifications/${id}/read`,
    MARK_ALL_READ: `${BASE_URL}/api/notifications/read-all`,
  },
  
  // Analytics
  ANALYTICS: {
    TRACK_EVENT: `${BASE_URL}/api/analytics/event`,
    TRACK_PAGE: `${BASE_URL}/api/analytics/page`,
  },
} as const;

// HTTP request configuration
export const HTTP_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// API response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export default API_ENDPOINTS;
